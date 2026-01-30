

# Fix Feature Carousel Hover Clipping + Add Trudy AI Card

## Issues Identified

### Issue 1: Hover Clipping
The `CarouselContent` component in `src/components/ui/carousel.tsx` has a **hardcoded wrapper div** with `overflow-hidden`:

```tsx
// Line 139 - this clips all hover expansion
<div ref={carouselRef} className="overflow-hidden">
```

CSS `!important` rules cannot override this because the wrapper is a separate div. The component must be modified.

### Issue 2: Missing Trudy AI Card
Need a 7th feature carousel item for "Trudy AI Assistant" that opens the chat modal instead of navigating to a route.

---

## Solution

### Step 1: Update Carousel Component to Support Overflow Prop

**File: `src/components/ui/carousel.tsx`**

Add an optional `allowOverflow` prop to `CarouselContent` that conditionally removes `overflow-hidden`:

```tsx
// Update CarouselContent (lines 134-148)
const CarouselContent = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement> & { allowOverflow?: boolean }
>(
  ({ className, allowOverflow = false, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div ref={carouselRef} className={allowOverflow ? "" : "overflow-hidden"}>
        <div
          ref={ref}
          className={cn("flex", orientation === "vertical" && "-mt-4 flex-col", className)}
          {...props}
        />
      </div>
    );
  },
);
```

### Step 2: Add Trudy AI Card + Handle Special Action

**File: `src/components/FeatureCarousel.tsx`**

1. Add `trudyAvatar` import (already exists in assets)
2. Add 7th feature item with `action: "openChat"` instead of `route`
3. Add `onOpenChat` callback prop
4. Modify click handler to differentiate between navigation and chat open
5. Use `allowOverflow` prop on CarouselContent

```tsx
// Feature type update
type Feature = {
  title: string;
  desc: string;
  image: string;
  route?: string;
  action?: "openChat";
};

// Add 7th item
{
  title: "Trudy AI Assistant",
  desc: "Chat with our AI to get instant answers about your move.",
  image: trudyAvatar,
  action: "openChat",
}

// Props update
interface FeatureCarouselProps {
  onOpenChat?: () => void;
}

// Click handler update
onClick={() => {
  if (feature.action === "openChat") {
    onOpenChat?.();
  } else {
    setSelectedFeature(feature);
  }
}}
```

### Step 3: Wire Up Chat Modal in Index.tsx

**File: `src/pages/Index.tsx`**

1. Import chat modal state management
2. Pass `onOpenChat` callback to FeatureCarousel
3. Trigger the floating chat to open when Trudy card is clicked

```tsx
// In Index.tsx
const [isTrudyChatOpen, setIsTrudyChatOpen] = useState(false);

<FeatureCarousel onOpenChat={() => setIsTrudyChatOpen(true)} />
```

Or alternatively, dispatch a custom event that `FloatingTruckChat` listens for.

---

## File Changes Summary

| File | Changes |
|------|---------|
| `src/components/ui/carousel.tsx` | Add `allowOverflow` prop to `CarouselContent` |
| `src/components/FeatureCarousel.tsx` | Use `allowOverflow`, add Trudy card, add `onOpenChat` prop |
| `src/pages/Index.tsx` | Pass `onOpenChat` handler to trigger chat modal |
| `src/components/FloatingTruckChat.tsx` | Expose method or listen for event to open chat programmatically |

---

## Technical Details

### Carousel Overflow Fix
The key issue is that Embla carousel requires `overflow-hidden` on the scroll container for proper drag behavior. However, we can use CSS negative margins + padding trick to allow visual overflow while maintaining scroll bounds:

```css
/* Alternative approach if allowOverflow causes drag issues */
.features-carousel-content {
  overflow: visible !important;
  margin: -40px;
  padding: 40px;
}
```

### Chat Modal Trigger Options

**Option A: Props callback (simpler)**
Pass a callback from parent that sets chat modal state

**Option B: Custom event (decoupled)**
```tsx
// In FeatureCarousel
window.dispatchEvent(new CustomEvent('openTrudyChat'));

// In FloatingTruckChat
useEffect(() => {
  const handleOpen = () => setIsOpen(true);
  window.addEventListener('openTrudyChat', handleOpen);
  return () => window.removeEventListener('openTrudyChat', handleOpen);
}, []);
```

I recommend **Option B** (custom event) since FloatingTruckChat is already a global component in App.tsx and this avoids prop drilling through Index.tsx.

