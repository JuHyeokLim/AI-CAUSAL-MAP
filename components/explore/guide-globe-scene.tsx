"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import type { PerspectiveGuide } from "./data"

const DEG = Math.PI / 180
const R = 2  // globe radius

// lat/lng → Three.js 3D position
function latlng(lat: number, lng: number, r = R): [number, number, number] {
  const phi = (90 - lat) * DEG
  const theta = lng * DEG
  return [
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.cos(theta),
  ]
}

// 각도 차이를 -π ~ π 로 정규화
function angleDiff(a: number, b: number) {
  let d = a - b
  while (d > Math.PI) d -= 2 * Math.PI
  while (d < -Math.PI) d += 2 * Math.PI
  return d
}

// ── 경도/위도선 GlobeLine ──────────────────────────────────────────
function GlobeLine({ geometry, color, opacity, lineWidth = 1 }: {
  geometry: THREE.BufferGeometry
  color: string
  opacity: number
  lineWidth?: number
}) {
  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity }),
    [color, opacity]
  )
  const obj = useMemo(() => new THREE.Line(geometry, mat), [geometry, mat])
  return <primitive object={obj} />
}

// ── 마커 (펄스 링 포함) ──────────────────────────────────────────
function GlobeMarker({
  position,
  isSelected,
}: {
  position: [number, number, number]
  isSelected: boolean
}) {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!ringRef.current || !isSelected) return
    const t = clock.getElapsedTime()
    const scale = 1 + Math.sin(t * 2.5) * 0.3
    ringRef.current.scale.setScalar(scale)
    ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.6 - Math.sin(t * 2.5) * 0.3
  })

  return (
    <group position={position}>
      {/* 마커 dot */}
      <mesh>
        <sphereGeometry args={[isSelected ? 0.09 : 0.05, 16, 16]} />
        <meshBasicMaterial color={isSelected ? '#C8960C' : '#B0ADAA'} />
      </mesh>

      {/* 선택 시 펄스 링 */}
      {isSelected && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.012, 8, 32]} />
          <meshBasicMaterial color="#C8960C" transparent opacity={0.6} />
        </mesh>
      )}

    </group>
  )
}

// ── 글로브 본체 + 회전 제어 ──────────────────────────────────────
function GlobeContent({
  guides,
  selectedId,
  targetRotationY,
}: {
  guides: PerspectiveGuide[]
  selectedId: string | null
  targetRotationY: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  const baseRotRef = useRef(0)

  // 선택 경도 (라디안) — 해당 meridian 골드로
  const selectedLng = useMemo(() => {
    const g = guides.find(g => g.id === selectedId)
    return g?.markerCoord ? g.markerCoord.lng * DEG : null
  }, [selectedId, guides])

  // 위도선: 20도 간격 9개
  const latLines = useMemo(() => {
    return [-80, -60, -40, -20, 0, 20, 40, 60, 80].map(lat => {
      const r = Math.cos(lat * DEG) * R
      const y = Math.sin(lat * DEG) * R
      const curve = new THREE.EllipseCurve(0, 0, r, r, 0, 2 * Math.PI, false, 0)
      const pts = curve.getPoints(72)
      return {
        lat,
        geo: new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(p.x, y, p.y))),
      }
    })
  }, [])

  // 경도선: 20도 간격 18개
  const lngLines = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => {
      const lng = (i / 18) * Math.PI * 2
      const curve = new THREE.EllipseCurve(0, 0, R, R, 0, Math.PI, false, 0)
      const pts = curve.getPoints(48)
      return {
        lngRad: lng,
        geo: new THREE.BufferGeometry().setFromPoints(
          pts.map(p => new THREE.Vector3(
            p.x * Math.cos(lng),
            p.y,
            p.x * Math.sin(lng),
          ))
        ),
      }
    })
  }, [])

  useFrame(() => {
    if (!groupRef.current) return

    if (selectedId === null) {
      // 자동 자전
      groupRef.current.rotation.y += 0.003
      baseRotRef.current = groupRef.current.rotation.y
    } else {
      // 목표 방향으로 부드럽게 수렴
      const diff = angleDiff(targetRotationY, groupRef.current.rotation.y)
      groupRef.current.rotation.y += diff * 0.055
    }

    // 카메라 미세 이동: 선택 시 살짝 오른쪽으로 → 오른쪽 공간 확장 느낌
    const targetCamX = selectedId ? 0.6 : 0
    camera.position.x += (targetCamX - camera.position.x) * 0.04
  })

  return (
    <group ref={groupRef}>
      {/* icosahedron wireframe — 입체감 핵심 */}
      <mesh>
        <icosahedronGeometry args={[1.96, 2]} />
        <meshBasicMaterial color="#1A1A1A" wireframe transparent opacity={0.07} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[2.0, 3]} />
        <meshBasicMaterial color="#1A1A1A" wireframe transparent opacity={0.10} />
      </mesh>

      {/* 위도선 */}
      {latLines.map(({ lat, geo }) => (
        <GlobeLine
          key={`lat-${lat}`}
          geometry={geo}
          color="#1A1A1A"
          opacity={lat === 0 ? 0.32 : 0.16}
        />
      ))}

      {/* 경도선 — 선택 경도는 골드 */}
      {lngLines.map(({ lngRad, geo }, i) => {
        const isHighlighted = selectedLng !== null &&
          Math.abs(angleDiff(lngRad, selectedLng)) < (20 * DEG)
        return (
          <GlobeLine
            key={`lng-${i}`}
            geometry={geo}
            color={isHighlighted ? '#C8960C' : '#1A1A1A'}
            opacity={isHighlighted ? 0.55 : 0.16}
          />
        )
      })}

      {/* 중심 dot */}
      <mesh>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#1A1A1A" transparent opacity={0.35} />
      </mesh>

      {/* 관점 마커 */}
      {guides.map(guide => {
        if (!guide.markerCoord) return null
        const pos = latlng(guide.markerCoord.lat, guide.markerCoord.lng, R + 0.06)
        return (
          <GlobeMarker
            key={guide.id}
            position={pos}
            isSelected={guide.id === selectedId}
          />
        )
      })}
    </group>
  )
}

// ── 외부 export ──────────────────────────────────────────────────
export function GuideGlobeScene({
  guides,
  selectedId,
  targetRotationY,
}: {
  guides: PerspectiveGuide[]
  selectedId: string | null
  targetRotationY: number
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 5.2], fov: 40 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.45} />
      <pointLight position={[5, 5, 5]} intensity={0.5} />
      <pointLight position={[-3, -3, -3]} intensity={0.15} color="#C8960C" />
      <GlobeContent
        guides={guides}
        selectedId={selectedId}
        targetRotationY={targetRotationY}
      />
    </Canvas>
  )
}
