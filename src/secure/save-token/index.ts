import { NASSSession } from "../../types/session.type";
import fs from 'fs';
import crypto from 'crypto';

function saveTokenToDisk(token: NASSSession, encryptionKey: string) {
  // Ensure the key is 32 bytes for aes-256-cbc
  const key = Buffer.alloc(32);
  Buffer.from(encryptionKey).copy(key);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(token), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  fs.writeFileSync('.nass-token', `${iv.toString('hex')}:${encrypted}`);
}

function loadTokenFromDisk(encryptionKey: string): NASSSession | null {
  if (!fs.existsSync('.nass-token')) return null;
  const encrypted = fs.readFileSync('.nass-token', 'utf8');
  const [iv, content] = encrypted.split(':');
  const key = Buffer.alloc(32);
  Buffer.from(encryptionKey).copy(key);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(content, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
}

export { saveTokenToDisk, loadTokenFromDisk };