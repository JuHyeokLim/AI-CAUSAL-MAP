"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { type KeywordNode, ALL_KEYWORDS } from "./data"

interface NodePosition {
  id: string
  x: number
  y: number
  keyword: KeywordNode
}

interface ConnectionMapProps {
  centerKeyword: KeywordNode
  onNodeClick: (keyword: KeywordNode) => void
  panelKeywordId: string | null
}

export function ConnectionMap({ centerKeyword, onNodeClick, panelKeywordId }: ConnectionMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight })
    update()

    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const connectedKeywords = centerKeyword.connectedTo
    .map(id => ALL_KEYWORDS.find(kw => kw.id === id))
    .filter((kw): kw is KeywordNode => !!kw)

  const cx = size.width / 2
  const cy = size.height / 2

  const nodePositions: NodePosition[] = connectedKeywords.map((kw, i) => {
    const angle = (i / connectedKeywords.length) * Math.PI * 2 - Math.PI / 2
    const distance = 120 + (1 - kw.strength) * 120
    return {
      id: kw.id,
      x: cx + Math.cos(angle) * distance,
      y: cy + Math.sin(angle) * distance,
      keyword: kw,
    }
  })

  const isReady = size.width > 0

  return (
    <div ref={containerRef} className="absolute inset-0">
      {isReady && (
        <>
          {/* SVG 연결선 */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none', zIndex: 5 }}>
            {nodePositions.map((np, i) => {
              const kw = np.keyword
              const isActive = panelKeywordId === kw.id
              const isWeak = kw.strength < 0.5
              const isCrossIndustry = !kw.domain.some(d => centerKeyword.domain.includes(d))
              const dashed = isWeak || isCrossIndustry

              return (
                <motion.line
                  key={np.id}
                  x1={cx}
                  y1={cy}
                  x2={np.x}
                  y2={np.y}
                  stroke={isActive ? '#C8960C' : '#1A1A1A'}
                  strokeWidth={isActive ? 1.5 : 1}
                  strokeOpacity={isActive ? 0.8 : isWeak ? 0.15 : 0.2}
                  strokeDasharray={dashed ? '5 4' : undefined}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: 'easeOut' }}
                />
              )
            })}
          </svg>

          {/* 중심 키워드 노드 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                border: '2px solid #1A1A1A',
                borderRadius: '100px',
                padding: '12px 24px',
                fontFamily: "'Noto Serif KR', serif",
                fontSize: '16px',
                fontWeight: 700,
                color: '#1A1A1A',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              {centerKeyword.label}
            </div>
          </motion.div>

          {/* 연결 키워드 노드들 */}
          {nodePositions.map((np, i) => {
            const kw = np.keyword
            const isActive = panelKeywordId === kw.id
            const isWeak = kw.strength < 0.5
            const isCross = !kw.domain.some(d => centerKeyword.domain.includes(d))

            return (
              <motion.div
                key={np.id}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: isWeak || isCross ? 0.5 : 1,
                  scale: 1,
                }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.2, ease: [0.175, 0.885, 0.32, 1.275] }}
                style={{
                  position: 'absolute',
                  left: np.x,
                  top: np.y,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                  cursor: 'pointer',
                }}
                onClick={() => onNodeClick(kw)}
              >
                <div
                  style={{
                    background: '#FFFFFF',
                    border: `1px solid ${isActive ? '#C8960C' : '#D0CEC9'}`,
                    borderRadius: '100px',
                    padding: '8px 16px',
                    fontFamily: "'Noto Serif KR', serif",
                    fontSize: '13px',
                    color: isActive ? '#C8960C' : '#555',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget
                    el.style.borderColor = '#C8960C'
                    el.style.color = '#1A1A1A'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget
                    el.style.borderColor = isActive ? '#C8960C' : '#D0CEC9'
                    el.style.color = isActive ? '#C8960C' : '#555'
                  }}
                >
                  {kw.label}
                </div>
              </motion.div>
            )
          })}
        </>
      )}
    </div>
  )
}
