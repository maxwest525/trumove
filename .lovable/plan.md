
# Add Auto-Cycling to Hero Box Carousel

## Overview
Enable the inline feature carousel in the "Your Move. Your Terms" hero card to cycle through all features slowly and continuously, following the same pattern used by the full-width FeatureCarousel.

## Current State
The hero box carousel (lines 1289-1322 in Index.tsx) currently:
- Uses the standard Carousel component with `loop: true` option
- Has 4 features displayed 2 at a time (basis-1/2)
- Requires manual interaction (arrows or drag) to advance
- No automatic cycling

## Changes Required

### 1. Update Index.tsx - Add Autoplay Logic to Hero Carousel

Add state and effect hooks to implement slow, continuous auto-scrolling:

```tsx
// Add state for hero carousel API
const [heroCarouselApi, setHeroCarouselApi] = useState<CarouselApi>();
const [isHeroCarouselPaused, setIsHeroCarouselPaused] = useState(false);

// Add autoplay effect (6-second interval for slow cycling)
useEffect(() => {
  if (!heroCarouselApi || isHeroCarouselPaused) return;
  
  const intervalId = setInterval(() => {
    heroCarouselApi.scrollNext();
  }, 6000); // 6 seconds between transitions
  
  return () => clearInterval(intervalId);
}, [heroCarouselApi, isHeroCarouselPaused]);
```

Update the Carousel component to:
- Pass `setApi={setHeroCarouselApi}` to capture the API
- Add hover handlers to pause/resume on interaction

```tsx
<div 
  className="tru-why-inline-carousel"
  onMouseEnter={() => setIsHeroCarouselPaused(true)}
  onMouseLeave={() => setIsHeroCarouselPaused(false)}
>
  <Carousel
    setApi={setHeroCarouselApi}
    opts={{ align: "start", loop: true }}
    className="tru-why-carousel"
  >
    {/* ... existing content ... */}
  </Carousel>
</div>
```

### 2. Import CarouselApi Type

Add the `CarouselApi` type import:
```tsx
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
```

---

## Technical Details

### Files to Modify
- `src/pages/Index.tsx`

### Implementation Steps
1. Add `CarouselApi` type to the carousel import
2. Add `heroCarouselApi` and `isHeroCarouselPaused` state variables
3. Add `useEffect` for auto-scrolling with 6-second interval
4. Wrap carousel in div with hover handlers to pause on interaction
5. Pass `setApi={setHeroCarouselApi}` to the Carousel component

### Behavior
| Aspect | Configuration |
|--------|---------------|
| Interval | 6 seconds (slow cycling) |
| Direction | Forward (scrollNext) |
| Loop | Continuous (loop: true already set) |
| Pause | On hover/touch |
| Resume | On mouse leave |

### Result
The hero box carousel will smoothly cycle through all 4 features (Smart Carrier Match → TruMove Specialist → Inventory Builder → AI Room Scanner) at a comfortable 6-second pace, pausing when users hover to interact.
