

# Update Scanner Preview: Remove Overlay Pre-Demo and Update Badge Text

## Overview
Make two key changes to the scanner preview:
1. Only show the scanning overlay and animation line when the demo is actively running
2. Update the bottom-left pill to show "Ready to Scan" initially, then "Pause Scan" once scanning starts

---

## Current State

| Element | Current Behavior |
|---------|-----------------|
| Scanner overlay + line | Always visible with animation |
| Bottom-left badge | Always shows "Scanning..." |

---

## Changes Required

### 1. Conditionally Render Scanner Overlay
**File: `src/pages/Index.tsx` (Lines 298-318)**

Only show the overlay and scanning line when `isRunning` is true:

```tsx
// Before
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
        {isRunning ? "Running..." : "Start AI Analysis Demo"}
      </button>
    </div>
  );
}

// After
function ScannerPreview({ isRunning, onStartDemo }: ScannerPreviewProps) {
  return (
    <div className="tru-ai-live-scanner">
      <img src={sampleRoomLiving} alt="Room being scanned" />
      {isRunning && (
        <div className="tru-ai-scanner-overlay">
          <div className="tru-ai-scanner-line" />
        </div>
      )}
      <div className="tru-ai-scanner-badge">
        <Scan className="w-4 h-4" />
        <span>{isRunning ? "Pause Scan" : "Ready to Scan"}</span>
      </div>
      {/* Start Demo button as overlay - top right */}
      <button 
        className="tru-ai-scanner-start-btn"
        onClick={onStartDemo}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {isRunning ? "Running..." : "Start AI Analysis Demo"}
      </button>
    </div>
  );
}
```

---

## Technical Summary

| Element | Before | After |
|---------|--------|-------|
| Scanner overlay | Always rendered | Only when `isRunning` is true |
| Scanning line animation | Always visible | Only when `isRunning` is true |
| Badge text (idle) | "Scanning..." | "Ready to Scan" |
| Badge text (running) | "Scanning..." | "Pause Scan" |

---

### Files Modified
- `src/pages/Index.tsx` - Conditional overlay rendering and dynamic badge text

