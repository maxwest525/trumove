
# Secondary Button Styling Fix Plan

## Summary
This plan addresses the remaining secondary button styling issues, particularly reducing the green glow on the "Analyze Route" button and ensuring all secondary buttons have consistent hover states without green text/icon transformation.

---

## Current Status

### Completed
- **Modal secondary buttons** (`tru-modal-secondary-btn`) - properly styled with transparent bg, subtle border, white icons
- **Secondary action buttons** (`tru-secondary-action-btn`) - correctly implemented
- **Dark action buttons** (`tru-dark-action-btn`) - added to Book.tsx with subtle green underglow
- **Navbar styling** - consistent across all pages via `tru-static-nav-menu`

### Needs Fixing
1. **Analyze Route button glow** - still too intense despite previous reductions
2. **Scanner badge/start buttons** - may still show green text on hover
3. **Homepage hero buttons** - need verification of hover states

---

## Implementation Plan

### Phase 1: Reduce Analyze Route Button Glow

**File: `src/index.css`**

Update `.tru-qb-continue.tru-engine-btn` styling:

| Property | Current Value | New Value |
|----------|---------------|-----------|
| Default box-shadow glow | `0 0 8px hsl(var(--primary) / 0.06)` | `0 0 4px hsl(var(--primary) / 0.03)` |
| Hover box-shadow glow | `0 0 10px hsl(var(--primary) / 0.1)` | `0 0 6px hsl(var(--primary) / 0.05)` |
| Hover border opacity | `hsl(var(--primary) / 0.35)` | `hsl(var(--primary) / 0.2)` |
| Icon drop-shadow | `0 0 2px hsl(var(--primary) / 0.4)` | `0 0 1px hsl(var(--primary) / 0.2)` |
| Pulse animation opacity | `0.4 → 0.7` | `0.2 → 0.35` |

### Phase 2: Fix Scanner Buttons

**File: `src/index.css`**

Update `.tru-ai-scanner-badge` and `.tru-ai-scanner-start-btn`:
- Remove any green text color on hover
- Ensure `color: currentColor` on SVGs
- Keep the button itself dark themed

### Phase 3: Audit All Secondary Buttons

Target classes to verify and fix:
- `.tru-hero-call-btn` - verify no green text on hover
- `.tru-ai-cta-btn` - verify icons stay white
- `.tru-hero-btn-secondary` - if exists, verify styling
- `.tracking-map-go-btn` - reduce glow further if needed

### Phase 4: Consistent Icon Treatment

Add global rule to enforce icon color inheritance:

```text
/* Example pattern */
.tru-secondary-* svg,
.tru-modal-secondary-* svg,
.tru-hero-* svg {
  color: currentColor !important;
}
```

---

## Technical Details

### Files to Modify

1. **`src/index.css`** - Primary file containing all button styles
   - Lines ~2800-3100: AI CTA and scanner buttons
   - Lines ~6350-6430: Engine button (Analyze Route)
   - Lines ~28475-28500: Tracking map go button

### Specific CSS Changes

**Engine Button (Analyze Route) - Minimal Glow**
```text
.tru-qb-continue.tru-engine-btn {
  box-shadow: 
    0 0 4px hsl(var(--primary) / 0.03),    /* Reduced from 0.06 */
    0 4px 16px hsl(var(--tm-ink) / 0.25);
}

.tru-qb-continue.tru-engine-btn:hover:not(:disabled) {
  border-color: hsl(var(--primary) / 0.2); /* Reduced from 0.35 */
  box-shadow: 
    0 0 6px hsl(var(--primary) / 0.05),    /* Reduced from 0.1 */
    0 6px 20px hsl(var(--tm-ink) / 0.35);
}

/* Reduce icon glow */
.tru-qb-continue.tru-engine-btn .tru-btn-scan,
.tru-qb-continue.tru-engine-btn .tru-btn-arrow {
  filter: drop-shadow(0 0 1px hsl(var(--primary) / 0.2));
}

/* Softer pulse animation */
@keyframes engine-glow-pulse {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.35; transform: scale(1.005); }
}
```

**Scanner Buttons - No Green Text on Hover**
```text
.tru-ai-scanner-badge:hover,
.tru-ai-scanner-start-btn:hover {
  background: hsl(var(--foreground));
  color: hsl(var(--background)); /* Stays black/white, not green */
}

.tru-ai-scanner-badge svg,
.tru-ai-scanner-start-btn svg {
  color: currentColor; /* Matches button text color */
}
```

**Tracking Map Go Button - Further Reduction**
```text
.tracking-map-go-btn:hover:not(:disabled) {
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.25),
    0 0 4px hsl(var(--primary) / 0.05); /* Reduced from 0.08 */
}
```

---

## Verification Checklist

After implementation, verify these elements:

1. **Homepage**
   - [ ] "Analyze Route" button has minimal green glow
   - [ ] Scanner badge/start buttons stay white text on hover
   - [ ] Hero CTA buttons maintain white icons

2. **Modals**
   - [ ] ScanIntroModal secondary buttons (Phone/Video) have white icons
   - [ ] InventoryIntroModal secondary buttons match
   - [ ] Hover shows subtle green border, no text color change

3. **Book Page**
   - [ ] "Schedule a Call" button has subtle green underglow on hover
   - [ ] "Whiteboard" and "Share Screen" buttons match
   - [ ] All icons stay white

4. **Live Tracking**
   - [ ] "Analyze Route" / "View Route" buttons have reduced glow
   - [ ] Green icons are acceptable, but glow is subtle

5. **Dark Mode**
   - [ ] All buttons maintain proper contrast
   - [ ] Glow effects remain subtle and not overpowering

---

## Estimated Impact
- **Files changed**: 1 (src/index.css)
- **Lines modified**: ~30-40 lines
- **Risk**: Low - CSS-only changes with no logic modifications
