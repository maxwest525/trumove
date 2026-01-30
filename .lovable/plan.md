

# Add Unique Images for FMCSA Verified and Smart Carrier Match

## Current Issue

Both "Smart Carrier Match" and "FMCSA Verified" features use the same image (`previewCarrierVetting`), making them visually indistinguishable in the carousel.

## Solution

Create custom icon components for each feature (similar to how Trudy AI Assistant has `TruckChatIcon`). This approach:
- Creates unique, distinctive visuals for each feature
- Uses lucide-react icons already in the project
- Maintains consistent styling with the existing TruckChatIcon pattern

---

## Implementation Plan

### Step 1: Create Smart Carrier Match Icon Component

**File: `src/components/FeatureCarousel.tsx`**

Add a new component that visualizes "smart matching" with trucks and a connection/matching visual:

```tsx
import { Truck, GitCompare, Star } from "lucide-react";

const SmartMatchIcon = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
    <div className="relative flex items-center gap-2">
      <Truck className="w-10 h-10 text-foreground" />
      <GitCompare className="w-8 h-8 text-primary" />
      <Star className="w-6 h-6 text-primary fill-primary/30 absolute -top-2 right-0" />
    </div>
  </div>
);
```

### Step 2: Create FMCSA Verified Icon Component

**File: `src/components/FeatureCarousel.tsx`**

Add a component that visualizes "official verification" with a shield/badge and checkmark:

```tsx
import { ShieldCheck, FileCheck, BadgeCheck } from "lucide-react";

const FMCSAVerifiedIcon = () => (
  <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
    <div className="relative">
      <ShieldCheck className="w-16 h-16 text-foreground" />
      <BadgeCheck className="w-6 h-6 text-primary absolute -bottom-1 -right-1" />
    </div>
  </div>
);
```

### Step 3: Update Features Array

**File: `src/components/FeatureCarousel.tsx`**

Replace the `image` property with `customIcon` for both features:

```tsx
{
  title: "Smart Carrier Match",
  desc: "Our algorithm finds the best carrier for your route.",
  customIcon: <SmartMatchIcon />,
  route: "/vetting",
},
// ...
{
  title: "FMCSA Verified",
  desc: "Real-time safety data checks from official databases.",
  customIcon: <FMCSAVerifiedIcon />,
  route: "/vetting",
},
```

### Step 4: Update Imports

**File: `src/components/FeatureCarousel.tsx`**

Add new icon imports from lucide-react:

```tsx
import { X, Truck, MessageCircle, Sparkles, GitCompare, Star, ShieldCheck, BadgeCheck } from "lucide-react";
```

---

## Summary of Changes

| File | Change |
|------|--------|
| `src/components/FeatureCarousel.tsx` | Add `GitCompare`, `Star`, `ShieldCheck`, `BadgeCheck` imports |
| `src/components/FeatureCarousel.tsx` | Create `SmartMatchIcon` component |
| `src/components/FeatureCarousel.tsx` | Create `FMCSAVerifiedIcon` component |
| `src/components/FeatureCarousel.tsx` | Update Smart Carrier Match to use `customIcon` |
| `src/components/FeatureCarousel.tsx` | Update FMCSA Verified to use `customIcon` |

---

## Visual Result

- **Smart Carrier Match**: Shows a truck with matching/comparison arrows and a star, representing the algorithm finding the best carrier
- **FMCSA Verified**: Shows a shield with checkmark badge, representing official government verification and safety
- Both icons use the same gradient background styling as the Trudy AI icon for visual consistency

