

# Instagram Stories Clone

A mobile-first Instagram Stories feature built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Completed as a 2-hour development challenge.


## Features

-  **Mobile-First Design** - Optimized for mobile devices with touch-friendly interactions
-  **Horizontal Stories List** - Instagram-like scrollable story previews with gradient rings
-  **Full-Screen Story Viewer** - Immersive story viewing experience
-  **Auto-Advance** - Stories automatically progress every 5 seconds
-  **Touch Navigation** - Tap left/right sides to navigate, middle to pause/play
-  **Swipe Gestures** - Swipe left/right for story navigation
-  **Keyboard Support** - Arrow keys, spacebar, and 'P' key for controls
-  **Smart Image Preloading** - Adjacent stories preload for instant navigation
-  **Smooth Transitions** - Instagram-like slide animations between stories
-  **Progress Indicators** - Real-time progress bars for each story
-  **Loading States** - Skeleton UI and loading indicators
-  **Modern UI** - Clean, responsive design with shadcn/ui components

##  Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Image Optimization:** Next.js Image component

##  Installation

1. **Clone the repository**
```
git clone <your-repo-url>
cd instagram-stories
```

2. **Install dependencies**
```
npm install
```

3. **Initialize shadcn/ui (if not already done)**
```
npx shadcn@latest init
npx shadcn@latest add button skeleton progress
```

4. **Run the development server**
```
npm run dev
```

5. **Open your browser**
```
http://localhost:3000
```

##  Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── skeleton.tsx
│   │   └── progress.tsx
│   └── stories/
│       ├── stories-list.tsx   # Horizontal scrollable list
│       ├── story-viewer.tsx   # Full screen story viewer
│       ├── story-item.tsx     # Individual story in list
│       ├── progress-bar.tsx   # Story progress indicator
│       ├── story-transitions.tsx # Smooth transition animations
│       └── loading-states.tsx # Loading UI components
├── hooks/
│   └── use-stories.ts         # Stories state management
├── lib/
│   ├── utils.ts
│   └── types.ts
public/
└── stories.json              # Sample stories data
```

##  Controls

### Mobile
- **Tap left side** - Previous story
- **Tap middle** - Pause/Play toggle
- **Tap right side** - Next story
- **Swipe left** - Next story
- **Swipe right** - Previous story

### Desktop
- **Click left side** - Previous story
- **Click middle** - Pause/Play toggle  
- **Click right side** - Next story
- **Arrow Left** - Previous story
- **Arrow Right/Spacebar** - Next story
- **P key** - Pause/Play toggle
- **Escape** - Close story viewer

##  Data Format

Stories data should be placed in `public/stories.json`:

```
{
  "stories": [
    {
      "id": "1",
      "image": "https://picsum.photos/400/700?random=1",
      "duration": 5000,
      "user": {
        "name": "username",
        "avatar": "https://picsum.photos/64/64?random=1"
      }
    }
  ]
}
```

##  Key Technical Implementations

### Image Preloading System
- Adjacent stories preload in background for instant navigation
- Smart loading states only show when images aren't cached
- Prevents flickering and loading delays

### Touch Event Handling
- Single touch area with intelligent tap zone detection
- Debounced interactions prevent rapid-fire events
- Separate handling for taps vs swipes

### Smooth Transitions
- Custom slide animations between stories
- Proper image positioning for seamless transitions
- CSS transforms with optimized timing curves

### State Management
- Custom React hook for stories logic
- Progress tracking with auto-advance
- Loading and playing state coordination

## Challenges Overcome

1. **Image Loading Delays** - Implemented intelligent preloading system
2. **Pause/Play Issues** - Added interaction debouncing to prevent state conflicts  
3. **Touch Event Conflicts** - Redesigned with single touch area and smart detection
4. **Jerky Transitions** - Built custom slide animations with proper positioning
5. **Mobile Responsiveness** - Mobile-first approach with touch-optimized interactions


## Browser Support

- **Mobile:** iOS Safari 12+, Chrome Mobile 80+
- **Desktop:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Development

**Total Development Time:** ~2.5 hours

**Key Learning:** Mobile touch event handling is significantly more complex than desktop interactions. Proper debouncing and state management are crucial for smooth user experience.

---

**Built with ❤️ using modern web technologies**
```
