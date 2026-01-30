

# Remove "Powered by AI" Pill from AI Inventory Analysis Section

## Overview
Remove the "Powered by AI" header badge pill from the AI Inventory Analysis section on the homepage.

---

## Current State
The section has a header badge displaying "Powered by AI" with a sparkles icon:
```tsx
{/* Header Badge */}
<div className="tru-ai-header-badge">
  <Sparkles className="w-4 h-4" />
  <span>Powered by AI</span>
</div>
```

## Target State
Remove the entire badge element. The section will still have:
- Gradient header ("AI Inventory Analysis")
- Accent line
- Subtitle
- All other content

---

## Change Required

**File:** `src/pages/Index.tsx` (lines 1534-1538)

Delete the header badge block:
```tsx
{/* DELETE THIS BLOCK */}
{/* Header Badge */}
<div className="tru-ai-header-badge">
  <Sparkles className="w-4 h-4" />
  <span>Powered by AI</span>
</div>
```

---

## Summary

| Change | Effect |
|--------|--------|
| Remove badge element | Cleaner section header with just the gradient title |
| Keep gradient header | "AI Inventory Analysis" title remains prominent |
| Keep accent line | Visual separator still present |

