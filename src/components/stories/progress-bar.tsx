'use client'

interface ProgressBarProps {
  progress: number
  isActive: boolean
  isCompleted: boolean
}

export function ProgressBar({ progress, isActive, isCompleted }: ProgressBarProps) {
  return (
    <div className="h-0.5 bg-white/30 rounded-full overflow-hidden">
      <div 
        className="h-full bg-white rounded-full transition-all duration-100 ease-linear"
        style={{ 
          width: isCompleted ? '100%' : isActive ? `${progress}%` : '0%' 
        }}
      />
    </div>
  )
}
