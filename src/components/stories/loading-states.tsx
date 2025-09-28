'use client'

import { Skeleton } from '@/components/ui/skeleton'

interface LoadingOverlayProps {
  isLoading: boolean
  isPreloaded: boolean
}

export function LoadingOverlay({ isLoading, isPreloaded }: LoadingOverlayProps) {
  if (!isLoading || isPreloaded) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
      <div className="text-center">
        <Skeleton className="w-full h-full bg-gray-800" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    </div>
  )
}

interface LoadingIndicatorProps {
  isVisible: boolean
}

export function LoadingIndicator({ isVisible }: LoadingIndicatorProps) {
  if (!isVisible) return null

  return (
    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 flex items-center space-x-3">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
        <span className="text-white text-sm font-medium">Loading...</span>
      </div>
    </div>
  )
}
