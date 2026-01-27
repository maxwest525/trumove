
# UI Refinement Plan

This plan addresses three specific requests:
1. Move the hero headline (logo + "A Smarter Way To Move") higher on the page
2. Make the SAFER trust strip thicker and more prominent, emphasizing DOT and FMCSA
3. Remove the subheadline "Technology, transparency, and control..." for now (to be repositioned later)

---

## Changes Overview

### 1. Move Hero Headline Higher

The current hero header section has significant padding that pushes the headline down. We'll reduce this padding to bring the logo and headline closer to the top of the visible area.

**File:** `src/index.css`
- Reduce top padding on `.tru-hero-header-section.tru-hero-header-refined` from `32px` to `16px`
- Adjust the overall hero section padding to create a tighter layout

### 2. Enhance SAFER Trust Strip

Make the trust bar more prominent with:
- Increased padding (thicker bar)
- Larger, bolder font for all items
- Special emphasis styling for "DOT" and "FMCSA" related terms
- Stronger text weight and slightly larger icons

**File:** `src/index.css`
- Increase `.tru-safer-trust-bar` padding from `5px 16px` to `10px 24px`
- Increase font size from `10px` to `12px`
- Increase font weight from `600` to `700`
- Increase icon size from `13px` to `16px`
- Add special emphasis for the "Official FMCSA Source" link

**File:** `src/components/layout/SiteShell.tsx`
- Update trust items to include visual emphasis for government/authority terms

### 3. Remove Subheadline Temporarily

Remove the "Technology, transparency, and control - built for the most important move of your life." subheadline from the hero section. This will be repositioned elsewhere in a future update.

**File:** `src/pages/Index.tsx`
- Remove or comment out the `<p className="tru-hero-subheadline-refined">` element

---

## Technical Details

### CSS Changes (`src/index.css`)

**Trust Strip Enhancements:**
```css
.tru-safer-trust-bar {
  padding: 10px 24px;  /* Was: 5px 16px */
}

.tru-safer-trust-item {
  font-size: 12px;     /* Was: 10px */
  font-weight: 700;    /* Was: 600 */
}

.tru-safer-trust-item svg {
  width: 16px;         /* Was: 13px */
  height: 16px;
}

.tru-safer-trust-link {
  font-size: 12px;     /* Was: 10px */
  font-weight: 800;    /* Extra bold for FMCSA */
}
```

**Hero Header Adjustments:**
```css
.tru-hero-header-section.tru-hero-header-refined {
  padding: 16px 48px;  /* Was: 32px 48px - moves headline higher */
}
```

### JSX Changes (`src/pages/Index.tsx`)

Remove the subheadline paragraph:
```jsx
{/* Subheadline removed - to be repositioned */}
{/* 
<p className="tru-hero-subheadline-refined">
  Technology, transparency, and control...
</p>
*/}
```

---

## Visual Result

After these changes:
- The TruMove logo and "A Smarter Way To Move" will appear higher on the page
- The trust strip will be noticeably thicker with bolder, more prominent text
- The FMCSA link will stand out as an official government source
- The hero area will be cleaner without the subheadline (ready for repositioning)
