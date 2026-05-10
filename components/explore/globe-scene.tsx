"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { WireframeGlobe } from "./wireframe-globe"
import { Suspense } from "react"
import { motion } from "framer-motion"

interface GlobeSceneProps {
  isZooming?: boolean
}

export function GlobeScene({ isZooming = false }: GlobeSceneProps) {
  return (
    <motion.div
      className="absolute inset-0 z-0"
      animate={isZooming ? { scale: 32, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={isZooming ? {
        scale: { duration: 0.21, ease: [0.7, 0, 1, 1] },
        opacity: { duration: 0.18, delay: 0.04, ease: 'easeIn' },
      } : {
        scale: { duration: 0.3 },
        opacity: { duration: 0.3 },
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <WireframeGlobe />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  )
}
