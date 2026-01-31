
# Plan: Update Trudy Button Subtitle Text

## Change Required

Update the subtitle text on the floating Trudy chat button from "Here to Help" to something more engaging and action-oriented.

## Recommended Options

| Option | Text | Reasoning |
|--------|------|-----------|
| **A** | "Your AI Move Expert" | Emphasizes expertise and AI capability |
| **B** | "Ask Me Anything" | Inviting and conversational |
| **C** | "Let's Plan Your Move" | Action-oriented, specific to purpose |
| **D** | "I Know Moving!" | Playful and confident |

**Recommendation**: Option **C** - "Let's Plan Your Move" - it's action-oriented, directly communicates value, and creates a sense of partnership.

## Implementation

**File**: `src/components/FloatingTruckChat.tsx`

**Line 128** - Change:
```tsx
<span className="text-xs leading-tight text-primary font-semibold">Here to Help</span>
```

To:
```tsx
<span className="text-xs leading-tight text-primary font-semibold">Let's Plan Your Move</span>
```

## Result

The floating Trudy button will display:
- **Title**: "Chat with Trudy"
- **Subtitle**: "Let's Plan Your Move" (more engaging and action-oriented)
