
# AI Inventory Section Improvements

## Overview
Make three improvements to the "Start Your AI Inventory Analysis" section:
1. Move the section up by ~90 pixels
2. Add a prominent "Start AI Analysis" button
3. Put the Live Detection items in a scrollable box with fixed height

---

## Changes

### 1. Move Section Up by 90 Pixels
**File:** `src/index.css` (lines 2115-2121)

Update the margin-top from `-32px` to `-120px` (additional ~90px upward):

```css
.tru-ai-steps-section {
  padding: 24px 24px 48px;
  margin-top: -120px; /* Changed from -32px to -120px */
  background: hsl(var(--background));
  position: relative;
  z-index: 5;
}
```

---

### 2. Add "Start AI Analysis" Button
**File:** `src/pages/Index.tsx` (lines 1459-1462)

Add a primary CTA button after the title and before the LiveScanPreview:

```tsx
<h2 className="tru-ai-steps-title">Start Your AI Inventory Analysis</h2>

{/* NEW: Primary CTA Button */}
<button 
  type="button"
  onClick={() => handleInventoryClick("scan")}
  className="tru-ai-start-btn"
>
  <Scan className="w-5 h-5" />
  Start AI Analysis
  <ArrowRight className="w-4 h-4" />
</button>

{/* Live Scan Preview */}
<LiveScanPreview />
```

**File:** `src/index.css`

Add styling for the new button:

```css
.tru-ai-start-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  font-size: 15px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  margin: 0 auto 24px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px hsl(var(--primary) / 0.3);
}

.tru-ai-start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px hsl(var(--primary) / 0.4);
}
```

---

### 3. Scrollable Live Detection Items Box
**File:** `src/index.css` (lines 2196-2230)

Update `.tru-ai-live-inventory` to have a fixed height and update `.tru-ai-live-items` to scroll:

```css
.tru-ai-live-inventory {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--border));
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 260px; /* Fixed height instead of min-height */
}

.tru-ai-live-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto; /* Enable vertical scrolling */
  padding-right: 4px; /* Space for scrollbar */
}

/* Custom scrollbar for items list */
.tru-ai-live-items::-webkit-scrollbar {
  width: 4px;
}

.tru-ai-live-items::-webkit-scrollbar-track {
  background: hsl(var(--muted) / 0.3);
  border-radius: 4px;
}

.tru-ai-live-items::-webkit-scrollbar-thumb {
  background: hsl(var(--primary) / 0.5);
  border-radius: 4px;
}

.tru-ai-live-items::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary) / 0.7);
}
```

---

## Summary

| Change | File | Description |
|--------|------|-------------|
| Move section up 90px | `src/index.css` | Change margin-top from -32px to -120px |
| Add Start AI Analysis button | `src/pages/Index.tsx` | Primary green CTA with Scan icon |
| Style the new button | `src/index.css` | Premium button with hover effects |
| Fixed-height items container | `src/index.css` | Set height: 260px on inventory box |
| Scrollable items list | `src/index.css` | Add overflow-y: auto with custom scrollbar |

## Visual Result
- The AI Inventory section moves significantly higher on the page
- A prominent green "Start AI Analysis" button draws attention and provides clear action
- The Live Detection box maintains a consistent height while items scroll smoothly inside it
- Custom scrollbar matches the green accent color scheme
