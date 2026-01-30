

# AI Inventory Analysis Section Redesign

## Summary of Changes

The user wants to:
1. Reduce the overall height of the section
2. Move "Live Detection" panel to the right of the room scan image (side-by-side instead of stacked)
3. Move the "Demo AI Analysis" button as a small pill overlay on the room image
4. Remove the "Build Inventory Manually" and "Prefer to talk? Book Video Consult" buttons

---

## Current Layout

```text
┌─────────────────────────────────────────────────────────────────┐
│  AI Inventory Analysis (Title)                                  │
│  ───────────────── (Accent Line)                                │
│  "Take a video or pictures..." (Subtitle)                       │
│                                                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐│
│  │ 1. Video or Photos   │  │ ┌────────────────────────────┐  ││
│  │ 2. AI Detection      │  │ │  Room Scan Image           │  ││
│  │ 3. Agent Confirmation│  │ │  (with scanner overlay)    │  ││
│  │                      │  │ └────────────────────────────┘  ││
│  │ [Demo AI Analysis]   │  │ ┌────────────────────────────┐  ││
│  │                      │  │ │  Live Detection List       │  ││
│  └──────────────────────┘  │ │  (items, totals)           │  ││
│                            │ └────────────────────────────┘  ││
│                            └──────────────────────────────────┘│
│                                                                 │
│  [Build Inventory Manually]  [Prefer to talk? Book Video Consult]│
└─────────────────────────────────────────────────────────────────┘
```

## New Layout

```text
┌─────────────────────────────────────────────────────────────────┐
│  AI Inventory Analysis (Title)                                  │
│  ───────────────── (Accent Line)                                │
│  "Take a video or pictures..." (Subtitle)                       │
│                                                                 │
│  ┌──────────────────────┐  ┌────────────────┬──────────────────┐│
│  │ 1. Video or Photos   │  │  Room Image    │ Live Detection   ││
│  │ 2. AI Detection      │  │  ┌───────────┐ │ ┌──────────────┐ ││
│  │ 3. Agent Confirmation│  │  │           │ │ │ Item 1       │ ││
│  │                      │  │  │  [Demo]   │ │ │ Item 2       │ ││
│  │                      │  │  │  (pill)   │ │ │ Item 3       │ ││
│  │                      │  │  │           │ │ │ Totals       │ ││
│  └──────────────────────┘  │  └───────────┘ │ └──────────────┘ ││
│                            └────────────────┴──────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Details

### File: `src/pages/Index.tsx`

**Change 1: Restructure the two-column layout (Lines 1581-1605)**

Move the `LiveScanPreview` component structure so scanner and detection are side-by-side. Remove the button from the left column and add a small pill overlay to the image inside the preview. Remove the inventory action buttons entirely.

```tsx
{/* Right column: Demo preview - horizontal layout */}
<div className="tru-ai-right-column">
  <div className="tru-ai-preview-horizontal">
    {/* Room scan with overlay pill */}
    <div className="tru-ai-scan-container">
      <div className="tru-ai-live-scanner">
        <img src={sampleRoomLiving} alt="Room being scanned" />
        <div className="tru-ai-scanner-overlay">
          <div className="tru-ai-scanner-line" />
        </div>
        <div className="tru-ai-scanner-badge">
          <Scan className="w-4 h-4" />
          <span>Scanning...</span>
        </div>
        {/* Demo pill overlay */}
        <button 
          onClick={() => setScanDemoRunning(true)}
          className="tru-ai-demo-pill"
        >
          <Sparkles className="w-3 h-3" />
          Demo
        </button>
      </div>
    </div>
    {/* Live detection list */}
    <div className="tru-ai-live-inventory">
      ...
    </div>
  </div>
</div>
```

**Change 2: Remove inventory action buttons (Lines 1587-1605)**

Delete the entire `.tru-inventory-actions` div containing "Build Inventory Manually" and "Prefer to talk? Book Video Consult" buttons.

**Change 3: Remove the "Demo AI Analysis" button from left column (Lines 1564-1578)**

The button moves to become a pill overlay on the image.

---

### File: `src/index.css`

**Change 1: Reduce section padding (Lines 2268-2274)**

```css
.tru-ai-steps-section {
  padding: 20px 24px 32px;  /* Was: 24px 24px 48px */
  margin-top: 0;
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
}
```

**Change 2: Make preview horizontal instead of vertical (Lines 2609-2614)**

```css
/* Horizontal layout for scanner + detection */
.tru-ai-right-column .tru-ai-preview-live,
.tru-ai-preview-horizontal {
  display: grid;
  grid-template-columns: 1fr 1fr;  /* Side by side */
  gap: 16px;
  max-width: none;
  margin: 0;
}
```

**Change 3: Add demo pill overlay style (New CSS)**

```css
/* Demo pill overlay on room image */
.tru-ai-demo-pill {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: hsl(var(--foreground));
  color: hsl(var(--background));
  font-size: 11px;
  font-weight: 700;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px hsl(var(--tm-ink) / 0.3);
  transition: all 0.2s ease;
}

.tru-ai-demo-pill:hover {
  background: hsl(var(--primary));
  color: hsl(var(--foreground));
  transform: scale(1.05);
}
```

**Change 4: Reduce inventory list height (Lines 2440-2448)**

```css
.tru-ai-live-inventory {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 12px;  /* Was 16px */
  display: flex;
  flex-direction: column;
  height: 200px;  /* Was 260px */
}
```

**Change 5: Remove .tru-inventory-actions styles (Lines 2686-2718)**

Can keep for backwards compatibility or remove entirely since buttons are deleted.

---

## Technical Summary

| Change | Location | Description |
|--------|----------|-------------|
| Remove left column button | Index.tsx L1564-1578 | Delete "Demo AI Analysis" button from left column |
| Add demo pill overlay | Index.tsx (new) | Small pill button on room image |
| Remove action buttons | Index.tsx L1587-1605 | Delete Build Inventory + Video Consult buttons |
| Horizontal layout | index.css L2609-2614 | Change from stacked to side-by-side |
| Demo pill styling | index.css (new) | Small dark pill with hover effects |
| Reduce section padding | index.css L2268 | Decrease vertical spacing |
| Reduce list height | index.css L2447 | Shorter Live Detection panel |

---

## Expected Result

- AI Inventory Analysis section is more compact vertically
- Room scan image and Live Detection panel are side-by-side horizontally
- Small "Demo" pill button overlays the top-right of the room image
- No more "Build Inventory Manually" or "Prefer to talk?" buttons cluttering the section
- Cleaner, more focused user experience

