"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import type { TagData } from "./floating-tag"

interface Signal {
  id: string
  title: string
  source: string
  date: string
  relevance: number
  category: string
  summary: string
}

// Dummy signals data
const DUMMY_SIGNALS: Signal[] = [
  {
    id: "1",
    title: "Korean Fintech Startup Raises $50M Series B",
    source: "TechCrunch",
    date: "2024.01.15",
    relevance: 94,
    category: "Funding",
    summary: "Leading digital payment platform expands into Southeast Asian markets with fresh capital injection.",
  },
  {
    id: "2",
    title: "New AI Regulations Framework Proposed in EU",
    source: "Reuters",
    date: "2024.01.14",
    relevance: 87,
    category: "Regulation",
    summary: "European Commission outlines stricter guidelines for AI deployment in financial services sector.",
  },
  {
    id: "3",
    title: "Healthcare Tech M&A Activity Surges in Q4",
    source: "Bloomberg",
    date: "2024.01.13",
    relevance: 82,
    category: "M&A",
    summary: "Strategic acquisitions reshape digital health landscape as major players consolidate positions.",
  },
  {
    id: "4",
    title: "Mobility Sector Sees Shift Toward Sustainable Models",
    source: "Forbes",
    date: "2024.01.12",
    relevance: 78,
    category: "Trend",
    summary: "Electric vehicle adoption accelerates as infrastructure investments reach critical mass.",
  },
  {
    id: "5",
    title: "Cloud Computing Costs Drop 30% Year-over-Year",
    source: "Gartner",
    date: "2024.01.11",
    relevance: 75,
    category: "Technology",
    summary: "Competition among major providers drives down enterprise cloud spending significantly.",
  },
]

interface SignalFeedProps {
  selectedTags: TagData[]
  onBack: () => void
}

export function SignalFeed({ selectedTags, onBack }: SignalFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-30 bg-background"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-8 py-6 border-b border-foreground/10">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-light text-foreground/60 hover:text-foreground transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Explorer
          </button>
          
          <div className="flex items-center gap-3">
            {selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-xs font-light tracking-wide rounded-full border border-foreground/20"
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Signal List */}
      <div className="pt-24 pb-12 px-8 h-full overflow-auto">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-extralight tracking-wide mb-2">
              {DUMMY_SIGNALS.length} Signals Detected
            </h2>
            <p className="text-sm text-foreground/50 font-light">
              Based on your selected filters
            </p>
          </motion.div>

          <div className="space-y-4">
            {DUMMY_SIGNALS.map((signal, index) => (
              <motion.article
                key={signal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
                className={cn(
                  "group relative p-6 rounded-lg",
                  "border border-foreground/10 hover:border-foreground/30",
                  "bg-background hover:bg-foreground/[0.02]",
                  "transition-all duration-300 cursor-pointer"
                )}
              >
                {/* Relevance indicator */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <span className="text-xs font-light text-foreground/40">Relevance</span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-1 bg-foreground/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${signal.relevance}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                        className="h-full bg-foreground/60"
                      />
                    </div>
                    <span className="text-xs font-mono text-foreground/60">{signal.relevance}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  {/* Category badge */}
                  <div className="shrink-0 w-2 h-2 mt-2 rounded-full bg-foreground/40" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-light tracking-wider text-foreground/40 uppercase">
                        {signal.category}
                      </span>
                      <span className="text-xs text-foreground/30">|</span>
                      <span className="text-xs font-light text-foreground/40">
                        {signal.source}
                      </span>
                      <span className="text-xs text-foreground/30">|</span>
                      <span className="text-xs font-mono text-foreground/30">
                        {signal.date}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-light mb-2 group-hover:text-foreground/80 transition-colors">
                      {signal.title}
                    </h3>
                    
                    <p className="text-sm font-light text-foreground/50 leading-relaxed">
                      {signal.summary}
                    </p>
                  </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-foreground/0 group-hover:bg-foreground/40 transition-colors" />
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      {/* Grid overlay */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </motion.div>
  )
}
