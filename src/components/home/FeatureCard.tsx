import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  previewImage: string;
  badge?: string;
  badgeLive?: boolean;
  href: string;
  isExpanded: boolean;
  onTap?: () => void;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  previewImage,
  badge,
  badgeLive,
  href,
  isExpanded,
  onTap,
}: FeatureCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onTap) {
      onTap();
    } else {
      navigate(href);
    }
  };

  return (
    <div 
      className={`tru-feature-card ${isExpanded ? 'is-expanded' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="tru-feature-card-icon">
        <Icon className="w-5 h-5" />
      </div>
      <div className="tru-feature-card-content">
        <h3 className="tru-feature-card-title">
          {title}
          {badge && (
            <span className={`tru-feature-card-badge ${badgeLive ? 'tru-feature-card-badge-live' : ''}`}>
              {badge}
            </span>
          )}
        </h3>
        <p className="tru-feature-card-desc">{description}</p>
      </div>
      {isExpanded && (
        <div className="tru-feature-card-preview">
          <img src={previewImage} alt={`${title} Preview`} loading="lazy" />
        </div>
      )}
    </div>
  );
}
