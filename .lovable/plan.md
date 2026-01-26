
# Plan: Fix Content Panel Grid Placement

## Problem
The "blagg is gay" content panel is appearing **below** the form instead of **beside** it because it's **nested inside** the `.tru-hero-right-half` container instead of being a **sibling** of it in the grid.

**Current (wrong) structure:**
```text
.tru-hero.tru-hero-split (grid: 520px | 1fr)
  ├── .tru-hero-header-section (spans both columns)
  └── .tru-hero-right-half (column 1)
        ├── .tru-hero-form-panel
        └── .tru-hero-content-panel  ← NESTED INSIDE!
```

**Required (correct) structure:**
```text
.tru-hero.tru-hero-split (grid: 520px | 1fr)
  ├── .tru-hero-header-section (spans both columns)
  ├── .tru-hero-right-half (column 1) ← Form only
  │     └── .tru-hero-form-panel
  └── .tru-hero-content-panel (column 2) ← SIBLING, not nested!
```

## Solution

### 1. Move Content Panel Outside Form Container
**File:** `src/pages/Index.tsx`

Move the `.tru-hero-content-panel` div from **inside** `.tru-hero-right-half` to be a **sibling** of it at the same level.

**Before (around lines 1071-1086):**
```tsx
            </div>  {/* end .tru-hero-form-panel */}

              {/* RIGHT SIDE: Value Proposition Content */}
              <div className="tru-hero-content-panel">
                ...
              </div>

              {/* SIDEBAR: Temporarily hidden ... */}
            </div>  {/* end .tru-hero-right-half */}
```

**After:**
```tsx
            </div>  {/* end .tru-hero-form-panel */}

            </div>  {/* end .tru-hero-right-half */}

            {/* RIGHT SIDE: Value Proposition Content - NOW A GRID SIBLING */}
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

The content panel must be closed **before** the `.tru-hero-right-half` closing tag, not inside it.

## Visual Result

```text
+--------------------------------------------------+
| Row 1: "Trumove. A Smarter Way To Move."         |
+--------------------------------------------------+
| Column 1 (520px)      |  Column 2 (1fr)          |
|                       |                          |
| [Form Card]           |  "blagg is gay"          |
|  - Progress bar       |                          |
|  - From/To inputs     |  Skip the complexity...  |
|  - Continue btn       |                          |
|  - Trust badges       |  Lorem ipsum...          |
|                       |                          |
+--------------------------------------------------+
```

## Files Modified
1. `src/pages/Index.tsx` - Move `.tru-hero-content-panel` to be a direct child of the grid container

## Technical Note
- The CSS is already correct (`grid-row: 2; grid-column: 2;`)
- Only the JSX nesting structure needs to change
- No CSS changes required
