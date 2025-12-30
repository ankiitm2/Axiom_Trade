import { TokenStatus } from '../features/market/marketSlice'

/**
 * Protocol configuration with colors for UI consistency
 * Using 'as const' for type safety
 */
export const PROTOCOLS = [
  { name: "Pump", color: "text-green-400 bg-green-400/10 border-green-400/20", icon: "🚀" },
  { name: "Mayhem", color: "text-red-400 bg-red-400/10 border-red-400/20", icon: "💥" },
  { name: "Bonk", color: "text-orange-400 bg-orange-400/10 border-orange-400/20", icon: "🔥" },
  { name: "Bags", color: "text-green-500 bg-green-500/10 border-green-500/20", icon: "💰" },
  { name: "Moonshot", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: "🌙" },
  { name: "Heaven", color: "text-white bg-white/10 border-white/20", icon: "☁️" },
  { name: "Daos.fun", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: "🌊" },
  { name: "Candle", color: "text-orange-500 bg-orange-500/10 border-orange-500/20", icon: "🕯️" },
  { name: "Sugar", color: "text-pink-400 bg-pink-400/10 border-pink-400/20", icon: "🍬" },
  { name: "Believe", color: "text-green-600 bg-green-600/10 border-green-600/20", icon: "✨" },
  { name: "Jupiter Studio", color: "text-orange-300 bg-orange-300/10 border-orange-300/20", icon: "🪐" },
  { name: "Moonit", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: "⚡" },
] as const

export type ProtocolName = typeof PROTOCOLS[number]['name']

/**
 * Get protocol configuration by name
 * 
 * @param name - Protocol name
 * @returns Protocol configuration or undefined
 */
export const getProtocol = (name: string) => {
  return PROTOCOLS.find(p => p.name === name)
}

/**
 * Filter tab configuration
 */
export const FILTER_TABS = ["New Pairs", "Final Stretch", "Migrated"] as const

export const FILTER_SUB_TABS = ["Protocols", "Audit", "$ Metrics", "Socials"] as const

/**
 * Map filter tab names to token status
 */
export const TAB_TO_STATUS_MAP: Record<string, TokenStatus> = {
  "New Pairs": "new_pairs",
  "Final Stretch": "final_stretch",
  "Migrated": "migrated"
}

/**
 * Map token status to display name
 */
export const STATUS_TO_DISPLAY_MAP: Record<TokenStatus, string> = {
  "new_pairs": "New Pairs",
  "final_stretch": "Final Stretch",
  "migrated": "Migrated"
}

/**
 * Timeframe options for filtering
 */
export const TIMEFRAMES = [
  { id: 'P1', label: '1 minute', value: 1 },
  { id: 'P2', label: '2 minutes', value: 2 },
  { id: 'P3', label: '3 minutes', value: 3 },
] as const

/**
 * Animation durations for consistent UX
 */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

/**
 * Update intervals
 */
export const UPDATE_INTERVALS = {
  priceUpdate: 800,      // Price updates every 800ms
  dataRefresh: 5000,     // Full data refresh every 5s
  chartUpdate: 2000,     // Chart updates every 2s
} as const
