

# Fix Feature Carousel Bottom Clipping + Update Trudy AI Card Image

## Issues Identified

### Issue 1: Bottom Clipping on Hover
The 135% scale hover effect causes cards to overflow beyond the carousel container bounds. Currently:
- Cards scale to 1.35x their original size
- The carousel has 8px padding on all sides (line 16612: `padding: 8px 8px`)
- A 240px card at 1.35x becomes 324px - that's 84px extra height (42px top + 42px bottom)
- The 8px padding is not enough to accommodate the 42px bottom overflow

**Solution**: Increase vertical padding on the carousel content to 48px to give room for the bottom expansion.

### Issue 2: Trudy AI Card Image
The current image is `trudy-avatar.png` (a static headshot). The user wants a "truck with word bubbles" similar to the floating chat button's design.

**Solution**: Create an inline SVG/React component that composes a Truck icon with speech bubble decorations, styled to match the tech-forward aesthetic.

---

## Implementation Plan

### Step 1: Fix Bottom Clipping with Increased Padding

**File: `src/index.css`** (line 16612)

Change from:
```css
.features-carousel-content {
  padding: 8px 8px;
}
```

To:
```css
.features-carousel-content {
  padding: 48px 8px;  /* Vertical padding for 1.35x scale overflow */
  margin: -40px 0;    /* Negative margin to maintain visual spacing */
}
```

This gives 48px of space above and below for hover expansion, while the negative margin keeps the visual layout tight.

### Step 2: Create Truck Chat Icon Component for Trudy Card

**File: `src/components/FeatureCarousel.tsx`**

Replace the static image for the Trudy AI Assistant card with an inline component that renders:
- A Truck icon (from lucide-react)
- Sparkle decorations
- Speech bubble indicators

```tsx
// Inside FeatureCarousel.tsx - Create a TruckChatIcon component
const TruckChatIcon = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
    <div className="relative">
      <Truck className="w-16 h-16 text-foreground" />
      <div className="absolute -top-3 -right-3 flex gap-1">
        <MessageCircle className="w-6 h-6 text-primary fill-primary/20" />
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
      </div>
    </div>
  </div>
);
```

### Step 3: Update Features Array to Use Custom Component

**File: `src/components/FeatureCarousel.tsx`**

Modify the Feature type and data to support either an image URL or a custom component:

```tsx
type Feature = {
  title: string;
  desc: string;
  image?: string;
  customIcon?: React.ReactNode;
  route?: string;
  action?: "openChat";
};

// Update Trudy AI Assistant entry
{
  title: "Trudy AI Assistant",
  desc: "Chat with our AI to get instant answers about your move.",
  customIcon: <TruckChatIcon />,
  action: "openChat",
}
```

### Step 4: Update Card Rendering to Handle Custom Icons

**File: `src/components/FeatureCarousel.tsx`**

In the JSX, conditionally render either the image or the custom icon:

```tsx
<div className="features-carousel-card-image-wrapper">
  {feature.customIcon ? (
    feature.customIcon
  ) : (
    <img src={feature.image} alt={`${feature.title} Preview`} />
  )}
</div>
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/index.css` | Increase vertical padding on `.features-carousel-content` to 48px with compensating negative margin |
| `src/components/FeatureCarousel.tsx` | Add `Truck`, `MessageCircle`, `Sparkles` imports from lucide-react |
| `src/components/FeatureCarousel.tsx` | Create `TruckChatIcon` component |
| `src/components/FeatureCarousel.tsx` | Update Feature type to support `customIcon` |
| `src/components/FeatureCarousel.tsx` | Replace Trudy card image with `<TruckChatIcon />` |
| `src/components/FeatureCarousel.tsx` | Update card rendering to handle custom icons |

---

## Visual Result

- **Hover expansion**: Cards can now grow 35% larger without being cut off at the bottom
- **Trudy AI card**: Shows a modern truck icon with animated sparkles and chat bubble, matching the floating chat button's aesthetic

