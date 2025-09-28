'use client'

import Image from 'next/image'
import type { Story } from '@/lib/types'

interface StoryItemProps {
  story: Story
  onClick: () => void
}

export function StoryItem({ story, onClick }: StoryItemProps) {
  return (
    <div 
      className="flex flex-col items-center space-y-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-0.5">
          <div className="w-full h-full rounded-full bg-white p-0.5">
            <Image
              src={story.user?.avatar || '/images/default-avatar.jpg'}
              alt={story.user?.name || 'User'}
              width={64}
              height={64}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-800 max-w-[70px] truncate ml-0.5">
        {story.user?.name || 'User'}
      </span>
    </div>
  )
}
