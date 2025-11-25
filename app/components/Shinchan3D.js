'use client'
import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Float, Center } from '@react-three/drei'

function ShinchanModel({ toggleAudio }) {
  const { scene } = useGLTF('/shinchan.glb')
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime()
      meshRef.current.rotation.y = Math.sin(t / 2) * 0.1 
    }
  })

  // Increased scale to 0.9 so he is clearly visible
  const BASE_SCALE = 0.37

  return (
    <Center>
      {/* The Visual Model */}
      <primitive 
        ref={meshRef}
        object={scene} 
        scale={hovered ? BASE_SCALE * 1.1 : BASE_SCALE}
        rotation={[0, 0, 0]}
      />

      {/* THE HIT BOX (The clickable trigger) */}
      <mesh 
        onClick={(e) => {
          e.stopPropagation()
          toggleAudio()
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
          setHover(true)
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
          setHover(false)
        }}
        visible={false} // Invisible box, but still clickable
      >
        {/* Large box geometry to ensure clicks register easily */}
        <boxGeometry args={[1.2, 1.8, 1]} />
        <meshBasicMaterial color="red" wireframe={true} transparent opacity={0.5} />
      </mesh>
    </Center>
  )
}

export default function Shinchan3D() {
  const [isTalking, setIsTalking] = useState(false)
  const audioRef = useRef(null)
  
  const toggleAudio = () => {
    // 1. Auto-pause the main website background music
    // We look for the audio tag from page.js using its src
    const bgMusic = document.querySelector('audio[src="/bg-music.mp3"]')
    if (bgMusic) {
      bgMusic.pause()
    }

    // 2. Toggle Logic (Stop if playing, Start if not)
    if (isTalking) {
      // STOP logic
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      setIsTalking(false)
    } else {
      // PLAY logic
      const audio = new Audio('/shinchan.mp3')
      audio.volume = 1.0 // Louder volume
      audioRef.current = audio
    
      audio.onended = () => setIsTalking(false)
      audio.play().catch(e => console.error("Audio failed:", e))
      setIsTalking(true)
    }
  }

  return (
    <div className="w-full h-[400px] relative mt-8" suppressHydrationWarning>
      
      {isTalking && (
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white text-black px-4 py-2 rounded-xl rounded-bl-none z-10 font-bold border-2 border-black animate-bounce">
          Hii! I am Shinchan!
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
           <Suspense fallback={null}>
             <ShinchanModel toggleAudio={toggleAudio} />
           </Suspense>
        </Float>

        <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
      
      <p className="text-center text-neutral-500 text-sm mt-2">Tap me!</p>
    </div>
  )
}