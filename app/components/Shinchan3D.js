'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Float, OrbitControls, useGLTF } from '@react-three/drei';

function ShinchanModel({ onToggleAudio, baseScale }) {
  const { scene } = useGLTF('/shinchan.glb');
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(time / 2) * 0.1;
  });

  return (
    <Center>
      <primitive ref={meshRef} object={scene} scale={hovered ? baseScale * 1.1 : baseScale} rotation={[0, 0, 0]} />
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onToggleAudio();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        visible={false}
      >
        <boxGeometry args={[1.2, 1.8, 1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </Center>
  );
}

useGLTF.preload('/shinchan.glb');

const REACTION_MESSAGES = {
  idle: 'Tap me!',
  unlock: 'Yay! Quest step unlocked!',
  celebrate: 'Mission complete! Lets build!',
};

export default function Shinchan3D({ reactionMode = 'idle' }) {
  const [isTalking, setIsTalking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeReaction, setActiveReaction] = useState(reactionMode);
  const audioRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 640px)');

    const update = (event) => {
      setIsMobile(event.matches);
    };

    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener('change', update);

    return () => {
      mediaQuery.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    setActiveReaction(reactionMode);
  }, [reactionMode]);

  useEffect(() => {
    const handleReaction = (event) => {
      const nextMode = event?.detail?.mode;
      if (!nextMode || (nextMode !== 'unlock' && nextMode !== 'celebrate')) {
        return;
      }

      setActiveReaction(nextMode);

      window.setTimeout(() => {
        setActiveReaction('idle');
      }, 2200);
    };

    window.addEventListener('shinchan:reaction', handleReaction);

    return () => {
      window.removeEventListener('shinchan:reaction', handleReaction);
    };
  }, []);

  const toggleAudio = () => {
    const backgroundMusic = document.querySelector('audio[src="/bg-music.mp3"]');
    if (backgroundMusic) {
      backgroundMusic.pause();
    }

    if (isTalking) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsTalking(false);
      return;
    }

    const audio = new Audio('/shinchan.mp3');
    audio.volume = 1;
    audioRef.current = audio;
    audio.onended = () => setIsTalking(false);

    audio
      .play()
      .then(() => setIsTalking(true))
      .catch(() => setIsTalking(false));
  };

  const reactionScaleBoost = activeReaction === 'celebrate' ? 0.06 : activeReaction === 'unlock' ? 0.03 : 0;
  const baseScale = (isMobile ? 0.31 : 0.37) + reactionScaleBoost;
  const floatSpeed = activeReaction === 'celebrate' ? 2.7 : 2;
  const showMessage = isTalking || activeReaction !== 'idle';
  const messageText = isTalking ? 'Hii! I am Shinchan!' : REACTION_MESSAGES[activeReaction];

  return (
    <div className={`relative mt-4 w-full ${isMobile ? 'h-[320px]' : 'h-[390px]'}`}>
      {showMessage && (
        <div className={`absolute left-1/2 z-10 -translate-x-1/2 rounded-xl rounded-bl-none border-2 border-black bg-white px-4 py-2 font-semibold text-black ${isMobile ? 'top-4 text-xs' : 'top-8 text-sm'}`}>
          {messageText}
        </div>
      )}

      <div className={`w-full ${isMobile ? 'h-[280px]' : 'h-[340px]'}`}>
        <Canvas camera={{ position: isMobile ? [0, 0, 5.6] : [0, 0, 5], fov: 50 }} dpr={isMobile ? [1, 1.3] : [1, 1.6]}>
          <ambientLight intensity={0.8} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={1} />

          <Float speed={floatSpeed} rotationIntensity={0.2} floatIntensity={0.5}>
            <Suspense fallback={null}>
              <ShinchanModel onToggleAudio={toggleAudio} baseScale={baseScale} />
            </Suspense>
          </Float>

          <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 1.5} />
        </Canvas>
      </div>

      <p className={`absolute left-1/2 -translate-x-1/2 text-center text-zinc-500 ${isMobile ? 'bottom-1 text-xs' : 'bottom-0 text-sm'}`}>
        Tap me!
      </p>
    </div>
  );
}
