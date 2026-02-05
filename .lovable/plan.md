
# Comprehensive Enhancement Plan: Balto Coaching + UI Fixes

## Part 1: Balto-Like Real-Time Coaching System

### Overview
Building a demo-ready coaching suite with three role-based views that can be enhanced with AI later.

### Architecture

```text
+------------------+     +--------------------+     +---------------------+
|  AGENT VIEW      |     |  MANAGER VIEW      |     |  ADMIN/OWNER VIEW   |
|  (In-CRM Widget) |     |  (Control Center)  |     |  (Summary Dashboard)|
+------------------+     +--------------------+     +---------------------+
|                  |     |                    |     |                     |
| - Live Checklist |     | - Active Calls     |     | - Team Performance  |
| - Talk Tracks    |     | - Listen/Whisper   |     | - Compliance Score  |
| - Objection Tips |     | - Coach Alerts     |     | - QA Trends         |
| - Compliance     |     | - Override Scripts |     | - Best Performers   |
|   Reminders      |     |                    |     |                     |
+------------------+     +--------------------+     +---------------------+
```

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/coaching/AgentCoachingWidget.tsx` | Floating widget agents see during calls - checklists, talk tracks, compliance reminders |
| `src/components/coaching/ManagerCoachingDashboard.tsx` | Live call monitoring, whisper controls, agent performance |
| `src/components/coaching/AdminCoachingSummary.tsx` | High-level metrics, team compliance scores, QA trends |
| `src/components/coaching/CoachingChecklist.tsx` | Reusable checklist component with check-off animations |
| `src/components/coaching/TalkTrackCard.tsx` | Expandable talk track suggestions |
| `src/components/coaching/types.ts` | Shared types for coaching data |

### Agent View Features (Widget in CRM)

**Static Checklists** (expandable as you collect data):
- Opening script compliance
- Verify customer identity
- Confirm move details
- Review estimate/pricing
- Upsell packing services
- Close with confirmation
- Set follow-up expectations

**Talk Tracks** (collapsible cards):
- Objection: "That's too expensive"
- Objection: "I need to think about it"
- Objection: "I'm comparing quotes"
- Upsell: Full packing service
- Upsell: Valuation coverage

**Compliance Alerts** (static badges that can become keyword-triggered later):
- "Disclose binding estimate"
- "Mention valuation options"
- "Confirm payment terms"

### Manager View Features

**Active Calls Panel:**
- Agent name, customer, duration
- "Listen" button (simulated)
- "Whisper" button (simulated)
- "Barge" button (simulated)
- Real-time compliance score per call

**Agent Performance Cards:**
- Calls today, avg handle time
- Compliance rate
- Conversion rate
- "Coach" button to send tips

### Admin/Owner View Features

**Summary Dashboard:**
- Team compliance score (pie chart)
- Calls by hour (bar chart)
- Top performers leaderboard
- QA score trends (line chart)
- Alerts requiring attention

### Integration Points

**For Agents**: Add to IntegrationModals.tsx Granot CRM demo as a floating widget
**For Managers**: New tab in Operations Center
**For Admins**: New card in Agent Tools or dedicated page

---

## Part 2: Pop-Out Button Visibility Fixes

### Problem Identified
The FloatingDemoButton is hidden on homepage (`location.pathname === "/"`), but pop-out buttons in modals may have z-index or visibility issues.

### Files to Modify

| File | Issue | Fix |
|------|-------|-----|
| `src/components/FloatingDemoButton.tsx` | Works fine, intentionally hidden on homepage | No change needed |
| `src/components/demo/ppc/AILandingPageGenerator.tsx` | Pop-out/expand buttons may be cut off by overflow containers | Add explicit z-index and ensure parent doesn't clip |
| `src/components/demo/ppc/LandingPageBoard.tsx` | Action buttons may be hidden in scroll areas | Ensure sticky positioning for action row |
| Various modal components | Nested modals may have z-index conflicts | Standardize z-index hierarchy |

### Specific Fixes

1. **AILandingPageGenerator.tsx**:
   - Add `overflow-visible` to preview container parents
   - Ensure action buttons have `z-50` minimum
   - Make "Pop Out" and "Edit" buttons always visible with fixed positioning inside preview

2. **LandingPageBoard.tsx**:
   - Add sticky header for page cards with action buttons
   - Ensure dropdown menus have proper portal mounting

3. **Global z-index hierarchy**:
   ```text
   z-30: Floating buttons (Demo, Quote)
   z-40: Popovers, dropdowns
   z-50: Modals
   z-60: Nested modals (e.g., editing inside Marketing Suite)
   z-70: Toast notifications
   ```

---

## Part 3: Marketing Suite Data Flow (From Saved Plan)

### Task 1: Connect Analytics to Landing Page Generator

**Current Flow**:
```text
Analytics Dashboard → "Create Landing Page" button → Opens tab → Empty form
```

**Fixed Flow**:
```text
Analytics Dashboard → "Create Landing Page" → Pre-filled form with:
  - Business name
  - Selected keywords
  - Target locations
  - Audience settings
```

**Files to modify**:
- `src/components/demo/ppc/AILandingPageGenerator.tsx` - Add `prefillData` prop
- Parent modal that manages tab state - Pass analytics selections when switching tabs

### Task 2: Connected Accounts Panel

**New Component**: `src/components/demo/ppc/ConnectedAccountsPanel.tsx`

Shows simulated connected ad accounts with sync status:
- Google Ads (connected, last sync: 2 min ago)
- Meta Business (connected, last sync: 5 min ago)
- Microsoft Ads (not connected)

---

## Implementation Order

### Phase 1: Critical UI Fixes (Quick Wins)
1. Fix pop-out button visibility in modals
2. Standardize z-index across components

### Phase 2: Balto Agent Widget
1. Create AgentCoachingWidget with static checklists
2. Integrate into Granot CRM demo modal
3. Add talk tracks and compliance reminders

### Phase 3: Balto Manager Dashboard
1. Create ManagerCoachingDashboard
2. Add as new tab in Operations Center
3. Implement simulated live call monitoring

### Phase 4: Balto Admin Summary
1. Create AdminCoachingSummary with charts
2. Add as new Agent Tool card
3. Include team leaderboard and QA trends

### Phase 5: Marketing Suite Data Flow
1. Wire analytics data to landing page generator
2. Add connected accounts panel

---

## Technical Notes

### Coaching Data Types
```typescript
interface CoachingChecklist {
  id: string;
  label: string;
  category: 'opening' | 'discovery' | 'presentation' | 'closing';
  isRequired: boolean;
  completedAt?: Date;
}

interface TalkTrack {
  id: string;
  title: string;
  trigger: string; // e.g., "price objection"
  script: string;
  tips: string[];
}

interface ActiveCall {
  id: string;
  agentId: string;
  agentName: string;
  customerName: string;
  startTime: Date;
  complianceScore: number;
  completedItems: string[];
}
```

### Demo Mode
All features will work in "demo mode" with simulated data:
- Fake active calls for manager view
- Animated metrics updates
- Simulated "whisper" sends toast notifications
- Pre-populated checklists and talk tracks
