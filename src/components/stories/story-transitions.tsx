'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Story } from '@/lib/types'

interface StoryTransitionsProps {
  stories: Story[]
  currentIndex: number
  isLoading: boolean
  preloadedImages: Set<number>
  onImageLoad: () => void
  isPlaying: boolean
}

type TransitionDirection = 'next' | 'prev' | 'none'

export function StoryTransitions({
  stories,
  currentIndex,
  isLoading,
  preloadedImages,
  onImageLoad,
  isPlaying
}: StoryTransitionsProps) {
  const [transitionDirection, setTransitionDirection] = useState<TransitionDirection>('none')
  const [previousIndex, setPreviousIndex] = useState(currentIndex)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentStory = stories[currentIndex]
  const previousStory = stories[previousIndex]

  useEffect(() => {
    if (previousIndex !== currentIndex) {
      setIsTransitioning(true)

      if (currentIndex > previousIndex) {
        setTransitionDirection('next')
      } else {
        setTransitionDirection('prev')
      }

      const timer = setTimeout(() => {
        setIsTransitioning(false)
        setTransitionDirection('none')
        setPreviousIndex(currentIndex)
      }, 400)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, previousIndex])

  const getSlideClass = (isCurrentSlide: boolean, isPreviousSlide: boolean) => {
    if (!isTransitioning) {
      return isCurrentSlide ? 'translate-x-0' : 'translate-x-full'
    }

    if (transitionDirection === 'next') {
      if (isCurrentSlide) return 'translate-x-0'
      if (isPreviousSlide) return '-translate-x-full'
      return 'translate-x-full'
    } else if (transitionDirection === 'prev') {
      if (isCurrentSlide) return 'translate-x-0'
      if (isPreviousSlide) return 'translate-x-full'
      return '-translate-x-full'
    }

    return 'translate-x-full'
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {isTransitioning && previousStory && previousIndex !== currentIndex && (
        <div 
          className={`absolute inset-0 transition-transform duration-400 ease-out ${
            getSlideClass(false, true)
          }`}
        >
          <Image
            src={previousStory.image}
            alt="Previous Story"
            fill
            className={`object-cover ${
              !isPlaying ? 'brightness-75 saturate-75' : 'brightness-100 saturate-100'
            }`}
            priority={false}
            sizes="(max-width: 640px) 100vw, 512px"
          />
        </div>
      )}

      <div 
        className={`absolute inset-0 transition-transform duration-400 ease-out ${
          getSlideClass(true, false)
        }`}
      >
        <Image
          key={`current-story-${currentIndex}`}
          src={currentStory.image}
          alt="Story"
          fill
          className={`object-cover transition-all duration-500 ease-out ${
            isLoading && !preloadedImages.has(currentIndex) 
              ? 'opacity-0 scale-105' 
              : 'opacity-100 scale-100'
          } ${
            !isPlaying ? 'brightness-75 saturate-75' : 'brightness-100 saturate-100'
          }`}
          onLoad={onImageLoad}
          priority
          sizes="(max-width: 640px) 100vw, 512px"
        />
      </div>

      {currentIndex < stories.length - 1 && (
        <div className="absolute inset-0 translate-x-full">
          <Image
            src={stories[currentIndex + 1].image}
            alt="Next Story Preload"
            fill
            className="object-cover opacity-0"
            priority={false}
            sizes="(max-width: 640px) 100vw, 512px"
          />
        </div>
      )}

      {currentIndex > 0 && (
        <div className="absolute inset-0 -translate-x-full">
          <Image
            src={stories[currentIndex - 1].image}
            alt="Previous Story Preload"
            fill
            className="object-cover opacity-0"
            priority={false}
            sizes="(max-width: 640px) 100vw, 512px"
          />
        </div>
      )}
    </div>
  )
}
