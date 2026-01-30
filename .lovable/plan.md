

# Auto-Minimize Trudy Pill on Scroll

## Overview
Modify the FloatingTruckChat component to automatically minimize when the user scrolls, while keeping the full expanded pill visible on initial page load (before any scroll).

---

## Current Behavior
- Pill starts expanded (unless localStorage says minimized)
- User must manually click the minimize button to collapse it
- Minimized state persists via localStorage

## New Behavior
- Pill starts expanded on page load
- When user scrolls down, automatically minimize to compact truck + hide button
- User can click to re-expand (returns to full pill)
- Scroll-triggered minimization is temporary (not persisted to localStorage)
- Manual minimize button still persists to localStorage as before

---

## Changes Required

### File: `src/components/FloatingTruckChat.tsx`

**Add scroll detection logic:**

```tsx
import { useState, useEffect } from 'react';

// New state to track scroll-based minimization (separate from manual)
const [isScrollMinimized, setIsScrollMinimized] = useState(false);

// Combined minimized state
const isCurrentlyMinimized = isMinimized || isScrollMinimized;

// Scroll listener effect
useEffect(() => {
  let lastScrollY = window.scrollY;
  
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    // Minimize when scrolling down past 100px threshold
    if (currentScrollY > 100 && !isScrollMinimized) {
      setIsScrollMinimized(true);
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, [isScrollMinimized]);
```

**Update handleReopen to clear scroll minimization:**

```tsx
const handleReopen = () => {
  setIsMinimized(false);
  setIsScrollMinimized(false); // Also clear scroll-triggered state
  localStorage.removeItem('tm_ai_helper_minimized');
};
```

**Update conditional rendering:**

```tsx
// Change from: if (isMinimized)
// To: if (isCurrentlyMinimized)
if (isCurrentlyMinimized) {
  return (
    // ... minimized compact view
  );
}
```

---

## Compact Minimized Design

The minimized state shows:
- Truck icon (clickable to expand/open chat)
- Hide/minimize button

Current minimized view already has this structure - just ensure it's clear and functional.

---

## Summary

| File | Change |
|------|--------|
| `src/components/FloatingTruckChat.tsx` | Add `useEffect` for scroll detection |
| `src/components/FloatingTruckChat.tsx` | Add `isScrollMinimized` state |
| `src/components/FloatingTruckChat.tsx` | Use combined minimized state for rendering |
| `src/components/FloatingTruckChat.tsx` | Update `handleReopen` to clear both states |

The pill will now auto-collapse on scroll for a cleaner browsing experience, while remaining expandable when the user wants to interact with Trudy.

