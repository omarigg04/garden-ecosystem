// OPTIONAL: More secure version of the webhook with email hashing
import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { generateUniqueEntity } from '@/lib/ai-generator';
import { hashEmail } from '@/lib/security';
import { databases, DATABASE_ID, ENTITIES_COLLECTION_ID, DONATIONS_COLLECTION_ID } from '@/lib/appwrite';
import { ID } from 'appwrite';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const event = constructWebhookEvent(body, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      if (session.payment_status === 'paid') {
        const email = session.customer_email || session.metadata?.donorEmail;
        const amount = session.amount_total! / 100;

        if (!email) {
          console.error('No email found in session');
          return NextResponse.json({ error: 'No email found' }, { status: 400 });
        }

        try {
          // Generate unique entity using AI
          const entity = await generateUniqueEntity(email);

          // Save entity to database (email stored in plain text for entity)
          await databases.createDocument(
            DATABASE_ID,
            ENTITIES_COLLECTION_ID,
            entity.id,
            {
              name: entity.name,
              donorEmail: entity.donorEmail, // Keep original for entity relationship
              species: entity.species,
              personality: JSON.stringify(entity.personality),
              appearance: JSON.stringify(entity.appearance),
              position: JSON.stringify(entity.position),
              status: entity.status,
              relationships: entity.relationships || [],
              createdAt: entity.createdAt,
              lastActive: entity.lastActive
            }
          );

          // Save donation record with HASHED email for privacy
          await databases.createDocument(
            DATABASE_ID,
            DONATIONS_COLLECTION_ID,
            ID.unique(),
            {
              email: hashEmail(email), // Hash email for privacy in payments
              amount,
              entityId: entity.id,
              stripeSessionId: session.id,
              status: 'completed',
              createdAt: new Date().toISOString()
            }
          );

          console.log(`Entity created successfully: ${entity.name} for ${email}`);
        } catch (error) {
          console.error('Error processing successful payment:', error);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}