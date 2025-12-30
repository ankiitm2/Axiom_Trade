/**
 * Format price with appropriate decimal places based on value
 * Small values get more precision
 * 
 * @param price - The price value to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number): string => {
  if (price < 0.000001) return price.toExponential(2)
  if (price < 0.01) return price.toFixed(6)
  if (price < 1) return price.toFixed(4)
  return price.toFixed(2)
}

/**
 * Format percentage change with sign and color indication
 * 
 * @param value - The percentage value
 * @returns Formatted percentage string with sign
 */
export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

/**
 * Get color class based on percentage value
 * 
 * @param value - The percentage value
 * @returns Tailwind color class
 */
export const getPercentageColor = (value: number): string => {
  if (value > 0) return 'text-green-400'
  if (value < 0) return 'text-red-400'
  return 'text-muted-foreground'
}

/**
 * Format large numbers with K, M, B suffixes
 * 
 * @param value - The number to format
 * @param prefix - Optional prefix (e.g., '$')
 * @returns Formatted string
 */
export const formatLargeNumber = (value: number, prefix: string = '$'): string => {
  if (value >= 1e9) return `${prefix}${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `${prefix}${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `${prefix}${(value / 1e3).toFixed(2)}K`
  return `${prefix}${value.toFixed(2)}`
}

/**
 * Format market cap specifically
 * 
 * @param value - Market cap value
 * @returns Formatted market cap string
 */
export const formatMarketCap = (value: number): string => {
  return formatLargeNumber(value, '$')
}

/**
 * Format volume with appropriate suffix
 * 
 * @param value - Volume value
 * @returns Formatted volume string
 */
export const formatVolume = (value: number): string => {
  return formatLargeNumber(value, '$')
}

/**
 * Format time since creation
 * Converts minutes to appropriate time unit
 * 
 * @param minutes - Minutes since creation
 * @returns Formatted time string
 */
export const formatTimeSince = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`
  return `${Math.floor(minutes / 1440)}d`
}

/**
 * Truncate address for display
 * Shows first and last characters
 * 
 * @param address - Full address string
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Truncated address
 */
export const truncateAddress = (
  address: string, 
  startChars: number = 6, 
  endChars: number = 4
): string => {
  if (address.length <= startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}
