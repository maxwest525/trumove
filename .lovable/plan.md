

# Three Hero Section Improvements

## Summary of Changes

1. **Don't calculate distance until BOTH cities are entered** - Modify the distance calculation logic to require both origin and destination before showing distance
2. **Make AI step preview images bigger** - Increase the thumbnail size from 64x48px to larger dimensions  
3. **Remove green accent bar from quote card** - Remove the green gradient progress bar at the top of the form card

---

## Current Behavior

### Distance Display
```text
Current: Distance shows as "— mi" immediately, and updates as soon as first ZIP is entered
Problem: Shows partial/0 distance when only one city is entered
```

### AI Step Preview Images
```text
Current size: 64px × 48px
Location: Left column of AI Inventory section
```

### Quote Form Card
```text
Current: Has a 4px green gradient progress bar at the top
CSS class: .tru-form-progress-bar with green gradient fill
```

---

## Implementation Details

### File: `src/pages/Index.tsx`

**Change 1: Conditional Distance Display (Line 228-233)**

Only display distance value when BOTH fromZip and toZip are valid:

```tsx
// Current
<span className="tru-move-summary-mileage">
  {distance > 0 ? `${distance.toLocaleString()} mi` : "— mi"}
</span>

// After
<span className="tru-move-summary-mileage">
  {fromCity && toCity && distance > 0 ? `${distance.toLocaleString()} mi` : "— mi"}
</span>
```

**Change 2: Same fix in Status Indicators (Line 280-281)**

Only mark "Distance calculated" as complete when both cities are entered:

```tsx
// Current
<div className={`tru-move-summary-status-item ${distance > 0 ? 'is-complete' : ''}`}>

// After
<div className={`tru-move-summary-status-item ${fromCity && toCity && distance > 0 ? 'is-complete' : ''}`}>
```

**Change 3: Remove Progress Bar from Quote Card (Lines 1046-1052)**

Delete or comment out the progress bar element entirely:

```tsx
// Remove this block:
{/* Progress Bar */}
<div className="tru-form-progress-bar">
  <div 
    className="tru-form-progress-fill" 
    style={{ width: `${(step / 3) * 100}%` }}
  />
</div>
```

---

### File: `src/index.css`

**Change 4: Bigger AI Step Preview Images (Lines 2641-2655)**

Increase the preview thumbnail size from 64x48px to 100x75px:

```css
/* Before */
.tru-ai-step-preview {
  width: 64px;
  height: 48px;
  border-radius: 8px;
  ...
}

/* After */
.tru-ai-step-preview {
  width: 100px;
  height: 75px;
  border-radius: 10px;
  ...
}
```

---

## Summary Table

| Component | Change | File | Lines |
|-----------|--------|------|-------|
| Distance Badge | Only show when both cities entered | `src/pages/Index.tsx` | ~228-233 |
| Status Indicator | Only mark complete when both cities | `src/pages/Index.tsx` | ~280 |
| Progress Bar | Remove from quote card | `src/pages/Index.tsx` | 1046-1052 |
| AI Step Previews | Increase size to 100x75px | `src/index.css` | 2641-2655 |

---

## Expected Results

1. **Distance field** shows "— mi" until user enters BOTH origin AND destination cities
2. **AI preview thumbnails** are larger and more visible (100x75px vs 64x48px)
3. **Quote form card** no longer has the green gradient progress bar at the top

