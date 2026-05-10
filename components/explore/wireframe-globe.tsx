"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// R3F의 <line>은 SVGLineElement와 충돌하므로 primitive로 래핑
function GlobeLine({ geometry, opacity }: { geometry: THREE.BufferGeometry; opacity: number }) {
  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color: '#1A1A1A', transparent: true, opacity }),
    [opacity]
  )
  const obj = useMemo(() => new THREE.Line(geometry, mat), [geometry, mat])
  return <primitive object={obj} />
}

interface WireframeGlobeProps {
  pulseIntensity?: number
  isActive?: boolean
}

export function WireframeGlobe({ pulseIntensity = 0.15, isActive = true }: WireframeGlobeProps) {
  const globeRef = useRef<THREE.Group>(null)
  const innerSphereRef = useRef<THREE.Mesh>(null)
  const outerSphereRef = useRef<THREE.Mesh>(null)
  const ringsRef = useRef<THREE.Group>(null)

  // Create latitude/longitude lines geometry
  const latitudeLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = []
    const latitudes = [-60, -30, 0, 30, 60]
    
    latitudes.forEach(lat => {
      const radius = Math.cos((lat * Math.PI) / 180) * 2
      const y = Math.sin((lat * Math.PI) / 180) * 2
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0)
      const points = curve.getPoints(64)
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, y, p.y))
      )
      lines.push(geometry)
    })
    
    return lines
  }, [])

  const longitudeLines = useMemo(() => {
    const lines: THREE.BufferGeometry[] = []
    const longitudes = 12
    
    for (let i = 0; i < longitudes; i++) {
      const angle = (i / longitudes) * Math.PI * 2
      const curve = new THREE.EllipseCurve(0, 0, 2, 2, 0, Math.PI, false, 0)
      const points = curve.getPoints(32)
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => {
          const x = p.x * Math.cos(angle)
          const z = p.x * Math.sin(angle)
          return new THREE.Vector3(x, p.y, z)
        })
      )
      lines.push(geometry)
    }
    
    return lines
  }, [])

  useFrame((state) => {
    if (!globeRef.current || !isActive) return

    const time = state.clock.elapsedTime

    // Y축 천천히 회전 (0.001 rad/frame ≈ 0.06 rad/s)
    globeRef.current.rotation.y = time * 0.06

    // 미세 pulse
    const pulse = 1 + Math.sin(time * 1.2) * pulseIntensity * 0.06
    globeRef.current.scale.setScalar(pulse)

    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.sin(time * 0.25) * 0.08
      ringsRef.current.rotation.z = time * 0.04
    }
  })

  return (
    <group ref={globeRef}>
      {/* Inner wireframe sphere */}
      <mesh ref={innerSphereRef}>
        <icosahedronGeometry args={[1.95, 2]} />
        <meshBasicMaterial
          color="#1A1A1A"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Outer wireframe sphere */}
      <mesh ref={outerSphereRef}>
        <icosahedronGeometry args={[2, 3]} />
        <meshBasicMaterial
          color="#1A1A1A"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Latitude lines */}
      {latitudeLines.map((geometry, i) => (
        <GlobeLine key={`lat-${i}`} geometry={geometry} opacity={0.18} />
      ))}

      {/* Longitude lines */}
      {longitudeLines.map((geometry, i) => (
        <GlobeLine key={`long-${i}`} geometry={geometry} opacity={0.18} />
      ))}

      {/* Orbital rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.8, 0.004, 8, 100]} />
          <meshBasicMaterial color="#1A1A1A" transparent opacity={0.15} />
        </mesh>
        <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
          <torusGeometry args={[3.2, 0.004, 8, 100]} />
          <meshBasicMaterial color="#1A1A1A" transparent opacity={0.08} />
        </mesh>
      </group>

      {/* Center point */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#1A1A1A" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}
