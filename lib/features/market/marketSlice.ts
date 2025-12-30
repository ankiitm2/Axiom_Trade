import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

/**
 * Defines the possible statuses a token can have, used for filtering.
 * - 'new_pairs': Recently launched tokens.
 * - 'final_stretch': Tokens nearing completion of their initial phase.
 * - 'migrated': Tokens that have completed their initial phase or moved to a new chain.
 */
export type TokenStatus = 'new_pairs' | 'final_stretch' | 'migrated'

export const PROTOCOL_NAMES = [
  "Pump", "Mayhem", "Bonk", "Bags", "Moonshot", "Heaven", 
  "Daos.fun", "Candle", "Sugar", "Believe", "Jupiter Studio", "Moonit"
]

/**
 * Represents the full data structure for a single token in the marketplace.
 * This includes static metadata (name, image) and dynamic market metrics (price, volume).
 */
export interface TokenData {
  id: string
  name: string
  symbol: string
  image: string
  price: number
  /** Percentage change in price over the last 24 hours */
  priceChange24h: number
  priceChange1h: number
  /** High-frequency percentage change used for sorting/trending logic */
  priceChange5m: number
  marketCap: number
  liquidity: number
  volume24h: number
  transactions: number
  holders: number
  timeSinceCreation: string
  contractAddress: string
  protocol: string
  /** Security metrics often checked by traders */
  security: {
    noMint: boolean
    hasAudit: boolean
    isBurned: boolean
    top10Holders: number // percentage
  }
  status: TokenStatus
  /** Price history array for future chart rendering */
  history: number[]
}

/**
 * Defines the available sorting options for the token list.
 */
export type SortOption = 'trending' | 'marketCap' | 'creationTime'

export interface FilterOptions {
    keywords: string[]
    excludedKeywords: string[]
    protocols: string[]
}

export interface SectionFilters {
  new_pairs: FilterOptions
  final_stretch: FilterOptions
  migrated: FilterOptions
}

/**
 * Represents the state structure for the market slice.
 * Manages a list of tokens, current filter, sort order, and selected token.
 */
interface MarketState {
  tokens: TokenData[]
  filter: TokenStatus | 'all'
  activeFilters: SectionFilters
  sort: SortOption
  selectedToken: TokenData | null
}

const MEME_NAMES = [
  { name: "Pepe Coin", symbol: "PEPE" },
  { name: "Doge Killer", symbol: "LEASH" },
  { name: "Shiba Inu", symbol: "SHIB" },
  { name: "Floki", symbol: "FLOKI" },
  { name: "Wojak", symbol: "WOJAK" },
  { name: "Milady", symbol: "LADYS" },
  { name: "Turbo", symbol: "TURBO" },
  { name: "Sponge", symbol: "SPONGE" },
  { name: "Mog Coin", symbol: "MOG" },
  { name: "HarryPotter", symbol: "BITCOIN" },
  { name: "HODL", symbol: "HODL" },
  { name: "GigaChad", symbol: "GIGA" },
  { name: "BasedGod", symbol: "BASED" },
  { name: "Zoomer", symbol: "ZOOM" },
  { name: "Boomer", symbol: "BOOM" },
  { name: "Coq Inu", symbol: "COQ" },
  { name: "Bonk", symbol: "BONK" },
  { name: "Myro", symbol: "MYRO" },
  { name: "Wen", symbol: "WEN" },
  { name: "Popcat", symbol: "POPCAT" },
  { name: "Dogwifhat", symbol: "WIF" },
  { name: "Silly Dragon", symbol: "SILLY" },
  { name: "Retardio", symbol: "RETARD" },
  { name: "Michi", symbol: "MICHI" },
  { name: "Popcat", symbol: "POPCAT" },
  { name: "Mew", symbol: "MEW" },
  { name: "Maneki", symbol: "MANEKI" },
  { name: "Slothana", symbol: "SLOTH" },
  { name: "Book of Meme", symbol: "BOME" },
  { name: "Slerf", symbol: "SLERF" }
]

// Simple pseudo-random function to ensure deterministic data (fixes hydration mismatch)
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * Generates a list of realistic mock tokens for demonstration purposes.
 * Populates data relative to the token's "status" (e.g. newer tokens might be more volatile).
 */
