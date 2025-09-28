'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { ProgressBar } from './progress-bar'
import { StoryTransitions } from './story-transitions'
import { LoadingOverlay, LoadingIndicator } from './loading-states'
import { useMobileNavigation } from '@/hooks/use-mobile-navigation'
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

  const {
    handleTouchStart,
    handleTouchEnd
  } = useMobileNavigation({
    onNext: nextStory,
    onPrevious: previousStory,
    onTogglePlay: togglePlay
  })

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          previousStory()
          break
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          nextStory()
          break
        case 'Escape':
          onClose()
          break
        case 'p':
        case 'P':
          e.preventDefault()
          togglePlay()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextStory, previousStory, togglePlay, onClose])

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
                <Play className="w-2 h-2 text-white fill-current" />
              ) : (
                <Pause className="w-2 h-2 text-white fill-current" />
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

      <div className="absolute inset-0 z-10 flex">
        <div 
          className="w-1/3 h-full"
          onClick={previousStory}
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => handleTouchEnd(e, 'left')}
        />

        <div 
          className="w-1/3 h-full"
          onClick={togglePlay}
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => handleTouchEnd(e, 'middle')}
        />
 
        <div 
          className="w-1/3 h-full"
          onClick={nextStory}
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => handleTouchEnd(e, 'right')}
        />
      </div>

      <div className="relative w-full h-full max-w-lg mx-auto">
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

        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-30">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-6">
              <Pause className="w-16 h-16 text-white fill-current" />
            </div>
          </div>
        )}
      </div>

      {currentIndex > 0 && (
        <ChevronLeft className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 text-white/50 pointer-events-none" />
      )}
      {currentIndex < totalStories - 1 && (
        <ChevronRight className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 text-white/50 pointer-events-none" />
      )}

      <LoadingIndicator isVisible={isLoading} />

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
