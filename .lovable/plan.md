
# Update Floating Pill Label

## Change
Update the primary label text from "Trudy **The** Move Specialist" to "Trudy **Your** Move Specialist".

The secondary label "Here to Help" is already correct.

---

## Technical Details

### File to Modify
- `src/components/FloatingTruckChat.tsx`

### Change (Line 91)
```tsx
// From:
<span className="text-sm font-bold leading-tight text-background">Trudy The Move Specialist</span>

// To:
<span className="text-sm font-bold leading-tight text-background">Trudy Your Move Specialist</span>
```

---

## Result
The floating pill will display:
- **Primary:** "Trudy Your Move Specialist"
- **Secondary:** "Here to Help"
