"use client"

import * as React from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Filter, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setFilters, TokenStatus } from "@/lib/features/market/marketSlice"
import { PROTOCOLS, FILTER_TABS, FILTER_SUB_TABS, TAB_TO_STATUS_MAP, STATUS_TO_DISPLAY_MAP } from "@/lib/constants"

interface FilterModalProps {
  section: TokenStatus
}

/**
 * FilterModal Component
 * Provides filtering interface for token lists with section-specific filters
 * 
 * Features:
 * - Protocol filtering with visual indicators
 * - Keyword search and exclusion
 * - Section-specific filter state
 * - Real-time filter count badges
 * 
 * @param section - The token status section this modal is filtering for
 */
export function FilterModal({ section }: FilterModalProps) {
  const dispatch = useAppDispatch()
  const { activeFilters } = useAppSelector(state => state.market)
  
  // Set initial tab based on the section prop
  const [activeTab, setActiveTab] = React.useState(() => STATUS_TO_DISPLAY_MAP[section])
  const [activeSubTab, setActiveSubTab] = React.useState("Protocols")
  
  // Local state
  const [selectedProtocols, setSelectedProtocols] = React.useState<string[]>([])
  const [searchKeywords, setSearchKeywords] = React.useState("")
  const [excludeKeywords, setExcludeKeywords] = React.useState("")
  const [open, setOpen] = React.useState(false)

  // Sync with Redux when opening - use section-specific filters
  React.useEffect(() => {
     if (open) {
         // Set the active tab to match the section when modal opens
         setActiveTab(STATUS_TO_DISPLAY_MAP[section])
         
         const sectionFilters = activeFilters[section]
         setSelectedProtocols(sectionFilters.protocols)
         setSearchKeywords(sectionFilters.keywords.join(', '))
         setExcludeKeywords(sectionFilters.excludedKeywords.join(', '))
     }
  }, [open, activeFilters, section])

  const toggleProtocol = (name: string) => {
    setSelectedProtocols(prev => 
      prev.includes(name) ? prev.filter(p => p !== name) : [...prev, name]
    )
  }

  const handleApply = () => {
      const keywords = searchKeywords.split(',').map(s => s.trim()).filter(Boolean)
      const excluded = excludeKeywords.split(',').map(s => s.trim()).filter(Boolean)

      dispatch(setFilters({
          section,
          filters: {
            keywords,
            excludedKeywords: excluded,
            protocols: selectedProtocols
          }
      }))
      setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="hover:text-foreground transition-colors" aria-label="Open filters">
           <Filter className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#09090b] border-border/40 text-foreground p-0 gap-0 overflow-hidden shadow-2xl">
        {/* Header Section */}
        <div className="p-6 pb-4 space-y-4 border-b border-border/20">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Filters</DialogTitle>
             {/* Close is built-in but we can custom style or add reset here if needed */}
          </div>

          {/* Main Tabs */}
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground border-b border-border/20 pb-0">
             {FILTER_TABS.map((tab) => {
               // Map tab name to section
               const tabSection = TAB_TO_STATUS_MAP[tab]
               
               // Calculate filter count for this specific section
               let filterCount = 0
               if (tabSection === section) {
                 // For current section, use local state
                 filterCount = selectedProtocols.length + 
                   (searchKeywords.trim() ? searchKeywords.split(',').filter(Boolean).length : 0) +
                   (excludeKeywords.trim() ? excludeKeywords.split(',').filter(Boolean).length : 0)
               } else {
                 // For other sections, use saved filters from Redux
                 const sectionFilters = activeFilters[tabSection]
                 filterCount = sectionFilters.protocols.length + 
                   sectionFilters.keywords.length + 
                   sectionFilters.excludedKeywords.length
               }
               
               return (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={cn(
                     "pb-3 relative transition-colors hover:text-foreground flex items-center gap-2",
                     activeTab === tab ? "text-foreground after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-primary" : ""
                   )}
                 >
                   {tab}
                   {filterCount > 0 && (
                     <span className="flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                       {filterCount}
                     </span>
                   )}
                 </button>
               )
             })}
             <RefreshCw className="w-3.5 h-3.5 ml-auto mb-3 cursor-pointer hover:rotate-180 transition-transform" />
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-2 gap-4 pt-2">
             <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Search Keywords</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="keyword1, keyword2..." 
                    value={searchKeywords}
                    onChange={(e) => setSearchKeywords(e.target.value)}
                    className="w-full bg-muted/20 border border-border/20 roundedmd px-3 py-2 text-xs focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50 rounded-md"
                  />
                </div>
             </div>
             <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Exclude Keywords</label>
                <input 
                  type="text" 
                  placeholder="keyword1, keyword2..." 
                  value={excludeKeywords}
                  onChange={(e) => setExcludeKeywords(e.target.value)}
                  className="w-full bg-muted/20 border border-border/20 roundedmd px-3 py-2 text-xs focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50 rounded-md"
                />
             </div>
          </div>
        </div>

        {/* content */}
        <div className="p-6 pt-2 h-[320px] overflow-y-auto custom-scrollbar">
           {/* Sub Tabs */}
           <div className="flex items-center gap-2 mb-6">
              {FILTER_SUB_TABS.map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveSubTab(tab)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-medium transition-colors border",
                      activeSubTab === tab 
                        ? "bg-muted/30 border-border/40 text-foreground" 
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/10"
                    )}
                 >
                    {tab}
                 </button>
              ))}
              <button 
                 onClick={() => {
                   if (selectedProtocols.length === PROTOCOLS.length) {
                     setSelectedProtocols([])
                   } else {
                     setSelectedProtocols(PROTOCOLS.map(p => p.name))
                   }
                 }}
                 className="ml-auto text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                 {selectedProtocols.length === PROTOCOLS.length ? 'Unselect All' : 'Select All'}
              </button>
           </div>
           
           {/* Protocols Grid */}
           {activeSubTab === 'Protocols' && (
              <div className="grid grid-cols-3 gap-3">
                 {PROTOCOLS.map((proto) => {
                    const isSelected = selectedProtocols.includes(proto.name)
                    return (
                       <button
                          key={proto.name}
                          onClick={() => toggleProtocol(proto.name)}
                          className={cn(
                             "flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                             isSelected ? "bg-muted/20 border-primary/30" : "bg-transparent border-border/20 opacity-60 hover:opacity-100",
                             proto.color
                          )}
                       >
                          {/* Mock Icons based on name or generic */}
                          <div className={cn("w-2 h-2 rounded-full", isSelected ? "bg-current" : "bg-muted-foreground")} />
                          {proto.name}
                       </button>
                    )
                 })}
              </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/20 flex items-center justify-between bg-muted/5">
             <div className="flex gap-2">
                <button className="px-4 py-1.5 rounded-full bg-muted/30 hover:bg-muted/50 text-xs font-medium text-muted-foreground transition-colors">Import</button>
                <button className="px-4 py-1.5 rounded-full bg-muted/30 hover:bg-muted/50 text-xs font-medium text-muted-foreground transition-colors">Export</button>
                <button className="px-4 py-1.5 rounded-full bg-muted/30 hover:bg-muted/50 text-xs font-medium text-muted-foreground transition-colors">Share</button>
             </div>
             <button 
                onClick={handleApply}
                className="px-6 py-1.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-lg shadow-blue-500/20"
             >
                Apply All
             </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
