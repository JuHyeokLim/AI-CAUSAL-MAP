"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DOMAINS } from "./data"

const ROLES = ["전략기획", "신사업", "투자·M&A", "마케팅·브랜드"]

interface ContextCaptureProps {
  onComplete: (domains: string[], role: string) => void
}

export function ContextCapture({ onComplete }: ContextCaptureProps) {
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [selectedRole, setSelectedRole] = useState<string>("")

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    )
  }

  const handleDomainConfirm = () => {
    if (selectedDomains.length === 0) return
    setStep(2)
  }

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    onComplete(selectedDomains, role)
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ pointerEvents: 'auto', textAlign: 'center' }}
          >
            <p
              style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: '20px',
                color: '#1A1A1A',
                marginBottom: '24px',
                letterSpacing: '0.02em',
              }}
            >
              어떤 시각으로 신호를 볼까요?
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
                maxWidth: '400px',
                marginBottom: '28px',
              }}
            >
              {DOMAINS.map(domain => {
                const active = selectedDomains.includes(domain)
                return (
                  <motion.button
                    key={domain}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleDomain(domain)}
                    style={{
                      padding: '8px 20px',
                      borderRadius: '100px',
                      border: `1px solid ${active ? '#C8960C' : '#D0CEC9'}`,
                      background: active ? 'rgba(200,150,12,0.08)' : '#FFFFFF',
                      color: active ? '#C8960C' : '#666',
                      fontFamily: "'Pretendard', sans-serif",
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {domain}
                  </motion.button>
                )
              })}
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDomainConfirm}
              disabled={selectedDomains.length === 0}
              style={{
                padding: '10px 32px',
                borderRadius: '100px',
                border: '1px solid',
                borderColor: selectedDomains.length > 0 ? '#1A1A1A' : '#D0CEC9',
                background: selectedDomains.length > 0 ? '#1A1A1A' : 'transparent',
                color: selectedDomains.length > 0 ? '#FFFFFF' : '#CCC',
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '13px',
                cursor: selectedDomains.length > 0 ? 'pointer' : 'default',
                transition: 'all 0.2s ease',
                letterSpacing: '0.04em',
              }}
            >
              다음
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{ pointerEvents: 'auto', textAlign: 'center' }}
          >
            <p
              style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: '20px',
                color: '#1A1A1A',
                marginBottom: '24px',
                letterSpacing: '0.02em',
              }}
            >
              어떤 역할로 보시나요?
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center',
                maxWidth: '400px',
              }}
            >
              {ROLES.map(role => (
                <motion.button
                  key={role}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRoleSelect(role)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '100px',
                    border: `1px solid ${selectedRole === role ? '#C8960C' : '#D0CEC9'}`,
                    background: selectedRole === role ? 'rgba(200,150,12,0.08)' : '#FFFFFF',
                    color: selectedRole === role ? '#C8960C' : '#666',
                    fontFamily: "'Pretendard', sans-serif",
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {role}
                </motion.button>
              ))}
            </div>
            <p
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '12px',
                color: '#BBB',
                marginTop: '20px',
              }}
            >
              역할을 선택하면 바로 시작됩니다
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
