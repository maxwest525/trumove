

## Plan: Remove Duplicate Trust Strip from Map

### Overview
Remove the trust strip overlay I mistakenly added to the map. The FMCSA Verified and Live GPS indicators already exist on the page's trust strip, so duplicating them on the map was unnecessary.

---

### Changes

**File: `src/components/tracking/Google2DTrackingMap.tsx`**

1. **Remove the centered trust strip overlay** (lines 574-594)
   - Delete the entire `{/* Centered Trust Strip on Map */}` block

2. **Clean up unused imports**
   - Remove `ShieldCheck` and `Truck` from the lucide-react import since they're no longer needed

---

### Result
The map will be clean without any overlays, matching your original intention. The trust indicators remain only on the page-level trust strip where they belong.