const generateMockTokens = (): TokenData[] => {
  const statuses: TokenStatus[] = ['new_pairs', 'final_stretch', 'migrated']
  const tokens: TokenData[] = []

  for (let i = 0; i < 30; i++) {
    const status = statuses[i % 3]
    const meme = MEME_NAMES[i % MEME_NAMES.length]
    // Generate mock Solana address - deterministic using seed
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
    let address = ''
    for (let j = 0; j < 44; j++) {
        const randIndex = Math.floor(seededRandom(i * 100 + j) * chars.length)
        address += chars.charAt(randIndex)
    }
    
    const protocol = PROTOCOL_NAMES[Math.floor(seededRandom(i * 15) * PROTOCOL_NAMES.length)]

    tokens.push({
      id: `token-${i}`,
      name: meme.name,
      symbol: meme.symbol,
      contractAddress: address,
      image: `https://picsum.photos/seed/${i + 142}/200`, 
      price: seededRandom(i * 1) * 10,
      priceChange24h: (seededRandom(i * 2) * 40) - 20,
      priceChange1h: (seededRandom(i * 3) * 10) - 5,
      priceChange5m: (seededRandom(i * 4) * 5) - 2.5,
      marketCap: seededRandom(i * 5) * 2000000,
      liquidity: seededRandom(i * 6) * 500000,
      volume24h: seededRandom(i * 7) * 1000000,
      transactions: Math.floor(seededRandom(i * 8) * 500),
      holders: Math.floor(seededRandom(i * 9) * 1000),
      timeSinceCreation: `${Math.floor(seededRandom(i * 10) * 60)}m`,
      security: {
        noMint: seededRandom(i * 11) > 0.2, // 20% danger chance
        hasAudit: seededRandom(i * 12) > 0.5,
        isBurned: seededRandom(i * 13) > 0.3,
        top10Holders: seededRandom(i * 14) * 50
      },
      status, 
      protocol,
      history: Array.from({ length: 20 }, (_, hIdx) => seededRandom(i * 20 + hIdx) * 100)
    })
  }
  return tokens
}

const initialState: MarketState = {
  tokens: generateMockTokens(),
  filter: 'all',
  activeFilters: {
    new_pairs: {
      keywords: [],
      excludedKeywords: [],
      protocols: []
    },
    final_stretch: {
      keywords: [],
      excludedKeywords: [],
      protocols: []
    },
    migrated: {
      keywords: [],
      excludedKeywords: [],
      protocols: []
    }
  },
  sort: 'trending',
  selectedToken: null
}

export const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<TokenStatus | 'all'>) => {
      state.filter = action.payload
    },
    setSort: (state, action: PayloadAction<SortOption>) => {
      state.sort = action.payload
    },
    setFilters: (state, action: PayloadAction<{ section: TokenStatus; filters: FilterOptions }>) => {
        state.activeFilters[action.payload.section] = action.payload.filters
    },
    /**
     * Simulates real-time market activity.
     * Updates prices, volume, and derivatives (marketCap, changes).
     * Includes logic to randomly skip updates to simulate organic "popcorn" activity.
     */
    updatePrices: (state) => {
      // Mock websocket update: Only update ~15% of tokens per tick to create "random" independent feel
      state.tokens.forEach(token => {
        if (Math.random() > 0.15) return; // Skip 85% of tokens to desync updates

        // Occasional volatility spikes (10% chance for higher volatility)
        const volatility = Math.random() > 0.9 ? 0.05 : 0.005
        const changeDir = Math.random() > 0.45 ? 1 : -1
        const change = token.price * volatility * changeDir

        token.price = Math.max(0.000001, token.price + change)

        // Update derivatives based on new price
        token.marketCap = token.price * (token.marketCap / (token.price - change))
        token.priceChange5m += (change / token.price) * 100
        token.priceChange1h += (change / token.price) * 100

        // Simulate volume/tx increments (30% chance per update)
        if (Math.random() > 0.7) {
            token.volume24h += Math.random() * 1000
            token.transactions += 1
        }

        token.history.push(token.price)
        if (token.history.length > 20) token.history.shift()
      })

      // Re-sort occasionally to keep the leaderboard dynamic
      state.tokens.sort((a, b) => b.priceChange5m - a.priceChange5m)
    }
  },
})

export const { setFilter, setSort, updatePrices, setFilters } = marketSlice.actions

// Custom selector to apply filters per section
export const selectFilteredTokens = createSelector(
  [(state: RootState) => state.market.tokens, (state: RootState) => state.market.activeFilters],
  (tokens, sectionFilters) => {
    return tokens.filter(token => {
       // Get filters for this token's section
       const filters = sectionFilters[token.status]
       
       // Filter by Protocol
       if (filters.protocols.length > 0 && !filters.protocols.includes(token.protocol)) {
           return false
       }
       
       // Filter by Keywords (Name, Symbol)
       if (filters.keywords.length > 0) {
           const match = filters.keywords.some((k: string) => 
               token.name.toLowerCase().includes(k.toLowerCase()) || 
               token.symbol.toLowerCase().includes(k.toLowerCase())
           )
           if (!match) return false
       }

       // Filter by Excluded Keywords (Name, Symbol)
       if (filters.excludedKeywords.length > 0) {
           const match = filters.excludedKeywords.some((k: string) => 
               token.name.toLowerCase().includes(k.toLowerCase()) || 
               token.symbol.toLowerCase().includes(k.toLowerCase())
           )
           if (match) return false
       }

       return true
    })
  }
)

export default marketSlice.reducer
