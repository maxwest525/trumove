
# Contact & Communication Center Redesign

## Overview
Transform the `/book` page from "Book Video Consult" to a comprehensive "Contact Us" / "Talk to Us Now" communication hub. This redesign removes the separate "Virtual Video Controls" box and integrates all communication options into a unified, intuitive interface.

## Current State Analysis
The current page has:
- A main video window (center-left) showing a paused state with "Ready to Connect"
- A chat panel (right side) with 3 tabs: Trudy AI, Live Support, In-Video Chat
- A separate "Virtual Video Controls" box below with buttons for: Share Screen, Schedule, Trudy AI, Whiteboard, Settings + Booking Code input
- The paused video state shows a generic "Ready to Connect" placeholder

## Planned Changes

### 1. Remove "Virtual Video Controls" Box
- Delete the entire `video-consult-booking-controls` section
- Move its functionality into the main video area and a new scheduling panel

### 2. Redesign Main Video Area (When Not On Call)
The paused/idle state will become a "Contact Hub" with primary action buttons:

```text
+-------------------------------------------------------+
|                   Ready to Connect                    |
|          How would you like to reach us?              |
|                                                       |
|  +-------------+  +-------------+  +-------------+    |
|  |   Start     |  |   Start     |  |   Send      |    |
|  |  Video Call |  |  Voice Call |  |   Email     |    |
|  +-------------+  +-------------+  +-------------+    |
|                                                       |
|               +-------------------+                   |
|               |   Send a Text     |                   |
|               +-------------------+                   |
|                                                       |
|  +-----------------------------------------------+    |
|  | Booking/Shipment ID: [______________] [Join]  |    |
|  +-----------------------------------------------+    |
|                                                       |
|  [Settings] [Volume]                                  |
+-------------------------------------------------------+
```

**Primary Actions (Large Buttons):**
- **Start Video Call** - Initiates demo/video session
- **Start Voice Call** - Opens `tel:` link for phone call
- **Send Email** - Opens `mailto:` link
- **Send a Text** - Opens SMS link or text input modal

**Secondary Controls:**
- Booking/Shipment ID search box with Join button (moved from controls box)
- Settings button (gear icon) - for camera/speaker selection
- Volume button (speaker icon) - for audio settings

### 3. New Scheduling Panel (Left of Video Preview)
Add a new card to the left of the main video window for scheduling:

```text
+------------------+  +---------------------------+  +-------------+
|  Schedule Call   |  |     Main Video Area       |  | Chat Panel  |
|                  |  |                           |  |             |
|  [Calendar UI]   |  |   Contact Hub (idle)      |  |  Trudy AI   |
|                  |  |   OR                      |  |  Live Spt   |
|  ○ Video Call    |  |   Active Call (live)      |  |  In-Video   |
|  ○ Voice Call    |  |                           |  |             |
|                  |  |                           |  |             |
|  [Schedule Btn]  |  |                           |  |             |
+------------------+  +---------------------------+  +-------------+
```

This panel includes:
- A compact booking calendar (reuse `BookingCalendar` component)
- Video/Voice call type selector (radio buttons)
- Contact info fields (name, phone, email)
- TCPA consent checkbox
- Schedule button

### 4. Move Video Controls to Active Call State
When a call IS active:
- Show the existing video controls (mic, camera, screen share, etc.) as they currently work
- Add Settings and Volume buttons to the control bar
- The FakeAgentView already has these controls in the overlay - ensure they're visible

### 5. Whiteboard Placement
Create a toolbar icon in the active video call controls or as a floating action button that appears during calls. Consider adding it to the control bar at the bottom of the video.

### 6. Update Page Title & Header
- Change "Video Consult Center" to "Contact Center" or "Connect With Us"
- Update section header from "Virtual Video Call" to "Connect With Us"

## Technical Implementation

### File Changes: `src/pages/Book.tsx`

**1. Update Page Layout Grid:**
Change from `grid-cols-[1fr,380px]` to `grid-cols-[280px,1fr,380px]` to accommodate the new scheduling panel.

**2. New Scheduling Panel Component:**
Create a new `SchedulePanel` component inline that includes:
- Compact calendar view
- Call type selector (video/voice radio)
- Contact form fields
- Schedule button

**3. Redesigned Idle Video State:**
Replace the current placeholder content with communication action buttons:
- 4 large action buttons (Video, Voice, Email, Text)
- Booking ID search row
- Settings/Volume buttons in corner

**4. Remove Virtual Video Controls Box:**
Delete lines ~2303-2423 containing the `video-consult-booking-controls` div.

**5. Add Controls to Active Call Bar:**
Modify `DemoVideoPlaceholder` control bar to include:
- Settings dropdown (already exists in FakeAgentView overlay)
- Volume control (already exists in FakeAgentView overlay)

**6. Update CSS Classes:**
Adjust responsive breakpoints for the new 3-column layout.

## Visual Design Considerations
- Use existing button variants (`variant="outline"`, `variant="default"`)
- Action buttons should use icons with labels: Video, Phone, Mail, MessageSquare
- Maintain dark gradient background in idle state
- Settings/Volume use the same overlay button style as existing controls
- Scheduling panel uses card styling matching the chat panel

## Implementation Order
1. Update grid layout to 3-column
2. Create scheduling panel (left side)
3. Redesign idle video state with action buttons
4. Move booking ID search into video area
5. Remove Virtual Video Controls box
6. Add Settings/Volume to video controls strip
7. Update page title and headers
8. Add Whiteboard to active call controls
