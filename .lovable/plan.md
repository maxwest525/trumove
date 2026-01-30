
# Make Move Profile Section Dismissable

## Current State

The "Building your personalized move profile" section (`MoveSummaryModal` component) already has:
- A close button (X) in the top right corner with proper styling
- State management via `showMoveSummary` / `setShowMoveSummary`
- The `onClose` prop is already being passed and connected

However, the close button may not be visible or functioning correctly, and there's no click-outside-to-dismiss functionality.

## Solution

Add **click-outside detection** so users can dismiss the modal by clicking anywhere outside of it. This requires wrapping the modal content and detecting clicks on a transparent backdrop area.

---

## Implementation

### File: `src/pages/Index.tsx`

**Change 1: Add useRef for click-outside detection** (around line 530)

Add a ref to track the modal container:
```tsx
const moveSummaryRef = useRef<HTMLDivElement>(null);
```

**Change 2: Add click-outside handler** (around line 540)

Add an effect that listens for clicks outside the modal:
```tsx
// Handle click outside to dismiss move summary
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      showMoveSummary && 
      moveSummaryRef.current && 
      !moveSummaryRef.current.contains(event.target as Node)
    ) {
      setShowMoveSummary(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [showMoveSummary]);
```

**Change 3: Update MoveSummaryModal to accept ref** (around line 162)

Modify the component to forward the ref:
```tsx
const MoveSummaryModal = React.forwardRef<HTMLDivElement, MoveSummaryModalProps>(({ 
  fromCity, 
  toCity, 
  ...
}, ref) => {
  // ...
  return (
    <div className="tru-move-summary-modal" ref={ref}>
      {/* existing content */}
    </div>
  );
});
```

**Change 4: Pass ref when rendering** (around line 1453)

```tsx
<MoveSummaryModal 
  ref={moveSummaryRef}
  fromCity={fromCity}
  toCity={toCity}
  distance={distance}
  fromCoords={fromCoords}
  toCoords={toCoords}
  onClose={() => setShowMoveSummary(false)}
/>
```

---

## Summary of Changes

| File | Location | Change |
|------|----------|--------|
| `src/pages/Index.tsx` | Line ~530 | Add `moveSummaryRef` using `useRef` |
| `src/pages/Index.tsx` | Line ~540 | Add `useEffect` for click-outside detection |
| `src/pages/Index.tsx` | Lines 162-171 | Convert `MoveSummaryModal` to use `forwardRef` |
| `src/pages/Index.tsx` | Line ~1453 | Pass `ref={moveSummaryRef}` to component |

---

## Expected Result

- **X button** in top right dismisses the modal (already working)
- **Click anywhere outside** the modal dismisses it (new functionality)
- Modal reappears when user enters new location data (existing behavior preserved)
