import { randomBytes } from 'crypto';

/**
 * ID Generation Utilities
 * 
 * This module provides functions to generate short, memorable, and unique IDs
 * for various entities in the school management system.
 */

// Base62 encoding for shorter IDs (using alphanumeric characters)
const BASE62_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Encode a number to base62 string
 */
function encodeBase62(num: number): string {
  if (num === 0) return '0';
  
  let result = '';
  while (num > 0) {
    result = BASE62_ALPHABET[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

/**
 * Generate a short random string using base62 encoding
 */
function generateShortId(length: number = 6): string {
  const bytes = randomBytes(Math.ceil(length * 0.75)); // Slightly more bytes for better distribution
  let result = '';
  
  for (let i = 0; i < bytes.length && result.length < length; i++) {
    result += BASE62_ALPHABET[bytes[i] % 62];
  }
  
  return result.substring(0, length);
}

/**
 * Generate a timestamp-based component for better uniqueness
 */
function getTimestampComponent(): string {
  const now = Date.now();
  const shortTimestamp = now % 1000000; // Last 6 digits of timestamp
  return encodeBase62(shortTimestamp);
}

/**
 * Generate memorable student ID
 * Format: STU-{shortId}{timestampComponent}
 * Example: STU-K9xY3m, STU-A7bN2p
 */
export function generateStudentId(existingIds?: string[]): string {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shortId = generateShortId(4);
    const timestampPart = getTimestampComponent().substring(0, 2);
    const id = `STU-${shortId}${timestampPart}`;
    
    // Check for uniqueness if existing IDs provided
    if (!existingIds || !existingIds.includes(id)) {
      return id;
    }
    
    attempts++;
  }
  
  // Fallback: use full timestamp if collision occurs
  const fallbackId = `STU-${generateShortId(3)}${getTimestampComponent()}`;
  return fallbackId;
}

/**
 * Generate memorable teacher ID
 * Format: TCH-{shortId}{timestampComponent}
 * Example: TCH-P5zX9k, TCH-M3vB7w
 */
export function generateTeacherId(existingIds?: string[]): string {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shortId = generateShortId(4);
    const timestampPart = getTimestampComponent().substring(0, 2);
    const id = `TCH-${shortId}${timestampPart}`;
    
    // Check for uniqueness if existing IDs provided
    if (!existingIds || !existingIds.includes(id)) {
      return id;
    }
    
    attempts++;
  }
  
  // Fallback: use full timestamp if collision occurs
  const fallbackId = `TCH-${generateShortId(3)}${getTimestampComponent()}`;
  return fallbackId;
}

/**
 * Generate memorable class ID
 * Format: CLS-{shortId}{timestampComponent}
 * Example: CLS-R8nT4j, CLS-Q2fH6s
 */
export function generateClassId(existingIds?: string[]): string {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shortId = generateShortId(4);
    const timestampPart = getTimestampComponent().substring(0, 2);
    const id = `CLS-${shortId}${timestampPart}`;
    
    // Check for uniqueness if existing IDs provided
    if (!existingIds || !existingIds.includes(id)) {
      return id;
    }
    
    attempts++;
  }
  
  // Fallback: use full timestamp if collision occurs
  const fallbackId = `CLS-${generateShortId(3)}${getTimestampComponent()}`;
  return fallbackId;
}

/**
 * Generate memorable subject ID
 * Format: SUB-{shortId}{timestampComponent}
 * Example: SUB-L4kW8n, SUB-D9jV3x
 */
export function generateSubjectId(existingIds?: string[]): string {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shortId = generateShortId(4);
    const timestampPart = getTimestampComponent().substring(0, 2);
    const id = `SUB-${shortId}${timestampPart}`;
    
    // Check for uniqueness if existing IDs provided
    if (!existingIds || !existingIds.includes(id)) {
      return id;
    }
    
    attempts++;
  }
  
  // Fallback: use full timestamp if collision occurs
  const fallbackId = `SUB-${generateShortId(3)}${getTimestampComponent()}`;
  return fallbackId;
}

/**
 * Generate memorable exam ID
 * Format: EXM-{shortId}{timestampComponent}
 * Example: EXM-B6hS2t, EXM-G1cF9y
 */
export function generateExamId(existingIds?: string[]): string {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shortId = generateShortId(4);
    const timestampPart = getTimestampComponent().substring(0, 2);
    const id = `EXM-${shortId}${timestampPart}`;
    
    // Check for uniqueness if existing IDs provided
    if (!existingIds || !existingIds.includes(id)) {
      return id;
    }
    
    attempts++;
  }
  
  // Fallback: use full timestamp if collision occurs
  const fallbackId = `EXM-${generateShortId(3)}${getTimestampComponent()}`;
  return fallbackId;
}

/**
 * Generic ID generator for any entity type
 */
export function generateEntityId(prefix: string, existingIds?: string[]): string {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shortId = generateShortId(4);
    const timestampPart = getTimestampComponent().substring(0, 2);
    const id = `${prefix}-${shortId}${timestampPart}`;
    
    // Check for uniqueness if existing IDs provided
    if (!existingIds || !existingIds.includes(id)) {
      return id;
    }
    
    attempts++;
  }
  
  // Fallback: use full timestamp if collision occurs
  const fallbackId = `${prefix}-${generateShortId(3)}${getTimestampComponent()}`;
  return fallbackId;
}

/**
 * Validate if an ID follows the expected format
 */
export function validateIdFormat(id: string, expectedPrefix: string): boolean {
  const pattern = new RegExp(`^${expectedPrefix}-[A-Za-z0-9]{6,8}$`);
  return pattern.test(id);
}

/**
 * Extract information from an ID (for debugging/analytics)
 */
export function parseId(id: string): { prefix: string; shortId: string; timestamp?: string } | null {
  const parts = id.split('-');
  if (parts.length !== 2) return null;
  
  const [prefix, idPart] = parts;
  if (idPart.length < 6) return null;
  
  return {
    prefix,
    shortId: idPart.substring(0, 4),
    timestamp: idPart.length > 4 ? idPart.substring(4) : undefined
  };
}

// Export legacy functions for backward compatibility (deprecated)
/**
 * @deprecated Use generateStudentId() instead
 */
export function generateStudentIdLegacy(existingStudents: any[]): string {
  const count = existingStudents.length + 1;
  return `STU${count.toString().padStart(4, '0')}`;
}

/**
 * @deprecated Use generateTeacherId() instead
 */
export function generateTeacherIdLegacy(existingTeachers: any[]): string {
  const count = existingTeachers.length + 1;
  return `TCH${count.toString().padStart(4, '0')}`;
}
