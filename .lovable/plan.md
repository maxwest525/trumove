

# Auto-Publish to Board & Custom Domain Connection

## Overview
After publishing a landing page, it will automatically appear in the "Manage Pages" board with active status and tracking initialized. Additionally, users can connect a custom domain to their published pages, with a link to the Lovable custom domain documentation.

---

## Part 1: Auto-Add Published Pages to Board

### Current Architecture
- `AILandingPageGenerator` manages the publish flow (`handlePublish`)
- `LandingPageBoard` has its own internal `pages` state (isolated)
- No communication between publish action and board state

### Solution: Lift State & Add Callback

**Changes to `LandingPageBoard.tsx`:**
- Accept `pages` and `setPages` as props (or a callback `onAddPage`)
- Export the `LandingPage` interface for type sharing

**Changes to `AILandingPageGenerator.tsx`:**
- Manage shared `pages` state at the parent level
- Pass `onAddPage` callback to `LandingPageBoard`
- After successful publish, create a new page entry and add it to the board

### New Page Entry on Publish:
```typescript
const newPage: LandingPage = {
  id: crypto.randomUUID(),
  name: `${businessName} - ${templateName}`,
  template: templateName,
  status: 'active',
  dailyBudget: 100,  // Default budget
  totalSpend: 0,
  conversions: 0,
  conversionRate: 0,
  cpa: 0,
  trend: 'stable',
  url: `${businessName.toLowerCase().replace(/\s/g, '')}.com/${selectedTemplate}`,
  createdAt: new Date().toISOString().split('T')[0],
  performance: 'new',
  customDomain: null  // New field
};
```

---

## Part 2: Custom Domain Connection

### Feature Design
After publishing, show a "Connect Custom Domain" section that:
1. Shows the generated URL (e.g., `trumove.com/quote-ca`)
2. Allows users to enter their own domain
3. Links to Lovable's custom domain documentation
4. Simulates DNS verification flow

### UI Components

**In Popout Footer (after publish):**
```text
┌──────────────────────────────────────────────────────────┐
│ 🎉 Published!                                            │
│ ────────────────────────────────────────────────────────│
│ 🌐 Your page is live at:                                 │
│    https://trumove.lovable.app/quote-ca                  │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Connect Custom Domain                        [→]    │ │
│ │ Use your own domain like mycompany.com             │ │
│ └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Domain Connection Modal/Drawer:**
```text
┌──────────────────────────────────────────────────────────┐
│ Connect Custom Domain                              [X]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Enter your domain:                                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │ moves.mycompany.com                                │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  DNS Configuration Required:                             │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Type: A Record                                     │ │
│  │ Name: @ (or subdomain)                             │ │
│  │ Value: 185.158.133.1                               │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📚 Need help? See the full setup guide                  │
│     [docs.lovable.dev/features/custom-domain]            │
│                                                          │
│  ┌──────────────┐  ┌───────────────────────────────┐    │
│  │ Verify DNS   │  │ 🔗 Get a domain on GoDaddy → │    │
│  └──────────────┘  └───────────────────────────────┘    │
│                                                          │
│  ⏳ DNS propagation can take up to 72 hours              │
└──────────────────────────────────────────────────────────┘
```

### Domain Verification Flow (Simulated)
1. User enters domain
2. Click "Verify DNS"
3. Show loading state: "Checking DNS records..."
4. After 2s, show one of:
   - Success: "✓ DNS verified! Your page is now live at [domain]"
   - Pending: "DNS not yet propagated. Check back in a few hours."

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/demo/ppc/LandingPageBoard.tsx` | Export `LandingPage` interface, accept optional `onAddPage` prop or external pages state, add `customDomain` field display |
| `src/components/demo/ppc/AILandingPageGenerator.tsx` | Lift `pages` state up, pass to LandingPageBoard, add page to board after publish, add domain connection UI to popout footer |
| `src/components/demo/ppc/types.ts` | Add `LandingPage` interface with `customDomain` field |

---

## Technical Implementation

### Updated LandingPage Interface
```typescript
export interface LandingPage {
  id: string;
  name: string;
  template: string;
  status: 'active' | 'paused' | 'draft';
  dailyBudget: number;
  totalSpend: number;
  conversions: number;
  conversionRate: number;
  cpa: number;
  trend: 'up' | 'down' | 'stable';
  url: string;
  createdAt: string;
  performance: 'excellent' | 'good' | 'poor' | 'new';
  customDomain?: string | null;
  domainStatus?: 'pending' | 'active' | 'failed' | null;
}
```

