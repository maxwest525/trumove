

# UI Refinements: Feature Carousel, AI Helper, and Navigation

## Overview
This plan addresses multiple UI refinements focusing on the Features Carousel section, the floating AI Moving Helper visibility control, and the Agent Login button positioning in the floating navigation.

---

## Changes Summary

| Component | Change |
|-----------|--------|
| Features Carousel | Subtle green styling, smoother scroll, hover preview |
| Section Headline | Redesign to be more integrated with carousel |
| AI Moving Helper | Add hide/dismiss button |
| Floating Nav (Agent Login) | Move Agent Login to far right position |

---

## 1. Features Carousel Styling Refinements

### A. Icon Badge - More Subtle Border and Green Tint

**File: `src/index.css`**

Current styling uses `hsl(var(--primary) / 0.08)` background and `1px solid hsl(var(--border))` border.

**Changes:**
- Reduce green background tint from `0.08` to `0.04` (more subtle)
- Make border even more subtle: `hsl(var(--border) / 0.5)`
- On hover: increase to `0.06` instead of `0.12`

```css
.features-carousel-card-icon {
  background: hsl(var(--primary) / 0.04);  /* Was 0.08 */
  border: 1px solid hsl(var(--border) / 0.5);  /* More subtle */
}

.features-carousel-card:hover .features-carousel-card-icon {
  background: hsl(var(--primary) / 0.06);  /* Was 0.12 */
  box-shadow: none;  /* Remove green glow on hover */
}
```

### B. Top Card Accent Stripe - More Subtle Green

**File: `src/index.css`**

Current: `hsl(var(--primary) / 0.6)` to `hsl(var(--primary) / 0.2)` gradient at `opacity: 0.7`

**Changes:**
- Reduce gradient intensity: `hsl(var(--primary) / 0.3)` to `hsl(var(--primary) / 0.08)`
- Lower base opacity to `0.4`
- On hover: increase only to `0.6` (not `1`)

```css
.features-carousel-card::before {
  background: linear-gradient(90deg, hsl(var(--primary) / 0.3), hsl(var(--primary) / 0.08));
  opacity: 0.4;  /* Was 0.7 */
}

.features-carousel-card:hover::before {
  opacity: 0.6;  /* Was 1 */
}
```

### C. Smooth Continuous Scroll (Marquee-Style)

**File: `src/components/FeatureCarousel.tsx`**

Replace interval-based autoplay with CSS animation for smooth continuous scroll.

**Approach:**
- Use `embla-carousel-auto-scroll` plugin OR implement custom CSS animation
- Since we're using Embla carousel via shadcn, we'll use a faster, smoother interval (e.g., 50ms with small scroll increments) to simulate smooth scrolling
- Alternative: Use CSS `@keyframes` for a true marquee effect on the content

**Implementation:**
- Keep Embla carousel but add smooth auto-scroll using `scrollBy()` method with small increments
- Use `requestAnimationFrame` for smoother animation
- Pause on hover/interaction (already implemented)

```typescript
// Smooth continuous scroll using scrollBy
useEffect(() => {
  if (!api || isPaused) return;
  
  let animationId: number;
  const scroll = () => {
    api.scrollBy(1, false); // Smooth small increment
    animationId = requestAnimationFrame(scroll);
  };
  
  // Start slow continuous scroll
  const intervalId = setInterval(() => {
    api.scrollBy(0.5, true); // Gentle nudge
  }, 50);
  
  return () => {
    clearInterval(intervalId);
    cancelAnimationFrame(animationId);
  };
}, [api, isPaused]);
```

### D. Page Preview on Hover

**File: `src/components/FeatureCarousel.tsx` and `src/index.css`**

Add a tooltip/popover showing a larger preview of the page when hovering over a card.

**Implementation:**
- Wrap card content in a Tooltip or Popover
- Show an enlarged version of the preview image on hover
- Add slight delay to prevent flickering

```tsx
// Add hover state for preview
const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

// On card hover, show enlarged preview
<div 
  className="features-carousel-card"
  onMouseEnter={() => setHoveredIndex(index)}
  onMouseLeave={() => setHoveredIndex(null)}
>
  {/* Existing card content */}
  
  {/* Preview overlay on hover */}
  {hoveredIndex === index && (
    <div className="features-carousel-preview-overlay">
      <img src={feature.image} alt="Page Preview" />
    </div>
  )}
</div>
```

---

## 2. Section Headline Redesign

### Problem
The current "A Smarter Way To Move" headline is disconnected and pushes cards too far from the form.

### Solution Options

**Option A: Inline Headline with Carousel**
- Remove the standalone h2
- Integrate headline as a pill badge above the carousel arrows
- Reduce vertical spacing

