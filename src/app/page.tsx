'use client'

import { useState, useEffect } from 'react'
import { StoriesList } from '@/components/stories/stories-list'
import { StoryViewer } from '@/components/stories/story-viewer'
import type { Story } from '@/lib/types'

// Fallback data in case fetch fails
// const fallbackStories: Story[] = [
//   {
//     "id": "1",
//     "image": "https://picsum.photos/400/700?random=1",
//     "duration": 5000,
//     "user": {
//       "name": "adventure_seeker",
//       "avatar": "https://picsum.photos/64/64?random=11"
//     }
//   },
//   {
//     "id": "2", 
//     "image": "https://picsum.photos/400/700?random=2",
//     "duration": 5000,
//     "user": {
//       "name": "food_lover",
//       "avatar": "https://picsum.photos/64/64?random=12"
//     }
//   },
//   {
//     "id": "3",
//     "image": "https://picsum.photos/400/700?random=3", 
//     "duration": 5000,
//     "user": {
//       "name": "travel_diary",
//       "avatar": "https://picsum.photos/64/64?random=13"
//     }
//   },
//   {
//     "id": "4",
//     "image": "https://picsum.photos/400/700?random=4",
//     "duration": 5000, 
//     "user": {
//       "name": "nature_shots",
//       "avatar": "https://picsum.photos/64/64?random=14"
//     }
//   },
//   {
//     "id": "5",
//     "image": "https://picsum.photos/400/700?random=5",
//     "duration": 5000, 
//     "user": {
//       "name": "city_explorer",
//       "avatar": "https://picsum.photos/64/64?random=15"
//     }
//   }
// ]

export default function Home() {
  const [stories, setStories] = useState<Story[]>([])
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch stories data
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/stories.json') // Fixed path - removed /data/
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setStories(data.stories)
      } catch (error) {
        console.warn('Failed to fetch stories, using fallback data:', error)
        // setStories(fallbackStories) // Use fallback data
      } finally {
        setIsLoading(false)
      }
    }

    fetchStories()
  }, [])

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index)
  }

  const handleCloseViewer = () => {
    setSelectedStoryIndex(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading stories...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900">Stories</h1>
      </div>

      {/* Stories List */}
      <StoriesList 
        stories={stories}
        onStoryClick={handleStoryClick}
      />

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={handleCloseViewer}
        />
      )}

      {/* Demo content */}
      <div className="p-4 text-center text-gray-500">
        <p>Tap on a story above to view it</p>
        <p className="text-sm mt-1">
          Use left/right sides to navigate • Space/Arrow keys work too
        </p>
      </div>
    </main>
  )
}
