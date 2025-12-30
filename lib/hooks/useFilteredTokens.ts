import { useMemo } from 'react'
import { useAppSelector } from '../hooks'
import { TokenStatus, TokenData } from '../features/market/marketSlice'

/**
 * Custom hook to get filtered tokens for a specific section
 * Memoized to prevent unnecessary recalculations
 * 
 * @param status - The token status section to filter (new_pairs, final_stretch, migrated)
 * @returns Filtered array of tokens matching the section's active filters
 */
export function useFilteredTokens(status: TokenStatus): TokenData[] {
  const allTokens = useAppSelector(state => state.market.tokens)
  const filters = useAppSelector(state => state.market.activeFilters[status])
  
  return useMemo(() => {
    return allTokens.filter(token => {
      // First filter by status
      if (token.status !== status) return false
      
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
  }, [allTokens, filters, status])
}
