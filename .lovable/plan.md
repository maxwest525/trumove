
# Plan: Default Animation for Route Summary + Remove Route Map

## Summary
Two changes to the homepage quote builder form:

1. **Add a subtle entrance/idle animation to the route summary strip** that plays on initial render (before any data is entered), giving the component visual polish and drawing attention to where route information will appear.

2. **Remove the route preview map** that appears when both origin and destination locations are entered.

---

## Technical Changes

### 1. Add Default Animation to Route Summary Strip

**File: `src/index.css`**

Add a new `@keyframes` animation and apply it to the permanent route summary strip for an entrance effect:

```css
@keyframes route-summary-entrance {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.tru-qb-route-summary-permanent {
  /* existing styles... */
  animation: route-summary-entrance 0.5s ease-out;
}
```

Additionally, add a subtle "shimmer" or "breathing" effect to the inner boxes when they contain placeholder values (before data is entered). This can be a gentle background pulse:

```css
@keyframes route-item-breathe {
  0%, 100% {
    background: hsl(var(--muted) / 0.35);
  }
  50% {
    background: hsl(var(--muted) / 0.5);
  }
}

.tru-qb-route-summary-permanent .tru-qb-route-summary-item:not(.has-data) {
  animation: route-item-breathe 2.5s ease-in-out infinite;
}
```

Then update the JSX in `Index.tsx` to add a `has-data` class when data is present, so the breathing animation only plays on empty placeholder boxes.

---

### 2. Remove Route Preview Map

**File: `src/pages/Index.tsx`**

Remove the following block (lines 1092-1100):

```jsx
{/* Compact Route Preview Map - shows when both locations entered */}
{fromCoords && toCoords && (
  <div className="tru-qb-route-preview-map">
    <MapboxMoveMap 
      fromZip={fromZip}
      toZip={toZip}
    />
  </div>
)}
```

---

## Result

- The route summary strip will have a polished entrance animation when the page loads
- The origin/destination boxes will have a subtle "breathing" effect when empty, inviting user input
- Once data is entered, the breathing stops and the existing pulse animations take over
- No more route preview map appearing in the form when both locations are entered
