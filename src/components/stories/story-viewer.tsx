'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Pause } from 'lucide-react'
import { ProgressBar } from './progress-bar'
import { StoryTransitions } from './story-transitions'
import { LoadingOverlay, LoadingIndicator } from './loading-states'
import { useStories } from '@/hooks/use-stories'
import type { Story } from '@/lib/types'

interface StoryViewerProps {
  stories: Story[]
  initialIndex: number
  onClose: () => void
}

export function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const {
    currentStory,
    currentIndex,
    progress,
    isPlaying,
    isLoading,
    nextStory,
    previousStory,
    togglePlay,
    handleImageLoad,
    totalStories,
    preloadedImages
  } = useStories({
    stories,
    initialIndex,
    onComplete: onClose
  })

  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null)
  const isHandlingInteraction = useRef(false)

  const handleInteraction = (action: () => void) => {
    if (isHandlingInteraction.current) return
    
    isHandlingInteraction.current = true
    action()

    setTimeout(() => {
      isHandlingInteraction.current = false
    }, 200)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || isHandlingInteraction.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const timeDiff = Date.now() - touchStart.time

    const screenWidth = window.innerWidth
    const tapX = touch.clientX

    const isTap = timeDiff < 300 && Math.abs(deltaX) < 30 && Math.abs(deltaY) < 30
    const isSwipe = Math.abs(deltaX) > 50

    if (isSwipe) {
      if (deltaX > 50) {
        handleInteraction(previousStory)
      } else if (deltaX < -50) {
        handleInteraction(nextStory)
      }
    } else if (isTap) {
      if (tapX < screenWidth / 3) {
        handleInteraction(previousStory)
      } else if (tapX > (2 * screenWidth) / 3) {
        handleInteraction(nextStory)
      } else {
        handleInteraction(togglePlay)
      }
    }

    setTouchStart(null)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isHandlingInteraction.current) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handleInteraction(previousStory)
          break
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          handleInteraction(nextStory)
          break
        case 'Escape':
          onClose()
          break
        case 'p':
        case 'P':
          e.preventDefault()
          handleInteraction(togglePlay)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextStory, previousStory, togglePlay, onClose, isPlaying])

  const handleClick = (e: React.MouseEvent) => {
    if (isHandlingInteraction.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width

    if (clickX < width / 3) {
      handleInteraction(previousStory)
    } else if (clickX > (2 * width) / 3) {
      handleInteraction(nextStory)
    } else {
      handleInteraction(togglePlay)
    }
  }

  if (!currentStory) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex space-x-1 z-20">
        {stories.map((_, index) => (
          <div key={index} className="relative flex-1">
            <ProgressBar
              progress={index === currentIndex ? progress : 0}
              isActive={index === currentIndex}
              isCompleted={index < currentIndex}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={currentStory.user?.avatar || '/images/default-avatar.jpg'}
              alt={currentStory.user?.name || 'User'}
              width={32}
              height={32}
              className="rounded-full"
            />
            {/* Play/pause indicator */}
            <div 
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                isPlaying 
                  ? 'bg-green-500' 
                  : 'bg-red-500 animate-pulse'
              }`}
            >
              {isPlaying ? (
                <div className="w-0 h-0 border-l-2 border-l-white border-y-transparent border-y-1 ml-0.5"></div>
              ) : (
                <div className="w-1.5 h-1.5 bg-white"></div>
              )}
            </div>
          </div>
          <span className="text-blue-400 font-medium text-sm">
            {currentStory.user?.name || 'User'}
          </span>
          <span className="text-blue-400/70 text-xs">now</span>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div 
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ 
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none'
        }}
      />

      <div className="relative w-full h-full max-w-lg mx-auto pointer-events-none">
        <LoadingOverlay 
          isLoading={isLoading} 
          isPreloaded={preloadedImages.has(currentIndex)} 
        />
        
        <StoryTransitions
          stories={stories}
          currentIndex={currentIndex}
          isLoading={isLoading}
          preloadedImages={preloadedImages}
          onImageLoad={handleImageLoad}
          isPlaying={isPlaying}
        />

        {/* Pause overlay */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-30 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-6 animate-pulse">
              <Pause className="w-10 h-10 text-white fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation hints */}
      {currentIndex > 0 && (
        <ChevronLeft className="hidden lg:block absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 text-white/30 pointer-events-none" />
      )}
      {currentIndex < totalStories - 1 && (
        <ChevronRight className="hidden lg:block absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 text-white/30 pointer-events-none" />
      )}

      <LoadingIndicator isVisible={isLoading} />

      {/* Story counter */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-white/80 text-xs font-medium">
            {currentIndex + 1} / {totalStories}
          </span>
        </div>
      </div>
    </div>
  )
}
