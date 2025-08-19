import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-char-secret-key-here-change';
const ALGORITHM = 'aes-256-gcm';

export function hashEmail(email: string): string {
  // One-way hash for privacy (no decryption needed)
  return crypto
    .createHash('sha256')
    .update(email + process.env.EMAIL_SALT)
    .digest('hex');
}

export function encryptSensitiveData(text: string): { encrypted: string; iv: string; tag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  cipher.setAAD(Buffer.from('additional-auth-data'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

export function decryptSensitiveData(encrypted: string, iv: string, tag: string): string {
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  decipher.setAAD(Buffer.from('additional-auth-data'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Validate Stripe webhook signature for security
export function validateStripeSignature(
  payload: string, 
  signature: string, 
  secret: string
): boolean {
  try {
    const elements = signature.split(',');
    const signatureElements: Record<string, string> = {};
    
    for (const element of elements) {
      const [key, value] = element.split('=');
      signatureElements[key] = value;
    }
    
    const timestamp = signatureElements.t;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(timestamp + '.' + payload)
      .digest('hex');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(signatureElements.v1, 'hex')
    );
  } catch {
    return false;
  }
}