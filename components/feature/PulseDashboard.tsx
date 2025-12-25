'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Filter, Settings2, RotateCcw } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import TokenCard from './TokenCard'
import { TokenStatus, updatePrices } from '@/lib/features/market/marketSlice'
import { Skeleton } from '@/components/ui/skeleton'

// Column Component
interface PulseColumnProps {
    /** Title of the column */
    title: string 
    /** Filter status for this column */
    status: TokenStatus
    /** Total number of tokens in this group */
    count: number
    /** List of token data to display */
    tokens: any[] // Should strictly be TokenData[]
    /** Loading state */
    loading: boolean
}

/**
 * PulseColumn Component
 * Renders a vertical list of TokenCards for a specific category.
 * Handles loading states and layout animations.
 */
const PulseColumn = ({ title, status, count, tokens, loading }: PulseColumnProps) => {
    return (
        <div className="flex flex-col h-[500px] lg:h-full bg-card/20 border-r-0 lg:border-r border-border/30 last:border-r-0 w-full lg:w-1/3">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/30 bg-muted/5 sticky top-0 z-10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                     <span className="text-xs font-mono text-muted-foreground mr-1">{count}</span>
                     <div className="flex bg-muted/20 rounded p-0.5 border border-border/20" role="group" aria-label="Timeframe filters">
                        <button className="px-1.5 py-0.5 text-[9px] hover:text-foreground text-muted-foreground transition-colors" aria-label="1 minute timeframe">P1</button>
                        <button className="px-1.5 py-0.5 text-[9px] hover:text-foreground text-muted-foreground transition-colors" aria-label="2 minute timeframe">P2</button>
                        <button className="px-1.5 py-0.5 text-[9px] hover:text-foreground text-muted-foreground transition-colors" aria-label="3 minute timeframe">P3</button>
                     </div>
                     <button aria-label="Filter options">
                        <Filter className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                     </button>
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
}

/**
 * PulseDashboard Component
 * The main container for the token discovery interface.
 * Orchestrates data fetching, live updates, and the 3-column layout.
 */
export default function PulseDashboard() {
  const { tokens } = useAppSelector(state => state.market)
  const [loading, setLoading] = React.useState(true)

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

  // Derived state for columns
  const newPairs = useMemo(() => tokens.filter(t => t.status === 'new_pairs'), [tokens])
  const finalStretch = useMemo(() => tokens.filter(t => t.status === 'final_stretch'), [tokens])
  const migrated = useMemo(() => tokens.filter(t => t.status === 'migrated'), [tokens])

  return (
    <div className="flex flex-col h-full lg:h-[calc(100vh-80px)] w-full"> 
       {/* Dashboard Header */}
       <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-xl shrink-0">
           <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                   <h1 className="text-2xl font-bold tracking-tight text-foreground">Pulse</h1>
                   <div className="flex gap-1" role="status" aria-label="Live updates active">
                      <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                      <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse delay-75" />
                   </div>
               </div>
               {/* Global Stats mock */}
               <div className="hidden md:flex gap-4 text-xs font-mono text-muted-foreground border-l border-border/30 pl-4" role="complementary" aria-label="Global market stats">
                   <span>SOL: <span className="text-green-400">$122.6</span></span>
                   <span>TPS: <span className="text-blue-400">2,492</span></span>
               </div>
           </div>

           <div className="flex items-center gap-3">
               <button 
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-muted/20 border border-border/30 rounded-full hover:bg-muted/40 transition-colors"
                  aria-label="Display settings"
                >
                   <Settings2 className="w-3.5 h-3.5" /> Display
               </button>
                <button 
                  className="p-2 hover:bg-muted/20 rounded-full transition-colors"
                  aria-label="Reset view"
                >
                   <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
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
              tokens={newPairs} 
              loading={loading}
            />
           <PulseColumn 
              title="Final Stretch" 
              status="final_stretch" 
              count={finalStretch.length} 
              tokens={finalStretch} 
              loading={loading}
            />
           <PulseColumn 
              title="Migrated" 
              status="migrated" 
              count={migrated.length} 
              tokens={migrated} 
              loading={loading}
            />
       </div>
    </div>
  )
}
