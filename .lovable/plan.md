

# Expandable Feature Cards with Hover Growth + Click Modal

## Overview
Implement a two-tier interaction for feature carousel cards:
1. **Hover**: Card expands significantly beyond its container, creating a dramatic "pop out" preview effect
2. **Click**: Opens a full modal with large image and feature details requiring explicit dismissal

---

## Changes

### 1. Enhanced Hover Expansion (CSS)

**File: `src/index.css`**

Update the card hover effect to dramatically scale the card and break out of container constraints:

**Lines 16659-16672 - Replace hover styles:**

```css
/* Hover effects - dramatic expansion breaking container limits */
.features-carousel-card:hover {
  transform: scale(1.35) translateZ(0);
  z-index: 100;
  border-color: hsl(var(--primary) / 0.4);
  box-shadow: 
    0 20px 50px hsl(var(--tm-ink) / 0.25),
    0 0 0 2px hsl(var(--primary) / 0.3);
}

.features-carousel-card:hover::before {
  opacity: 0.8;
  background: linear-gradient(90deg, hsl(var(--primary)), hsl(160 80% 40%));
}
```

**Lines 16623-16643 - Update base card for smooth transitions:**

```css
.features-carousel-card {
  /* ... existing styles ... */
  transition: 
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.25s ease, 
    box-shadow 0.3s ease,
    z-index 0s;
}
```

**Lines 16611-16619 - Ensure parent allows overflow:**

```css
.features-carousel-item {
  /* ... existing styles ... */
  overflow: visible !important;
  z-index: 1;
}

.features-carousel-item:has(.features-carousel-card:hover) {
  z-index: 100;
}
```

**Add to carousel container (around line 16590):**

```css
.features-carousel,
.features-carousel-container,
.features-carousel-content {
  overflow: visible !important;
}
```

---

### 2. Click-to-Open Modal (Component)

**File: `src/components/FeatureCarousel.tsx`**

Add state and Dialog component for modal behavior:

```tsx
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

// Add state
const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

// Update card onClick
onClick={() => setSelectedFeature(feature)}

// Add modal after </Carousel>
<Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
  <DialogContent className="feature-preview-modal">
    <DialogTitle className="sr-only">{selectedFeature?.title}</DialogTitle>
    <DialogDescription className="sr-only">{selectedFeature?.desc}</DialogDescription>
    <DialogClose className="feature-preview-close">
      <X className="h-5 w-5" />
    </DialogClose>
    {selectedFeature && (
      <div className="feature-preview-content">
        <div className="feature-preview-image">
          <img src={selectedFeature.image} alt={selectedFeature.title} />
        </div>
        <div className="feature-preview-info">
          <h3>{selectedFeature.title}</h3>
          <p>{selectedFeature.desc}</p>
          <button 
            className="feature-preview-cta"
            onClick={() => {
              setSelectedFeature(null);
              navigate(selectedFeature.route);
            }}
          >
            Explore Feature
          </button>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>
```

---

### 3. Modal Styling (CSS)

**File: `src/index.css`** - Add after carousel styles:

```css
/* Feature Preview Modal */
.feature-preview-modal {
  max-width: 700px;
  width: 90vw;
  padding: 0;
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--card));
}

.feature-preview-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(var(--background) / 0.9);
  border: 1px solid hsl(var(--border));
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
}

.feature-preview-close:hover {
  background: hsl(var(--primary));
  color: white;
}

.feature-preview-content {
  display: flex;
  flex-direction: column;
}

.feature-preview-image {
  width: 100%;
  height: 400px;
  overflow: hidden;
  background: hsl(var(--muted) / 0.3);
}

.feature-preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.feature-preview-info {
  padding: 24px;
  text-align: center;
}

.feature-preview-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: hsl(var(--foreground));
  margin-bottom: 8px;
}

.feature-preview-info p {
  font-size: 1rem;
  color: hsl(var(--muted-foreground));
  margin-bottom: 20px;
  line-height: 1.5;
}

.feature-preview-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(160 80% 40%));
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.feature-preview-cta:hover {
  transform: scale(1.03);
  box-shadow: 0 8px 24px hsl(var(--primary) / 0.3);
}

/* Dark mode */
.dark .feature-preview-modal {
  background: hsl(220 15% 10%);
  border-color: hsl(0 0% 100% / 0.1);
}

/* Mobile */
@media (max-width: 640px) {
  .feature-preview-image {
    height: 280px;
  }
  
  .feature-preview-info {
    padding: 20px 16px;
  }
}
```

---

## Interaction Flow

```text
                   HOVER                           CLICK
               +-----------+                   +-----------+
               |           |                   |           |
   +-------+   |  Card     |   +-------+       |   MODAL   |
   | Card  | --| scales to |-->| Card  | ----->|  - Big    |
   | 100%  |   |   135%    |   | 135%  |       |    image  |
   +-------+   | (pop out) |   +-------+       |  - Info   |
               |           |                   |  - CTA    |
               +-----------+                   +-----------+
                                                     |
                                            X or click outside
                                                     |
                                                     v
                                               Modal closes
```

---

## Summary

| Behavior | Result |
|----------|--------|
| **Hover** | Card scales to 135%, pops out of container with dramatic shadow and green border glow |
| **Click** | Opens centered modal with 400px tall image, title, description, and "Explore Feature" CTA |
| **Dismiss** | Click X button or outside modal to close |

