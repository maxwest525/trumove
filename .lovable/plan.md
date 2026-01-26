
# Plan: Add Right-Side Hero Content + Visual Separation

## Overview
This plan adds new headline content on the right side of the hero section while adding a subtle visual separator to replace the removed green line in the form. The changes are designed to be additive without disrupting existing spacing.

## Changes

### 1. Add Subtle Visual Separator to Form
**File:** `src/index.css`

Replace the hidden green line with a subtle bottom border on the question heading for visual separation:

```css
.tru-qb-question-decorated::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 1px;
  background: hsl(var(--tm-ink) / 0.12);
  display: block;
}
```

This adds a very subtle, centered horizontal line below "Enter your route to begin matching" without being as prominent as the green accent was.

---

### 2. Add Right-Side Hero Content Section
**File:** `src/pages/Index.tsx`

Add a new content section positioned on the right side of the hero grid (after the form panel). This will contain:

- **Headline:** "blagg is gay" with "gay" using the `.tru-hero-headline-accent` class for the green gradient
- **Description:** The provided text about skipping van line complexity, AI scanning, etc.

The new JSX will be inserted after the form panel div closes (around line 920), positioned within the existing grid layout:

```tsx
{/* RIGHT SIDE: Value Proposition Content */}
<div className="tru-hero-content-panel">
  <div className="tru-hero-content-inner">
    <h2 className="tru-hero-headline-main">
      blagg is <span className="tru-hero-headline-accent">gay</span>
    </h2>
    <p className="tru-hero-subheadline">
      Skip the complexity of large national van lines. We use <strong>AI inventory scanning</strong> and <strong>live video consults</strong> to understand your move, then vet carriers using verified <strong>FMCSA and DOT safety data</strong>, so we can confidently match you with carriers that best meet your needs.
    </p>
    <p className="tru-hero-subheadline" style={{ opacity: 0.6 }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </div>
</div>
```

---

### 3. Update CSS for Right Panel Styling (if needed)
**File:** `src/index.css`

The existing `.tru-hero-content-panel` and `.tru-hero-content-inner` classes should work, but may need minor adjustments for text alignment:

```css
.tru-hero-content-panel .tru-hero-headline-main {
  text-align: left;
  justify-content: flex-start;
}

.tru-hero-content-panel .tru-hero-subheadline {
  text-align: left;
  margin-left: 0;
  margin-right: 0;
}
```

---

## Visual Layout Preview

```text
+------------------------------------------+
|     Trumove. A Smarter Way To Move.      |  <- Centered header (unchanged)
|     [subheadline description]            |
+------------------------------------------+
|                    |                     |
|   [Form Card]      |   blagg is gay      |  <- New right content
|   - Progress bar   |                     |
|   - From/To inputs |   [description...]  |
|   - Continue btn   |   [lorem ipsum...]  |
|                    |                     |
+------------------------------------------+
```

---

## Technical Notes

- **No spacing changes:** The existing grid layout (`grid-template-columns: 520px 1fr`) will automatically position the new content panel
- **Green gradient reuse:** The `.tru-hero-headline-accent` class already exists and provides the exact gradient styling
- **Existing classes:** Using `.tru-hero-content-panel` which is already defined in CSS with `order: 2` to position it on the right

---

## Files Modified
1. `src/pages/Index.tsx` - Add new content panel JSX
2. `src/index.css` - Update decorated question border, adjust right panel text alignment
