
# Plan: Match Shipment Tracking Spacing to Connect With Us Page

## Overview
Update the "Track Your Shipment" hero section on the LiveTracking page to match the exact spacing structure used on the "Connect With Us" (Book) page.

## Current Spacing Analysis

### Connect With Us Page (`Book.tsx`)
- Header container: `mb-10` (40px margin-bottom to video content)
- Headline to subheadline: `mb-3` (12px gap)

### Shipment Tracking Page (`LiveTracking.tsx`)  
- Hero container: `py-8` (32px vertical padding)
- Headline to subheadline: `mb-2` (8px gap)

## Changes Required

### File: `src/pages/LiveTracking.tsx`

**Line 638 - Update container spacing:**
```tsx
// Before:
<div className="text-center py-8 px-4">

// After:
<div className="text-center py-8 px-4 mb-10">
```

**Line 639 - Update headline margin:**
```tsx
// Before:
<h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">

// After:
<h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
```

## Summary of Changes
| Element | Current | Updated |
|---------|---------|---------|
| Hero container bottom margin | 0px | 40px (`mb-10`) |
| Headline to subheadline gap | 8px (`mb-2`) | 12px (`mb-3`) |

This will ensure both pages have identical spacing between:
1. The subheadline and the main content below (40px)
2. The headline and subheadline (12px)
