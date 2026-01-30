
# AI Inventory Section Redesign

## Current Layout

```text
┌────────────────────────────────────────────────────────────────────────┐
│                    AI Inventory Analysis                               │
│    Take a video or pictures of your room and let us do the rest       │
├──────────────────────────┬─────────────────────────────────────────────┤
│  1 Video or Photos       │  ┌─────────────┐ ┌─────────────────────┐    │
│  2 AI Detection          │  │  Room Scan  │ │   Live Detection    │    │
│  3 Agent Confirmation    │  │   Preview   │ │      List           │    │
│                          │  └─────────────┘ └─────────────────────┘    │
└──────────────────────────┴─────────────────────────────────────────────┘
```

## New Layout

```text
┌────────────────────────────────────────────────────────────────────────────────┐
│                    AI Inventory Analysis                                       │
│           Take a video or pictures of your room and let us do the rest        │
│                     [ Start Demo AI Analysis ]                                 │
├────────────────────────────────┬───────────────────────────────────────────────┤
│  ┌─────┐                       │                                               │
│  │ 📷 │  1. Video or Photos    │     ┌────────────────────────────────────┐    │
│  └─────┘  Walk through rooms   │     │                                    │    │
│                                │     │         Room Scan Preview          │    │
│  ┌─────┐                       │     │           (LARGER)                 │    │
│  │ 🤖 │  2. AI Detection       │     │                                    │    │
│  └─────┘  Computer vision...   │     └────────────────────────────────────┘    │
│                                │     ┌────────────────────────────────────┐    │
│  ┌─────┐                       │     │        Live Detection List         │    │
│  │ ✅ │  3. Agent Confirmation │     │           (LARGER)                 │    │
│  └─────┘  A live specialist... │     │                                    │    │
│                                │     └────────────────────────────────────┘    │
└────────────────────────────────┴───────────────────────────────────────────────┘
```

---

## Implementation Details

### File: `src/pages/Index.tsx`

**1. Add Step Preview Images Data**

Add image paths to associate with each step:
- Step 1 (Video/Photos): Use camera/video icon or a sample room thumbnail
- Step 2 (AI Detection): Use an AI/scan preview image
- Step 3 (Agent Confirmation): Use agent/video consult preview

**2. Restructure the AI Section JSX (Lines 1536-1593)**

```text
Before:
- h2 title
- accent line
- p subtitle
- Two columns: steps | scanner+list

After:
- h2 title
- accent line  
- p subtitle
- [ Start Demo AI Analysis ] button (centered)
- Two columns:
  - LEFT: Steps with mini preview thumbnails
  - RIGHT: Room scanner STACKED above inventory list (both enlarged)
```

**3. Move Demo Button Under Subtitle**

Extract the demo button from the room preview and place it centered under the subtitle.

**4. Stack Scanner and List Vertically on Right**

Change the right column from a 2-column grid to a vertical stack to maximize the size of both components.

---

### File: `src/index.css`

**5. Add Step Preview Image Styles**

```css
.tru-ai-step-preview {
  width: 64px;
  height: 48px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid hsl(var(--tm-ink) / 0.12);
  background: hsl(var(--muted) / 0.3);
}

.tru-ai-step-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

**6. Create Centered Demo Button Style**

```css
.tru-ai-demo-button-centered {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: hsl(var(--foreground));
  color: hsl(var(--background));
  font-size: 14px;
  font-weight: 700;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  margin: 20px auto 32px;
  box-shadow: 0 4px 16px hsl(var(--primary) / 0.3);
  transition: all 0.2s ease;
}

.tru-ai-demo-button-centered:hover {
  background: hsl(var(--primary));
  transform: translateY(-2px);
  box-shadow: 0 8px 24px hsl(var(--primary) / 0.5);
}
```

**7. Adjust Grid Proportions**

```css
.tru-ai-two-column {
  grid-template-columns: 0.8fr 1.5fr;  /* Give more space to right column */
  gap: 40px;
}
```

**8. Stack Scanner and List Vertically**

```css
.tru-ai-preview-vertical {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tru-ai-live-scanner-large {
  height: 280px;  /* Larger height */
}

.tru-ai-live-inventory-large {
  min-height: 260px;  /* Taller list */
}
```

---

## Step Preview Images

Using existing assets for step thumbnails:
- **Step 1**: `src/assets/sample-room-living.jpg` - Shows room scanning concept
- **Step 2**: `src/assets/preview-ai-scanner.jpg` - AI analysis preview  
- **Step 3**: `src/assets/preview-video-consult.jpg` - Agent confirmation concept

---

## Expected Result

- Steps 1-2-3 appear on the left with mini preview thumbnails (64x48px) showing what each step looks like
- "Start Demo AI Analysis" button is centered and prominent under the subtitle
- Room scanner and live detection list are stacked vertically on the right, both significantly larger
- More visual hierarchy draws users to click the demo button
- Cleaner separation between "how it works" (left) and "live demo" (right)
