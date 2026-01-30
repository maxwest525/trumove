

# Maximize AI Inventory Analysis Width & Preview Sizes

## Summary

Expand the AI Inventory Analysis section to use the full page width and maximize the scanner preview and detection card sizes. Key changes:
1. Remove the `max-width: 900px` constraint on `.tru-ai-steps-inner`
2. Use horizontal padding instead to create breathing room from edges
3. Increase the right column (detection list) minimum width
4. Set more generous proportions for the three-column grid

---

## Current State vs Target

```text
CURRENT (constrained to 900px):
┌─────────────────────────────────────────────────────────────┐
│      ╔═══════════════════════════════════════════╗          │
│      ║  Steps | Scanner (small) | Detection      ║          │
│      ╚═══════════════════════════════════════════╝          │
│      ↑ max-width: 900px centered ↑                          │
└─────────────────────────────────────────────────────────────┘

TARGET (full width with padding):
┌─────────────────────────────────────────────────────────────┐
│   Steps  |   Scanner (LARGE)    |    Detection (LARGE)      │
│          |   Fills available    |    Matches scanner        │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation

### File: `src/index.css`

**1. Remove max-width constraint on inner container (Lines 2570-2574)**

Change:
```css
.tru-ai-steps-inner {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}
```
To:
```css
.tru-ai-steps-inner {
  max-width: none;
  padding: 0 48px;
  text-align: center;
}
```

**2. Update three-column grid for better proportions (Lines 2586-2593)**

Change:
```css
.tru-ai-two-column {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 24px;
  align-items: stretch;
  margin-bottom: 0;
  text-align: left;
}
```
To:
```css
.tru-ai-two-column {
  display: grid;
  grid-template-columns: 180px 1fr 300px;
  gap: 32px;
  align-items: stretch;
  margin-bottom: 0;
  text-align: left;
}
```

**3. Increase right column minimum width (Lines 2609-2614)**

Change:
```css
.tru-ai-right-column {
  display: flex;
  flex-direction: column;
  min-width: 240px;
  height: 100%;
}
```
To:
```css
.tru-ai-right-column {
  display: flex;
  flex-direction: column;
  min-width: 280px;
  height: 100%;
}
```

**4. Increase step preview thumbnail size (Lines 2659-2667)**

Change:
```css
.tru-ai-step-preview {
  width: 80px;
  height: 60px;
  ...
}
```
To:
```css
.tru-ai-step-preview {
  width: 100px;
  height: 75px;
  ...
}
```

**5. Update section padding for full-width feel (Lines 2252-2260)**

Change:
```css
.tru-ai-steps-section {
  padding: 16px 24px 20px;
  ...
}
```
To:
```css
.tru-ai-steps-section {
  padding: 16px 0 20px;
  ...
}
```

---

## Summary Table

| Element | Before | After |
|---------|--------|-------|
| Inner container max-width | 900px | none (full width) |
| Horizontal padding | 24px on section | 48px on inner |
| Grid columns | `auto 1fr auto` | `180px 1fr 300px` |
| Column gap | 24px | 32px |
| Right column min-width | 240px | 280px |
| Step thumbnails | 80×60px | 100×75px |

This spreads the content across the full viewport width while maintaining proper spacing, and maximizes the scanner preview and detection list sizes.

