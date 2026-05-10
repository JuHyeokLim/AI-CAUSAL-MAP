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

interface ScopeOption {
  id: string
  label: string
}

interface ReportBuilderProps {
  config: ReportConfig
  setConfig: React.Dispatch<React.SetStateAction<ReportConfig>>
  scopeOptions: ScopeOption[]
  sectionOptions: ScopeOption[]
  onScopeToggle: (id: string) => void
  onSectionToggle: (id: string) => void
  onGenerate: () => void
}

export function ReportBuilder({
  config,
  setConfig,
  scopeOptions,
  sectionOptions,
  onScopeToggle,
  onSectionToggle,
  onGenerate,
}: ReportBuilderProps) {
  const isValid = config.title.trim() && config.scope.length > 0

  return (
    <div className="space-y-12">
      {/* Title Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-3xl font-extralight tracking-wide mb-6">
          Create Your Intelligence Report
        </h2>
        <p className="text-sm font-light text-foreground/50 max-w-2xl mb-8">
          Configure the parameters for your custom strategic intelligence report.
          Our system will analyze relevant signals and synthesize actionable insights.
        </p>

        <div className="relative">
          <input
            type="text"
            value={config.title}
            onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Report Title"
            className={cn(
              "w-full bg-transparent border-b border-foreground/20",
              "py-4 text-2xl font-extralight tracking-wide",
              "placeholder:text-foreground/20",
              "focus:outline-none focus:border-foreground/40",
              "transition-colors"
            )}
          />
          <div className="absolute right-0 bottom-4 text-xs font-mono text-foreground/30">
            {config.title.length}/100
          </div>
        </div>
      </motion.section>

      {/* Analysis Scope */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-light tracking-[0.2em] uppercase text-foreground/60 mb-6">
          Analysis Scope
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {scopeOptions.map((option, index) => (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.3 }}
              onClick={() => onScopeToggle(option.id)}
              className={cn(
                "group relative p-6 rounded-lg border text-left",
                "transition-all duration-300",
                config.scope.includes(option.id)
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/20 hover:border-foreground/40"
              )}
            >
              <span className="text-sm font-light tracking-wide">{option.label}</span>
              
              {/* Selection indicator */}
              <div
                className={cn(
                  "absolute top-3 right-3 w-4 h-4 rounded-full border",
                  "flex items-center justify-center transition-all",
                  config.scope.includes(option.id)
                    ? "border-background"
                    : "border-foreground/30"
                )}
              >
                {config.scope.includes(option.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 bg-background rounded-full"
                  />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Report Depth */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-light tracking-[0.2em] uppercase text-foreground/60 mb-6">
          Report Depth
        </h3>
        <div className="flex gap-4">
          {[
            { id: "executive" as const, label: "Executive", desc: "2-3 pages", pages: "~3" },
            { id: "detailed" as const, label: "Detailed", desc: "5-8 pages", pages: "~6" },
            { id: "comprehensive" as const, label: "Comprehensive", desc: "12+ pages", pages: "12+" },
          ].map((depth) => (
            <motion.button
              key={depth.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig((prev) => ({ ...prev, depth: depth.id }))}
              className={cn(
                "flex-1 p-6 rounded-lg border text-center",
                "transition-all duration-300",
                config.depth === depth.id
                  ? "border-foreground bg-foreground/5"
                  : "border-foreground/20 hover:border-foreground/40"
              )}
            >
              <div className="text-lg font-light mb-1">{depth.label}</div>
              <div className="text-xs font-mono text-foreground/40">{depth.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Sections */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-sm font-light tracking-[0.2em] uppercase text-foreground/60 mb-6">
          Include Sections
        </h3>
        <div className="space-y-3">
          {sectionOptions.map((section, index) => (
            <motion.button
              key={section.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index + 0.5 }}
              onClick={() => onSectionToggle(section.id)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border",
                "transition-all duration-300 text-left",
                config.sections.includes(section.id)
                  ? "border-foreground/40 bg-foreground/5"
                  : "border-foreground/10 hover:border-foreground/20"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center",
                  "transition-all",
                  config.sections.includes(section.id)
                    ? "border-foreground bg-foreground"
                    : "border-foreground/30"
                )}
              >
                {config.sections.includes(section.id) && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-background"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-light">{section.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* Timeframe */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-sm font-light tracking-[0.2em] uppercase text-foreground/60 mb-6">
          Analysis Timeframe
        </h3>
        <div className="flex gap-3">
          {["Q1 2024", "Q4 2023", "H2 2023", "Full Year 2023"].map((tf) => (
            <button
              key={tf}
              onClick={() => setConfig((prev) => ({ ...prev, timeframe: tf }))}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-light border",
                "transition-all duration-300",
                config.timeframe === tf
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/20 hover:border-foreground/40"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </motion.section>

      {/* Generate Button */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="pt-8 border-t border-foreground/10"
      >
        <div className="flex items-center justify-between">
          <div className="text-sm font-light text-foreground/50">
            {isValid ? (
              <span>Ready to generate your report</span>
            ) : (
              <span className="text-foreground/30">
                Please fill in the title and select at least one scope
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: isValid ? 1.02 : 1 }}
            whileTap={{ scale: isValid ? 0.98 : 1 }}
            onClick={onGenerate}
            disabled={!isValid}
            className={cn(
              "px-8 py-3 rounded-full text-sm font-light tracking-wider uppercase",
              "transition-all duration-300",
              isValid
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-foreground/20 text-foreground/40 cursor-not-allowed"
            )}
          >
            Generate Report
          </motion.button>
        </div>
      </motion.section>
    </div>
  )
}
