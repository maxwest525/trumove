
# Fix Trudy Martinez Face in Video Preview

## Issue
The `FakeAgentView` component in `src/pages/Book.tsx` uses a random Unsplash stock photo URL for Trudy Martinez instead of the actual Trudy model image that exists in the project assets.

**Current (line 36):**
```tsx
src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=800&fit=crop"
```

This shows a random professional woman from Unsplash, not Trudy.

## Solution
Replace the Unsplash URL with the `trudy-model.jpg` asset that already exists in the project and is used elsewhere (Index.tsx).

---

## Changes Required

### File: `src/pages/Book.tsx`

#### 1. Update Import (line 19)

Change from importing the avatar to importing the full model image:

```tsx
// BEFORE
import trudyAvatar from "@/assets/trudy-avatar.png";

// AFTER
import trudyModel from "@/assets/trudy-model.jpg";
import trudyAvatar from "@/assets/trudy-avatar.png";  // Keep if used elsewhere
```

#### 2. Update FakeAgentView Image (line 36)

Replace the Unsplash URL with the Trudy model image:

```tsx
// BEFORE
<img 
  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=800&fit=crop" 
  alt="Trudy Martinez" 
  className="w-full h-full object-cover"
/>

// AFTER
<img 
  src={trudyModel} 
  alt="Trudy Martinez" 
  className="w-full h-full object-cover"
/>
```

---

## Result

| Before | After |
|--------|-------|
| Random Unsplash stock photo | Actual Trudy Martinez model image |
| Inconsistent branding | Consistent with Index.tsx Trudy appearance |

---

## Summary

| File | Change |
|------|--------|
| `src/pages/Book.tsx` | Add import for `trudy-model.jpg`, update `FakeAgentView` image src |
