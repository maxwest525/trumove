import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Shield, MessageCircle, MapPin, Video, Phone,
  ChevronDown, ChevronUp, Route, Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { UIState } from '@/hooks/useHomepageState';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolsSidebarProps {
  uiState: UIState;
  onChatOpen: () => void;
  fromCity: string;
  toCity: string;
  distance: number;
  moveDate: Date | null;
  estimatedDuration: string | null;
  size: string;
  propertyType: string;
}

const TOOLS = [
  { id: 'estimator', icon: Sparkles, label: 'AI Estimator', href: '/online-estimate' },
  { id: 'vetting', icon: Shield, label: 'Carrier Vetting', href: '/vetting' },
  { id: 'chat', icon: MessageCircle, label: 'AI Chat', action: 'chat' },
  { id: 'property', icon: MapPin, label: 'Property Lookup', href: '/property-lookup' },
  { id: 'video', icon: Video, label: 'Video Consult', href: '/book' },
  { id: 'call', icon: Phone, label: 'Call Us', href: 'tel:+16097277647' },
];

const PRIMARY_TOOLS = ['chat', 'call', 'video'];

export default function ToolsSidebar({
  uiState,
  onChatOpen,
  fromCity,
  toCity,
  distance,
  moveDate,
  estimatedDuration,
  size,
  propertyType,
}: ToolsSidebarProps) {
  const navigate = useNavigate();
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleToolClick = (tool: typeof TOOLS[0]) => {
    if (tool.action === 'chat') {
      onChatOpen();
    } else if (tool.href?.startsWith('tel:')) {
      window.location.href = tool.href;
    } else if (tool.href) {
      navigate(tool.href);
    }
  };

  const showSummary = uiState !== 'idle';
  const primaryTools = TOOLS.filter(t => PRIMARY_TOOLS.includes(t.id));
  const secondaryTools = TOOLS.filter(t => !PRIMARY_TOOLS.includes(t.id));

  // Desktop sidebar (LG+)
  const DesktopSidebar = () => (
    <div className={`tru-tools-sidebar tru-tools-sidebar-desktop ui-state-${uiState}`}>
      {/* Move Summary - shown in engaged/validated states */}
      {showSummary && (
        <div className="tru-tools-summary">
          <div className="tru-tools-summary-header">
            <Route className="w-4 h-4" />
            <span>Move Summary</span>
          </div>
          <div className="tru-tools-summary-body">
            <div className="tru-tools-summary-row">
              <span className="tru-tools-summary-label">From</span>
              <span className="tru-tools-summary-value">{fromCity ? fromCity.split(',')[0] : '—'}</span>
            </div>
            <div className="tru-tools-summary-row">
              <span className="tru-tools-summary-label">To</span>
              <span className="tru-tools-summary-value">{toCity ? toCity.split(',')[0] : '—'}</span>
            </div>
            <div className="tru-tools-summary-row">
              <span className="tru-tools-summary-label">Distance</span>
              <span className="tru-tools-summary-value">{distance > 0 ? `${distance.toLocaleString()} mi` : '—'}</span>
            </div>
            <div className="tru-tools-summary-row">
              <span className="tru-tools-summary-label">Date</span>
              <span className="tru-tools-summary-value">{moveDate ? format(moveDate, "MMM d") : '—'}</span>
            </div>
            <div className="tru-tools-summary-row">
              <span className="tru-tools-summary-label">ETA</span>
              <span className="tru-tools-summary-value">{estimatedDuration || '—'}</span>
            </div>
            {size && (
              <div className="tru-tools-summary-row">
                <span className="tru-tools-summary-label">Size</span>
                <span className="tru-tools-summary-value">{size}</span>
              </div>
            )}
            {propertyType && (
              <div className="tru-tools-summary-row">
                <span className="tru-tools-summary-label">Property</span>
                <span className="tru-tools-summary-value">{propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tools List */}
      <div className="tru-tools-list">
        <TooltipProvider delayDuration={0}>
          {TOOLS.map((tool) => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <button
                  className="tru-tools-item"
                  onClick={() => handleToolClick(tool)}
                >
                  <tool.icon className="w-5 h-5" />
                  <span className="tru-tools-item-label">{tool.label}</span>
                </button>
              </TooltipTrigger>
              {uiState === 'idle' && (
                <TooltipContent side="left">
                  <span>{tool.label}</span>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );

  // Mobile/Tablet tools panel (below form)
  const MobileToolsPanel = () => (
    <div className={`tru-tools-mobile ui-state-${uiState}`}>
      {/* Move Summary for mobile - shown in engaged/validated states */}
      {showSummary && (
        <div className="tru-tools-mobile-summary">
          <div className="tru-tools-mobile-summary-row">
            {fromCity && <span><strong>From:</strong> {fromCity.split(',')[0]}</span>}
            {toCity && <span><strong>To:</strong> {toCity.split(',')[0]}</span>}
            {distance > 0 && <span><strong>{distance.toLocaleString()} mi</strong></span>}
          </div>
        </div>
      )}

      {/* Primary tools as chips */}
      <div className="tru-tools-mobile-primary">
        {primaryTools.map((tool) => (
          <button
            key={tool.id}
            className="tru-tools-mobile-chip"
            onClick={() => handleToolClick(tool)}
          >
            <tool.icon className="w-4 h-4" />
            <span>{tool.label}</span>
          </button>
        ))}
      </div>

      {/* Expandable secondary tools */}
      {uiState !== 'idle' && (
        <>
          <button
            className="tru-tools-mobile-toggle"
            onClick={() => setMobileExpanded(!mobileExpanded)}
          >
            <span>More Tools</span>
            {mobileExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {mobileExpanded && (
            <div className="tru-tools-mobile-expanded">
              {secondaryTools.map((tool) => (
                <button
                  key={tool.id}
                  className="tru-tools-mobile-item"
                  onClick={() => handleToolClick(tool)}
                >
                  <tool.icon className="w-4 h-4" />
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileToolsPanel />
    </>
  );
}
