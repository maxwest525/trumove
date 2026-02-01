
# Implementation Plan: Shipment Command Center Modal + Live Agent Enhancements

## Overview

This plan addresses multiple feature requests across two pages:

1. **Book.tsx (Video Consult)**: Live Agent status indicator and dynamic queue countdown
2. **LiveTracking.tsx (Shipment Command Center)**: Entry modal for route setup, layout improvements, and cross-page navigation

---

## Part 1: Live Agent Enhancements (Book.tsx)

### 1.1 Agent Availability Status System

Add a simulated "Busy" vs "Available" status to the Live Agent header that changes dynamically:

```text
+---------------------------+
| [Avatar]                  |
| Live Agent Chat           |
| [Status Badge] Available  | <-- Dynamic status indicator
+---------------------------+
```

**Implementation Details:**
- Add state: `agentStatus: 'available' | 'busy'`
- Add `useEffect` to simulate random availability changes (e.g., every 30-60 seconds toggle between states)
- Update header to show colored badge:
  - Green dot + "Available" when available
  - Amber/orange dot + "Busy" when busy
- When busy, show estimated wait time in the header subtitle

### 1.2 Dynamic Queue Countdown Timer

Enhance `AgentQueueIndicator` with a real-time countdown:

**Current State:**
```
Queue Position: #2
Estimated wait: ~2 minutes
[Progress bar]
```

**New State:**
```
Queue Position: #2 → #1 (updates)
Estimated wait: 1:45 (countdown timer)
[Animated progress bar]
```

**Implementation Details:**
- Add state for `queuePosition` and `queueWaitSeconds`
- Add `useEffect` with `setInterval` to:
  - Decrement `queueWaitSeconds` every second
  - Occasionally decrement `queuePosition` (when timer hits certain thresholds)
  - Clear queue when position reaches 0 (agent "connected")
- Update `AgentQueueIndicator` to accept dynamic props
- Add visual feedback when queue position changes (brief highlight/animation)

---

## Part 2: Shipment Command Center Modal (LiveTracking.tsx)

### 2.1 Route Setup Entry Modal

Create a new modal that appears on page load, replacing the sidebar-based route setup:

```text
+---------------------------------------+
|          Track Your Shipment          |
|                                       |
| [Origin Address Input         ]       |
| [Destination Address Input    ]       |
|                                       |
| --- OR ---                            |
|                                       |
| [Booking/Shipping Number      ]       |
|                                       |
| [Cancel]              [View Route]    |
+---------------------------------------+
```

**Implementation Details:**
- Add state: `showRouteModal: boolean` (default: `true` on mount)
- Create `RouteSetupModal` component with:
  - `LocationAutocomplete` for origin address
  - `LocationAutocomplete` for destination address
  - Divider with "OR" text
  - Input for booking/shipping number (auto-populates addresses when valid)
  - Date picker (only shown when booking number is entered)
  - "View Route" button to close modal and start tracking
  - Optional "Cancel" or close button
- When booking number entered (e.g., 12345), auto-fill origin/destination and show date
- On "View Route" click: close modal, populate route, center map

### 2.2 Remove Left Sidebar Route Setup

Since the modal now handles route entry:
- Remove the entire `<div className="tracking-sidebar">` section containing:
  - Origin input with Street View preview
  - Destination input with Street View preview
  - Move Date picker
  - Start/Pause/Reset buttons

### 2.3 Layout Recentering

With the left sidebar removed, update the layout:

**Current CSS Grid:**
```css
grid-template-columns: 480px minmax(180px, 1fr) 480px;
```

**New CSS Grid (2-column):**
```css
grid-template-columns: minmax(400px, 1fr) 400px;
```

- Map takes the larger left column
- Dashboard (stats, weather, route info) takes the right column
- Content properly padded below the sticky header

### 2.4 Lower Content Below Header

Add proper top padding/margin to `.tracking-content` to prevent content from being hidden behind the sticky header:

```css
.tracking-content {
  margin-top: 12px; /* Add spacing below header */
  /* existing styles... */
}
```

The tracking header is already sticky at `top: 103px` offset, so the content grid needs to start below it.

### 2.5 Cross-Page "View Route" Navigation

Add a "View Route" button to relevant forms that navigates to the tracking page with pre-populated data:

**Target Forms:**
- `EstimateWizard.tsx` - After entering origin/destination
- `OnlineEstimate.tsx` - Quote result screen
- `Index.tsx` - Hero form (if applicable)

**Implementation:**
- Use `useNavigate` from `react-router-dom`
- Store route data in localStorage before navigation:
  ```typescript
  localStorage.setItem('trumove_pending_route', JSON.stringify({
    originAddress: '...',
    destAddress: '...',
    originCoords: [...],
    destCoords: [...]
  }));
  navigate('/track');
  ```
- In `LiveTracking.tsx`, check for pending route on mount and auto-populate

---

## Technical Details

### New State Variables (LiveTracking.tsx)
```typescript
const [showRouteModal, setShowRouteModal] = useState(true);
const [modalOriginAddress, setModalOriginAddress] = useState("");
const [modalDestAddress, setModalDestAddress] = useState("");
const [modalBookingNumber, setModalBookingNumber] = useState("");
```

### New State Variables (Book.tsx)
```typescript
const [agentStatus, setAgentStatus] = useState<'available' | 'busy'>('available');
const [queuePosition, setQueuePosition] = useState(2);
const [queueWaitSeconds, setQueueWaitSeconds] = useState(120);
```

### CSS Updates (index.css)
```css
/* Updated 2-column tracking layout */
.tracking-content {
  grid-template-columns: minmax(400px, 1fr) 400px;
  padding-top: 16px;
}

/* Route Setup Modal */
.route-setup-modal {
  /* Modal overlay and card styles */
}

/* Agent status badge styles */
.agent-status-badge {
  /* Available/Busy badge variants */
}
```

### Files Modified
1. **src/pages/LiveTracking.tsx**
   - Add `RouteSetupModal` component
   - Add modal state management
   - Remove left sidebar
   - Check for pending route data on mount
   - Update layout structure

2. **src/pages/Book.tsx**
   - Add agent status state and simulation
   - Add queue countdown state and timer
   - Update `AgentQueueIndicator` to use dynamic values
   - Update Live Agent header with status badge

3. **src/index.css**
   - Update `.tracking-content` grid to 2 columns
   - Add top padding for header clearance
   - Add modal styles
   - Add status badge styles
   - Update responsive breakpoints

4. **src/components/estimate/EstimateWizard.tsx**
   - Add "View Route" button after address entry
   - Add navigation logic with data persistence

5. **src/pages/OnlineEstimate.tsx**
   - Add "View Route" button to quote results

---

## Summary of Changes

| Feature | File(s) | Complexity |
|---------|---------|------------|
| Agent Busy/Available status | Book.tsx | Low |
| Dynamic queue countdown | Book.tsx | Medium |
| Route Setup Entry Modal | LiveTracking.tsx | Medium |
| Remove left sidebar | LiveTracking.tsx | Low |
| Recenter layout (2-column) | LiveTracking.tsx, index.css | Medium |
| Lower content below header | index.css | Low |
| "View Route" cross-navigation | EstimateWizard.tsx, OnlineEstimate.tsx, LiveTracking.tsx | Medium |
