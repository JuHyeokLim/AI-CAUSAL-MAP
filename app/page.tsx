"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const ExploreView = dynamic(
  () => import("@/components/explore/explore-view").then((mod) => mod.ExploreView),
  { ssr: false }
)

const InsightsView = dynamic(
  () => import("@/components/insights/insights-view").then((mod) => mod.InsightsView),
  { ssr: false }
)

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"explore" | "insights">("explore")

  return (
    <>
      {currentView === "explore" ? (
        <ExploreView onNavigate={setCurrentView} />
      ) : (
        <InsightsView onNavigate={setCurrentView} />
      )}
    </>
  )
}
