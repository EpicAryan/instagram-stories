'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Story } from '@/lib/types'

interface UseStoriesProps {
  stories: Story[]
  initialIndex?: number
  onComplete?: () => void
}

export function useStories({ 
  stories, 
  initialIndex = 0, 
  onComplete 
}: UseStoriesProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set())
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isNavigatingRef = useRef(false)

  const currentStory = stories[currentIndex]
  const duration = currentStory?.duration || 5000

  const preloadImage = useCallback((index: number): Promise<void> => {
    return new Promise((resolve) => {
      if (index < 0 || index >= stories.length) {
        resolve()
        return
      }

      const img = new Image()
      img.onload = () => {
        setPreloadedImages(prev => new Set(prev).add(index))
        resolve()
      }
      img.onerror = () => resolve()
      img.src = stories[index].image
    })
  }, [stories])

  useEffect(() => {
    const preloadAdjacent = async () => {
      const toPreload = []
      
      if (!preloadedImages.has(currentIndex)) {
        toPreload.push(preloadImage(currentIndex))
      }
      
      if (currentIndex + 1 < stories.length && !preloadedImages.has(currentIndex + 1)) {
        toPreload.push(preloadImage(currentIndex + 1))
      }
      
      if (currentIndex - 1 >= 0 && !preloadedImages.has(currentIndex - 1)) {
        toPreload.push(preloadImage(currentIndex - 1))
      }

      await Promise.allSettled(toPreload)
    }

    preloadAdjacent()
  }, [currentIndex, stories, preloadImage, preloadedImages])

  const nextStory = useCallback(() => {
    if (isNavigatingRef.current) return
    
    if (currentIndex < stories.length - 1) {
      isNavigatingRef.current = true
      setCurrentIndex(prev => prev + 1)
      setProgress(0)
      setIsPlaying(true)
      
      const isImagePreloaded = preloadedImages.has(currentIndex + 1)
      setIsLoading(!isImagePreloaded)
      
      setTimeout(() => {
        isNavigatingRef.current = false
      }, 100)
    } else {
      onComplete?.()
    }
  }, [currentIndex, stories.length, onComplete, preloadedImages])

  const previousStory = useCallback(() => {
    if (isNavigatingRef.current) return
    
    if (currentIndex > 0) {
      isNavigatingRef.current = true
      setCurrentIndex(prev => prev - 1)
      setProgress(0)
      setIsPlaying(true)
      
      const isImagePreloaded = preloadedImages.has(currentIndex - 1)
      setIsLoading(!isImagePreloaded)
      
      setTimeout(() => {
        isNavigatingRef.current = false
      }, 100)
    }
  }, [currentIndex, preloadedImages])

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      return !prev
    })
  }, []) 

  const pauseStory = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const resumeStory = useCallback(() => {
    setIsPlaying(true)
  }, [])

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (!isPlaying || isLoading) return

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration / 100))
        
        if (newProgress >= 100) {
          nextStory()
          return 0
        }
        
        return newProgress
      })
    }, 100)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isLoading, duration, nextStory])

  const handleImageLoad = useCallback(() => {
    setIsLoading(false)
    setPreloadedImages(prev => new Set(prev).add(currentIndex))
  }, [currentIndex])

  return {
    currentStory,
    currentIndex,
    progress,
    isPlaying,
    isLoading,
    nextStory,
    previousStory,
    togglePlay,
    pauseStory,
    resumeStory,
    handleImageLoad,
    totalStories: stories.length,
    preloadedImages
  }
}