### Updated LandingPageBoard Props
```typescript
interface LandingPageBoardProps {
  onCreateNew: () => void;
  onEditPage: (pageId: string) => void;
  pages: LandingPage[];
  onPagesChange: (pages: LandingPage[]) => void;
}
```

### Publish Handler with Auto-Add
```typescript
const handlePublish = async () => {
  setIsPublishing(true);
  // ... existing simulation steps ...
  
  // Create new page entry for the board
  const templateInfo = LANDING_PAGE_TEMPLATES.find(t => t.id === selectedTemplate);
  const newPage: LandingPage = {
    id: crypto.randomUUID(),
    name: `${businessName} - ${targetLocation.split(',')[0]}`,
    template: templateInfo?.name || 'Quote Funnel',
    status: 'active',
    dailyBudget: 100,
    totalSpend: 0,
    conversions: 0,
    conversionRate: 0,
    cpa: 0,
    trend: 'stable',
    url: `${businessName.toLowerCase().replace(/\s/g, '')}.lovable.app/${selectedTemplate}`,
    createdAt: new Date().toISOString().split('T')[0],
    performance: 'new',
    customDomain: null,
    domainStatus: null
  };
  
  setManagedPages(prev => [newPage, ...prev]);
  setPublishedPageId(newPage.id);
  setIsPublished(true);
  
  toast.success("🎉 Landing page published!", {
    description: `Now tracking in Manage Pages`,
    action: {
      label: "View Board",
      onClick: () => setMainView('manage')
    }
  });
};
```

### Domain Connection Component
```typescript
const DomainConnectionSection = ({ page, onDomainUpdate }) => {
  const [domain, setDomain] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  const handleVerify = async () => {
    setIsVerifying(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsVerifying(false);
    
    // Simulate 70% success rate
    if (Math.random() > 0.3) {
      onDomainUpdate(domain, 'active');
      toast.success(`Domain connected: ${domain}`);
    } else {
      onDomainUpdate(domain, 'pending');
      toast.warning("DNS not yet propagated", {
        description: "Check back in a few hours"
      });
    }
  };
  
  return (
    <div className="space-y-3 p-4 border rounded-lg">
      <h4 className="font-medium flex items-center gap-2">
        <Globe className="w-4 h-4" />
        Connect Custom Domain
      </h4>
      <Input 
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
        placeholder="moves.yourcompany.com"
      />
      <div className="text-xs text-muted-foreground p-3 bg-muted rounded">
        <p className="font-medium mb-1">DNS Configuration:</p>
        <code className="block">A Record → 185.158.133.1</code>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleVerify} disabled={!domain || isVerifying}>
          {isVerifying ? <Loader2 className="animate-spin" /> : 'Verify DNS'}
        </Button>
        <Button variant="outline" asChild>
          <a href="https://www.godaddy.com/domains" target="_blank">
            Get a Domain <ExternalLink className="ml-1 w-3 h-3" />
          </a>
        </Button>
      </div>
      <a 
        href="https://docs.lovable.dev/features/custom-domain"
        target="_blank"
        className="text-xs text-primary hover:underline flex items-center gap-1"
      >
        📚 Full setup guide
      </a>
    </div>
  );
};
```

---

## UI Flow

1. **User creates & publishes page** → Page auto-added to Manage Pages board with "new" performance badge
2. **In popout footer after publish** → Shows live URL + "Connect Custom Domain" expandable section
3. **User clicks Connect Custom Domain** → Expands to show input field + DNS instructions
4. **User enters domain & clicks Verify** → Simulates DNS check (2s delay)
5. **Success** → Domain shown in board listing, domain badge displays as "active"
6. **Pending** → Domain shown with "pending" status, user advised to wait

---

## Board Display Updates

After a page has a custom domain connected:
```text
┌────────────────────────────────────────────────────────────┐
│ TruMove - California  [active] [new]                       │
│ Quote Funnel • trumove.lovable.app/quote-ca                │
│               ↳ 🌐 moves.trumove.com [active]              │
├────────────────────────────────────────────────────────────┤
│ Spend: $0  │ Conv: 0  │ Rate: 0%  │ CPA: $0  │ Budget: $100│
└────────────────────────────────────────────────────────────┘
```

---

## Summary

This implementation:
- Auto-adds published pages to the Manage Pages board with tracking initialized
- Shows live URL in popout footer after publishing  
- Provides domain connection UI with DNS instructions
- Links to Lovable's custom domain documentation
- Links to GoDaddy for domain purchase
- Simulates DNS verification flow
- Displays domain status in the board listing

