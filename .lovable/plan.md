
# Adjust Furniture Bounding Box Positions

## Overview
Fine-tune the detection bounding box positions in the AI Move Estimator scanner demo to better align with the furniture in the sample living room image.

---

## Current Positions

```text
const FURNITURE_POSITIONS = [
  { id: 0, name: "3-Seat Sofa",  top: "55%", left: "5%",  width: "40%", height: "32%" },
  { id: 1, name: "Coffee Table", top: "72%", left: "35%", width: "22%", height: "14%" },
  { id: 2, name: "TV Stand",     top: "28%", left: "50%", width: "28%", height: "28%" },
  { id: 3, name: "Armchair",     top: "48%", left: "68%", width: "22%", height: "28%" },
  { id: 4, name: "Floor Lamp",   top: "18%", left: "88%", width: "10%", height: "38%" },
];
```

---

## Proposed Adjustments

Based on typical living room layouts in the sample image, I'll adjust the positions to better frame each piece of furniture:

| Item | Current Position | Adjusted Position | Reason |
|------|------------------|-------------------|--------|
| 3-Seat Sofa | top: 55%, left: 5% | top: 52%, left: 8% | Shift slightly up and right for better centering |
| Coffee Table | top: 72%, left: 35% | top: 68%, left: 38% | Move up slightly to align with table surface |
| TV Stand | top: 28%, left: 50% | top: 25%, left: 48% | Adjust to frame the entertainment center area |
| Armchair | top: 48%, left: 68% | top: 45%, left: 65% | Better alignment with chair in right portion |
| Floor Lamp | top: 18%, left: 88% | top: 15%, left: 85% | Shift to capture full lamp including shade |

---

## Technical Implementation

**File: `src/pages/Index.tsx` (Lines 293-299)**

Update the `FURNITURE_POSITIONS` constant:

```javascript
const FURNITURE_POSITIONS = [
  { id: 0, name: "3-Seat Sofa",  top: "52%", left: "8%",  width: "38%", height: "30%" },
  { id: 1, name: "Coffee Table", top: "68%", left: "38%", width: "20%", height: "12%" },
  { id: 2, name: "TV Stand",     top: "25%", left: "48%", width: "26%", height: "26%" },
  { id: 3, name: "Armchair",     top: "45%", left: "65%", width: "24%", height: "30%" },
  { id: 4, name: "Floor Lamp",   top: "15%", left: "85%", width: "12%", height: "40%" },
];
```

---

## Summary

| Change | Details |
|--------|---------|
| Sofa | Moved up 3%, right 3%, slightly smaller box |
| Coffee Table | Moved up 4%, right 3%, tighter box |
| TV Stand | Moved up 3%, left 2%, slightly smaller |
| Armchair | Moved up 3%, left 3%, taller box |
| Floor Lamp | Moved up 3%, left 3%, wider/taller box |

---

### Files Modified
- `src/pages/Index.tsx` - Update FURNITURE_POSITIONS array with refined coordinates
