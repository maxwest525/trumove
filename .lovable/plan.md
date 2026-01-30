

# Update Trudy Images for Video Conference Call Look

## Overview
Generate a new AI image of Trudy that looks like she's on a professional video conference call, then update both the feature carousel preview and the demo video call screen to use this new image.

---

## Current State

| Location | File | Current Image | Usage |
|----------|------|---------------|-------|
| Feature Carousel | `src/components/FeatureCarousel.tsx` | `preview-video-consult.jpg` | "TruMove Specialist" card preview |
| Index Page Carousel | `src/pages/Index.tsx` | `previewVideoConsult` | Same carousel on home page |
| Video Call Demo | `src/pages/Book.tsx` | `trudy-model.jpg` | Full-screen fake agent view |

---

## Implementation Plan

### Step 1: Generate New Video Call Image

Use AI image generation to create an image of a professional woman (Trudy) that looks like she's on a video conference call:

- Professional headshot style, webcam-angle framing
- Business casual attire
- Warm, friendly expression
- Blurred home office or professional background
- Natural lighting like from a webcam/laptop screen

The generated image will be saved to the project assets.

---

### Step 2: Update File References

**File: `src/pages/Book.tsx`**

Update the `FakeAgentView` component to use the new video call image:

```tsx
// Line 37: Replace trudyModel with the new image
<img 
  src={trudyVideoCall}  // New import
  alt="Trudy Martinez" 
  className="w-full h-full object-cover"
/>
```

**File: `src/components/FeatureCarousel.tsx`**

Update the "TruMove Specialist" feature to use the new image:

```tsx
// Line 41: Replace previewVideoConsult with new image
{
  title: "TruMove Specialist",
  desc: "Live video consultation for personalized guidance.",
  image: trudyVideoCall,  // New image
  route: "/book",
}
```

**File: `src/pages/Index.tsx`**

Update the inline carousel to use the new image:

```tsx
// Line 1505: Replace previewVideoConsult
{ title: "TruMove Specialist", desc: "Live video consultation for personalized guidance.", image: trudyVideoCall, route: "/book", action: "navigate" as const }
```

---

## Result

Both the preview card and the demo will show Trudy in a consistent video conference call appearance, making the experience feel more cohesive and realistic.

