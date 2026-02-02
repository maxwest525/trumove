
# Simplify Contact Hub - Less Busy Design

## Overview
Declutter the Contact Hub by relocating controls and tools outside the video preview, moving the Booking ID search to the bottom, hiding the demo button, and removing visual noise.

## Current Issues Identified
1. **Too much in the video preview**: Settings, Volume, Demo button, and Booking ID are all cluttering the space
2. **Booking ID search is in the center** - should be at the bottom, less prominent
3. **Screen Sharing text message** - needs removal ("Screen Sharing Available — Collaborate on inventory, documents, and profiles.")
4. **Demo button too visible** - should be nearly hidden for when you need to show someone
5. **Schedule, Whiteboard, and Screen Share** - scattered; should be grouped together outside the video

## Changes to Make

### 1. Simplify ContactHub Component
**File: `src/components/video-consult/ContactHub.tsx`**

Remove from the video preview:
- Settings button (gear icon)
- Volume button (speaker icon)
- Demo button ("Try Demo Mode")
- Screen Sharing text message

Keep and reorganize:
- Header ("Ready to Connect")
- 4 action buttons (Video, Voice, Email, Text) - centered
- Booking ID search - moved to **bottom** of the preview window

The video preview becomes clean with just:
```
+-----------------------------------------------+
|            Ready to Connect                   |
|       How would you like to reach us?         |
|                                               |
|  [Video]  [Voice]  [Email]  [Text]            |
|                                               |
|                                               |
|  +---------------------------------------+    |
|  | Enter Booking or Shipment ID [Join]  |    |
|  +---------------------------------------+    |
+-----------------------------------------------+
```

### 2. Add Tool Strip Below Video Preview
**File: `src/pages/Book.tsx`**

Create a horizontal toolbar strip below the video window with:
- **Schedule a Call** button (opens calendar modal)
- **Whiteboard** button (opens whiteboard modal)
- **Screen Share** button (toggles screen sharing)
- **Demo** button - small, subtle, far right corner

Layout:
```
[Schedule a Call]  [Whiteboard]  [Screen Share]       [Demo]
```

The Demo button will be styled as a very small, ghost/text link to make it nearly invisible until needed.

### 3. Remove Items from ContactHub
- Delete the `Screen Sharing Available` text and icon
- Delete Settings dropdown button
- Delete Volume dropdown button
- Delete "Try Demo Mode" button
- Move Booking ID search box to absolute bottom of the container

### 4. Pass Demo Handler as Prop
The ContactHub will need a way to trigger video call without the demo button being inside it. The "Video Call" action button already calls `onStartVideoCall` which triggers the demo.

### 5. Icon Reference from User's Image
The user's screenshot shows a control strip with icons in this order:
- Pen/Whiteboard (PenTool)
- Speaker/Volume
- Microphone
- Video Camera
- Screen Share (Monitor)
- Settings (Gear)

This appears to be the in-call control bar. We'll keep the in-call controls as they are (shown during live call in `FakeAgentView`) and create a separate external toolbar for the idle state.

## Technical Implementation

### ContactHub.tsx Changes
1. Remove lines 141-148 (Screen Share text)
2. Remove lines 150-286 (entire bottom controls row with Settings, Volume, and Demo)
3. Reposition Booking ID search (lines 114-139) to be at absolute bottom with `absolute bottom-6 left-8 right-8`
4. Simplify the props interface - remove device/volume props since those are only needed during calls
5. Add `onDemoStart?: () => void` prop if needed for external demo trigger

### Book.tsx Changes
1. Add a toolbar strip between the video Card and the Chat Panel
2. Create inline buttons for: Schedule, Whiteboard, Screen Share
3. Add a tiny, subtle Demo button at the far right
4. Wire up handlers:
   - Schedule → `setShowScheduleModal(true)`
   - Whiteboard → `setShowWhiteboardModal(true)`
   - Screen Share → `handleScreenShare()`
   - Demo → `handleStartDemo()`

### Visual Design
- Tool strip uses neutral styling: `bg-muted/50 border rounded-xl p-3`
- Buttons are outlined with icons and labels
- Demo button: small text link style, opacity-60, no border

## Files to Modify
1. `src/components/video-consult/ContactHub.tsx` - Simplify dramatically
2. `src/pages/Book.tsx` - Add toolbar strip below video
