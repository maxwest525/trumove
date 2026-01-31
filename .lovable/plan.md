

# Plan: Video Consult Page Header Restructure

## Overview
Reorganize the Video Consult (/book) page header and content layout by:
1. Moving trust strip back below header
2. Adding shipment ID input like the tracking page
3. Moving booking code/join/demo controls below the video window
4. Removing the 4 action cards currently below the video

## Changes

### 1. Reorder Trust Strip (Back Below Header)

**File: `src/pages/Book.tsx`**

In the sticky header block (lines 696-760), swap the order so trust strip comes after header:

```tsx
<div className="sticky top-[107px] z-40">
  {/* Header First */}
  <header className="video-consult-header">
    {/* ... header content ... */}
  </header>
  
  {/* Trust Strip Below */}
  <VideoConsultTrustStrip />
</div>
```

### 2. Add Shipment ID Input to Header

Replace the current header center controls (booking code input, Join, Demo) with a shipment ID lookup similar to the `/track` page:

```tsx
<div className="video-consult-header-controls">
  <div className="video-consult-header-search">
    <Search className="w-4 h-4 text-white/70" />
    <input
      type="text"
      placeholder="Enter Shipment ID (try 12345)"
      className="video-consult-header-input"
      value={shipmentInput}
      onChange={(e) => setShipmentInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          // Handle shipment lookup
        }
      }}
    />
    <Button className="video-consult-header-go-btn">
      Go
    </Button>
  </div>
</div>
```

New state required:
```tsx
const [shipmentInput, setShipmentInput] = useState("");
```

### 3. Move Booking Code Controls Below Video Window

After the video Card component (around line 835), add a new section with the booking code input, Join, and Demo buttons:

```tsx
{/* Booking Controls - Below Video */}
<div className="mt-6 flex flex-col items-center gap-4">
  <div className="flex items-center gap-3 w-full max-w-md">
    <Input
      value={bookingCode}
      onChange={(e) => setBookingCode(e.target.value)}
      placeholder="Enter booking code..."
      className="flex-1 h-11"
      onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
    />
    <Button onClick={handleJoinRoom} disabled={!bookingCode.trim()}>
      Join
    </Button>
    <Button variant="outline" onClick={handleStartDemo}>
      <Sparkles className="w-4 h-4 mr-2" />
      Demo
    </Button>
  </div>
  <p className="text-xs text-muted-foreground">
    Enter your booking code to join a scheduled session
  </p>
</div>
```

### 4. Remove Action Cards Grid

Delete the entire "Action Buttons Grid" section (lines 837-904):

```tsx
{/* REMOVE THIS ENTIRE SECTION */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {/* Quick Call */}
  ...
  {/* Build Inventory */}
  ...
  {/* AI Scanner */}
  ...
  {/* Schedule */}
  ...
</div>
```

### 5. Update Imports

Add `Search` icon import at top of file:
```tsx
import { 
  Video, Phone, Boxes, Camera, Calendar, ArrowRight, Play, Users, Monitor, 
  Mic, MicOff, VideoOff, MessageSquare, Plus, Minus, X, Package, Search,  // Add Search
  Sofa, Bed, UtensilsCrossed, Laptop, Wrench, LayoutGrid, List, Sparkles
} from "lucide-react";
```

## Summary of Layout Changes

| Before | After |
|--------|-------|
| Trust Strip | Header |
| Header (with booking code) | Trust Strip |
| Video Window | Video Window |
| 4 Action Cards | Booking Controls (Join/Demo) |

## Files to Modify
- `src/pages/Book.tsx`