**Option B: Compact Badge Above Carousel**
- Convert headline to a small, styled badge (like "HOW IT WORKS")
- Position it closer to the carousel with minimal top margin
- Much smaller font size

**Recommended: Option B**

**File: `src/index.css`**

```css
.features-carousel-headline {
  text-align: center;
  font-size: 0.875rem;  /* Was 1.75rem - much smaller */
  font-weight: 600;
  color: hsl(var(--muted-foreground));
  margin-bottom: 16px;  /* Was 32px - tighter */
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: hsl(var(--muted) / 0.3);
  border: 1px solid hsl(var(--border) / 0.5);
  border-radius: 20px;
  margin-left: auto;
  margin-right: auto;
}

.tru-feature-carousel-fullwidth {
  margin-top: 48px;  /* Reduced from 64px */
  text-align: center;  /* Center the badge */
}
```

---

## 3. AI Moving Helper - Add Hide Button

**File: `src/components/FloatingTruckChat.tsx`**

Add a small X button or dismiss control to allow users to hide the floating AI helper.

### Implementation

**A. Add dismiss state and localStorage persistence:**
```typescript
const [isHidden, setIsHidden] = useState(() => {
  return localStorage.getItem('tm_ai_helper_hidden') === 'true';
});

const handleHide = (e: React.MouseEvent) => {
  e.stopPropagation();
  setIsHidden(true);
  localStorage.setItem('tm_ai_helper_hidden', 'true');
};
```

**B. Add small X button to the floating pill:**
```tsx
{/* Small dismiss X button */}
<button
  onClick={handleHide}
  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
  aria-label="Hide AI Helper"
>
  <X className="w-3 h-3" />
</button>
```

**C. Conditionally render based on isHidden:**
```tsx
if (isHidden) return null;
```

---

## 4. Agent Login Button - Move to Far Right in Floating Nav

**File: `src/components/FloatingNav.tsx`**

### Current State
The FloatingNav component doesn't include Agent Login - it only has the 6 nav items (AI Estimator, Carrier Vetting, AI Chat, Property Lookup, Video Consult, Call Us).

The Agent Login button is in the site Header, not in FloatingNav.

### Clarification Needed
Based on the user's request "move agent login button in the floating nav bar all the way to the right", I need to:

**Option A**: Add Agent Login to FloatingNav as a new item at the end
**Option B**: The user may be referring to the Header's Agent Login positioning

**Assuming Option A - Add to FloatingNav:**

**File: `src/components/FloatingNav.tsx`**

Add Agent Login as the last item in the navItems array:

```typescript
const navItems: NavItem[] = [
  { icon: Sparkles, label: "AI Estimator", href: "/online-estimate" },
  { icon: Shield, label: "Carrier Vetting", href: "/vetting" },
  { icon: MessageSquare, label: "AI Chat", href: null, action: "chat" },
  { icon: MapPin, label: "Property Lookup", href: "/property-lookup" },
  { icon: Video, label: "Video Consult", href: "/book" },
  { icon: Headphones, label: "Call Us", href: "tel:+16097277647" },
  // NEW: Agent Login at the far right
  { icon: User, label: "Agent Login", href: "/agent-login" },
];
```

**CSS (index.css) - Visually separate Agent Login:**
```css
.tru-static-nav-item:last-child {
  margin-left: auto;  /* Push to far right */
  border-left: 1px solid hsl(var(--border) / 0.3);
  padding-left: 12px;
}
```

---

## Files Modified

1. **`src/index.css`**
   - Subtle icon badge styling (reduced green tint)
   - Subtle top accent stripe (reduced opacity)
   - Compact headline styling (badge format)
   - Reduced section top margin
   - Visual separator for Agent Login in nav

2. **`src/components/FeatureCarousel.tsx`**
   - Smooth continuous scroll (faster, smaller increments)
   - Hover preview state for cards
   - Preview overlay component on hover

3. **`src/components/FloatingTruckChat.tsx`**
   - Add `isHidden` state with localStorage persistence
   - Add dismiss X button with stopPropagation
   - Import X icon from lucide-react

4. **`src/components/FloatingNav.tsx`**
   - Add User icon import
   - Add Agent Login as last navItem

---

## Technical Approach Summary

| Feature | Approach |
|---------|----------|
| Subtle green | Reduce opacity values in CSS |
| Smooth scroll | Faster interval (50ms) with smaller scroll increments |
| Hover preview | Overlay positioned absolutely, shown on hover state |
| Compact headline | Convert to uppercase badge with pill styling |
| Hide AI helper | useState + localStorage + X button |
| Agent Login right | Add to navItems array + CSS margin-left: auto |

