/**
 * Error handling utilities
 * Provides consistent error handling across the application
 */

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Handle API errors with consistent formatting
 * 
 * @param error - The error object
 * @returns Formatted error message
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred'
}

/**
 * Log error to console in development, send to monitoring in production
 * 
 * @param error - The error to log
 * @param context - Additional context about where the error occurred
 */
export const logError = (error: unknown, context?: string): void => {
  const errorMessage = handleApiError(error)
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, errorMessage, error)
  } else {
    // In production, send to error monitoring service (e.g., Sentry)
    // sentry.captureException(error, { tags: { context } })
  }
}

/**
 * Safe JSON parse with error handling
 * 
 * @param json - JSON string to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export const safeJsonParse = <T>(json: string, fallback: T): T => {
  try {
    return JSON.parse(json) as T
  } catch (error) {
    logError(error, 'JSON Parse')
    return fallback
  }
}

/**
 * Retry a function with exponential backoff
 * Useful for API calls that might fail temporarily
 * 
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param delay - Initial delay in ms (default: 1000)
 * @returns Promise with function result
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (maxRetries <= 0) {
      throw error
    }
    
    await new Promise(resolve => setTimeout(resolve, delay))
    return retryWithBackoff(fn, maxRetries - 1, delay * 2)
  }
}
