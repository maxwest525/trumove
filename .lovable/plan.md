

# Plan: Video Consult Header Simplification & Styling

## Overview
Simplify the Video Consult header by removing the shipment search and call button, integrating trust strip items directly into the header, removing the separate trust strip component, and styling the booking controls below the video with a dark theme.

## Changes

### 1. Modify Header - Remove Search & Call, Add Trust Items

**File: `src/pages/Book.tsx`**

Replace the current header content (lines 699-749) with a simplified structure:

```tsx
<header className="video-consult-header">
  {/* Left - Logo & Title */}
  <div className="flex items-center gap-3">
    <img 
      src={logoImg} 
      alt="TruMove" 
      className="h-6 brightness-0 invert"
    />
    <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/90">
      Video Consult Center
    </span>
  </div>

  {/* Center - Trust Items (inline) */}
  <div className="video-consult-header-trust">
    <div className="video-consult-header-trust-item">
      <Shield className="w-4 h-4" />
      <span>SECURE VIDEO</span>
    </div>
    <span className="video-consult-trust-dot">•</span>
    <div className="video-consult-header-trust-item">
      <BadgeCheck className="w-4 h-4" />
      <span>LICENSED BROKER</span>
    </div>
    <span className="video-consult-trust-dot">•</span>
    <div className="video-consult-header-trust-item">
      <Monitor className="w-4 h-4" />
      <span>SCREEN SHARING</span>
    </div>
    <span className="video-consult-trust-dot">•</span>
    <div className="video-consult-header-trust-item">
      <FileText className="w-4 h-4" />
      <span>QUOTE REVIEW</span>
    </div>
    <span className="video-consult-trust-dot">•</span>
    <div className="video-consult-header-trust-item">
      <Clock className="w-4 h-4" />
      <span>NO OBLIGATION</span>
    </div>
  </div>

  {/* Right - Empty spacer for balance */}
  <div className="w-[120px]" />
</header>
```

Remove `<VideoConsultTrustStrip />` from below the header.

### 2. Update Imports

**File: `src/pages/Book.tsx`**

Add trust strip icons and remove unused imports:

```tsx
import { 
  Video, Phone, Boxes, Camera, Calendar, ArrowRight, Play, Users, Monitor, 
  Mic, MicOff, VideoOff, MessageSquare, Plus, Minus, X, Package,
  Sofa, Bed, UtensilsCrossed, Laptop, Wrench, LayoutGrid, List, Sparkles,
  Shield, BadgeCheck, FileText, Clock  // Add these
} from "lucide-react";

// Remove or keep VideoConsultTrustStrip import - can be deleted
```

### 3. Add CSS for Header Trust Items

**File: `src/index.css`**

Add new styles for the inline trust items in the header:

```css
/* Trust items within header - centered */
.video-consult-header-trust {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 24px;
}

.video-consult-header-trust-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: hsl(0 0% 100% / 0.85);
  white-space: nowrap;
}

.video-consult-header-trust-item svg {
  width: 14px;
  height: 14px;
  color: hsl(var(--primary));
}

/* Responsive - hide trust items on smaller screens */
@media (max-width: 1200px) {
  .video-consult-header-trust {
    display: none;
  }
}
```

### 4. Style Booking Controls with Dark Theme

**File: `src/pages/Book.tsx`**

Update the booking controls section (lines 830-851) with dark styling:

```tsx
{/* Booking Controls - Below Video - Dark themed */}
<div className="video-consult-booking-controls">
  <div className="video-consult-booking-inner">
    <Input
      value={bookingCode}
      onChange={(e) => setBookingCode(e.target.value)}
      placeholder="Enter booking code..."
      className="video-consult-booking-input"
      onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
    />
    <Button 
      onClick={handleJoinRoom} 
      disabled={!bookingCode.trim()}
      className="video-consult-booking-btn"
    >
      Join
    </Button>
    <Button 
      variant="outline" 
      onClick={handleStartDemo}
      className="video-consult-booking-demo-btn"
    >
      <Sparkles className="w-4 h-4 mr-2" />
      Demo
    </Button>
  </div>
  <p className="text-xs text-white/50 mt-3">
    Enter your booking code to join a scheduled session
  </p>
</div>
```

### 5. Add CSS for Dark-Themed Booking Controls

**File: `src/index.css`**

```css
/* Booking Controls - Below Video */
.video-consult-booking-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
  background: linear-gradient(to bottom, hsl(220 15% 8%), hsl(220 15% 6%));
  border-radius: 12px;
  border: 1px solid hsl(0 0% 100% / 0.08);
}

.video-consult-booking-inner {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 480px;
}

.video-consult-booking-input {
  flex: 1;
  height: 44px;
  background: hsl(220 15% 12%) !important;
  border: 1px solid hsl(0 0% 100% / 0.15) !important;
  color: white !important;
  font-size: 14px;
}

.video-consult-booking-input::placeholder {
  color: hsl(0 0% 100% / 0.4) !important;
}

.video-consult-booking-input:focus {
  border-color: hsl(var(--primary) / 0.6) !important;
  box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2) !important;
}

.video-consult-booking-btn {
  height: 44px;
  padding: 0 24px;
  font-weight: 700;
}

.video-consult-booking-demo-btn {
  height: 44px;
  padding: 0 20px;
  background: transparent !important;
  border: 1px solid hsl(0 0% 100% / 0.2) !important;
  color: hsl(0 0% 100% / 0.8) !important;
}

.video-consult-booking-demo-btn:hover {
  background: hsl(0 0% 100% / 0.1) !important;
  border-color: hsl(0 0% 100% / 0.3) !important;
}
```

## Summary of Changes

| Element | Before | After |
|---------|--------|-------|
| Header center | Shipment ID search | Trust strip items inline |
| Header right | Call Now button | Empty (balanced layout) |
| Trust Strip | Separate component below header | Removed (items in header) |
| Booking controls | Light themed | Dark themed card |

## Files to Modify
- `src/pages/Book.tsx` - Header restructure, booking controls styling
- `src/index.css` - New CSS classes for header trust items and dark booking controls

