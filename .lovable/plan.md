

# Marketing Suite Enhancement Plan

## Summary of Current State

After thorough exploration of the codebase, I found:

1. **MarketingAnalyticsDashboard** (`src/components/demo/ppc/MarketingAnalyticsDashboard.tsx`) contains:
   - Business profile inputs (businessName, phoneNumber, serviceType, etc.)
   - Selected keywords state (`selectedKeywords`)
   - Selected platforms state (`selectedPlatforms`)
   - Target locations and audience fields
   - A "Create Landing Page with These Settings" button that calls `onProceedToCreate()`

2. **AILandingPageGenerator** (`src/components/demo/ppc/AILandingPageGenerator.tsx`) has its own isolated form fields:
   - `businessName`, `targetAudience`, `mainOffer`, `targetLocation` states
   - No connection to analytics dashboard data

3. **LandingPageBoard** (`src/components/demo/ppc/LandingPageBoard.tsx`) is functional with:
   - `toggleStatus()` for pause/activate
   - `deletePage()` for removing pages
   - `onEditPage()` callback for editing
   - State is managed via `pages` and `onPagesChange` props

---

## Implementation Tasks

### Task 1: Connect Analytics Data to Landing Page Generator

**Problem**: When clicking "Create Landing Page with These Settings" in the analytics dashboard, the data isn't passed to the generator.

**Solution**: Pass selected data through props or shared state.

**Files to modify**:
- `src/components/demo/ppc/AILandingPageGenerator.tsx` - Accept optional prefill props
- `src/components/demo/PPCDemoModal.tsx` - Pass analytics data when navigating to landing page tab

**Technical approach**:
```typescript
// Add to AILandingPageGeneratorProps
interface AILandingPageGeneratorProps {
  isGenerating: boolean;
  onGenerate: () => void;
  prefillData?: {
    keywords: string[];
    platforms: string[];
    locations: string;
    audience: string;
    businessName: string;
  };
}

// Initialize form state from prefillData when provided
useEffect(() => {
  if (prefillData) {
    setBusinessName(prefillData.businessName);
    setTargetLocation(prefillData.locations);
    setTargetAudience(prefillData.audience);
    // Pre-select template based on keywords
  }
}, [prefillData]);
```

---

### Task 2: Add Real-Time Data Sync (DashClicks-style)

**Problem**: No connection to real ad accounts for live performance data.

**Solution**: Create simulated "Connected Accounts" UI with live-style data updates.

**Files to create/modify**:
- `src/components/demo/ppc/ConnectedAccountsPanel.tsx` - New component showing connected Google/Meta accounts
- `src/components/demo/ppc/MarketingAnalyticsDashboard.tsx` - Add connection status indicators

**Technical approach**:
```typescript
// Simulated connected accounts with "live" data polling
const [connectedAccounts, setConnectedAccounts] = useState([
  { platform: 'Google Ads', status: 'connected', lastSync: new Date() },
  { platform: 'Meta Business', status: 'connected', lastSync: new Date() },
]);

// Live mode updates (already exists in PPCDemoModal, extend to analytics)
useEffect(() => {
  if (liveMode) {
    const interval = setInterval(() => {
      // Simulate real-time metric updates
      updatePlatformMetrics();
    }, 3000);
    return () => clearInterval(interval);
  }
}, [liveMode]);
```

---

### Task 3: Landing Page Board Testing Fixes

**Current state**: The LandingPageBoard appears functional based on code review. The component properly:
- Calls `toggleStatus(id)` when pause/play button is clicked
- Calls `deletePage(id)` from dropdown menu
- Calls `onEditPage(page.id)` when Edit button is clicked

**Potential issue**: The FloatingDemoButton is not visible on homepage (by design), and accessing via other pages may have issues.

**Verification needed**: Ensure the parent component (`AILandingPageGenerator`) properly passes the `onPagesChange` callback and manages state.

---

## Files Summary

| File | Action | Purpose |
|------|--------|---------|
| `AILandingPageGenerator.tsx` | Modify | Accept prefillData props from analytics |
| `PPCDemoModal.tsx` | Modify | Store analytics selections, pass to generator |
| `MarketingAnalyticsDashboard.tsx` | Modify | Export selected data when proceeding |
| `ConnectedAccountsPanel.tsx` | Create | DashClicks-style account connection UI |

---

## Implementation Order

1. **Phase 1**: Wire up data flow from MarketingAnalyticsDashboard → AILandingPageGenerator
2. **Phase 2**: Add connected accounts panel with live sync indicators
3. **Phase 3**: Verify LandingPageBoard CRUD operations work end-to-end

