

# Slow Down AI Room Analysis and Allow Item Deletion Without Gating

## Overview
Make the AI room scanning experience more interactive by slowing down the item detection speed and allowing users to delete items immediately without needing to unlock via lead capture.

---

## Current Behavior

| Issue | Current State |
|-------|---------------|
| Scanning too fast | Items appear every 1200ms (1.2 seconds) |
| Editing locked | Delete/quantity controls are disabled until user submits lead form |
| Lead capture required | Modal appears after scan asking for name/email/phone to "unlock" |
| Poor demo experience | Users can't interact with their inventory in the demo |

---

## Target Behavior

| Change | New Behavior |
|--------|--------------|
| Slower scanning | Items appear every 2500-3000ms (2.5-3 seconds) |
| Immediate editing | Users can delete items right away |
| No lead gating for demo | Remove the locked state and lead capture modal |
| Better demo experience | Full interactive inventory management |

---

## Changes Required

### File: `src/pages/ScanRoom.tsx`

#### 1. Slow Down the Scanning Speed (line 88)
Change the timeout from 1200ms to 2500ms:

```tsx
// Before
const timer = setTimeout(() => {
  setDetectedItems(prev => [...prev, DEMO_ITEMS[prev.length]]);
}, 1200);

// After
const timer = setTimeout(() => {
  setDetectedItems(prev => [...prev, DEMO_ITEMS[prev.length]]);
}, 2500);
```

#### 2. Set `isUnlocked` to `true` by Default (line 67)
Change the initial state so editing is always available:

```tsx
// Before
const [isUnlocked, setIsUnlocked] = useState(false);

// After  
const [isUnlocked, setIsUnlocked] = useState(true);
```

#### 3. Remove Lead Capture Trigger After Scan (lines 91-97)
Remove the automatic lead capture modal trigger:

```tsx
// Before
} else if (detectedItems.length >= DEMO_ITEMS.length && isScanning) {
  setIsScanning(false);
  // Show lead capture when scan completes
  if (!isUnlocked) {
    setShowLeadCapture(true);
  }
}

// After
} else if (detectedItems.length >= DEMO_ITEMS.length && isScanning) {
  setIsScanning(false);
}
```

#### 4. Remove Lead Capture Modal UI (lines 582-645)
Delete the entire lead capture overlay component as it's no longer needed.

#### 5. Remove "Unlock to Edit" Button (lines 651-659)
Remove the unlock button from the table header since everything is already unlocked.

#### 6. Remove Lock Icons from Migrate Button (lines 804-806)
Simplify the button since lock state no longer applies.

#### 7. Clean Up Unused State and Functions
Remove:
- `leadForm` state (lines 68-72)
- `showLeadCapture` state (line 73)
- `handleLeadSubmit` function (lines 100-110)
- Lock icon from Migrate button conditional

---

## Visual Before/After

```
BEFORE (Locked Experience)
┌──────────────────────────────────────────────┐
│ 🔒 Items appear fast (1.2s)                  │
│ ❌ Can't delete items                        │
│ 📝 Must fill form to unlock                  │
│ 🔒 "Unlock to Edit" button shown             │
└──────────────────────────────────────────────┘

AFTER (Open Demo Experience)  
┌──────────────────────────────────────────────┐
│ ✨ Items appear slowly (2.5s)                │
│ ✅ Can delete items immediately              │
│ 🚫 No lead capture form needed               │
│ 🎯 Full demo interaction available           │
└──────────────────────────────────────────────┘
```

---

## Summary

| Change | Effect |
|--------|--------|
| Slower scanning (2500ms) | Users can watch items being detected one by one |
| `isUnlocked = true` | All editing controls work immediately |
| Remove lead capture modal | No friction for demo users |
| Remove unlock button | Cleaner table header |
| Simplified migrate button | No lock icon needed |

---

## Technical Details

### Files Modified
| File | Lines Changed |
|------|---------------|
| `src/pages/ScanRoom.tsx` | ~67-68, 88, 91-97, 582-659, 804-806 |

### State Removed
- `leadForm` state object
- `showLeadCapture` boolean
- `handleLeadSubmit` function

### Timing Change
- Item detection interval: 1200ms → 2500ms

