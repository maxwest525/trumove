

# Change Trudy Carousel Image to a Professional Model

## Overview
Replace the current `trudy-avatar.png` used in the "Trudy AI Assistant" carousel card with a professional, polished image featuring a famous model or stock photo of a professional woman that better represents a high-end AI assistant.

---

## Approach Options

Since we need an image of a "famous model," there are two approaches:

### Option A: Use a High-Quality Stock Image (Recommended)
Download a professional stock photo of an elegant, professional woman (like a customer service representative or virtual assistant aesthetic) and add it to the assets folder.

### Option B: Use a Placeholder URL
Temporarily use an external image URL from a stock photo site, though this isn't ideal for production.

---

## Implementation

### 1. Add New Image Asset
**Action:** Upload a new professional model/assistant image to the project

**Location:** `src/assets/trudy-model.jpg` (or similar name)

The image should convey:
- Professional, friendly demeanor
- Customer service/assistant vibe
- High-quality, polished appearance

### 2. Update Import Statement
**File:** `src/pages/Index.tsx` (line 32)

```tsx
// FROM:
import trudyAvatar from "@/assets/trudy-avatar.png";

// TO:
import trudyAvatar from "@/assets/trudy-model.jpg";
```

Or rename the import for clarity:
```tsx
import trudyModelImage from "@/assets/trudy-model.jpg";
```

### 3. Update Carousel Reference (if import name changes)
**File:** `src/pages/Index.tsx` (line 1273)

If we change the import name:
```tsx
{ title: "Trudy AI Assistant", desc: "Your virtual moving assistant, available 24/7.", image: trudyModelImage, route: "", action: "openChat" as const },
```

---

## Summary

| Step | Action |
|------|--------|
| 1 | Upload new professional model image to `src/assets/` |
| 2 | Update import statement in `Index.tsx` |
| 3 | (Optional) Rename variable if desired |

## Note
You'll need to provide or upload the image of the famous model you'd like to use. Once uploaded, I can update the code to reference the new image.

