"use client"

import { motion } from "framer-motion"
import { type KeywordNode } from "./data"

interface SummaryBarProps {
  keywords: KeywordNode[]
  onKeywordClick: (keyword: KeywordNode) => void
  crossDomainCount?: number
}

export function SummaryBar({ keywords, onKeywordClick, crossDomainCount }: SummaryBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '68px',
        background: 'rgba(248,246,241,0.92)',
        backdropFilter: 'blur(8px)',
        borderTop: '1px solid #E8E5E0',
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
        padding: '0 40px',
        zIndex: 20,
      }}
    >
      <span
        style={{
          fontFamily: "'Pretendard', sans-serif",
          fontSize: '11px',
          color: '#999',
          letterSpacing: '0.06em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {crossDomainCount != null
          ? `오늘의 신호 · 이 중 ${crossDomainCount}개는 경계 밖`
          : '오늘 가장 핫한 신호'}
      </span>

      {keywords.map((kw, i) => (
        <motion.button
          key={kw.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 + i * 0.1 }}
          onClick={() => onKeywordClick(kw)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: '12px',
              color: '#999',
              minWidth: '14px',
            }}
          >
            {['①', '②', '③'][i]}
          </span>
          <span
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontSize: '13px',
              color: '#1A1A1A',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#C8960C' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#1A1A1A' }}
          >
            {kw.label}
          </span>
          <StrengthBar value={kw.strength} />
          {kw.strength < 0.5 && (
            <span
              style={{
                fontFamily: "'Pretendard', sans-serif",
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
        </motion.button>
      ))}
    </motion.div>
  )
}

function StrengthBar({ value }: { value: number }) {
  return (
    <div
      style={{
        width: '48px',
        height: '3px',
        background: '#E8E5E0',
        borderRadius: '2px',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 100}%` }}
        transition={{ duration: 0.6, delay: 1.2, ease: 'easeOut' }}
        style={{
          height: '100%',
          background: '#C8960C',
          borderRadius: '2px',
        }}
      />
    </div>
  )
}
