"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GlobeScene } from "./globe-scene"
import { DimensionMap } from "./dimension-map"
import { SignalPanel } from "./signal-panel"
import { ContextCapture } from "./context-capture"
import { FilteringAnimation } from "./filtering-animation"
import {
  type KeywordNode,
  KEYWORDS_BY_DOMAIN,
  ALL_KEYWORDS,
  DOMAINS,
  getSignalDetail,
  getPersonalizedKeywords,
} from "./data"

// 화면 내 키워드 노드 기본 위치 (% 단위, 지구본 주변 분산 배치)
// left 최소 18%, 최대 80% — overflow-hidden 컨테이너에서 pill이 잘리지 않도록
const BASE_POSITIONS = [
  { left: '19%', top: '24%' },
  { left: '72%', top: '20%' },
  { left: '18%', top: '50%' },
  { left: '80%', top: '46%' },
  { left: '24%', top: '74%' },
  { left: '68%', top: '72%' },
  { left: '46%', top: '14%' },
  { left: '52%', top: '82%' },
]

interface FloatingNodeProps {
  keyword: KeywordNode
  position: { left: string; top: string }
  index: number
  isHovered: boolean
  anyHovered: boolean
  onClick: () => void
  onHover: (id: string | null) => void
  transitionKeywordId: string | null
  isCrossDomain?: boolean
}

function FloatingNode({
  keyword,
  position,
  index,
  isHovered,
  anyHovered,
  onClick,
  onHover,
  transitionKeywordId,
  isCrossDomain = false,
}: FloatingNodeProps) {
  const strong = keyword.strength >= 0.8
  const weak = keyword.strength < 0.5

  const fontSize = strong ? '15px' : weak ? '11px' : '13px'
  const padding = strong ? '10px 22px' : weak ? '6px 14px' : '8px 18px'
  const borderWidth = strong ? '1.5px' : '1px'
  const baseOpacity = weak ? 0.5 : 1
  const opacity = anyHovered ? (isHovered ? 1 : 0.4) : baseOpacity

  const isClickedNode = transitionKeywordId === keyword.id
  const isAnyTransitioning = transitionKeywordId !== null

  // 현재 노드 위치에서 화면 중앙(지구본)까지의 픽셀 거리
  const leftPct = parseFloat(position.left)
  const topPct = parseFloat(position.top)
  const pullX = typeof window !== 'undefined' ? ((50 - leftPct) / 100) * window.innerWidth * 0.88 : 0
  const pullY = typeof window !== 'undefined' ? ((50 - topPct) / 100) * window.innerHeight * 0.88 : 0

  const animateProps = isAnyTransitioning
    ? isClickedNode
      ? { x: pullX, y: pullY, scale: 0.1, opacity: 0 }
      : { opacity: 0, scale: 0.85, x: 0, y: 0 }
    : {
        opacity,
        scale: isHovered ? 1.05 : 1,
        y: [0, -8, 0, -4, 0],
        x: [0, -4, 0, 3, 0],
      }

  const transitionProps = isAnyTransitioning
    ? isClickedNode
      ? { duration: 0.46, ease: [0.4, 0, 1, 1] as const }
      : { duration: 0.18 }
    : {
        opacity: { duration: 0.15 },
        scale: { duration: 0.15 },
        y: { duration: 4 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 },
        x: { duration: 5 + index * 0.4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.25 },
      }

  return (
    // 포지셔닝 래퍼 (transform 충돌 방지용 일반 div)
    <div
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        transform: 'translate(-50%, -50%)',
        zIndex: 15,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={animateProps}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={transitionProps}
        onClick={isAnyTransitioning ? undefined : onClick}
        onHoverStart={isAnyTransitioning ? undefined : () => onHover(keyword.id)}
        onHoverEnd={isAnyTransitioning ? undefined : () => onHover(null)}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              background: '#FFFFFF',
              border: `${borderWidth} ${isCrossDomain ? 'dashed' : 'solid'} ${isHovered ? '#C8960C' : '#D0CEC9'}`,
              borderRadius: '100px',
              padding,
              fontFamily: "'Noto Serif KR', serif",
              fontSize,
              color: isHovered ? '#C8960C' : '#1A1A1A',
              cursor: isAnyTransitioning ? 'default' : 'pointer',
              whiteSpace: 'nowrap',
              position: 'relative',
              transition: 'color 0.15s ease, border-color 0.15s ease',
              userSelect: 'none',
            }}
          >
            {keyword.label}
            {keyword.isNew && (
              <span
                style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '6px',
                  height: '6px',
                  background: '#C8960C',
                  borderRadius: '50%',
                }}
              />
            )}
          </div>
          {isCrossDomain && (
            <span
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '10px',
                color: '#999',
                letterSpacing: '0.03em',
              }}
            >
              {keyword.domain[0]}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  )
}

function BackIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" stroke="#1A1A1A" strokeWidth="1" strokeOpacity="0.18" />
      <path d="M21 11 L14 18 L21 25" stroke="#1A1A1A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.45" />
    </svg>
  )
}

interface ExploreViewProps {
  onNavigate?: (view: 'explore' | 'insights') => void
}

export function ExploreView({ onNavigate }: ExploreViewProps) {
  const [phase, setPhase] = useState<'explore' | 'map'>('explore')
  const [centerKeyword, setCenterKeyword] = useState<KeywordNode | null>(null)
  const [panelKeyword, setPanelKeyword] = useState<KeywordNode | null>(null)
  const [exploreMode, setExploreMode] = useState<'분야별' | '맞춤형'>('분야별')
  const [selectedDomain, setSelectedDomain] = useState('헬스케어')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [transitionKeyword, setTransitionKeyword] = useState<KeywordNode | null>(null)
  const [isZooming, setIsZooming] = useState(false)
  const [customPhase, setCustomPhase] = useState<'idle' | 'filtering' | 'ready'>('idle')
  const [personalizedResult, setPersonalizedResult] = useState<{
    primary: KeywordNode[]
    crossDomain: KeywordNode[]
  } | null>(null)

  const displayKeywords =
    exploreMode === '분야별'
      ? (KEYWORDS_BY_DOMAIN[selectedDomain] ?? []).slice(0, 8)
      : customPhase === 'ready' && personalizedResult
      ? [...personalizedResult.primary, ...personalizedResult.crossDomain]
      : []

  const crossDomainIds = new Set(personalizedResult?.crossDomain.map(k => k.id) ?? [])


  const handleContextComplete = useCallback((domains: string[], role: string) => {
    const result = getPersonalizedKeywords(domains, role)
    setPersonalizedResult(result)
    setCustomPhase('filtering')
  }, [])

  const handleFilteringComplete = useCallback(() => {
    setCustomPhase('ready')
  }, [])

  const handleKeywordClick = useCallback((keyword: KeywordNode) => {
    if (transitionKeyword) return
    setTransitionKeyword(keyword)
    setHoveredNodeId(null)
    // Phase 1 끝 → 지구본 줌인 시작
    setTimeout(() => setIsZooming(true), 480)
    // Phase 2 끝 → 화면 전환
    setTimeout(() => {
      setCenterKeyword(keyword)
      setPanelKeyword(null)
      setPhase('map')
      setTransitionKeyword(null)
      setIsZooming(false)
    }, 700)
  }, [transitionKeyword])

  const handleConnectedNodeClick = useCallback((keyword: KeywordNode) => {
    setPanelKeyword(prev => (prev?.id === keyword.id ? null : keyword))
  }, [])

  const handleBackToExplore = useCallback(() => {
    setPhase('explore')
    setCenterKeyword(null)
    setPanelKeyword(null)
  }, [])

  const handleRelatedSignalClick = useCallback(
    (id: string) => {
      const kw = ALL_KEYWORDS.find(k => k.id === id)
      if (kw) {
        setCenterKeyword(kw)
        setPanelKeyword(null)
      }
    },
    []
  )

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: '#FFFFFF',
        backgroundImage: `
          linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px',
      }}
    >
      <AnimatePresence mode="wait">
        {/* ── Phase 1: Explore ── */}
        {phase === 'explore' && (
          <motion.div
            key="phase-explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {/* 헤더 */}
            <header
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 20,
                padding: '24px 32px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      background: '#1A1A1A',
                      borderRadius: '50%',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Noto Serif KR', serif",
                      fontSize: '13px',
                      color: '#1A1A1A',
                      letterSpacing: '0.12em',
                    }}
                  >
                    AI CAUSAL MAP
                  </span>
                </div>

                {/* 탐색 모드 탭 */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  {(['분야별 탐색', '맞춤형 탐색'] as const).map(tab => {
                    const mode = tab === '분야별 탐색' ? '분야별' : '맞춤형'
                    const active = exploreMode === mode
                    return (
                      <button
                        key={tab}
                        onClick={() => setExploreMode(mode)}
                        style={{
                          padding: '6px 16px',
                          borderRadius: '100px',
                          border: `1px solid ${active ? '#1A1A1A' : '#D0CEC9'}`,
                          background: active ? '#1A1A1A' : 'transparent',
                          color: active ? '#FFFFFF' : '#999',
                          fontFamily: "'Pretendard', sans-serif",
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {tab}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 분야 선택 칩 */}
              <AnimatePresence>
                {exploreMode === '분야별' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}
                  >
                    {DOMAINS.map(domain => {
                      const active = selectedDomain === domain
                      return (
                        <button
                          key={domain}
                          onClick={() => setSelectedDomain(domain)}
                          style={{
                            padding: '4px 14px',
                            borderRadius: '100px',
                            border: `1px solid ${active ? '#C8960C' : '#D0CEC9'}`,
                            background: active ? 'rgba(200,150,12,0.08)' : 'transparent',
                            color: active ? '#C8960C' : '#999',
                            fontFamily: "'Pretendard', sans-serif",
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {domain}
                        </button>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </header>

            {/* 3D 지구본 */}
            <GlobeScene isZooming={isZooming} />

            {/* 중앙 텍스트 — 분야별 모드 또는 맞춤형 ready 상태에서만 표시 */}
            <AnimatePresence>
              {(exploreMode === '분야별' || customPhase === 'ready') && (
                <motion.div
                  key="center-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                >
                  <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{
                      fontFamily: "'Noto Serif KR', serif",
                      fontSize: '48px',
                      color: '#1A1A1A',
                      margin: 0,
                      marginBottom: '10px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    DISCOVER
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    style={{
                      fontFamily: "'Pretendard', sans-serif",
                      fontSize: '14px',
                      color: '#999',
                      margin: 0,
                    }}
                  >
                    오늘의 신호를 탐색하세요
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 맞춤형 탐색 — Act 1: 렌즈 설정 */}
            <AnimatePresence>
              {exploreMode === '맞춤형' && customPhase === 'idle' && (
                <motion.div
                  key="context-capture"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ position: 'absolute', inset: 0, zIndex: 10 }}
                >
                  <ContextCapture onComplete={handleContextComplete} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 맞춤형 탐색 — Act 2: 필터링 애니메이션 */}
            <AnimatePresence>
              {exploreMode === '맞춤형' && customPhase === 'filtering' && personalizedResult && (
                <motion.div
                  key="filtering"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'absolute', inset: 0, zIndex: 10 }}
                >
                  <FilteringAnimation
                    allKeywords={ALL_KEYWORDS}
                    primaryKeywords={personalizedResult.primary}
                    crossDomainKeywords={personalizedResult.crossDomain}
                    onComplete={handleFilteringComplete}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 부유 키워드 노드 */}
            <AnimatePresence>
              {displayKeywords.map((keyword, index) => (
                <FloatingNode
                  key={`${keyword.id}-${selectedDomain}-${exploreMode}-${customPhase}`}
                  keyword={keyword}
                  position={BASE_POSITIONS[index % BASE_POSITIONS.length]}
                  index={index}
                  isHovered={hoveredNodeId === keyword.id}
                  anyHovered={hoveredNodeId !== null}
                  onClick={() => handleKeywordClick(keyword)}
                  onHover={setHoveredNodeId}
                  transitionKeywordId={transitionKeyword?.id ?? null}
                  isCrossDomain={crossDomainIds.has(keyword.id)}
                />
              ))}
            </AnimatePresence>

          </motion.div>
        )}

        {/* ── Phase 2: Map ── */}
        {phase === 'map' && (
          <motion.div
            key="phase-map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {/* 미니 지구본 (뒤로가기 버튼) */}
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.6, scale: 1 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={handleBackToExplore}
              style={{
                position: 'fixed',
                top: '14px',
                left: '20px',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="탐색으로 돌아가기"
            >
              <BackIcon />
            </motion.button>

            {/* 다차원 레이어 맵 (헤더는 DimensionMap 내부에서 렌더) */}
            {centerKeyword && (
              <DimensionMap
                centerKeyword={centerKeyword}
                onNavigate={onNavigate}
              />
            )}

            {/* 우측 패널 */}
            <AnimatePresence>
              {panelKeyword && (
                <SignalPanel
                  key={panelKeyword.id}
                  keyword={panelKeyword}
                  detail={getSignalDetail(panelKeyword)}
                  onClose={() => setPanelKeyword(null)}
                  onRelatedSignalClick={handleRelatedSignalClick}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
