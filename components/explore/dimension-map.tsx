"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { KeywordNode, CausalNode, CausalGraph, CausalNodeSource, PerspectiveGuide } from "./data"
import { SIGNAL_DETAILS } from "./data"
import { GuideGlobeScene } from "./guide-globe-scene"

const OPEN_W = 52
const OPEN_H = 52
const PANEL_W = 320

interface NodeConfig {
  nodeW: number
  nodeH: number
  padX: number
  headlinePx: number
  sourcePx: number
  dataPx: number
}

function getNodeConfig(maxDepth: number): NodeConfig {
  // nodeH = y축 간격 계산용 (시각 카드 높이 아님 — 카드는 auto height)
  if (maxDepth >= 5) return { nodeW: 152, nodeH: 140, padX: 20, headlinePx: 10.5, sourcePx: 8.5, dataPx: 9.5 }
  if (maxDepth >= 4) return { nodeW: 162, nodeH: 136, padX: 26, headlinePx: 11,   sourcePx: 9,   dataPx: 10  }
  return                      { nodeW: 172, nodeH: 130, padX: 40, headlinePx: 11.5, sourcePx: 9,   dataPx: 10  }
}

interface LayoutNode extends CausalNode {
  x: number
  y: number
  nW: number
  nH: number
}

function buildLayout(graph: CausalGraph, w: number, h: number, cfg: NodeConfig): LayoutNode[] {
  const maxDepth = Math.max(...graph.nodes.map(n => n.depth))
  const groups: Record<number, CausalNode[]> = {}
  graph.nodes.forEach(n => { groups[n.depth] = groups[n.depth] ?? []; groups[n.depth].push(n) })

  const padY = 48
  const usableW = w - cfg.padX * 2
  const usableH = h - padY * 2

  return graph.nodes.map(node => {
    const isOpen = node.type === 'open'
    const nW = isOpen ? OPEN_W : cfg.nodeW
    const nH = isOpen ? OPEN_H : cfg.nodeH
    const siblings = groups[node.depth]
    const idx = siblings.indexOf(node)
    const depthX = cfg.padX + (maxDepth === 0 ? usableW / 2 : (node.depth / maxDepth) * (usableW - nW)) + nW / 2
    const segH = usableH / siblings.length
    const nodeY = padY + segH * idx + segH / 2
    return { ...node, x: depthX, y: nodeY, nW, nH }
  })
}

function getFallbackGraph(keyword: KeywordNode): CausalGraph {
  return {
    nodes: [
      { id: 'f1', headline: '시장 구조적 압력 축적', source: '업계', date: '-', dataPoint: '복수 원인 수렴 중', type: 'cause', depth: 0, summary: '이 신호와 관련된 시장 구조적 압력들이 축적되고 있습니다.' },
      { id: 'f2', headline: keyword.label, source: keyword.domain[0], date: '04.2026', dataPoint: `신호 강도 ${Math.round(keyword.strength * 100)}%`, type: 'center', depth: 1, summary: '현재 분석 중인 핵심 신호입니다.' },
      { id: 'f3', headline: '파급 효과 전개 중', source: '업계', date: '-', type: 'effect', depth: 2, summary: '이 신호로부터 파생되는 영향들이 전개되고 있습니다.' },
    ],
    edges: [
      { from: 'f1', to: 'f2', label: '인과' },
      { from: 'f2', to: 'f3', label: '파급' },
    ],
  }
}

// ─────────────────────────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────────────────────────

type ActiveTab = 'map' | 'chat' | 'guide'

interface DimensionMapProps {
  centerKeyword: KeywordNode
  onNavigate?: (view: 'explore' | 'insights') => void
}

