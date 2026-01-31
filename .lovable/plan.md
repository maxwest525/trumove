

# Plan: Match Video Consult Header Trust Strip to Home Page Style

## Overview
Update the video consult header trust strip styling to match the home page trust strip font size and icon size exactly.

## Current vs Target Comparison

| Property | Current (Video Consult) | Target (Home Page) |
|----------|------------------------|-------------------|
| Font size | 11px | 10px |
| Icon size | 14px | 14px (already matches) |
| Font weight | 700 | 600 |
| Letter spacing | 0.06em | 0.05em |
| Gap (icon to text) | 8px | 5px |

## Changes

### Update Video Consult Header Trust Styling

**File: `src/index.css`**

Update `.video-consult-header-trust-item` (lines 29892-29902):

```css
.video-consult-header-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;           /* was 8px */
  font-size: 10px;    /* was 11px */
  font-weight: 600;   /* was 700 */
  text-transform: uppercase;
  letter-spacing: 0.05em;  /* was 0.06em */
  color: hsl(0 0% 100% / 0.85);
  white-space: nowrap;
}
```

The icon size (14px) already matches the home page trust strip, so no change needed there.

## Files to Modify
- `src/index.css` - Update video consult header trust item styling to match home page

