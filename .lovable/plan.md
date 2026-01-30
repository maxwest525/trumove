

# Allow Demo AI Analysis Without Contact Info Requirement

## Overview
Remove the lead capture gating from the "Demo AI Analysis" button on the homepage so users can experience the AI inventory analysis demo without entering their personal information first.

---

## Current Behavior
- Clicking "Demo AI Analysis" triggers `handleInventoryClick("ai")`
- This function checks if user has provided contact info (name, email, phone)
- If no contact info exists, it opens the lead capture modal
- User must enter info before being allowed to navigate to `/scan-room`

## Target Behavior
- Clicking "Demo AI Analysis" navigates directly to `/scan-room`
- No lead capture modal required for the demo
- "Build Inventory Manually" can optionally keep the gating (or also be ungated)

---

## Changes Required

### File: `src/pages/Index.tsx`

#### Option 1: Simple Direct Navigation (Recommended)
Change the "Demo AI Analysis" button to navigate directly instead of using `handleInventoryClick`:

**Line ~1567-1575** - Update the button onClick:
```tsx
{/* Before */}
<button 
  type="button"
  onClick={() => handleInventoryClick("ai")}
  className="tru-ai-start-btn"
>

{/* After */}
<button 
  type="button"
  onClick={() => navigate("/scan-room")}
  className="tru-ai-start-btn"
>
```

#### Option 2: Also Ungate Manual Builder (if desired)
Similarly update the "Build Inventory Manually" button:

**Line ~1607-1614**:
```tsx
{/* Before */}
onClick={() => handleInventoryClick("manual")}

{/* After */}
onClick={() => navigate("/online-estimate")}
```

---

## Summary

| Change | Effect |
|--------|--------|
| Direct navigation for AI demo | Users can click "Demo AI Analysis" and go straight to the scan room |
| No lead capture modal | Removes friction for experiencing the demo |
| Contact info collected later | Users can still be prompted on the actual scan page if needed |

