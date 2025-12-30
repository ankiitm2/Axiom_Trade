"use client"

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Settings2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { FilterModal } from './FilterModal'
import { cn } from '@/lib/utils'
import TokenCard from './TokenCard'
import { useAppDispatch } from '@/lib/hooks'
import { TokenData, TokenStatus, updatePrices } from '@/lib/features/market/marketSlice'
import { useFilteredTokens } from '@/lib/hooks/useFilteredTokens'
import { useTokenCount } from '@/lib/hooks/useTokenCount'

interface PulseColumnProps {
    title: string
    status: TokenStatus
    count: number
    totalCount: number
    tokens: TokenData[]
    loading: boolean
    className?: string
}

/**
 * PulseColumn component - Displays a column of tokens with filters
 * Memoized to prevent unnecessary re-renders when parent updates
 * Only re-renders when count, totalCount, loading, or tokens length changes
 */
const PulseColumn = React.memo(({ 
    title, 
    status, 
    count, 
    totalCount, 
    tokens, 
    loading, 
    className 
}: PulseColumnProps) => {
    return (
        <div className={cn("flex flex-col h-[500px] lg:h-full bg-card/20 border-r-0 lg:border-r border-border/30 last:border-r-0 w-full lg:w-1/3 transition-all", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30 bg-muted/5 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-xs font-mono text-muted-foreground mr-1">
                       ⚡ {count}{totalCount !== count && <span className="text-muted-foreground/50"> / {totalCount}</span>}
                     </span>
                     <div className="flex bg-muted/20 rounded p-0.5 border border-border/20" role="group" aria-label="Timeframe filters">
                        <button className="px-1.5 py-0.5 text-[9px] hover:text-foreground text-muted-foreground transition-colors" aria-label="1 minute timeframe">P1</button>
                        <button className="px-1.5 py-0.5 text-[9px] hover:text-foreground text-muted-foreground transition-colors" aria-label="2 minute timeframe">P2</button>
                        <button className="px-1.5 py-0.5 text-[9px] hover:text-foreground text-muted-foreground transition-colors" aria-label="3 minute timeframe">P3</button>
                     </div>
                     <div aria-label="Filter options">
                        <FilterModal section={status} /> 
                     </div>
                </div>
            </div>

            {/* List */}
            <div 
                className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar"
                role="list"
                aria-label={`${title} tokens`}
            >
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg border border-border/20 bg-card/10">
                            <Skeleton className="w-14 h-14 rounded-md" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))
                ) : tokens.length === 0 ? (
                    // Empty state when no tokens match filters
                    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                            <svg 
                                className="w-8 h-8 text-muted-foreground" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
                                />
                            </svg>
                        </div>
                        <h3 className="text-sm font-medium text-foreground mb-1">No tokens found</h3>
                        <p className="text-xs text-muted-foreground max-w-[200px]">
                            No tokens match your current filters. Try adjusting your filter criteria.
                        </p>
                    </div>
                ) : (
                    tokens.map((token) => (
                        <motion.div
                            layout
                            key={token.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                                layout: { duration: 0.3, type: "spring", bounce: 0.2 },
                                opacity: { duration: 0.2 }
                            }}
                            role="listitem"
                        >
                            <TokenCard token={token} />
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    )
}, (prevProps, nextProps) => {
  // Custom comparison for optimization
  // Allow re-render if count changes, loading changes, or if we have different number of tokens
  // Don't block re-renders for price updates - we want those to show!
  return (
    prevProps.count === nextProps.count &&
    prevProps.totalCount === nextProps.totalCount &&
    prevProps.loading === nextProps.loading &&
    prevProps.tokens === nextProps.tokens // Reference equality check - will update when Redux state changes
  )
})

PulseColumn.displayName = 'PulseColumn'

export default function PulseDashboard() {
  const [loading, setLoading] = React.useState(true)
  const [activeMobileTab, setActiveMobileTab] = React.useState<TokenStatus>('new_pairs')

  // Use custom hooks for filtered tokens per section
  const newPairs = useFilteredTokens('new_pairs')
  const finalStretch = useFilteredTokens('final_stretch')
  const migrated = useFilteredTokens('migrated')

  // Use custom hooks for total counts
  const totalNewPairs = useTokenCount('new_pairs')
  const totalFinalStretch = useTokenCount('final_stretch')
  const totalMigrated = useTokenCount('migrated')

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  // Live Price Updates
  const dispatch = useAppDispatch()
  React.useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updatePrices())
    }, 800) 
    return () => clearInterval(interval)
  }, [dispatch])

  const mobileTabs = [
      { id: 'new_pairs', label: 'New Pairs' },
      { id: 'final_stretch', label: 'Final Stretch' },
      { id: 'migrated', label: 'Migrated' },
  ]

  return (
    <div className="flex flex-col h-full lg:h-[calc(100vh-80px)] w-full"> 
       {/* Dashboard Header */}
       <div className="flex flex-col md:flex-row items-center justify-between px-4 lg:px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-xl shrink-0 gap-4">
           <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
               <div className="flex items-center gap-2">
                   <h1 className="text-2xl font-bold tracking-tight text-foreground">Pulse</h1>
                   <div className="flex gap-1" role="status" aria-label="Live updates active">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-75" />
                   </div>
               </div>
               {/* Mobile Tabs */}
                <div className="flex lg:hidden bg-muted/20 rounded-lg p-1 border border-border/20">
                    {mobileTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveMobileTab(tab.id as TokenStatus)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                activeMobileTab === tab.id 
                                ? "bg-background text-foreground shadow-sm" 
                                : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

               {/* Global Stats mock */}
               <div className="hidden md:flex gap-4 text-xs font-mono text-muted-foreground border-l border-border/30 pl-4" role="complementary" aria-label="Global market stats">
                   <span>SOL: <span className="text-green-400">$122.6</span></span>
                   <span>TPS: <span className="text-blue-400">2,492</span></span>
               </div>
           </div>

           <div className="flex items-center gap-3 w-full md:w-auto justify-end">
               <button 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-muted/20 border border-border/30 rounded-full hover:bg-muted/40 transition-colors"
                  aria-label="Display settings"
                >
                   <Settings2 className="w-3.5 h-3.5" /> Display
               </button>
           </div>
       </div>

       {/* Columns Layout */}
       <div 
          className="flex-1 flex flex-col lg:flex-row overflow-x-hidden overflow-y-auto lg:overflow-y-hidden lg:divide-x divide-y lg:divide-y-0 divide-border/20"
          role="region"
          aria-label="Token lists"
       >
           <PulseColumn 
              title="New Pairs" 
              status="new_pairs" 
              count={newPairs.length}
              totalCount={totalNewPairs}
              tokens={newPairs} 
              loading={loading}
              className={cn(activeMobileTab === 'new_pairs' ? 'flex' : 'hidden lg:flex')}
            />
           <PulseColumn 
              title="Final Stretch" 
              status="final_stretch" 
              count={finalStretch.length}
              totalCount={totalFinalStretch}
              tokens={finalStretch} 
              loading={loading}
              className={cn(activeMobileTab === 'final_stretch' ? 'flex' : 'hidden lg:flex')}
            />
           <PulseColumn 
              title="Migrated" 
              status="migrated" 
              count={migrated.length}
              totalCount={totalMigrated}
              tokens={migrated} 
              loading={loading}
              className={cn(activeMobileTab === 'migrated' ? 'flex' : 'hidden lg:flex')}
            />
       </div>
    </div>
  )
}
