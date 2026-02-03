
## Enhance Text Visibility with Underglow Effects

### Summary
Add enhanced underglow styling to improve visibility of key page elements:
1. **TruMove Logo (Homepage)**: Add a subtle white underglow to make the logo pop against the hero background
2. **"Build Your Move" Section (Online Estimate page)**: Add dark black underglow to the headline and subheadline for better readability

---

### Implementation Details

#### 1. TruMove Logo - White Underglow

The homepage logo (`.tru-hero-logo`) currently has a black drop-shadow. I'll add a **soft white glow behind it** to create depth and make it more legible against varied backgrounds.

**Location**: `src/index.css` (around line 1450)

**Approach**:
- Add a white glow layer behind the existing black shadows
- Use a subtle white `drop-shadow` that creates a "halo" effect
- Keeps the logo visible on both light and dark hero image areas

#### 2. "Build Your Move" Headline & Subheadline - Black Underglow

On the Online Estimate page, the "Build Your Move" title and its subtitle ("Add your household items...") appear in the `.tru-summary-header-large` section. I'll add multi-layered black text shadows similar to the hero headline treatment.

**Locations affected**:
- `.tru-summary-header-large h3` - The "Build Your Move" headline
- `.tru-summary-header-large p` - The subheadline text

**Approach**:
- Add layered `text-shadow` with high-opacity blacks for deep underglow
- Ensures maximum readability against the gradient card backgrounds

---

### Technical Changes

**File**: `src/index.css`

| Element | Current State | After Change |
|---------|--------------|--------------|
| `.tru-hero-logo` | Black drop-shadows only | Add white glow layer for halo effect |
| `.tru-summary-header-large h3` | No text-shadow | Multi-layer black underglow |
| `.tru-summary-header-large p` | No text-shadow | Multi-layer black underglow (lighter) |

---

### Visual Result
- **Logo**: Will have a soft white "halo" glow, making it stand out on any background
- **Build Your Move**: Headline and subheadline will have enhanced depth and legibility with black underglow treatment matching the homepage hero style
