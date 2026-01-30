

# Reorganize AI Inventory Analysis Section - Compact Two-Column Layout

## Current Layout (Vertical Stack)
```text
┌─────────────────────────────────────────────────────┐
│           AI Inventory Analysis (title)             │
│              ─────────────────────                  │
│           Take a video or pictures...              │
│            [Demo AI Analysis Button]                │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │   Room Scanner   │  │    Live Inventory List   │ │
│  │   (image + scan) │  │    (items appearing)     │ │
│  └──────────────────┘  └──────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│   ①────────────  ②────────────  ③────────────      │
│   Video/Photos   AI Detection   Agent Confirm      │
├─────────────────────────────────────────────────────┤
│   [Build Inventory]    [Book Video Consult]         │
└─────────────────────────────────────────────────────┘
```

## New Layout (Side-by-Side)
```text
┌─────────────────────────────────────────────────────┐
│           AI Inventory Analysis (title)             │
│              ─────────────────────                  │
│           Take a video or pictures...              │
├───────────────────────────┬─────────────────────────┤
│                           │  ┌───────────────────┐  │
│  ① Video or Photos        │  │  Room Scanner     │  │
│     Walk through rooms... │  │  (image + scan)   │  │
│                           │  └───────────────────┘  │
│  ② AI Detection           │  ┌───────────────────┐  │
│     Computer vision...    │  │  Live Inventory   │  │
│                           │  │  (items list)     │  │
│  ③ Agent Confirmation     │  └───────────────────┘  │
│     A live specialist...  │                         │
│                           │                         │
│  [Demo AI Analysis]       │                         │
├───────────────────────────┴─────────────────────────┤
│   [Build Inventory]    [Book Video Consult]         │
└─────────────────────────────────────────────────────┘
```

This keeps all elements at the same size but rearranges them into a more compact horizontal structure.

---

## Implementation

### File: `src/pages/Index.tsx`

**Lines 1517-1595: Restructure the AI Steps section**

Move the button after the steps, wrap steps + button in a left column, and put LiveScanPreview in a right column:

```tsx
{/* START YOUR AI INVENTORY ANALYSIS - Enhanced with Preview */}
<section className="tru-ai-steps-section">
  <div className="tru-ai-steps-inner">
    {/* Gradient Header */}
    <h2 className="tru-ai-steps-title">
      <span className="tru-ai-gradient-text">AI</span> Inventory Analysis
    </h2>

    {/* Accent Line */}
    <div className="tru-ai-accent-line" />

    <p className="tru-ai-steps-subtitle">Take a video or pictures of your room and let us do the rest</p>
    
    {/* Two-column layout: Steps on left, Demo on right */}
    <div className="tru-ai-two-column">
      {/* Left column: Vertical steps + button */}
      <div className="tru-ai-left-column">
        <div className="tru-ai-steps-vertical">
          <div className="tru-ai-step">
            <div className="tru-ai-step-number">1</div>
            <div className="tru-ai-step-content">
              <h3 className="tru-ai-step-title">Video or Photos</h3>
              <p className="tru-ai-step-desc">Walk through rooms with your camera or upload photos.</p>
            </div>
          </div>
          <div className="tru-ai-step">
            <div className="tru-ai-step-number">2</div>
            <div className="tru-ai-step-content">
              <h3 className="tru-ai-step-title">AI Detection</h3>
              <p className="tru-ai-step-desc">Computer vision identifies items and estimates weight/volume.</p>
            </div>
          </div>
          <div className="tru-ai-step">
            <div className="tru-ai-step-number">3</div>
            <div className="tru-ai-step-content">
              <h3 className="tru-ai-step-title">Agent Confirmation</h3>
              <p className="tru-ai-step-desc">A live specialist reviews to ensure accuracy.</p>
            </div>
          </div>
        </div>
        
        {/* Primary CTA Button */}
        <button 
          type="button"
          onClick={() => {
            setScanDemoRunning(true);
            setTimeout(() => {
              scanPreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
          }}
          className="tru-ai-start-btn tru-ai-start-btn-left"
        >
          <Scan className="w-5 h-5" />
          {scanDemoRunning ? "Scanning..." : "Demo AI Analysis"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Right column: Demo preview */}
      <div className="tru-ai-right-column">
        <LiveScanPreview isRunning={scanDemoRunning} containerRef={scanPreviewRef} />
      </div>
    </div>
    
    {/* Inventory Action Buttons */}
    <div className="tru-inventory-actions">
      <button 
        type="button" 
        className="tru-inventory-action-btn"
        onClick={() => navigate("/online-estimate")}
      >
        <Boxes className="w-5 h-5" />
        <span>Build Inventory Manually</span>
      </button>
      <button 
        type="button" 
        className="tru-inventory-action-btn"
        onClick={() => navigate("/book")}
      >
        <Video className="w-5 h-5" />
        <span>Prefer to talk? Book Video Consult</span>
      </button>
    </div>
  </div>
</section>
```

---

### File: `src/index.css`

**Add new CSS for the two-column layout (~after line 2562)**

```css
/* Two-column layout for AI section */
.tru-ai-two-column {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 32px;
  align-items: start;
  margin-bottom: 32px;
  text-align: left;
}

.tru-ai-left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tru-ai-right-column {
  display: flex;
  flex-direction: column;
}

/* Vertical steps layout */
.tru-ai-steps-vertical {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Override for left-aligned button */
.tru-ai-start-btn.tru-ai-start-btn-left {
  margin: 0;
  align-self: flex-start;
}

/* Responsive: Stack on mobile */
@media (max-width: 768px) {
  .tru-ai-two-column {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .tru-ai-start-btn.tru-ai-start-btn-left {
    align-self: center;
  }
}
```

**Update LiveScanPreview container to be single-column when inside right column**

```css
/* When inside the two-column layout, stack scanner and inventory vertically */
.tru-ai-right-column .tru-ai-preview-live {
  grid-template-columns: 1fr;
  max-width: none;
  margin: 0;
  gap: 16px;
}

.tru-ai-right-column .tru-ai-live-inventory {
  height: auto;
  min-height: 200px;
}
```

---

## Technical Summary

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Restructure AI section into 2-column grid: left (vertical steps + button), right (demo viewer) |
| `src/index.css` | Add `.tru-ai-two-column`, `.tru-ai-left-column`, `.tru-ai-right-column`, `.tru-ai-steps-vertical` styles |
| `src/index.css` | Add responsive breakpoint to stack columns on mobile |
| `src/index.css` | Override LiveScanPreview to stack vertically when in right column |

---

## Expected Result

- Section becomes more vertically compact
- Steps 1, 2, 3 stack vertically on the left side
- Demo viewer (scanner + inventory) displays on the right side
- All elements maintain their current size (no shrinking)
- "Demo AI Analysis" button moves below the steps on the left
- Action buttons remain at the bottom, centered
- Mobile: Gracefully stacks into single column

