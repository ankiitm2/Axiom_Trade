import { useMemo } from 'react'
import { useAppSelector } from '../hooks'
import { TokenStatus } from '../features/market/marketSlice'

/**
 * Custom hook to get total token count for a specific section (unfiltered)
 * Memoized to prevent unnecessary recalculations
 * 
 * @param status - The token status section (new_pairs, final_stretch, migrated)
 * @returns Total count of tokens in the section
 */
export function useTokenCount(status: TokenStatus): number {
  const allTokens = useAppSelector(state => state.market.tokens)
  
  return useMemo(() => {
    return allTokens.filter(t => t.status === status).length
  }, [allTokens, status])
}

/**
 * Custom hook to get filter count for a specific section
 * Returns the number of active filters (protocols + keywords + excluded keywords)
 * 
 * @param status - The token status section
 * @returns Number of active filters
 */
export function useFilterCount(status: TokenStatus): number {
  const filters = useAppSelector(state => state.market.activeFilters[status])
  
  return useMemo(() => {
    return filters.protocols.length + 
           filters.keywords.length + 
           filters.excludedKeywords.length
  }, [filters])
}
