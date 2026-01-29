
# Dark Mode Fixes, Homepage Layout Updates & Tracking Preview

This plan addresses multiple issues identified in the review:

---

## Issue 1: Dark Mode Form Buttons Are Unreadable

**Problem:** The screenshot shows white buttons (HOME SIZE, etc.) with white/light text on a dark form background. The root cause:
- `.tru-qb-size-btn` uses hardcoded `background: #ffffff` (line 14068)
- `.tru-qb-toggle-card` uses hardcoded `background: #ffffff` (line 14110)
- Dark mode overrides exist for `.tru-qb-size-card` but NOT for `.tru-qb-size-btn`

**Fix:** Add dark mode overrides for these button classes:
```css
/* Dark mode: size buttons (HOME SIZE grid) */
.dark .tru-qb-size-btn {
  background: hsl(220 15% 12%);
  border-color: hsl(0 0% 100% / 0.12);
  color: hsl(0 0% 100% / 0.85);
}

.dark .tru-qb-size-btn:hover {
  background: hsl(220 15% 18%);
  border-color: hsl(var(--primary) / 0.4);
}

.dark .tru-qb-size-btn.is-active {
  background: hsl(var(--primary) / 0.15);
  border-color: hsl(var(--primary) / 0.6);
  color: hsl(0 0% 100%);
}

/* Dark mode: toggle cards (House/Apartment, Stairs/Elevator) */
.dark .tru-qb-toggle-card {
  background: hsl(220 15% 12%);
  border-color: hsl(0 0% 100% / 0.12);
}

.dark .tru-qb-toggle-icon {
  color: hsl(0 0% 100% / 0.5);
}

.dark .tru-qb-toggle-card.is-active .tru-qb-toggle-icon {
  color: hsl(var(--primary));
}

.dark .tru-qb-toggle-title {
  color: hsl(0 0% 100% / 0.9);
}
```

---

## Issue 2: Update 6 Feature Badges to Show Actual Features

**Current Features (already correct):**
1. Computer Vision Inventory (AI Scanner) - Scan
2. Live Video Walk-Through - Video
3. FMCSA Safety Intelligence - ShieldCheck
4. License Verification Engine - Shield
5. Coverage Validation - CreditCard
6. Zero Black Box - Zap

These ARE the actual features TruMove uses. The icons and labels are accurate and reflect real platform capabilities.

**No changes needed** - the features are already aligned with actual product offerings.

---

## Issue 3: Make Tracking Preview Card Blank Inside

**Requirement:** Keep the "Live Tracking - Real-Time Shipment Tracking" box but remove the screenshot image inside, leaving just the container header.

**Change to `TrackingPreviewCard` in Index.tsx:**

```tsx
function TrackingPreviewCard() {
  const navigate = useNavigate();
  
  return (
    <div 
      className="tru-tracking-preview-card"
      onClick={() => navigate('/track')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate('/track')}
    >
      <div className="tru-tracking-preview-header">
        <div className="tru-tracking-preview-badge">
          <span className="tru-tracking-live-dot" />
          <span>LIVE TRACKING</span>
        </div>
        <h3 className="tru-tracking-preview-title">Real-Time Shipment Tracking</h3>
        <p className="tru-tracking-preview-desc">Track your move with GPS precision and live ETA updates</p>
      </div>
      
      {/* Blank placeholder instead of screenshot */}
      <div className="tru-tracking-preview-placeholder">
        <ArrowRight className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">Try Demo</span>
      </div>
    </div>
  );
}
```

**Add CSS for placeholder:**
```css
.tru-tracking-preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 120px;
  background: hsl(var(--muted) / 0.3);
  border-top: 1px solid hsl(var(--border));
}
```

---

## Summary of Files to Modify

| File | Changes |
|------|---------|
| `src/index.css` | Add dark mode styles for `.tru-qb-size-btn`, `.tru-qb-toggle-card`, and related elements |
| `src/pages/Index.tsx` | Update `TrackingPreviewCard` to remove image, show blank placeholder |
| `src/index.css` | Add `.tru-tracking-preview-placeholder` styling |

---

## Verification After Implementation

1. Toggle to dark mode and verify:
   - HOME SIZE buttons (Studio, 1 Bed, etc.) have dark backgrounds with readable white text
   - Property Type buttons (House, Apartment) have proper dark styling
   - Floor selection buttons are readable
   - Stairs/Elevator toggles are visible
   
2. Check homepage tracking preview card shows:
   - Header with "LIVE TRACKING" badge
   - Title "Real-Time Shipment Tracking"
   - Blank placeholder area with "Try Demo" CTA
   
3. Verify Remote View button on /track page has neutral styling (not green-on-green)
