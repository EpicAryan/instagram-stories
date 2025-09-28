'use client'

import { StoryItem } from './story-item'
import type { Story } from '@/lib/types'

interface StoriesListProps {
  stories: Story[]
  onStoryClick: (index: number) => void
}

export function StoriesList({ stories, onStoryClick }: StoriesListProps) {
  return (
    <div className="w-full py-3 bg-white border-b border-gray-200">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {stories.map((story, index) => (
          <div key={story.id} className="flex-shrink-0">
            <StoryItem 
              story={story}
              onClick={() => onStoryClick(index)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
