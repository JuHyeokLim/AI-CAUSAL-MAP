"use client"

import { useDroppable } from "@dnd-kit/core"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { TagData } from "./floating-tag"

interface DropZoneProps {
  selectedTags: TagData[]
  onRemoveTag?: (tagId: string) => void
  onExplore?: () => void
}

export function DropZone({ selectedTags, onRemoveTag, onExplore }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "selection-zone",
  })

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className={cn(
        "fixed bottom-8 left-1/2 -translate-x-1/2",
        "min-w-[300px] max-w-[600px] min-h-[60px]",
        "px-6 py-4 rounded-2xl",
        "border border-foreground/20 bg-background/60 backdrop-blur-md",
        "transition-all duration-300",
        isOver && "border-foreground/50 bg-background/80 scale-[1.02]"
      )}
    >
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {selectedTags.length === 0 ? (
          <span className="text-muted-foreground text-sm font-light tracking-wide">
            Drop keywords here to customize your signal feed
          </span>
        ) : (
          <AnimatePresence mode="popLayout">
            {selectedTags.map((tag) => (
              <motion.button
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRemoveTag?.(tag.id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-light",
                  "bg-foreground text-background",
                  "hover:bg-foreground/80 transition-colors",
                  "flex items-center gap-2"
                )}
              >
                {tag.label}
                <span className="text-xs opacity-60">x</span>
              </motion.button>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {selectedTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 pt-3 border-t border-foreground/10 flex items-center justify-between"
        >
          <span className="text-xs text-muted-foreground tracking-wider uppercase">
            {selectedTags.length} filter{selectedTags.length > 1 ? "s" : ""} active
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExplore}
            className={cn(
              "px-4 py-1.5 text-xs font-light tracking-wider uppercase",
              "bg-foreground text-background rounded-full",
              "hover:bg-foreground/80 transition-colors"
            )}
          >
            Explore Signals
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
