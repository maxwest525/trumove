
# Style Why TruMove Card Headers + Delete Interactive Demo Info

## Overview
Two changes requested:
1. Update the "Why TruMove?" card header and subtitle to match the consistent header styling used elsewhere (like the AI Inventory Analysis section with gradient accents)
2. Remove the "This is an interactive demo" info callout box from the AI Inventory Analysis section

---

## Current State

### Why TruMove Card (lines 1478-1483 in Index.tsx)
```tsx
<h3 className="tru-why-title-premium">
  Why TruMove?
</h3>
<p className="tru-why-subtitle-premium tru-why-subtitle-bold-italic">
  Skip the van line middleman...
</p>
```
- Plain text title, no gradient accent
- Smaller size (22px) compared to section headers (36px)

### Interactive Demo Info (lines 1556-1570 in Index.tsx)
```tsx
<div className="tru-ai-demo-info">
  <div className="tru-ai-demo-info-icon">...</div>
  <div className="tru-ai-demo-info-content">
    <p className="tru-ai-demo-info-title">This is an interactive demo</p>
    <p className="tru-ai-demo-info-text">Experience how our AI scans...</p>
  </div>
</div>
```
- This entire block will be removed

---

## Changes Required

### File: `src/pages/Index.tsx`

#### 1. Update Why TruMove Card Header (lines 1478-1483)

**Before:**
```tsx
<h3 className="tru-why-title-premium">
  Why TruMove?
</h3>
<p className="tru-why-subtitle-premium tru-why-subtitle-bold-italic">
  Skip the van line middleman. Get matched with vetted carriers who compete for your business.
</p>
```

**After:**
```tsx
<h3 className="tru-ai-steps-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
  Why <span className="tru-ai-gradient-text">TruMove</span>?
</h3>
<div className="tru-ai-accent-line" style={{ marginBottom: '12px' }} />
<p className="tru-ai-steps-subtitle" style={{ maxWidth: 'none' }}>
  Skip the van line middleman. Get matched with vetted carriers who compete for your business.
</p>
```

This applies:
- Same gradient text effect on "TruMove" (using existing `tru-ai-gradient-text` class)
- Same accent line divider (using existing `tru-ai-accent-line` class)
- Same title and subtitle classes for consistent typography
- Inline style overrides for appropriate sizing within the card context

#### 2. Delete Interactive Demo Info Box (lines 1556-1570)

**Remove this entire block:**
```tsx
{/* Demo Info Callout */}
<div className="tru-ai-demo-info">
  <div className="tru-ai-demo-info-icon">
    <Info className="w-5 h-5" />
  </div>
  <div className="tru-ai-demo-info-content">
    <p className="tru-ai-demo-info-title">
      This is an interactive demo
    </p>
    <p className="tru-ai-demo-info-text">
      Experience how our AI scans a room and automatically detects furniture, boxes, and appliances. 
      The demo uses sample imagery — when you're ready, you can scan your own home.
    </p>
  </div>
</div>
```

---

## Visual Result

| Element | Before | After |
|---------|--------|-------|
| Why TruMove title | Plain "Why TruMove?" | "Why **TruMove**?" with green gradient on "TruMove" |
| Why TruMove subtitle | Bold italic, custom class | Matches AI section subtitle styling |
| Accent line | None | Green gradient line under title |
| Demo info box | Visible teal/green callout | Removed entirely |

---

## Summary

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Lines 1478-1483: Update Why TruMove header to use gradient styling |
| `src/pages/Index.tsx` | Lines 1556-1570: Delete the interactive demo info callout |
