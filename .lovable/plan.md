
# AI Landing Page Generator Enhancements

## Overview
This plan addresses two key improvements to the AI Landing Page Generator:

1. **Landing pages as editable popout modals** - The generated landing page should use the reusable `DraggableModal` component (like Granot and RingCentral), allowing users to edit content while the modal is popped out
2. **Import data before generation** - Move the "Import Data" functionality to the pre-generation form so analytics data can inform the input fields before the landing page is created

---

## Current Architecture

The `AILandingPageGenerator` component has two main states:
- **Pre-generation view** (`showLandingPage === false`): Shows template selection, input form (Business Name, Target Location, Target Audience, Main Offer), and Generate button
- **Post-generation view** (`showLandingPage === true`): Shows the generated landing page with inline editing, popout capability, and data import

The current popout modal is a custom inline implementation (~200 lines of code) with:
- Manual drag/resize handling
- Position/size persistence in localStorage
- Side-by-side analytics view

---

## Implementation Plan

### Part 1: Move Import Data to Pre-Generation Form

**Goal**: Allow users to import analytics data before generating a landing page, so the AI can use this data to inform better defaults.

**Changes to AILandingPageGenerator.tsx:**

1. **Add new section (Step 3) before the Generate button**:
   - Add "Import Analytics Data (Optional)" section between the business form and generate button
   - Show the same import options (Google Ads, Google Analytics, Upload CSV)
   - Display a condensed summary of imported data if available

2. **Pre-populate form fields from imported data**:
   - When data is imported, auto-fill `targetLocation` from top geographic markets (e.g., "California, Texas, Florida")
   - Auto-fill `targetAudience` from top demographic segments
   - Suggest `mainOffer` improvements based on winning keyword insights

3. **Update generation flow**:
   - Pass imported data context to influence template selection recommendations
   - Show badges indicating "Data-Driven" generation when analytics are pre-imported

```text
┌─────────────────────────────────────────┐
│  Step 1: Choose Template                │
├─────────────────────────────────────────┤
│  Step 2: Business Info                  │
├─────────────────────────────────────────┤
│  Step 3: Import Analytics (Optional)    │  ← NEW
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Google  │ │Analytics│ │ Upload  │   │
│  │  Ads    │ │         │ │  CSV    │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│  [Imported: 24,847 clicks, 1,892 conv]  │
├─────────────────────────────────────────┤
│  [🌟 Generate Landing Page with AI]     │
└─────────────────────────────────────────┘
```

---

### Part 2: Convert Popout to DraggableModal Component

**Goal**: Replace the 200+ lines of custom popout modal code with the reusable `DraggableModal` component, ensuring editing still works.

**Changes:**

1. **Replace custom popout with DraggableModal**:
   - Remove inline popout state management (`popoutPosition`, `popoutSize`, `isDragging`, `isResizing`, etc.)
   - Import and use `DraggableModal` from `@/components/ui/DraggableModal`
   - Configure with appropriate defaults for landing page preview

2. **Pass editing capability to modal**:
   - The `EditableText` component and editing state (`editingSection`, `tempEditValue`, etc.) already work via React state
   - Move the template rendering and `EditableText` components inside the `DraggableModal` children
   - Editing will continue to work as state is shared with the parent component

3. **Maintain side-by-side analytics view**:
   - Add a toggle inside the modal to switch between "Preview Only" and "Side-by-Side" views
   - Keep the analytics panel implementation but render it inside the modal content area

4. **Configure DraggableModal props**:
```typescript
<DraggableModal
  isOpen={isPopoutOpen}
  onClose={() => setIsPopoutOpen(false)}
  title={
    <div className="flex items-center gap-2">
      <Sparkles className="w-4 h-4" />
      <span>Landing Page Preview</span>
      <Badge>{selectedTemplate}</Badge>
    </div>
  }
  storageKey="tm_landing_page_popout"
  defaultWidth={1200}
  defaultHeight={700}
  minWidth={600}
  minHeight={400}
  maxWidth={1800}
  maxHeight={1000}
  headerClassName="bg-gradient-to-r from-purple-600 to-purple-500"
  footer={<ActionButtons />}
>
  {/* Browser chrome + editable preview */}
</DraggableModal>
```

---

### Part 3: Enhance Editing in Popout Mode

**Goal**: Ensure all editing capabilities work seamlessly in the popout modal.

**Changes:**

1. **Inline text editing in popout**:
   - The `EditableText` component with click-to-edit already works
   - Verify editing state persists when opening/closing popout

2. **Add template switching in popout**:
   - Add template selector in the popout header or footer
   - Allow switching templates without closing the modal

3. **Add theme selector in popout** (already exists, will be maintained):
   - Color theme dropdown
   - Real-time preview updates

4. **Add export actions in popout footer**:
   - Export HTML button
   - Copy HTML button
   - PDF export button (if data imported)
   - Publish button

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/demo/ppc/AILandingPageGenerator.tsx` | Main refactor - move import section, replace popout with DraggableModal, reorganize state |

---

## Technical Details

### State Management Updates

**Remove** (replaced by DraggableModal):
- `popoutPosition`
- `popoutSize`
- `isDragging`
- `dragOffset`
- `isResizing`
- `resizeStart`
- `popoutRef`
- `loadPopoutState()` / `savePopoutState()`
- `handleDragStart()` / `handleResizeStart()`
- Mouse event listeners for drag/resize

**Keep**:
- `isPopoutOpen` - controls modal visibility
- `isSideBySide` - controls layout inside modal
- `showHeatmapOverlay` - controls heatmap display
- `editingSection` / `tempEditValue` - controls inline editing
- All section content state

### Pre-Generation Import Flow

```text
User clicks "Import Data" in Step 3
        ↓
Show import options (Google Ads, Analytics, CSV)
        ↓
User selects source → Load MOCK_IMPORTED_DATA
        ↓
Auto-populate form fields:
  - targetLocation = Top 3 states from geographic data
  - Suggest targetAudience from demographics
        ↓
Show "Data Imported" badge with summary stats
        ↓
User clicks Generate → AI uses data context
```

---

## Summary

This refactor:
- Reduces code by ~150 lines by reusing `DraggableModal`
- Moves data import to a more logical position in the workflow
- Enables data-driven landing page generation
- Maintains all existing editing and export functionality
- Follows established patterns used by Granot and RingCentral modals
