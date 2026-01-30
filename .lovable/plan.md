

# Ungate "Build Inventory Manually" Button

## Overview
Remove the lead capture gate from the "Build Inventory Manually" button so it navigates directly to `/online-estimate` without requiring contact information first.

---

## Current Behavior

The button currently calls `handleInventoryClick("manual")` which:
1. Checks if user has provided contact info
2. If NO → Opens `LeadCaptureModal` to collect name/email/phone
3. If YES → Navigates to `/online-estimate`

```tsx
// Current (line 1622)
onClick={() => handleInventoryClick("manual")}
```

---

## Proposed Change

Replace the gated handler with direct navigation:

```tsx
// After
onClick={() => navigate("/online-estimate")}
```

---

## File Change

### `src/pages/Index.tsx`

**Line 1622** - Change the onClick handler:

| Before | After |
|--------|-------|
| `onClick={() => handleInventoryClick("manual")}` | `onClick={() => navigate("/online-estimate")}` |

---

## Result

| Before | After |
|--------|-------|
| Clicks opens modal asking for contact info | Clicks navigates directly to estimate page |
| User must fill form before seeing inventory builder | User can start building inventory immediately |

This matches the "Video Consult" button next to it which also navigates directly without gating.

