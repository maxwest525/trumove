import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, MapPin, Shield, Video } from 'lucide-react';
import { UIState } from '@/hooks/useHomepageState';

import previewAiScanner from '@/assets/preview-ai-scanner.jpg';
import previewCarrierVetting from '@/assets/preview-carrier-vetting.jpg';
import previewVideoConsult from '@/assets/preview-video-consult.jpg';
import previewPropertyLookup from '@/assets/preview-property-lookup.jpg';

interface FeatureCardsProps {
  uiState: UIState;
}

const CARDS = [
  {
    id: 'scan',
    icon: Scan,
    title: 'Scan Your Room',
    description: 'Point your camera and let AI detect all furniture automatically.',
    preview: previewAiScanner,
    badge: 'Soon',
    badgeLive: false,
    href: '/scan-room',
  },
  {
    id: 'property',
    icon: MapPin,
    title: 'Property Lookup',
    description: 'Instant bed/bath, sqft, and photos for any address.',
    preview: previewPropertyLookup,
    badge: 'Live',
    badgeLive: true,
    href: '/property-lookup',
  },
  {
    id: 'vetting',
    icon: Shield,
    title: 'Carrier Vetting',
    description: 'FMCSA verified, insurance validated, complaints monitored.',
    preview: previewCarrierVetting,
    href: '/vetting',
  },
  {
    id: 'video',
    icon: Video,
    title: 'Video Consult',
    description: 'Virtual walkthrough with a specialist for accurate quotes.',
    preview: previewVideoConsult,
    href: '/book',
  },
];

export default function FeatureCards({ uiState }: FeatureCardsProps) {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Determine which cards should show previews based on state and breakpoint
  // For mobile (handled in CSS), only first card auto-expands
  // For desktop in engaged/validated, all cards show previews
  const shouldShowPreview = (cardId: string, index: number) => {
    if (uiState === 'idle') return false;
    
    // On mobile (XS/SM), only first card or tapped card shows preview
    // This is controlled by CSS media queries, but we track tap state
    if (expandedCard === cardId) return true;
    
    // In engaged/validated states, all cards show previews on desktop
    return true;
  };

  const handleCardClick = (card: typeof CARDS[0]) => {
    // On mobile, first tap expands, second tap navigates
    if (window.innerWidth < 768) {
      if (expandedCard !== card.id) {
        setExpandedCard(card.id);
        return;
      }
    }
    navigate(card.href);
  };

  return (
    <div className={`tru-feature-cards ui-state-${uiState}`}>
      {CARDS.map((card, index) => {
        const Icon = card.icon;
        const isExpanded = shouldShowPreview(card.id, index);
        const isMobileFirstCard = index === 0;

        return (
          <div
            key={card.id}
            className={`tru-feature-card ${isExpanded ? 'is-expanded' : ''} ${isMobileFirstCard ? 'is-mobile-first' : ''}`}
            onClick={() => handleCardClick(card)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(card)}
          >
            <div className="tru-feature-card-icon">
              <Icon className="w-5 h-5" />
            </div>
            <div className="tru-feature-card-content">
              <h3 className="tru-feature-card-title">
                {card.title}
                {card.badge && (
                  <span className={`tru-feature-card-badge ${card.badgeLive ? 'tru-feature-card-badge-live' : ''}`}>
                    {card.badge}
                  </span>
                )}
              </h3>
              <p className="tru-feature-card-desc">{card.description}</p>
            </div>
            <div className="tru-feature-card-preview">
              <img src={card.preview} alt={`${card.title} Preview`} loading="lazy" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
