'use client'

import { useState, useCallback } from 'react'

interface UseMobileNavigationProps {
  onNext: () => void
  onPrevious: () => void
  onTogglePlay: () => void
}

export function useMobileNavigation({
  onNext,
  onPrevious,
  onTogglePlay
}: UseMobileNavigationProps) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ 
      x: touch.clientX, 
      y: touch.clientY, 
      time: Date.now() 
    })
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent, area: 'left' | 'right' | 'middle') => {
    if (!touchStart) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const timeDiff = Date.now() - touchStart.time

    const isTap = timeDiff < 200 && Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30
    const isSwipe = Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)

    if (isSwipe) {
      if (deltaX > 50) {
        onPrevious()
      } else if (deltaX < -50) {
        onNext()
      }
    } else if (isTap) {
      if (area === 'left') {
        onPrevious()
      } else if (area === 'right') {
        onNext()
      } else if (area === 'middle') {
        onTogglePlay()
      }
    }

    setTouchStart(null)
  }, [touchStart, onNext, onPrevious, onTogglePlay])

  return {
    handleTouchStart,
    handleTouchEnd
  }
}
