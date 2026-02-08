

# Plan: Hank Pill Above Transport Summary with Connecting Visual

## Overview
Reposition the Hank chat pill to appear **above** the Transport Summary modal with a subtle visual connector between them. Both components can expand (Hank opens a chat window, Transport Summary is draggable), so the design must account for these behaviors.

## Design Approach

```text
┌─────────────────────────────────────┐
│                                     │
│     ┌─────────────┐                 │
│     │ 👋 Hank Pill │  ← Trigger     │
│     └──────┬──────┘                 │
│            │                        │       ┌───────────────┐
│            │  ← Connecting Line     │       │    FORM       │
│            │                        │       │               │
│     ┌──────┴──────────┐            │←70px→│               │
│     │ Transport       │             │       │               │
│     │ Summary         │             │       │               │
│     │ (draggable)     │             │       └───────────────┘
│     └─────────────────┘             │
│                                     │
└─────────────────────────────────────┘
```

When Hank's chat modal opens, it will replace/overlay the pill position, and the connecting line will be hidden to avoid visual clutter.

---

## Technical Implementation

### 1. Create a Combined Container Component

Since both Hank and Transport Summary need to be visually connected, we'll create a wrapper component that positions them together.

**New File: `src/components/hvl/HankSummaryDock.tsx`**

This wrapper will:
- Contain both the Hank pill button and the Transport Summary modal
- Render a connecting SVG line between them
- Handle visibility states (hide connector when Hank chat is open)
- Be positioned 70px from the form with fixed horizontal placement

### 2. Update CSS Positioning

**File: `src/index.css`**

Changes:
- Create `.hvl-assistant-dock` - fixed container positioned 70px from form
- Move `.hvl-hank-form-pill` to be relative within the dock (at top)
- Add `.hvl-dock-connector` - a vertical dashed/gradient line between Hank and Summary
- The Transport Summary will be rendered below Hank in the dock
- Connector animates away when chat modal opens

### 3. Component Structure

```text
HankSummaryDock (fixed, 70px from form)
├── HankChatButton (at top)
│   ├── Pill Button (visible when closed)
│   └── Chat Modal (appears when open, positioned absolutely)
├── Connector Line (SVG or CSS pseudo-element)
└── VehiclePreviewModal (below Hank, still draggable independently)
```

### 4. Handle Expansion States

| State | Hank Pill | Connector | Transport Summary | Hank Chat |
|-------|-----------|-----------|-------------------|-----------|
| Default (vehicle selected) | Visible | Visible | Visible | Hidden |
| Default (no vehicle) | Visible | Hidden | Hidden | Hidden |
| Chat Open | Hidden | Hidden | Visible (unaffected) | Visible |
| Summary Dragged | Visible | Hidden (detaches) | Visible (new position) | N/A |

**Key Decision**: When the Transport Summary is dragged, the connector line should disappear since the components are no longer visually aligned. This is handled by checking the dragging state.

---

## Files to Create/Modify

### New File
- `src/components/hvl/HankSummaryDock.tsx` - Combined wrapper component

### Modified Files

1. **`src/index.css`**
   - Add `.hvl-assistant-dock` container styles
   - Add `.hvl-dock-connector` line styles with gradient animation
   - Update `.hvl-hank-form-pill` to be relative within dock
   - Update `.hvl-vehicle-modal` (Transport Summary) positioning for dock context
   - Add responsive breakpoints for mobile

2. **`src/components/hvl/HankChatButton.tsx`**
   - Accept `onOpenChange` callback prop to communicate chat state to parent
   - Export `isOpen` state for connector visibility logic

3. **`src/components/hvl/VehiclePreviewModal.tsx`**
   - Accept `onDragStart` and `onDragEnd` callbacks
   - Export `isDragging` state for connector visibility

4. **`src/pages/AutoTransport.tsx`**
   - Replace separate `<HankChatButton />` and `<VehiclePreviewModal />` with `<HankSummaryDock />`
   - Pass vehicle/route data to the dock component

---

## Connector Visual Design

The connecting line between Hank and Transport Summary will be:
- A subtle dashed or gradient line (Howard Red theme)
- Approximately 16-24px in length
- Fade in/out with smooth transitions
- Uses CSS pseudo-element (`:after`) or inline SVG

```css
.hvl-dock-connector {
  width: 2px;
  height: 20px;
  margin: 0 auto;
  background: linear-gradient(
    to bottom,
    hsl(0 70% 45% / 0.6),
    hsl(0 70% 45% / 0.2)
  );
  border-radius: 1px;
  transition: opacity 0.3s ease;
}

.hvl-dock-connector.is-hidden {
  opacity: 0;
}
```

---

## Responsive Behavior

For screens under 1200px width:
- The dock moves to bottom-right corner
- Connector is hidden (stacked vertical layout not needed)
- Hank pill and Summary appear separately

For mobile (under 480px):
- Full-width chat modal
- Summary minimizes or hides

