

# AI Inventory Analysis - Maximize Content at 450px Height

## Summary

Restructure the AI Inventory Analysis section to:
1. Increase section height from 400px to **450px**
2. Remove the subtitle text "Take a video or pictures of your room and let us do the rest"
3. Move the "Start Demo AI Analysis" button to the **top-right corner of the scanner preview** as an overlay
4. Maximize the scanner and detection card sizes with **matching dimensions**
5. Adjust content distribution to fill the available space

---

## Target Layout

```text
┌─────────────────────────────────────────────────────────────┐
│              AI Inventory Analysis                          │
│              ───────────────                                │
├───────────────┬─────────────────────────┬───────────────────┤
│               │  ┌─────────────────────┐│                   │
│  [img] 1 Step │  │ [Start Demo...] btn ││   LIVE DETECTION  │
│               │  │                     ││   ─────────────   │
│  [img] 2 Step │  │   Room Scanner      ││   - Item 1        │
│               │  │   Preview           ││   - Item 2        │
│  [img] 3 Step │  │   (Demo pill)       ││   - Item 3        │
│               │  │                     ││                   │
│   Vertical    │  └─────────────────────┘│   Items/Wt/Vol    │
└───────────────┴─────────────────────────┴───────────────────┘
                    ↑ Matching height ↑
```

---

## Implementation

### File: `src/index.css`

**1. Increase section height to 450px (Line 2258)**

Change:
```css
height: 400px;
```
To:
```css
height: 450px;
```

**2. Update scanner height to fill available space (Line 2621-2623)**

Change the scanner to use the full column height:
```css
.tru-ai-preview-vertical .tru-ai-live-scanner {
  height: 100%;
  flex: 1;
}
```

**3. Update detection list to match scanner height (Lines 2625-2628)**

Change detection list to fill height and match scanner:
```css
.tru-ai-preview-vertical .tru-ai-live-inventory {
  height: 100%;
  flex: 1;
  max-height: none;
}
```

**4. Ensure center and right columns stretch to fill height (Lines 2587-2598)**

Update columns to fill available vertical space:
```css
.tru-ai-center-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.tru-ai-right-column {
  display: flex;
  flex-direction: column;
  min-width: 240px;
  height: 100%;
}
```

**5. Make three-column grid fill the remaining height (Line 2268-2271)**

Update:
```css
.tru-ai-two-column {
  flex: 1;
  min-height: 0;
  align-items: stretch;
}
```

**6. Create new button overlay class for scanner**

Add after the demo-pill styles:
```css
.tru-ai-scanner-start-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: hsl(var(--foreground));
  color: hsl(var(--background));
  font-size: 12px;
  font-weight: 700;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  z-index: 15;
  box-shadow: 0 4px 16px hsl(var(--tm-ink) / 0.4);
  transition: all 0.2s ease;
}

.tru-ai-scanner-start-btn:hover {
  background: hsl(var(--primary));
  transform: scale(1.05);
  box-shadow: 0 6px 20px hsl(var(--primary) / 0.5);
}
```

**7. Remove or hide the demo pill when button is present**

Since the button will be in the top-right, we can move the demo pill to bottom-right or remove it to avoid overlap.

---

### File: `src/pages/Index.tsx`

**8. Remove the subtitle paragraph (Line 1535)**

Delete:
```tsx
<p className="tru-ai-steps-subtitle">Take a video or pictures of your room and let us do the rest</p>
```

**9. Remove the centered demo button div (Lines 1537-1551)**

Delete the entire `<div className="flex justify-center">` block containing the button.

**10. Move button inside ScannerPreview component (Lines 297-315)**

Update ScannerPreview to include the button as an overlay:
```tsx
interface ScannerPreviewProps {
  isRunning: boolean;
  onStartDemo: () => void;
}

function ScannerPreview({ isRunning, onStartDemo }: ScannerPreviewProps) {
  return (
    <div className="tru-ai-live-scanner">
      <img src={sampleRoomLiving} alt="Room being scanned" />
      <div className="tru-ai-scanner-overlay">
        <div className="tru-ai-scanner-line" />
      </div>
      <div className="tru-ai-scanner-badge">
        <Scan className="w-4 h-4" />
        <span>Scanning...</span>
      </div>
      {/* Start Demo button as overlay - top right */}
      <button 
        className="tru-ai-scanner-start-btn"
        onClick={onStartDemo}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {isRunning ? "Running..." : "Start Demo"}
      </button>
    </div>
  );
}
```

**11. Update ScannerPreview usage (Line 1593)**

Pass the click handler:
```tsx
<ScannerPreview 
  isRunning={scanDemoRunning} 
  onStartDemo={() => {
    setScanDemoRunning(true);
    setTimeout(() => {
      scanPreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }} 
/>
```

---

## CSS Classes to Delete (Cleanup)

- `.tru-ai-steps-subtitle` (Lines 2274-2285) - no longer used
- `.tru-ai-demo-button-centered` (Lines 2631-2652) - replaced by overlay button
- `.tru-ai-demo-pill` styles can remain for the "Demo" indicator on scanner

---

## Summary Table

| Element | Before | After |
|---------|--------|-------|
| Section height | 400px | 450px |
| Subtitle text | Present | Removed |
| Demo button location | Centered above grid | Top-right overlay on scanner |
| Scanner height | 220px fixed | Flex to fill column |
| Detection list height | max-height: 220px | Flex to fill column (matching scanner) |
| Demo pill | Top-right of scanner | Remove (replaced by button) |

