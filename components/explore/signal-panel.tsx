"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { type KeywordNode, type SignalDetail } from "./data"

interface SignalPanelProps {
  keyword: KeywordNode
  detail: SignalDetail
  onClose: () => void
  onRelatedSignalClick: (id: string) => void
}

export function SignalPanel({ keyword, detail, onClose, onRelatedSignalClick }: SignalPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // 패널 외부 클릭 시 닫기
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    // 마운트 직후 클릭 이벤트가 즉시 발동하지 않도록 지연 등록
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick)
    }, 50)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [onClose])

  return (
    <motion.div
      ref={panelRef}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: '360px',
        height: '100vh',
        background: '#FFFFFF',
        borderLeft: '1px solid #E8E5E0',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#999',
          fontSize: '18px',
          lineHeight: 1,
          padding: '4px',
        }}
        title="닫기"
      >
        ×
      </button>

      {/* 스크롤 영역 */}
      <div style={{ padding: '40px 28px 120px', flex: 1 }}>
        {/* 헤더 */}
        <div style={{ marginBottom: '24px' }}>
          <h2
            style={{
              fontFamily: "'Noto Serif KR', serif",
              fontSize: '18px',
              color: '#1A1A1A',
              margin: 0,
              marginBottom: '4px',
            }}
          >
            {keyword.label}
          </h2>
          <div style={{ height: '1px', background: '#E8E5E0', margin: '12px 0' }} />
          <p
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: '12px',
              color: '#999',
              margin: 0,
            }}
          >
            오늘 이 신호가 움직이고 있어요
          </p>
        </div>

        {/* 섹션 1: 관련 뉴스 */}
        <Section title="관련 뉴스">
          {detail.news.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '16px 0',
                borderBottom: '1px solid #F0EDE8',
              }}
            >
              <p
                style={{
                  fontFamily: "'Noto Serif KR', serif",
                  fontSize: '14px',
                  color: '#1A1A1A',
                  margin: 0,
                  marginBottom: '6px',
                  lineHeight: 1.5,
                }}
              >
                {item.title}
              </p>
              <p
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  fontSize: '12px',
                  color: '#666',
                  margin: 0,
                  lineHeight: 1.7,
                  marginBottom: '8px',
                }}
              >
                {item.summary}
              </p>
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: '#999',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{item.source}</span>
                <span style={{ color: '#D0CEC9' }}>·</span>
                <span>{item.date}</span>
                {item.url !== '#' && (
                  <>
                    <span style={{ color: '#D0CEC9' }}>·</span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#C8960C', textDecoration: 'none' }}
                    >
                      →
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </Section>

        {/* 섹션 2: 타이밍 */}
        <Section title="이 신호가 움직인 시점">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              color: '#1A1A1A',
              padding: '12px 0',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                background: '#C8960C',
                borderRadius: '50%',
                flexShrink: 0,
              }}
            />
            <span>{detail.timeline.firstSeen} 처음 등장</span>
            <div
              style={{
                flex: 1,
                height: '1px',
                background: '#C8960C',
                opacity: 0.3,
              }}
            />
            <span
              style={{
                width: '6px',
                height: '6px',
                background: '#C8960C',
                borderRadius: '50%',
                flexShrink: 0,
              }}
            />
            <span>{detail.timeline.peakDate} 강도 최고</span>
          </div>
        </Section>

        {/* 섹션 3: 연결된 신호 */}
        <Section title="함께 움직이는 신호">
          {detail.relatedSignals.map((signal, i) => (
            <button
              key={i}
              onClick={() => onRelatedSignalClick(signal.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '10px 0',
                borderBottom: '1px solid #F0EDE8',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '13px',
                color: '#1A1A1A',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#C8960C' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#1A1A1A' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#D0CEC9' }}>·</span>
                {signal.label}
                {signal.isWeak && (
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#999',
                      border: '1px solid #D0CEC9',
                      borderRadius: '4px',
                      padding: '1px 5px',
                    }}
                  >
                    약한신호
                  </span>
                )}
              </span>
              <span style={{ color: '#D0CEC9', fontSize: '12px' }}>→</span>
            </button>
          ))}
        </Section>
      </div>

      {/* CTA 고정 하단 */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          background: '#FFFFFF',
          padding: '20px 28px',
          borderTop: '1px solid #F0EDE8',
        }}
      >
        <button
          onClick={() => {
            window.location.href = `/report/new?signal=${encodeURIComponent(keyword.label)}`
          }}
          style={{
            width: '100%',
            padding: '14px',
            background: '#1A1A1A',
            color: '#FFFFFF',
            fontFamily: "'Noto Serif KR', serif",
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#C8960C' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1A1A1A' }}
        >
          이 신호 깊게 분석하기 →
        </button>
      </div>
    </motion.div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <p
        style={{
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '11px',
          color: '#999',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          margin: 0,
          marginBottom: '4px',
        }}
      >
        {title}
      </p>
      <div style={{ height: '1px', background: '#E8E5E0', marginBottom: '2px' }} />
      {children}
    </div>
  )
}
