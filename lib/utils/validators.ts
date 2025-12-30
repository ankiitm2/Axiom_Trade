/**
 * Validation utilities
 * Provides input validation functions for forms and user input
 */

/**
 * Validate Solana address format
 * 
 * @param address - Address string to validate
 * @returns True if valid Solana address
 */
export const isValidSolanaAddress = (address: string): boolean => {
  // Solana addresses are base58 encoded and typically 32-44 characters
  const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  return solanaAddressRegex.test(address)
}

/**
 * Validate keyword input (no special characters except spaces and commas)
 * 
 * @param keyword - Keyword string to validate
 * @returns True if valid keyword
 */
export const isValidKeyword = (keyword: string): boolean => {
  // Allow alphanumeric, spaces, and commas
  const keywordRegex = /^[a-zA-Z0-9\s,]+$/
  return keywordRegex.test(keyword)
}

/**
 * Validate number is within range
 * 
 * @param value - Number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max
}

/**
 * Validate percentage value (0-100)
 * 
 * @param value - Percentage value
 * @returns True if valid percentage
 */
export const isValidPercentage = (value: number): boolean => {
  return isInRange(value, 0, 100)
}

/**
 * Sanitize user input to prevent XSS
 * 
 * @param input - User input string
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate and parse comma-separated keywords
 * 
 * @param input - Comma-separated keyword string
 * @returns Array of trimmed, valid keywords
 */
export const parseKeywords = (input: string): string[] => {
  return input
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0 && isValidKeyword(k))
}

/**
 * Check if value is a valid number
 * 
 * @param value - Value to check
 * @returns True if valid number
 */
export const isValidNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
}

/**
 * Validate token data structure
 * 
 * @param data - Data to validate
 * @returns True if valid token data
 */
export const isValidTokenData = (data: unknown): boolean => {
  if (typeof data !== 'object' || data === null) return false
  
  const token = data as Record<string, unknown>
  
  return (
    typeof token.id === 'string' &&
    typeof token.name === 'string' &&
    typeof token.symbol === 'string' &&
    isValidNumber(token.price) &&
    isValidNumber(token.marketCap)
  )
}
