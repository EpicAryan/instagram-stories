export interface Story {
  id: string
  image: string
  duration?: number
  user?: {
    name: string
    avatar?: string
  }
}

export interface StoriesData {
  stories: Story[]
}
