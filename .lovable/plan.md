
# Plan: Extend Route Summary Box Horizontally

## Overview
Make the route summary strip (Origin / Distance / Destination) extend wider horizontally by increasing its negative margins so it stretches beyond the form card edges.

## Technical Changes

### File: `src/index.css`
**Lines 23817-23825** - Update `.tru-qb-route-summary-permanent`

| Property | Current | New |
|----------|---------|-----|
| `margin-left` | `-24px` | `-32px` |
| `margin-right` | `-24px` | `-32px` |
| `padding` (horizontal) | `8px 24px` | `8px 32px` |

This extends the box 8px further on each side (16px total wider) while keeping the inner content properly aligned with the rest of the form.

## Result
The route summary strip will appear noticeably wider, extending further toward the edges of the form card while maintaining balanced internal proportions for the origin, distance, and destination boxes.
