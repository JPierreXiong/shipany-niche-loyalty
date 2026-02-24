/**
 * Encryption Utilities
 * AES-256-GCM encryption for sensitive data
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits

/**
 * Generate a new encryption key
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Encrypt text using AES-256-GCM
 * @param text - Plain text to encrypt
 * @param key - Hex-encoded encryption key (64 characters)
 * @returns Encrypted string in format: iv:authTag:encrypted
 */
export function encrypt(text: string, key: string): string {
  if (!text) {
    throw new Error('Text to encrypt cannot be empty');
  }
  
  if (!key || key.length !== 64) {
    throw new Error('Encryption key must be 64 hex characters (32 bytes)');
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(key, 'hex'),
    iv
  );

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  // Return format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt text using AES-256-GCM
 * @param encryptedData - Encrypted string in format: iv:authTag:encrypted
 * @param key - Hex-encoded encryption key (64 characters)
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string, key: string): string {
  if (!encryptedData) {
    throw new Error('Encrypted data cannot be empty');
  }

  if (!key || key.length !== 64) {
    throw new Error('Encryption key must be 64 hex characters (32 bytes)');
  }

  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format');
  }

  const [ivHex, authTagHex, encrypted] = parts;

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, 'hex'),
    iv
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

/**
 * Hash a string using SHA-256
 * Useful for creating non-reversible hashes
 */
export function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Generate a random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Mask sensitive data for logging
 * Shows first 4 and last 4 characters
 */
export function maskSensitive(text: string, visibleChars: number = 4): string {
  if (!text || text.length <= visibleChars * 2) {
    return '***';
  }
  
  const start = text.substring(0, visibleChars);
  const end = text.substring(text.length - visibleChars);
  const masked = '*'.repeat(Math.min(text.length - visibleChars * 2, 8));
  
  return `${start}${masked}${end}`;
}

