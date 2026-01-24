import React, { useEffect, useRef, useState } from 'react';
import MoveMapTriptych from '@/components/MoveMapTriptych';

interface MapsSectionProps {
  fromZip: string;
  toZip: string;
  fromCity: string;
  toCity: string;
  visible: boolean;
}

export default function MapsSection({ fromZip, toZip, fromCity, toCity, visible }: MapsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Lazy load maps when near viewport
  useEffect(() => {
    if (!visible || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [visible]);

  if (!visible) return null;

  return (
    <section ref={sectionRef} className="tru-maps-section">
      <div className="tru-maps-section-inner">
        {isInView ? (
          <MoveMapTriptych
            fromZip={fromZip}
            toZip={toZip}
            fromCity={fromCity}
            toCity={toCity}
            visible={true}
          />
        ) : (
          <div className="tru-maps-placeholder">
            <div className="tru-maps-placeholder-panel">
              <span>ORIGIN</span>
            </div>
            <div className="tru-maps-placeholder-panel">
              <span>DESTINATION</span>
            </div>
            <div className="tru-maps-placeholder-panel tru-maps-placeholder-route">
              <span>YOUR ROUTE</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
