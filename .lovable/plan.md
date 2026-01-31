

# Plan: Add Video Call Section Header & Screen Share Animation

## Overview
Implement three enhancements to the Video Consult page (/book):
1. Add an explanation header above the video window styled like the "Build Your Move" section
2. Title: "Virtual Video Call" with gradient accent
3. Add subtle fade/scale animation when opening/closing the screen share preview modal

---

## Changes

### 1. Add Section Header Above Video Window

**File: `src/pages/Book.tsx`** (around line 1072, before the grid)

Add a centered header matching the "Build Your Move" styling from OnlineEstimate.tsx:

```tsx
// BEFORE (line 1072):
{/* Two-Column Grid: Video + Chat Panel */}
<div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6 mb-8">

// AFTER:
{/* Section Header - matches Build Your Move styling */}
<div className="text-center mb-8">
  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
    Virtual Video <span className="tru-qb-title-accent">Call</span>
  </h2>
  <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
    Connect face-to-face with our moving specialists for a personalized consultation. 
    Share your screen to walk through your inventory together in real-time.
  </p>
</div>

{/* Two-Column Grid: Video + Chat Panel */}
<div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6 mb-8">
```

This uses the same structure as OnlineEstimate.tsx lines 305-312:
- `text-3xl md:text-4xl font-black tracking-tight` for the title
- `tru-qb-title-accent` class for the green gradient on "Call"
- `text-sm text-muted-foreground` for the subtitle

---

### 2. Add Screen Share Modal Animation

**File: `src/pages/Book.tsx`** (line 1090-1093)

Update the screen share overlay to use animation classes:

```tsx
// BEFORE:
{showScreenSharePreview && isScreenSharing && (
  <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center">
    <ScreenSharePreviewModal onClose={() => setShowScreenSharePreview(false)} />
  </div>
)}

// AFTER:
{showScreenSharePreview && isScreenSharing && (
  <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center animate-fade-in">
    <div className="animate-scale-in">
      <ScreenSharePreviewModal onClose={() => setShowScreenSharePreview(false)} />
    </div>
  </div>
)}
```

This uses existing animation classes from tailwind.config.ts:
- `animate-fade-in` on the overlay for smooth opacity transition
- `animate-scale-in` on the modal for a subtle zoom-in effect

---

### 3. Add CSS for Video Consult Section Header (if needed)

**File: `src/index.css`**

Add specific styling for the video consult header to ensure dark mode compatibility:

```css
/* Video Consult Section Header */
.video-consult-section-header {
  text-align: center;
  margin-bottom: 2rem;
}

.video-consult-section-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: hsl(var(--foreground));
  margin-bottom: 0.5rem;
}

.dark .video-consult-section-header h2 {
  color: hsl(0 0% 100%);
}

.video-consult-section-header p {
  font-size: 0.875rem;
  color: hsl(var(--muted-foreground));
  max-width: 32rem;
  margin: 0 auto;
}
```

---

## Visual Result

```
┌────────────────────────────────────────────────────────────────┐
│                                                                │
│              Virtual Video Call                                │
│                      ~~~~  (gradient green on "Call")          │
│                                                                │
│   Connect face-to-face with our moving specialists for a      │
│   personalized consultation. Share your screen to walk        │
│   through your inventory together in real-time.               │
│                                                                │
├─────────────────────────────────┬──────────────────────────────┤
│                                 │                              │
│        Video Window             │       Chat Panel             │
│        (560px)                  │       (560px)                │
│                                 │                              │
└─────────────────────────────────┴──────────────────────────────┘
```

---

## Summary of Changes

| Location | Change |
|----------|--------|
| Book.tsx line 1072 | Add section header with title "Virtual Video Call" + subtitle |
| Book.tsx lines 1090-1093 | Wrap screen share overlay with `animate-fade-in` and modal with `animate-scale-in` |
| index.css (optional) | Add `.video-consult-section-header` styles for dark mode consistency |

---

## Files to Modify

- `src/pages/Book.tsx` - Add header section, add animation classes to screen share modal
- `src/index.css` - Add section header styles (optional, can use existing Tailwind classes)

