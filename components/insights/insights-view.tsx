"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReportBuilder } from "./report-builder"
import { ReportPreview } from "./report-preview"

type InsightStep = "configure" | "preview" | "generating"

interface ReportConfig {
  title: string
  scope: string[]
  depth: "executive" | "detailed" | "comprehensive"
  sections: string[]
  timeframe: string
}

const SCOPE_OPTIONS = [
  { id: "market", label: "Market Analysis" },
  { id: "competitor", label: "Competitor Intelligence" },
  { id: "trend", label: "Trend Forecast" },
  { id: "risk", label: "Risk Assessment" },
  { id: "opportunity", label: "Opportunity Mapping" },
]

const SECTION_OPTIONS = [
  { id: "executive", label: "Executive Summary" },
  { id: "data", label: "Data Visualization" },
  { id: "analysis", label: "Deep Analysis" },
  { id: "recommendations", label: "Strategic Recommendations" },
  { id: "appendix", label: "Appendix & Sources" },
]

interface InsightsViewProps {
  onNavigate?: (view: "explore" | "insights") => void
}

export function InsightsView({ onNavigate }: InsightsViewProps) {
  const [step, setStep] = useState<InsightStep>("configure")
  const [config, setConfig] = useState<ReportConfig>({
    title: "",
    scope: [],
    depth: "detailed",
    sections: ["executive", "analysis", "recommendations"],
    timeframe: "Q1 2024",
  })

  const handleScopeToggle = (scopeId: string) => {
    setConfig((prev) => ({
      ...prev,
      scope: prev.scope.includes(scopeId)
        ? prev.scope.filter((s) => s !== scopeId)
        : [...prev.scope, scopeId],
    }))
  }

  const handleSectionToggle = (sectionId: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.includes(sectionId)
        ? prev.sections.filter((s) => s !== sectionId)
        : [...prev.sections, sectionId],
    }))
  }

  const handleGenerate = () => {
    setStep("generating")
    // Simulate generation
    setTimeout(() => {
      setStep("preview")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 border-b border-foreground/10 bg-background/80 backdrop-blur-md"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-foreground/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-foreground rounded-full" />
              </div>
              <span className="text-sm font-light tracking-[0.2em] uppercase text-foreground/60">
                Signal Explorer
              </span>
            </div>
            <nav className="flex items-center gap-6">
              <button 
                onClick={() => onNavigate?.("explore")}
                className="text-sm font-light tracking-wide text-foreground/40 hover:text-foreground transition-colors"
              >
                Explore
              </button>
              <button className="text-sm font-light tracking-wide text-foreground border-b border-foreground pb-0.5">
                Insights
              </button>
            </nav>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-6">
            {["configure", "preview"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono",
                    step === s || (step === "generating" && s === "configure")
                      ? "border-foreground bg-foreground text-background"
                      : step === "preview" && s === "configure"
                      ? "border-foreground/40 text-foreground/40"
                      : "border-foreground/20 text-foreground/20"
                  )}
                >
                  {i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-light tracking-wider uppercase",
                    step === s ? "text-foreground" : "text-foreground/40"
                  )}
                >
                  {s === "configure" ? "Configure" : "Preview"}
                </span>
                {i < 1 && (
                  <div className="w-12 h-px bg-foreground/20 ml-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Content */}
      <div className="pt-28 pb-12 px-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {step === "configure" && (
              <motion.div
                key="configure"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ReportBuilder
                  config={config}
                  setConfig={setConfig}
                  scopeOptions={SCOPE_OPTIONS}
                  sectionOptions={SECTION_OPTIONS}
                  onScopeToggle={handleScopeToggle}
                  onSectionToggle={handleSectionToggle}
                  onGenerate={handleGenerate}
                />
              </motion.div>
            )}

            {step === "generating" && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[60vh]"
              >
                <GeneratingAnimation />
              </motion.div>
            )}

            {step === "preview" && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ReportPreview
                  config={config}
                  onBack={() => setStep("configure")}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
    </div>
  )
}

function GeneratingAnimation() {
  return (
    <div className="text-center">
      {/* Animated circles */}
      <div className="relative w-32 h-32 mx-auto mb-8">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border border-foreground/30 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-1 h-1 bg-foreground rounded-full absolute top-2" />
        </motion.div>
      </div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-extralight tracking-wide mb-2"
      >
        Generating Report
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm font-light text-foreground/50"
      >
        Analyzing signals and synthesizing insights...
      </motion.p>

      {/* Progress steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 space-y-2"
      >
        {["Collecting data sources", "Analyzing patterns", "Generating insights"].map(
          (text, i) => (
            <motion.div
              key={text}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.8,
              }}
              className="text-xs font-light text-foreground/40"
            >
              {text}
            </motion.div>
          )
        )}
      </motion.div>
    </div>
  )
}
