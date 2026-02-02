
## Raise Trust Bar by 20px

### Overview
The black stats strip with "SERVING 48 STATES", "50,000+ MOVES COMPLETED", etc. needs to move 20px higher on the page.

### Current State
The `.stats-strip` component has `margin-top: -175px` which positions it to overlap with the hero section above.

### Implementation

**File: `src/index.css`**
- Line 30130: Change `margin-top: -175px` to `margin-top: -195px`

This single CSS change will raise the entire trust bar by 20px, creating more overlap with the content above it.

---

### Technical Details
| Property | Current Value | New Value |
|----------|---------------|-----------|
| `margin-top` | `-175px` | `-195px` |

The negative margin pulls the strip upward, so increasing the negative value by 20px raises it by 20px.
