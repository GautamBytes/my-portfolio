'use client'
import { useState, useEffect } from 'react'

export default function StarBackground() {
  const [stars, setStars] = useState({ small: '', medium: '', large: '' })

  useEffect(() => {
    const generateSpace = (count) => {
      let value = ''
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 2000)
        const y = Math.floor(Math.random() * 2000)
        value += `${x}px ${y}px #FFF, `
      }
      return value.slice(0, -2)
    }

    setStars({
      small: generateSpace(700),
      medium: generateSpace(200),
      large: generateSpace(100)
    })
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute w-[1px] h-[1px] bg-transparent animate-star-move-slow opacity-70" style={{ boxShadow: stars.small }} />
      <div className="absolute w-[2px] h-[2px] bg-transparent animate-star-move-medium opacity-50" style={{ boxShadow: stars.medium }} />
      <div className="absolute w-[3px] h-[3px] bg-transparent animate-star-move-fast opacity-30" style={{ boxShadow: stars.large }} />
    </div>
  )
}