export function DimensionMap({ centerKeyword, onNavigate }: DimensionMapProps) {
  // rootRef: 전체 컨테이너 — 패널 애니메이션과 무관하게 항상 고정 크기
  const rootRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ w: 900, h: 500 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<LayoutNode | null>(null)
  const [activeTab, setActiveTab] = useState<ActiveTab>('map')
  const [perspectiveHighlightIds, setPerspectiveHighlightIds] = useState<Set<string>>(new Set())
  const [extraNodes, setExtraNodes] = useState<LayoutNode[]>([])

  // 루트 컨테이너 크기 추적 (애니메이션 도중 변하지 않음)
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setContainerSize({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    setSelectedNode(null)
    setPerspectiveHighlightIds(new Set())
    setExtraNodes([])
    setActiveTab('map')
  }, [centerKeyword.id])

  const detail = SIGNAL_DETAILS[centerKeyword.id]
  const graph = detail?.causalGraph ?? getFallbackGraph(centerKeyword)
  const guides = graph.guides ?? []
  const maxDepth = Math.max(...graph.nodes.map(n => n.depth))
  const cfg = getNodeConfig(maxDepth)
  const panelOpen = selectedNode !== null
  // graphW: 패널 유무에 따라 즉시 계산 (애니메이션 중간값 없음)
  const graphW = panelOpen ? containerSize.w - PANEL_W : containerSize.w
  const graphH = containerSize.h - 60  // 헤더 60px 제외
  const layoutNodes = buildLayout(graph, graphW, graphH, cfg)
  const allLayoutNodes = [...layoutNodes, ...extraNodes]
  const nodeById = Object.fromEntries(allLayoutNodes.map(n => [n.id, n]))

  const connectedNodeIds = new Set<string>()
  const connectedEdgeIds = new Set<string>()
  if (hoveredId) {
    connectedNodeIds.add(hoveredId)
    graph.edges.forEach((e, i) => {
      if (e.from === hoveredId || e.to === hoveredId) {
        connectedNodeIds.add(e.from)
        connectedNodeIds.add(e.to)
        connectedEdgeIds.add(String(i))
      }
    })
  }

  const handleNodeClick = (node: LayoutNode) => {
    if (node.type === 'open') { onNavigate?.('insights'); return }
    setSelectedNode(prev => prev?.id === node.id ? null : node)
  }

  const handleGuideViewOnMap = (guide: PerspectiveGuide) => {
    setPerspectiveHighlightIds(new Set(guide.focusNodeIds))
    setActiveTab('map')
  }

  return (
    <div ref={rootRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#FFFFFF',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.028) 1px, transparent 1px)`,
      backgroundSize: '80px 80px',
    }}>
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, zIndex: 30,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px 0 88px',
          borderBottom: '1px solid #F5F3F0', background: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 15, color: '#1A1A1A', fontWeight: 700 }}>
            {centerKeyword.label}
          </span>
          <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 12, color: '#C8C5C0' }}>
            — 인과 지도
          </span>
        </div>

        {/* 탭 바 */}
        <div style={{ display: 'flex', gap: 24 }}>
          {(['map', 'chat', 'guide'] as ActiveTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                fontFamily: "'Pretendard', sans-serif",
                fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: activeTab === tab ? '#1A1A1A' : '#BBB',
                borderBottom: activeTab === tab ? '1.5px solid #1A1A1A' : '1.5px solid transparent',
                transition: 'color 0.15s ease, border-color 0.15s ease',
              }}
            >
              {tab === 'map' ? 'Map' : tab === 'chat' ? 'Chat' : 'Guide'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── MAP 탭 ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'map' && (
          <motion.div
            key="map-tab"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', inset: '60px 0 0 0' }}
          >
            {/* 그래프 영역 */}
            <motion.div
              animate={{ right: panelOpen ? PANEL_W : 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <svg width={graphW} height={graphH}
                style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
                <defs>
                  {[
                    { id: 'arr-gold',  fill: '#C8960C' },
                    { id: 'arr-gray',  fill: '#D0CEC9' },
                    { id: 'arr-light', fill: '#E4E1DC' },
                    { id: 'arr-extra', fill: '#C8960C' },
                  ].map(({ id, fill }) => (
                    <marker key={id} id={id} markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L7,3 z" fill={fill} />
                    </marker>
                  ))}
                </defs>

                {graph.edges.map((edge, i) => {
                  const src = nodeById[edge.from]
                  const tgt = nodeById[edge.to]
                  if (!src || !tgt) return null
                  const x1 = src.x + src.nW / 2
                  const y1 = src.y
                  const x2 = tgt.x - tgt.nW / 2
                  const y2 = tgt.y
                  const mx = (x1 + x2) / 2
                  const toCenter = tgt.type === 'center'
                  const fromCenter = src.type === 'center'
                  const isOpenEdge = tgt.type === 'open'
                  const markerId = isOpenEdge ? 'arr-light' : (toCenter || fromCenter) ? 'arr-gold' : 'arr-gray'
                  const stroke = isOpenEdge ? '#E4E1DC' : (toCenter || fromCenter) ? '#C8960C' : '#D0CEC9'
                  const isActive = hoveredId !== null && connectedEdgeIds.has(String(i))
                  const isDimmed = hoveredId !== null && !connectedEdgeIds.has(String(i))
                  const isHighlighted = perspectiveHighlightIds.size > 0 &&
                    (perspectiveHighlightIds.has(edge.from) || perspectiveHighlightIds.has(edge.to))

                  return (
                    <g key={i}>
                      <motion.path
                        d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                        fill="none"
                        stroke={isHighlighted ? '#C8960C' : stroke}
                        strokeWidth={isActive || isHighlighted ? 1.5 : 1}
                        markerEnd={`url(#${markerId})`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: isDimmed ? 0.1 : isActive || isHighlighted ? 1 : 0.6 }}
                        transition={{ pathLength: { delay: 0.15 + i * 0.05, duration: 0.4 }, opacity: { duration: 0.15 } }}
                      />
                      {edge.label && !panelOpen && (
                        <motion.text
                          x={mx} y={(y1 + y2) / 2 - 7}
                          textAnchor="middle"
                          fill={isActive ? '#C8960C' : '#888'}
                          fontSize={maxDepth >= 5 ? 8.5 : 10}
                          fontFamily="'Pretendard', sans-serif"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: isDimmed ? 0.08 : isActive ? 1 : 0.72 }}
                          transition={{ delay: 0.45 + i * 0.04, duration: 0.3 }}
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {edge.label}
                        </motion.text>
                      )}
                    </g>
                  )
                })}

                {/* 새로 추가된 노드 엣지 */}
                {extraNodes.map((eNode, i) => {
                  const lastNode = layoutNodes[layoutNodes.length - 1]
                  if (!lastNode) return null
                  const x1 = lastNode.x + lastNode.nW / 2
                  const y1 = lastNode.y
                  const x2 = eNode.x - eNode.nW / 2
                  const y2 = eNode.y
                  return (
                    <motion.path key={`extra-edge-${i}`}
                      d={`M ${x1} ${y1} C ${(x1+x2)/2} ${y1}, ${(x1+x2)/2} ${y2}, ${x2} ${y2}`}
                      fill="none" stroke="#C8960C" strokeWidth="1" strokeDasharray="4 4"
                      markerEnd="url(#arr-extra)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.7 }}
                      transition={{ duration: 0.5 }}
                    />
                  )
                })}
              </svg>

              {/* 노드 카드 */}
              {allLayoutNodes.map((node, i) => {
                const isHovered = hoveredId === node.id
                const isSelected = selectedNode?.id === node.id
                const isDimmed = hoveredId !== null && !connectedNodeIds.has(node.id)
                const isHighlighted = perspectiveHighlightIds.has(node.id)
                const isOpen = node.type === 'open'
                const isExtra = node.id.startsWith('extra_')

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: isExtra ? 0.7 : 0.82 }}
                    animate={{
                      opacity: isDimmed ? 0.18 : 1,
                      scale: isHovered || isSelected ? 1.04 : 1,
                    }}
                    transition={{
                      opacity: { duration: 0.15 },
                      scale: { duration: 0.18 },
                      default: { delay: isExtra ? 0 : 0.04 * i, duration: 0.3, ease: [0.175, 0.885, 0.32, 1.275] },
                    }}
                    onHoverStart={() => setHoveredId(node.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    onClick={() => handleNodeClick(node)}
                    style={{
                      position: 'absolute',
                      left: node.x - node.nW / 2,
                      top: node.y - node.nH / 2,
                      width: node.nW,
                      cursor: 'pointer',
                      outline: isHighlighted ? '2px solid #C8960C' : 'none',
                      outlineOffset: 3,
                      borderRadius: 10,
                    }}
                  >
                    {isOpen
                      ? <OpenNode isHovered={isHovered} />
                      : <NewsNode node={node} isHovered={isHovered} isSelected={isSelected} isExtra={isExtra} cfg={cfg} />
                    }
                  </motion.div>
                )
              })}
            </motion.div>

            {/* 우측 디테일 패널 */}
            <AnimatePresence>
              {selectedNode && (
                <NodeDetailPanel
                  key={selectedNode.id}
                  node={selectedNode}
                  graph={graph}
                  nodeById={nodeById}
                  onClose={() => setSelectedNode(null)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── CHAT 탭 ── */}
        {activeTab === 'chat' && (
          <motion.div
            key="chat-tab"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', inset: '60px 0 0 0', display: 'flex' }}
          >
            {/* 맵 참조 (55%) — Map 탭과 동일한 렌더링, 읽기 전용 */}
            {/* 맵 미니맵 (구조 + 헤드라인 전체, 메타데이터 없음) */}
            {(() => {
              const miniCfg: NodeConfig = { nodeW: 130, nodeH: 76, padX: 14, headlinePx: 10, sourcePx: 8, dataPx: 8 }
              const chatW = containerSize.w * 0.58
              const chatNodes = buildLayout(graph, chatW, graphH, miniCfg)
              const chatNodeById = Object.fromEntries(chatNodes.map(n => [n.id, n]))
              return (
                <div style={{ width: '58%', position: 'relative', overflow: 'hidden', flexShrink: 0, borderRight: '1px solid #F5F3F0' }}>
                  <svg width={chatW} height={graphH}
                    style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}>
                    <defs>
                      {[{ id: 'c-gold', fill: '#C8960C' }, { id: 'c-gray', fill: '#D0CEC9' }].map(({ id, fill }) => (
                        <marker key={id} id={id} markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
                          <path d="M0,0 L0,6 L6,3 z" fill={fill} />
                        </marker>
                      ))}
                    </defs>
                    {graph.edges.map((edge, ei) => {
                      const src = chatNodeById[edge.from]
                      const tgt = chatNodeById[edge.to]
                      if (!src || !tgt) return null
                      const x1 = src.x + src.nW / 2, y1 = src.y
                      const x2 = tgt.x - tgt.nW / 2, y2 = tgt.y
                      const mx = (x1 + x2) / 2
                      const isCenterEdge = src.type === 'center' || tgt.type === 'center'
                      return (
                        <path key={ei}
                          d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                          fill="none"
                          stroke={isCenterEdge ? '#C8960C' : '#E0DDD8'}
                          strokeWidth={isCenterEdge ? 1.2 : 0.8}
                          markerEnd={`url(#${isCenterEdge ? 'c-gold' : 'c-gray'})`}
                        />
                      )
                    })}
                  </svg>
                  {chatNodes.map(node => {
                    const isCenter = node.type === 'center'
                    const isCause  = node.type === 'cause'
                    const isOpen   = node.type === 'open'
                    if (isOpen) return null
                    return (
                      <div key={node.id} style={{
                        position: 'absolute',
                        left: node.x - node.nW / 2,
                        top: node.y - miniCfg.nodeH / 2,
                        width: node.nW,
                        height: miniCfg.nodeH,
                        border: `${isCenter ? 1.5 : 1}px solid ${isCenter ? '#C8960C' : isCause ? '#ECEAE6' : '#D8D5D0'}`,
                        borderRadius: 7,
                        background: isCenter ? 'rgba(200,150,12,0.05)' : '#FFFFFF',
                        padding: '0 10px',
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                      }}>
                        <span style={{
                          fontFamily: "'Noto Serif KR', serif",
                          fontSize: miniCfg.headlinePx,
                          color: isCenter ? '#C8960C' : isCause ? '#999' : '#444',
                          lineHeight: 1.48,
                          wordBreak: 'keep-all',
                        }}>
                          {node.headline}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            {/* 채팅 패널 */}
            <ChatPanel
              highlightNodeId={(id) => setHoveredId(id)}
              keywordId={centerKeyword.id}
            />
          </motion.div>
        )}

        {/* ── GUIDE 탭 ── */}
        {activeTab === 'guide' && (
          <motion.div
            key="guide-tab"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', inset: '60px 0 0 0' }}
          >
            <OrbitalGuide
              keyword={centerKeyword}
              guides={guides}
              onViewOnMap={handleGuideViewOnMap}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// 노드 카드
// ─────────────────────────────────────────────────────────────────

function NewsNode({ node, isHovered, isSelected, isExtra, cfg }: {
  node: LayoutNode; isHovered: boolean; isSelected: boolean; isExtra?: boolean; cfg: NodeConfig
}) {
  const isCenter = node.type === 'center'
  const isCause  = node.type === 'cause'
  const borderColor = isSelected ? '#1A1A1A'
    : (isHovered && !isCenter) ? '#C8960C'
    : isCenter ? '#C8960C'
    : isCause  ? '#E4E1DC'
    : '#C8C5C0'

  return (
    <div style={{
      width: '100%', height: '100%',
      border: `${isCenter || isSelected ? 1.5 : 1}px ${isExtra ? 'dashed' : 'solid'} ${borderColor}`,
      borderRadius: 8,
      background: isCenter ? 'rgba(200,150,12,0.045)' : isSelected ? 'rgba(26,26,26,0.03)' : '#FFFFFF',
      padding: '10px 11px 9px',
      display: 'flex', flexDirection: 'column', gap: 5,
      transition: 'border-color 0.15s ease, background 0.15s ease',
      boxShadow: isHovered || isSelected ? '0 2px 16px rgba(0,0,0,0.09)' : 'none',
    }}>
      <p style={{
        fontFamily: "'Noto Serif KR', serif",
        fontSize: cfg.headlinePx, lineHeight: 1.52,
        color: (isCause && !isSelected) ? '#888' : '#1A1A1A',
        margin: 0, flex: 1,
        wordBreak: 'keep-all', overflowWrap: 'break-word',
      }}>
        {node.headline}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
        {(node.source || node.date) && (
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: cfg.sourcePx, color: '#C8C5C0', letterSpacing: '0.02em' }}>
            {[node.source, node.date].filter(Boolean).join(' · ')}
          </span>
        )}
        {node.dataPoint && (
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: cfg.dataPx, color: isCenter ? '#C8960C' : '#999', fontWeight: isCenter ? 500 : 400 }}>
            {node.dataPoint}
          </span>
        )}
      </div>
    </div>
  )
}

function OpenNode({ isHovered }: { isHovered: boolean }) {
  return (
    <div style={{
      width: '100%', height: '100%',
      border: `1px dashed ${isHovered ? '#C8960C' : '#D0CEC9'}`,
      borderRadius: '50%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
      transition: 'border-color 0.15s ease',
      background: isHovered ? 'rgba(200,150,12,0.03)' : 'transparent',
    }}>
      <span style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 18, color: isHovered ? '#C8960C' : '#CCC', transition: 'color 0.15s ease', lineHeight: 1 }}>?</span>
      <AnimatePresence>
        {isHovered && (
          <motion.span initial={{ opacity: 0, y: 2 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}
            style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 8, color: '#C8960C', whiteSpace: 'nowrap' }}>
            분석하기 →
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// 맵 확장 입력창
// ─────────────────────────────────────────────────────────────────

function MapExpandInput({ onAdd }: { onAdd: (text: string) => void }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (!value.trim() || loading) return
    setLoading(true)
    setTimeout(() => {
      onAdd(value.trim())
      setValue('')
      setLoading(false)
    }, 900)
  }

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 56,
      borderTop: '1px solid #F0EDE8',
      background: 'rgba(255,255,255,0.96)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12,
      zIndex: 20,
    }}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="이 맵에 노드를 추가하거나 방향을 확장해보세요"
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: "'Pretendard', sans-serif", fontSize: 13, color: '#1A1A1A',
        }}
      />
      {loading ? (
        <LoadingDots />
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          style={{
            background: 'none', border: 'none', cursor: value.trim() ? 'pointer' : 'default',
            color: value.trim() ? '#C8960C' : '#D0CEC9',
            fontFamily: "'Pretendard', sans-serif", fontSize: 16, transition: 'color 0.15s',
          }}
        >
          →
        </button>
      )}
    </div>
  )
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#C8960C' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// 우측 디테일 패널
// ─────────────────────────────────────────────────────────────────

function NodeDetailPanel({ node, graph, nodeById, onClose }: {
  node: LayoutNode; graph: CausalGraph; nodeById: Record<string, LayoutNode>; onClose: () => void
}) {
  const incoming = graph.edges.filter(e => e.to === node.id)
  const outgoing = graph.edges.filter(e => e.from === node.id)
  const typeLabel: Record<string, string> = { cause: '원인', center: '핵심 신호', effect: '파급', open: '미지' }
  const typeColor: Record<string, string> = { cause: '#999', center: '#C8960C', effect: '#666', open: '#CCC' }

  return (
    <motion.div
      initial={{ x: PANEL_W }} animate={{ x: 0 }} exit={{ x: PANEL_W }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: PANEL_W,
        background: '#FDFCFB', borderLeft: '1px solid #F0EDE8',
        display: 'flex', flexDirection: 'column', zIndex: 25, overflow: 'hidden' }}
    >
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F0EDE8', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 10,
            padding: '3px 9px', borderRadius: 100, border: `1px solid #E8E5E0`,
            color: typeColor[node.type], letterSpacing: '0.06em' }}>
            {typeLabel[node.type]}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#CCC', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>
        </div>
        <h3 style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 13.5, lineHeight: 1.6, color: '#1A1A1A', margin: 0, wordBreak: 'keep-all' }}>
          {node.headline}
        </h3>
        {(node.source || node.date) && (
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#C0BDB8', margin: '8px 0 0' }}>
            {[node.source, node.date].filter(Boolean).join(' · ')}
          </p>
        )}
        {node.dataPoint && (
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5,
            color: node.type === 'center' ? '#C8960C' : '#777', margin: '5px 0 0',
            fontWeight: node.type === 'center' ? 500 : 400 }}>
            {node.dataPoint}
          </p>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        {node.summary && (
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 12.5, lineHeight: 1.8, color: '#444', margin: '0 0 20px', wordBreak: 'keep-all' }}>
            {node.summary}
          </p>
        )}
        {(incoming.length > 0 || outgoing.filter(e => nodeById[e.to]?.type !== 'open').length > 0) && (
          <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: 16 }}>
            <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 10, color: '#C8C5C0', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>인과 연결</p>
            {incoming.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 10, color: '#CCC', margin: '0 0 7px' }}>이 사건을 야기한 것</p>
                {incoming.map((edge, i) => {
                  const src = nodeById[edge.from]
                  return src ? (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
                      <span style={{ color: '#D0CEC9', fontSize: 11, flexShrink: 0, marginTop: 1 }}>↑</span>
                      <div>
                        <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 11, color: '#777', margin: 0, lineHeight: 1.45, wordBreak: 'keep-all' }}>{src.headline}</p>
                        {edge.label && <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 9.5, color: '#C8960C', margin: '2px 0 0' }}>{edge.label}</p>}
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            )}
            {outgoing.some(e => nodeById[e.to]?.type !== 'open') && (
              <div>
                <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 10, color: '#CCC', margin: '0 0 7px' }}>이 사건이 야기하는 것</p>
                {outgoing.map((edge, i) => {
                  const tgt = nodeById[edge.to]
                  if (!tgt || tgt.type === 'open') return null
                  return (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
                      <span style={{ color: '#C8960C', fontSize: 11, flexShrink: 0, marginTop: 1 }}>↓</span>
                      <div>
                        <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 11, color: '#555', margin: 0, lineHeight: 1.45, wordBreak: 'keep-all' }}>{tgt.headline}</p>
                        {edge.label && <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 9.5, color: '#C8960C', margin: '2px 0 0' }}>{edge.label}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
        {node.sources && node.sources.length > 0 && (
          <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: 16, marginTop: 4 }}>
            <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 10, color: '#C8C5C0', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>출처</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(node.sources as CausalNodeSource[]).map((src, i) => (
                <a key={i} href={src.url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 6, textDecoration: 'none', color: 'inherit',
                    padding: '7px 9px', borderRadius: 6, border: '1px solid #F0EDE8', background: '#FAFAF9',
                    transition: 'border-color 0.15s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#C8960C' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#F0EDE8' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d="M1 9L9 1M9 1H4M9 1V6" stroke="#C8960C" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 11, color: '#666', lineHeight: 1.45, wordBreak: 'break-all' }}>
                    {src.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Chat 패널
// ─────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  nodeRefs?: string[]
  time?: string
}

interface ChatConfig {
  suggestedPrompts: string[]
  sampleResponse: Omit<ChatMessage, 'id' | 'time'>
}

const CHAT_CONFIGS: Record<string, ChatConfig> = {
  kw121: {
    suggestedPrompts: [
      '이 맵에서 가장 중요한 노드는 어디인가?',
      'AI PoC 실패율을 낮추려면 뭘 먼저 해야 하나?',
      '데이터 파이프라인 스타트업 기회를 어떻게 봐야 하나?',
    ],
    sampleResponse: {
      role: 'ai',
      text: '이 맵에서 핵심은 PoC 실패(n4)가 기술 문제가 아니라는 점입니다. 세 가지 구조적 원인 — 데이터 비구조화(n1), 보안 장벽(n2), 오류율 격차(n3) — 이 동시에 작동하고 있어요. 특히 n7(파이프라인 스타트업 시장)이 이 구조에서 생겨나는 새로운 기회입니다. 어떤 노드를 더 깊이 탐구하고 싶으신가요?',
      nodeRefs: ['n4', 'n1', 'n7'],
    },
  },
  kw120: {
    suggestedPrompts: [
      'HBM 병목이 우리 사업에 직접 영향을 주는 경로는?',
      'SK하이닉스가 삼성을 이긴 결정적 이유는 뭔가?',
      '중국 AI 굴기가 HBM 수출 통제로 정말 막히는가?',
    ],
    sampleResponse: {
      role: 'ai',
      text: '이 맵의 핵심은 n4(HBM 병목)가 단순한 반도체 부족 문제가 아니라는 점입니다. 물리적 공정 한계(rn2)와 AI 수요 폭발(rn1)이 동시에 작동하며, 여기에 지정학 규제(n3)가 추가됐습니다. 특히 n5(SK하이닉스 62% 독점)에서 n8(영업이익 47조)로 이어지는 인과가 이 맵의 핵심 인사이트입니다. 어떤 노드를 더 깊이 탐구하고 싶으신가요?',
      nodeRefs: ['n4', 'rn2', 'n5', 'n8'],
    },
  },
}

const DEFAULT_CHAT_CONFIG: ChatConfig = {
  suggestedPrompts: [
    '이 맵에서 가장 중요한 노드는 어디인가?',
    '투자자 관점에서 기회가 보이는 지점은?',
    '이 신호가 우리 사업에 미치는 영향은?',
  ],
  sampleResponse: {
    role: 'ai',
    text: '이 인과 맵에서 핵심 노드들의 연결 구조를 분석했습니다. 각 노드 간의 인과관계를 따라가면 이 신호의 본질적인 메커니즘이 드러납니다. 어떤 노드나 연결을 더 깊이 탐구하고 싶으신가요?',
    nodeRefs: [],
  },
}

function ChatPanel({ highlightNodeId, keywordId }: { highlightNodeId: (id: string) => void; keywordId: string }) {
  const config = CHAT_CONFIGS[keywordId] ?? DEFAULT_CHAT_CONFIG
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = () => {
    if (!input.trim() || loading) return
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: input.trim(), time: now }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { ...config.sampleResponse, id: `ai-${Date.now()}`, time: now }])
      setLoading(false)
    }, 900)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #F0EDE8', background: '#FDFCFB', minWidth: 0 }}>

      {/* 헤더 */}
      <div style={{
        padding: '12px 18px', borderBottom: '1px solid #F0EDE8', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50', flexShrink: 0 }} />
        <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 11.5, color: '#888', letterSpacing: '0.02em' }}>
          Map 컨텍스트 기반 대화
        </span>
      </div>

      {/* 메시지 영역 */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* 빈 상태 */}
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 13.5, color: '#444', marginBottom: 16, lineHeight: 1.7 }}>
              이 맵의 인과관계를 바탕으로 자유롭게 질문하거나 탐구해보세요.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {config.suggestedPrompts.map((q, i) => (
                <button key={i} onClick={() => { setInput(q); textareaRef.current?.focus() }}
                  style={{
                    textAlign: 'left', cursor: 'pointer',
                    background: '#F5F3F0', border: '1px solid transparent',
                    borderRadius: 10, padding: '10px 14px',
                    fontFamily: "'Pretendard', sans-serif", fontSize: 12.5, color: '#555', lineHeight: 1.5,
                    transition: 'background 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ECEAE7'; e.currentTarget.style.borderColor = '#E0DDD8' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F5F3F0'; e.currentTarget.style.borderColor = 'transparent' }}
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 메시지 목록 */}
        {messages.map(msg => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 4 }}>

            {msg.role === 'ai' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#FFF', fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }}>AI</span>
                </div>
                <span style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 10.5, color: '#BBB' }}>AI Space</span>
              </div>
            )}

            <div style={{
              maxWidth: '88%',
              padding: msg.role === 'user' ? '10px 14px' : '0',
              borderRadius: msg.role === 'user' ? 14 : 0,
              background: msg.role === 'user' ? '#F0EDE8' : 'transparent',
              fontFamily: "'Pretendard', sans-serif",
              fontSize: 13, lineHeight: 1.75,
              color: msg.role === 'user' ? '#1A1A1A' : '#333',
            }}>
              {msg.role === 'ai' && msg.nodeRefs
                ? <NodeRefText text={msg.text} nodeRefs={msg.nodeRefs} onHoverRef={highlightNodeId} />
                : msg.text}
            </div>

            {msg.time && (
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9.5, color: '#D0CEC9' }}>
                {msg.time}
              </span>
            )}
          </motion.div>
        ))}

        {/* 로딩 */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#FFF', fontSize: 9, fontFamily: "'IBM Plex Mono', monospace" }}>AI</span>
            </div>
            <LoadingDots />
          </motion.div>
        )}
      </div>

      {/* 입력 영역 — 현대적 스타일 */}
      <div style={{ padding: '12px 16px 16px', flexShrink: 0 }}>
        <div style={{
          border: '1px solid #E8E5E0', borderRadius: 14,
          background: '#FFFFFF',
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
          onFocus={() => {}}
        >
          {/* 텍스트 입력 */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="질문하거나 맵을 탐구해보세요... (Shift+Enter 줄바꿈)"
            rows={1}
            style={{
              width: '100%', border: 'none', outline: 'none', resize: 'none',
              background: 'transparent', padding: '13px 16px 4px',
              fontFamily: "'Pretendard', sans-serif", fontSize: 13, color: '#1A1A1A',
              lineHeight: 1.6, maxHeight: 120, overflowY: 'auto',
              boxSizing: 'border-box',
            }}
          />

          {/* 하단 액션 바 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px 10px' }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {/* 첨부파일 */}
              <IconButton title="파일 첨부">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 7.5L7 14C5.34 15.66 2.67 15.66 1 14 -.66 12.33-.66 9.67 1 8L8.5 .5C9.61-.61 11.39-.61 12.5.5 13.61 1.61 13.61 3.39 12.5 4.5L5.5 11.5C4.95 12.05 4.05 12.05 3.5 11.5 2.95 10.95 2.95 10.05 3.5 9.5L9.5 3.5"
                    stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </IconButton>
              {/* 이미지 */}
              <IconButton title="이미지 첨부">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="5.5" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M1 11L5 7.5L8.5 10.5L11 8.5L15 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </IconButton>
            </div>

            {/* 전송 버튼 */}
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              whileTap={input.trim() ? { scale: 0.92 } : {}}
              style={{
                width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                background: input.trim() && !loading ? '#1A1A1A' : '#F0EDE8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 12V2M2 7L7 2L12 7" stroke={input.trim() && !loading ? '#FFFFFF' : '#C8C5C0'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </div>
        </div>

        <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 10, color: '#D0CEC9', textAlign: 'center', margin: '8px 0 0', letterSpacing: '0.02em' }}>
          Map 컨텍스트 기반으로 응답합니다
        </p>
      </div>
    </div>
  )
}

function IconButton({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <button title={title}
      style={{ width: 30, height: 30, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6,
        color: '#C8C5C0', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'color 0.15s, background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = '#F5F3F0' }}
      onMouseLeave={e => { e.currentTarget.style.color = '#C8C5C0'; e.currentTarget.style.background = 'none' }}
    >
      {children}
    </button>
  )
}

function NodeRefText({ text, nodeRefs, onHoverRef }: { text: string; nodeRefs: string[]; onHoverRef: (id: string) => void }) {
  const parts = text.split(new RegExp(`(${nodeRefs.map(r => `\\b${r}\\b`).join('|')})`, 'g'))
  return (
    <span>
      {parts.map((part, i) =>
        nodeRefs.includes(part)
          ? <span key={i} onMouseEnter={() => onHoverRef(part)}
              style={{ background: 'rgba(200,150,12,0.12)', color: '#C8960C', borderRadius: 4,
                padding: '1px 5px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, cursor: 'default' }}>
              {part}
            </span>
          : <span key={i}>{part}</span>
      )}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────
// Guide 탭 — 궤도형 3D 관점 탐색
// ─────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────
// Guide 탭 — Three.js 글로브 + 관점별 해석 패널
// ─────────────────────────────────────────────────────────────────

const GUIDE_DEG = Math.PI / 180

function OrbitalGuide({ keyword, guides, onViewOnMap }: {
  keyword: KeywordNode
  guides: PerspectiveGuide[]
  onViewOnMap: (guide: PerspectiveGuide) => void
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showContent, setShowContent] = useState(false)

  // 관점 선택 시 글로브 회전 후 400ms 뒤 텍스트 reveal
  useEffect(() => {
    setShowContent(false)
    if (!selected) return
    const t = setTimeout(() => setShowContent(true), 400)
    return () => clearTimeout(t)
  }, [selected])

  const selectedGuide = guides.find(g => g.id === selected)

  // 선택된 관점의 lng → 해당 경도가 카메라 방향(+Z)을 향하는 회전각
  const targetRotationY = selectedGuide?.markerCoord
    ? -(selectedGuide.markerCoord.lng * GUIDE_DEG)
    : 0

  const handleSelect = (guide: PerspectiveGuide) => {
    setSelected(prev => prev === guide.id ? null : guide.id)
  }

  if (guides.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%',
        fontFamily: "'Pretendard', sans-serif", fontSize: 13, color: '#CCC' }}>
        이 신호에 대한 관점 가이드가 준비 중입니다
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* 좌측: Three.js 글로브 */}
      <div style={{
        width: '48%', height: '100%', flexShrink: 0, position: 'relative', overflow: 'hidden',
      }}>
        <GuideGlobeScene
          guides={guides}
          selectedId={selected}
          targetRotationY={targetRotationY}
        />
      </div>

      {/* Globe → Panel 커넥터 */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, overflow: 'visible' }}
      >
        <circle cx="46%" cy="50%" r="3.5" fill="none" stroke="#C8C5C0" strokeWidth="1.5" />
        <circle cx="46%" cy="50%" r="1.5" fill="#C8C5C0" />
        <line x1="46%" y1="50%" x2="48%" y2="50%" stroke="#D8D5D0" strokeWidth="1" />
      </svg>

      {/* 우측: 해석 패널 */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: '40px 48px', overflowY: 'auto',
        justifyContent: 'center',
        borderLeft: '1px solid #F5F3F0',
      }}>
        {/* 렌즈 탭 */}
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}
        >
          {guides.map((guide, i) => {
            const isActive = selected === guide.id
            return (
              <motion.button
                key={guide.id}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
                onClick={() => handleSelect(guide)}
                style={{
                  padding: '7px 18px', borderRadius: 100, cursor: 'pointer',
                  border: `1px solid ${isActive ? '#1A1A1A' : '#E0DDD8'}`,
                  background: isActive ? '#1A1A1A' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#888',
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: 12, letterSpacing: '0.02em',
                  transition: 'all 0.2s ease',
                }}
              >
                {guide.label}
              </motion.button>
            )
          })}
        </motion.div>

        {/* 해석 텍스트 — 글로브 회전 후 delay reveal */}
        <AnimatePresence mode="wait">
          {selectedGuide && showContent ? (
            <motion.div
              key={selectedGuide.id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 10, color: '#C8C5C0',
                letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 16px' }}>
                {selectedGuide.label}으로 바라본 문제
              </p>
              <p style={{
                fontFamily: "'Noto Serif KR', serif", fontSize: 15, lineHeight: 1.9,
                color: '#222', margin: '0 0 28px', wordBreak: 'keep-all',
              }}>
                {selectedGuide.interpretation ?? selectedGuide.questions.join(' ')}
              </p>

              {selectedGuide.focusNodeIds.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 28 }}>
                  {selectedGuide.focusNodeIds.map(id => (
                    <span key={id} style={{
                      fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                      background: 'rgba(200,150,12,0.1)', color: '#C8960C',
                      padding: '3px 9px', borderRadius: 4,
                    }}>
                      {id}
                    </span>
                  ))}
                </div>
              )}

              <button
                onClick={() => onViewOnMap(selectedGuide)}
                style={{
                  background: 'none', border: '1px solid #1A1A1A', cursor: 'pointer',
                  padding: '9px 20px', borderRadius: 8,
                  fontFamily: "'Pretendard', sans-serif", fontSize: 12, color: '#1A1A1A',
                  letterSpacing: '0.03em', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#1A1A1A'; e.currentTarget.style.color = '#FFFFFF' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#1A1A1A' }}
              >
                Map 보러가기
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 16, color: '#1A1A1A', margin: '0 0 12px', fontWeight: 700, lineHeight: 1.6, wordBreak: 'keep-all' }}>
                {keyword.label}
              </p>
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: 13, color: '#BBB', margin: 0, lineHeight: 1.7 }}>
                렌즈를 선택하면 이 문제가<br />다른 각도에서 해석됩니다
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
