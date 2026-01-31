
# Plan: Update Floating Chat Button Text

## Change Required

Update the floating Trudy chat button text from "Trudy Your Move Specialist" to "Chat with Trudy".

## Implementation

**File**: `src/components/FloatingTruckChat.tsx`

**Line 102** - Change:
```tsx
<span className="text-sm font-bold leading-tight text-background">Trudy Your Move Specialist</span>
```

To:
```tsx
<span className="text-sm font-bold leading-tight text-background">Chat with Trudy</span>
```

## Result

The floating pill button that appears in the bottom-right corner will display "Chat with Trudy" instead of "Trudy Your Move Specialist", making it shorter and more action-oriented.
