"use client"

import Image from 'next/image'
import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  ShieldCheck, 
  Lock,
  Search,
  Activity,
  Copy,
  Check
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import type { TokenData } from '@/lib/features/market/marketSlice'

interface TokenCardProps {
  /** The token data object containing all metrics and metadata */
  token: TokenData
}

/**
 * Formats large numbers into readable concise strings (e.g., 1.2M, 400K).
 * @param num - The number to format
 */
const formatNumber = (num: number) => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`
  return `$${num.toFixed(1)}`
}

/**
 * TokenCard Component
 * Displays a single token's metrics, status, and interactive actions.
 * Optimized for performance with React.memo and next/image.
 */
const TokenCard = memo(({ token }: TokenCardProps) => {
  const isPositive = token.priceChange1h >= 0
  const prevPriceRef = React.useRef(token.price)
  const [flash, setFlash] = React.useState<'up' | 'down' | null>(null)
  const [copied, setCopied] = React.useState(false)

  // Track price changes to trigger flash animation
  React.useEffect(() => {
     if (token.price > prevPriceRef.current) {
        setFlash('up')
     } else if (token.price < prevPriceRef.current) {
        setFlash('down')
     }
     prevPriceRef.current = token.price
     
     const timer = setTimeout(() => setFlash(null), 1000)
     return () => clearTimeout(timer)
  }, [token.price])

  const handleCopy = (e: React.MouseEvent) => {
      e.stopPropagation()
      navigator.clipboard.writeText(token.contractAddress) 
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card 
      className="bg-card/50 border-input/40 backdrop-blur-md p-3 transition-colors duration-300 group relative overflow-hidden"
      role="article"
      aria-label={`Token card for ${token.name}`}
    > 
      {/* Flash Overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className={`absolute inset-0 z-0 pointer-events-none 
              ${flash === 'up' 
                ? 'bg-gradient-to-r from-transparent via-green-500/10 to-transparent' 
                : 'bg-gradient-to-r from-transparent via-red-500/10 to-transparent'
              }`}
          />
        )}
      </AnimatePresence>
      
      {/* Border Highlight (Removed as per feedback, kept static) */}
      <div className="absolute inset-0 border-2 border-transparent rounded-lg pointer-events-none z-10" />

      <div className="flex gap-3 relative z-10">
        {/* Left: Image with Hover Effect */}
        <div className="relative shrink-0">
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <div 
                  className="w-14 h-14 rounded-md overflow-hidden shadow-lg cursor-pointer bg-muted relative group/image ring-1 ring-border/50 hover:ring-2 hover:ring-primary/20 transition-all outline-none focus:outline-none"
                  role="button"
                  aria-label={`View details for ${token.name}`}
                  tabIndex={0}
                >
                    <Image 
                      src={token.image} 
                      alt={token.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover/image:scale-110"
                      unoptimized={false} // Use next/image optimization
                    />
                     <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5 border border-border z-20">
                        <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${flash === 'up' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]' : flash === 'down' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-gray-500'}`} />
                     </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent side="right" align="start" className="w-[300px] p-0 overflow-hidden border-border/50 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl">
               <div className="relative aspect-square w-full">
                   <Image 
                      src={token.image} 
                      alt={token.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                        <h3 className="text-white font-bold text-2xl drop-shadow-md tracking-tight">{token.name}</h3>
                        <p className="text-white/70 text-sm font-mono mt-1">{token.symbol}</p>
                    </div>
               </div>
               <div className="p-4 bg-muted/10 border-t border-white/5">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground/70 mb-3 tracking-wider">Similar Tokens</div>
                  <div className="flex gap-3">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-md bg-muted/20 animate-pulse ring-1 ring-white/10" />
                     ))}
                  </div>
               </div>
            </HoverCardContent>
          </HoverCard>
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          
          {/* Top Row: Name + Metrics */}
          <div className="flex items-center justify-between mb-1">
             <div className="flex items-center gap-2 min-w-0">
                 <h3 className="font-bold text-sm truncate text-foreground/90">{token.name}</h3>
                 <span className="text-[10px] text-muted-foreground truncate font-medium">{token.symbol}</span>
                 <TooltipProvider>
                    <Tooltip delayDuration={0}>
                      <TooltipTrigger asChild>
                         <button 
                             onClick={handleCopy} 
                             className={`ml-0.5 p-1 rounded transition-colors group/copy ${copied ? 'text-green-500' : 'text-muted-foreground/40 hover:text-foreground'}`}
                             aria-label="Copy contract address"
                         >
                             {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                         </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-[10px] font-mono bg-black text-white border-white/20">
                          {copied ? "Copied!" : token.contractAddress}
                      </TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
             </div>
             <div className="text-right leading-none">
                 <div className="text-xs font-bold text-blue-400">{formatNumber(token.marketCap)}</div>
                 <div className="text-[10px] text-muted-foreground/80 flex items-center justify-end gap-0.5">
                    <span className="uppercase text-[9px]" aria-label="Volume 24h">VOL</span> {formatNumber(token.volume24h)}
                 </div>
             </div>
          </div>

          {/* Middle Row: Meta info & Icons */}
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
                 <span className="text-xs font-mono text-green-400 bg-green-500/10 px-1 rounded" aria-label={`Created ${token.timeSinceCreation} ago`}>
                    {token.timeSinceCreation}
                 </span>
                 <TooltipProvider>
                    <div className="flex items-center gap-1 text-muted-foreground">
                        {token.security.hasAudit && (
                            <Tooltip>
                              <TooltipTrigger><ShieldCheck className="w-3 h-3 text-green-500" aria-label="Audited Contract" /></TooltipTrigger>
                              <TooltipContent>Audited Contract</TooltipContent>
                            </Tooltip>
                        )}
                        {token.security.noMint && (
                             <Tooltip>
                              <TooltipTrigger><Lock className="w-3 h-3 text-blue-500" aria-label="Mint Authority Revoked" /></TooltipTrigger>
                              <TooltipContent>Mint Authority Revoked</TooltipContent>
                            </Tooltip>
                        )}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button aria-label="Quick analysis">
                                    <Search className="w-3 h-3 hover:text-foreground cursor-pointer" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-60 p-2">
                                <div className="text-xs space-y-2">
                                    <div className="font-bold border-b pb-1">Quick Analysis</div>
                                    <div className="grid grid-cols-2 gap-2">
                                         <div>Liq: {formatNumber(token.liquidity)}</div>
                                         <div>Top 10: {token.security.top10Holders.toFixed(1)}%</div>
                                    </div>
                                    <button className="w-full bg-primary/20 hover:bg-primary/30 text-primary py-1 rounded text-center mt-2">
                                        View Chart
                                    </button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                 </TooltipProvider>
             </div>
             
             <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 font-mono">
                <span className="flex items-center gap-0.5" aria-label={`${token.holders} holders`}>
                    <Users className="w-3 h-3" /> {token.holders}
                </span>
                <span className="flex items-center gap-0.5 ml-1" aria-label={`${token.transactions} transactions`}>
                    TX {token.transactions}
                </span>
             </div>
          </div>

          {/* Bottom Row: Percentage Badges */}
          <div className="flex items-center gap-2 overflow-hidden">
             <span className={`text-[10px] font-mono flex items-center gap-0.5 ${token.priceChange5m >= 0 ? 'text-green-500' : 'text-red-500'}`} aria-label={`5 minute change ${token.priceChange5m.toFixed(1)}%`}>
                <Activity className="w-3 h-3" /> {Math.abs(token.priceChange5m).toFixed(1)}%
             </span>
             <span className="text-[10px] text-muted-foreground" aria-hidden="true">|</span>
             <Badge variant="outline" className={`h-4 px-1 py-0 text-[9px] border-none bg-muted/20 ${token.priceChange1h >= 0 ? 'text-green-500' : 'text-red-500'}`} aria-label={`1 hour change ${token.priceChange1h.toFixed(0)}%`}>
                 1h {Math.abs(token.priceChange1h).toFixed(0)}%
             </Badge>
             <Badge variant="outline" className={`h-4 px-1 py-0 text-[9px] border-none bg-muted/20 ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`} aria-label={`24 hour change ${token.priceChange24h.toFixed(0)}%`}>
                 24h {Math.abs(token.priceChange24h).toFixed(0)}%
             </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
})

TokenCard.displayName = 'TokenCard'

export default TokenCard
