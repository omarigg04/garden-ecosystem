import OpenAI from 'openai';
import { Entity, EntityPersonality, EntityAppearance } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedEntity {
  name: string;
  species: string;
  personality: EntityPersonality;
  appearance: EntityAppearance;
}

const GENERATION_PROMPT = `Create a unique digital creature for an ecosystem garden. Return ONLY a JSON object with this exact structure:

{
  "name": "unique creature name",
  "species": "creature species/type",
  "personality": {
    "traits": ["select 2-3 from: curious, social, creative, energetic, calm, mysterious, protective, playful"],
    "energy": number between 0-100
  },
  "appearance": {
    "color": "hex color code (e.g., #FF5733)",
    "size": number between 0.5-2.0,
    "shape": "one of: circle, triangle, hexagon, diamond, star",
    "features": ["select 1-3 from: glowing_eyes, crystal_spikes, energy_aura, particle_trail, geometric_pattern, flowing_tendrils, rotating_symbols"]
  }
}

Make each creature unique and interesting. Ensure personality traits match the appearance and features.`;

export async function generateUniqueEntity(donorEmail: string): Promise<Entity> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative AI that generates unique digital creatures for an ecosystem. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: GENERATION_PROMPT
        }
      ],
      temperature: 0.9,
      max_tokens: 300
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const generated: GeneratedEntity = JSON.parse(content);
    
    // Validate the generated data
    validateGeneratedEntity(generated);

    // Create full entity object
    const entity: Entity = {
      id: uuidv4(),
      name: generated.name,
      donorEmail,
      species: generated.species,
      personality: generated.personality,
      appearance: generated.appearance,
      position: generateRandomPosition(),
      status: 'exploring',
      relationships: [],
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    return entity;
  } catch (error) {
    console.error('Error generating entity:', error);
    
    // Fallback: generate a simple default entity
    return generateFallbackEntity(donorEmail);
  }
}

function validateGeneratedEntity(entity: GeneratedEntity): void {
  if (!entity.name || typeof entity.name !== 'string') {
    throw new Error('Invalid name');
  }
  
  if (!entity.species || typeof entity.species !== 'string') {
    throw new Error('Invalid species');
  }
  
  if (!entity.personality?.traits || !Array.isArray(entity.personality.traits)) {
    throw new Error('Invalid personality traits');
  }
  
  if (typeof entity.personality.energy !== 'number' || 
      entity.personality.energy < 0 || 
      entity.personality.energy > 100) {
    throw new Error('Invalid personality energy');
  }
  
  if (!entity.appearance?.color || !entity.appearance.color.match(/^#[0-9A-Fa-f]{6}$/)) {
    throw new Error('Invalid appearance color');
  }
  
  if (typeof entity.appearance.size !== 'number' || 
      entity.appearance.size < 0.5 || 
      entity.appearance.size > 2.0) {
    throw new Error('Invalid appearance size');
  }
  
  const validShapes = ['circle', 'triangle', 'hexagon', 'diamond', 'star'];
  if (!validShapes.includes(entity.appearance.shape)) {
    throw new Error('Invalid appearance shape');
  }
  
  if (!Array.isArray(entity.appearance.features)) {
    throw new Error('Invalid appearance features');
  }

  const validFeatures = [
    'glowing_eyes', 'crystal_spikes', 'energy_aura', 
    'particle_trail', 'geometric_pattern', 'flowing_tendrils', 'rotating_symbols'
  ];
  
  for (const feature of entity.appearance.features) {
    if (!validFeatures.includes(feature)) {
      throw new Error(`Invalid feature: ${feature}`);
    }
  }
}

function generateFallbackEntity(donorEmail: string): Entity {
  const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F7', '#F7FF33', '#33F7FF'];
  const shapes = ['circle', 'triangle', 'hexagon', 'diamond', 'star'] as const;
  const traits = ['curious', 'social', 'creative', 'energetic'];
  const features = ['glowing_eyes', 'energy_aura'];

  return {
    id: uuidv4(),
    name: `Creature-${Math.floor(Math.random() * 1000)}`,
    donorEmail,
    species: 'Digital Being',
    personality: {
      traits: [traits[Math.floor(Math.random() * traits.length)]],
      energy: Math.floor(Math.random() * 101)
    },
    appearance: {
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 0.5 + Math.random() * 1.5,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      features: [features[Math.floor(Math.random() * features.length)]]
    },
    position: generateRandomPosition(),
    status: 'exploring',
    relationships: [],
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };
}

function generateRandomPosition() {
  return {
    x: Math.random() * 1000 + 100, // 100-1100 range
    y: Math.random() * 600 + 100   // 100-700 range
  };
}

export async function generateEntityBehaviorUpdate(entity: Entity, nearbyEntities: Entity[]): Promise<{
  status: Entity['status'];
  newRelationships?: string[];
}> {
  try {
    const prompt = `Given this entity:
Name: ${entity.name}
Species: ${entity.species}
Personality: ${entity.personality.traits.join(', ')} (Energy: ${entity.personality.energy})
Current Status: ${entity.status}
Nearby Entities: ${nearbyEntities.map(e => e.name).join(', ') || 'None'}

Determine the entity's next behavior. Respond with JSON:
{
  "status": "one of: exploring, building, socializing, resting",
  "newRelationships": ["entity_ids if socializing"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You determine digital creature behaviors based on personality. Respond with JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return { status: 'exploring' };
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating behavior update:', error);
    return { status: 'exploring' };
  }
}