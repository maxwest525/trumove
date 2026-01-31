
# Fix AI Inventory Analysis - Content Not Filling 450px

## Problem

There are **duplicate CSS rules** that override each other. The later rules are removing the critical flex properties needed to fill the 450px height:

1. `.tru-ai-steps-inner` is defined twice - lines 2262-2268 have `height: 100%` and `display: flex`, but lines 2575-2578 override with just `max-width` and `padding`, losing the flex layout
2. `.tru-ai-two-column` is defined twice - lines 2270-2277 have `flex: 1`, but lines 2591-2598 override with just grid properties, losing the flex growth

---

## Solution

Consolidate the duplicate rules into single complete definitions. The fix involves:

1. **Delete duplicate rule blocks** (lines 2575-2578 and 2591-2598)
2. **Ensure single, complete rules** that include all necessary properties

---

## Implementation

### File: `src/index.css`

**1. Update the FIRST `.tru-ai-steps-inner` rule (Lines 2262-2268) to be complete:**

```css
.tru-ai-steps-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-width: none;
  padding: 0 48px;
  text-align: center;
}
```

**2. Update the FIRST `.tru-ai-two-column` rule (Lines 2270-2277) to be complete:**

```css
.tru-ai-two-column {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 180px 1fr 300px;
  gap: 32px;
  align-items: stretch;
  text-align: left;
}
```

**3. DELETE the duplicate `.tru-ai-steps-inner` rule (Lines 2575-2579)**

Remove:
```css
.tru-ai-steps-inner {
  max-width: none;
  padding: 0 48px;
  text-align: center;
}
```

**4. DELETE the duplicate `.tru-ai-two-column` rule (Lines 2590-2598)**

Remove:
```css
/* Three-column layout for AI section */
.tru-ai-two-column {
  display: grid;
  grid-template-columns: 180px 1fr 300px;
  gap: 32px;
  align-items: stretch;
  margin-bottom: 0;
  text-align: left;
}
```

---

## Why This Fixes It

```text
BEFORE (broken cascade):
┌─ Lines 2262-2268: height: 100%, display: flex ─┐
│  └─ Lines 2575-2578: OVERRIDES with only max-width/padding │
│     (loses height: 100% and display: flex!) ──────────────┘
│
└─ Lines 2270-2277: flex: 1 ─────────────────────┐
   └─ Lines 2591-2598: OVERRIDES with only grid props │
      (loses flex: 1 that makes it grow!) ──────────┘

AFTER (single complete rules):
┌─ Lines 2262-2268: ALL properties in one place ─┐
│  height: 100%, display: flex, max-width: none, │
│  padding: 0 48px, text-align: center           │
└────────────────────────────────────────────────┘
┌─ Lines 2270-2277: ALL properties in one place ─┐
│  flex: 1, min-height: 0, display: grid,        │
│  grid-template-columns, gap, align-items       │
└────────────────────────────────────────────────┘
```

Now the grid will properly flex to fill the remaining height after the title.

---

## Summary

| Issue | Before | After |
|-------|--------|-------|
| `.tru-ai-steps-inner` | Duplicate rules, flex lost | Single complete rule |
| `.tru-ai-two-column` | Duplicate rules, flex: 1 lost | Single complete rule |
| Grid fills height | No (flex properties overwritten) | Yes (flex: 1 preserved) |
