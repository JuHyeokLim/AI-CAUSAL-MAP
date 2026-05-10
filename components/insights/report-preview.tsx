"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ReportConfig {
  title: string
  scope: string[]
  depth: "executive" | "detailed" | "comprehensive"
  sections: string[]
  timeframe: string
}

interface ReportPreviewProps {
  config: ReportConfig
  onBack: () => void
}

export function ReportPreview({ config, onBack }: ReportPreviewProps) {
  const handleDownload = () => {
    // Simulate PDF download
    alert("PDF download would start here")
  }

  return (
    <div className="space-y-8">
      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-light text-foreground/60 hover:text-foreground transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Edit Configuration
        </button>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 rounded-full text-sm font-light border border-foreground/30 hover:border-foreground/50 transition-colors"
          >
            Share Link
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="px-5 py-2 rounded-full text-sm font-light bg-foreground text-background hover:bg-foreground/90 transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download PDF
          </motion.button>
        </div>
      </div>

      {/* Preview Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        {/* Document shadow effect */}
        <div className="absolute -inset-4 bg-foreground/5 rounded-2xl -z-10" />
        <div className="absolute -inset-8 bg-foreground/[0.02] rounded-3xl -z-20" />

        {/* Document */}
        <div className="bg-background border border-foreground/10 rounded-lg overflow-hidden">
          {/* Document header */}
          <div className="p-8 border-b border-foreground/10">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono text-foreground/40 mb-2">
                  {config.timeframe} Report
                </div>
                <h1 className="text-2xl font-extralight tracking-wide mb-4">
                  {config.title || "Untitled Report"}
                </h1>
                <div className="flex items-center gap-3">
                  {config.scope.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-1 text-xs font-light tracking-wide rounded-full border border-foreground/20 capitalize"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-foreground/30">Generated</div>
                <div className="text-sm font-light text-foreground/60">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="p-8 border-b border-foreground/10">
            <h3 className="text-xs font-light tracking-[0.2em] uppercase text-foreground/40 mb-4">
              Contents
            </h3>
            <div className="space-y-3">
              {config.sections.map((section, index) => (
                <motion.div
                  key={section}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-xs font-mono text-foreground/30 w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-light capitalize">
                    {section.replace(/-/g, " ")}
                  </span>
                  <div className="flex-1 border-b border-dotted border-foreground/10" />
                  <span className="text-xs font-mono text-foreground/30">
                    {index * 2 + 1}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Preview content - simulated */}
          <div className="p-8 space-y-8">
            {config.sections.includes("executive") && (
              <section>
                <h4 className="text-sm font-light tracking-[0.15em] uppercase text-foreground/60 mb-4">
                  Executive Summary
                </h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-3 bg-foreground/10 rounded"
                      style={{ width: `${100 - i * 15}%` }}
                    />
                  ))}
                </div>
              </section>
            )}

            {config.sections.includes("data") && (
              <section>
                <h4 className="text-sm font-light tracking-[0.15em] uppercase text-foreground/60 mb-4">
                  Data Visualization
                </h4>
                {/* Chart placeholder */}
                <div className="h-48 border border-foreground/10 rounded-lg flex items-center justify-center">
                  <div className="flex items-end gap-2 h-24">
                    {[40, 60, 45, 80, 55, 70, 90].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: 0.1 * i + 0.5, duration: 0.5 }}
                        className="w-8 bg-foreground/20 rounded-t"
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {config.sections.includes("analysis") && (
              <section>
                <h4 className="text-sm font-light tracking-[0.15em] uppercase text-foreground/60 mb-4">
                  Analysis
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="p-4 border border-foreground/10 rounded-lg"
                    >
                      <div className="h-2 w-20 bg-foreground/20 rounded mb-3" />
                      <div className="space-y-2">
                        <div className="h-2 bg-foreground/10 rounded w-full" />
                        <div className="h-2 bg-foreground/10 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {config.sections.includes("recommendations") && (
              <section>
                <h4 className="text-sm font-light tracking-[0.15em] uppercase text-foreground/60 mb-4">
                  Strategic Recommendations
                </h4>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 border-l-2 border-foreground/20"
                    >
                      <span className="text-xs font-mono text-foreground/40">
                        {String(i).padStart(2, "0")}
                      </span>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-foreground/15 rounded w-2/3" />
                        <div className="h-2 bg-foreground/10 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-4 border-t border-foreground/10 flex items-center justify-between text-xs text-foreground/30">
            <span>Signal Explorer Intelligence Report</span>
            <span>Confidential</span>
          </div>
        </div>
      </motion.div>

      {/* Report metadata */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-center gap-8 text-xs font-light text-foreground/40"
      >
        <span>
          Depth: <span className="text-foreground/60 capitalize">{config.depth}</span>
        </span>
        <span className="text-foreground/20">|</span>
        <span>
          Est. Pages: <span className="text-foreground/60">
            {config.depth === "executive" ? "2-3" : config.depth === "detailed" ? "5-8" : "12+"}
          </span>
        </span>
        <span className="text-foreground/20">|</span>
        <span>
          Format: <span className="text-foreground/60">PDF</span>
        </span>
      </motion.div>
    </div>
  )
}
