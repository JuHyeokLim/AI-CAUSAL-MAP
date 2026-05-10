"use client"

import { motion } from "framer-motion"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

export interface TagData {
  id: string
  label: string
  category: "industry" | "region" | "trend" | "technology"
  isSelected?: boolean
}

interface FloatingTagProps {
  tag: TagData
  style?: React.CSSProperties
  onSelect?: (tag: TagData) => void
  delay?: number
}

const categoryStyles = {
  industry: "border-foreground/40",
  region: "border-foreground/30",
  trend: "border-foreground/50",
  technology: "border-foreground/35",
}

export function FloatingTag({ tag, style, onSelect, delay = 0 }: FloatingTagProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: tag.id,
    data: tag,
  })

  const dragStyle = transform
    ? {
        transform: CSS.Transform.toString(transform),
      }
    : undefined

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.5, delay },
        y: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + Math.random() * 2,
        },
      }}
      style={{ ...style, ...dragStyle }}
      className={cn(
        "absolute cursor-grab select-none",
        "px-4 py-2 rounded-full",
        "bg-background/80 backdrop-blur-sm",
        "border transition-all duration-300",
        categoryStyles[tag.category],
        tag.isSelected && "bg-foreground text-background border-foreground",
        isDragging && "cursor-grabbing z-50 scale-110 shadow-lg"
      )}
      onClick={() => onSelect?.(tag)}
      {...attributes}
      {...listeners}
    >
      <span className="text-sm font-light tracking-wide whitespace-nowrap">
        {tag.label}
      </span>
    </motion.div>
  )
}
