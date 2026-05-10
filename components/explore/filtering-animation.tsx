"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { KeywordNode } from "./data"

// 36개 키워드를 화면 전체에 랜덤 배치하기 위한 시드 기반 위치
function getScatterPosition(index: number): { left: string; top: string } {
  const cols = 6
  const rows = 6
  const col = index % cols
  const row = Math.floor(index / cols)
  const jitterX = ((index * 37 + 13) % 20) - 10
  const jitterY = ((index * 53 + 7) % 20) - 10
  return {
    left: `${10 + col * 13.5 + jitterX}%`,
    top: `${12 + row * 13 + jitterY}%`,
  }
}

interface FilteringAnimationProps {
  allKeywords: KeywordNode[]
  primaryKeywords: KeywordNode[]
  crossDomainKeywords: KeywordNode[]
  onComplete: () => void
}

type NodeState = 'scattered' | 'eliminating' | 'settled' | 'gone'

export function FilteringAnimation({
  allKeywords,
  primaryKeywords,
  crossDomainKeywords,
  onComplete,
}: FilteringAnimationProps) {
  const [nodeStates, setNodeStates] = useState<Record<string, NodeState>>({})
  const [showGlobePulse, setShowGlobePulse] = useState(false)
  const [showComplete, setShowComplete] = useState(false)

  const keptIds = new Set([
    ...primaryKeywords.map(k => k.id),
    ...crossDomainKeywords.map(k => k.id),
  ])

  useEffect(() => {
    // 0.0s: 전체 흩뿌림 상태로 시작
    const initial: Record<string, NodeState> = {}
    allKeywords.forEach(k => { initial[k.id] = 'scattered' })
    setNodeStates(initial)

    // 0.3s: 무관 키워드 소거 시작
    const eliminateTimer = setTimeout(() => {
      setNodeStates(prev => {
        const next = { ...prev }
        allKeywords.forEach(k => {
          if (!keptIds.has(k.id)) next[k.id] = 'gone'
        })
        return next
      })
    }, 300)

    // 0.8s: Primary 신호 정착
    const settleTimer = setTimeout(() => {
      setNodeStates(prev => {
        const next = { ...prev }
        primaryKeywords.forEach(k => { next[k.id] = 'settled' })
        return next
      })
    }, 800)

    // 1.0s: Cross-domain 신호 정착 (약간 늦게 — bonus discovery 효과)
    const crossSettleTimer = setTimeout(() => {
      setNodeStates(prev => {
        const next = { ...prev }
        crossDomainKeywords.forEach(k => { next[k.id] = 'settled' })
        return next
      })
    }, 1000)

    // 1.2s: Globe ripple pulse
    const pulseTimer = setTimeout(() => {
      setShowGlobePulse(true)
    }, 1200)

    // 1.4s: 완료 텍스트 + 콜백
    const completeTimer = setTimeout(() => {
      setShowComplete(true)
    }, 1400)

    const doneTimer = setTimeout(() => {
      onComplete()
    }, 2000)

    return () => {
      clearTimeout(eliminateTimer)
      clearTimeout(settleTimer)
      clearTimeout(crossSettleTimer)
      clearTimeout(pulseTimer)
      clearTimeout(completeTimer)
      clearTimeout(doneTimer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
      {/* 흩뿌려진 키워드들 */}
      {allKeywords.map((keyword, index) => {
        const state = nodeStates[keyword.id] ?? 'scattered'
        const pos = getScatterPosition(index)

        return (
          <AnimatePresence key={keyword.id}>
            {state !== 'gone' && (
              <motion.div
                style={{
                  position: 'absolute',
                  left: pos.left,
                  top: pos.top,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={
                  state === 'scattered'
                    ? { opacity: 0.35, scale: 0.75 }
                    : { opacity: 0, scale: 0.5 }
                }
                exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.25 } }}
                transition={{ duration: 0.2, delay: index * 0.012 }}
              >
                <div
                  style={{
                    padding: '5px 14px',
                    borderRadius: '100px',
                    border: '1px solid #D0CEC9',
                    background: '#FFFFFF',
                    fontFamily: "'Noto Serif KR', serif",
                    fontSize: '11px',
                    color: '#1A1A1A',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {keyword.label}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )
      })}

      {/* Globe ripple pulse */}
      <AnimatePresence>
        {showGlobePulse && (
          <>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  translateX: '-50%',
                  translateY: '-50%',
                  borderRadius: '50%',
                  border: '1px solid #C8960C',
                  width: '180px',
                  height: '180px',
                  pointerEvents: 'none',
                }}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 2.5 + i * 0.4, opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* 완료 메시지 */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              bottom: '88px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#C8960C',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}
          >
            당신을 위한 신호 {primaryKeywords.length + crossDomainKeywords.length}개를 선별했습니다
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
