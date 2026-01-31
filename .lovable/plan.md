

# Fix Detection Box Height to Match Scanner Preview

## Overview
Prevent the Live Detection box from elongating when the scanner demo runs by setting a fixed height that matches the scanner preview (340px), rather than using flex-grow behavior.

---

## Current State

| Property | Current Value | Issue |
|----------|---------------|-------|
| `.tru-ai-live-inventory` base height | 275px | Outdated - doesn't match new scanner height |
| `.tru-ai-preview-vertical .tru-ai-live-inventory` | height: 100%, flex: 1 | Causes elongation |
| `.tru-ai-right-column .tru-ai-live-inventory` | height: 100%, flex: 1 | Causes elongation |

---

## Changes Required

### 1. Update Base Detection Box Height
**File: `src/index.css` (Lines 2448-2457)**

Update the base height from 275px to 340px to match the scanner:

```css
/* Before */
.tru-ai-live-inventory {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 275px;
}

/* After */
.tru-ai-live-inventory {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 340px;
}
```

### 2. Fix Vertical Layout Override
**File: `src/index.css` (Lines 2651-2655)**

Change from flex-grow to fixed height:

```css
/* Before */
.tru-ai-preview-vertical .tru-ai-live-inventory {
  height: 100%;
  flex: 1;
  max-height: none;
}

/* After */
.tru-ai-preview-vertical .tru-ai-live-inventory {
  height: 340px;
  flex: none;
  max-height: 340px;
}
```

### 3. Fix Right Column Override
**File: `src/index.css` (Lines 2745-2749)**

Change from flex-grow to fixed height:

```css
/* Before */
.tru-ai-right-column .tru-ai-live-inventory {
  height: 100%;
  flex: 1;
  min-height: 0;
}

/* After */
.tru-ai-right-column .tru-ai-live-inventory {
  height: 340px;
  flex: none;
  min-height: 0;
}
```

---

## Technical Summary

| Element | Before | After |
|---------|--------|-------|
| Base inventory height | 275px | 340px |
| Vertical layout flex | flex: 1 (grow) | flex: none (fixed) |
| Right column flex | flex: 1 (grow) | flex: none (fixed) |
| Height behavior | Dynamic (elongates) | Fixed at 340px |

Both boxes will now maintain equal 340px heights regardless of content, with internal scrolling for overflow items.

---

### Files Modified
- `src/index.css` - Fix detection box height to match scanner dimensions

