import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";

// Preview images
import previewAiScanner from "@/assets/preview-ai-scanner.jpg";
import previewCarrierVetting from "@/assets/preview-carrier-vetting.jpg";
import previewVideoConsult from "@/assets/preview-video-consult.jpg";
import previewPropertyLookup from "@/assets/preview-property-lookup.jpg";
import sampleRoomLiving from "@/assets/sample-room-living.jpg";
import scanRoomPreview from "@/assets/scan-room-preview.jpg";

const features = [
  {
    title: "Inventory Builder",
    desc: "Build your item list room by room for accurate pricing estimates.",
    image: previewAiScanner,
    route: "/online-estimate",
  },
  {
    title: "AI Room Scanner",
    desc: "Point your camera and AI detects furniture instantly.",
    image: sampleRoomLiving,
    route: "/scan-room",
  },
  {
    title: "Shipment Tracking",
    desc: "Track your shipment in real-time with live updates and notifications.",
    image: previewPropertyLookup,
    route: "/track",
  },
  {
    title: "Smart Carrier Match",
    desc: "Our algorithm finds the best carrier for your route.",
    image: previewCarrierVetting,
    route: "/vetting",
  },
  {
    title: "TruMove Specialist",
    desc: "Live video consultation for personalized guidance.",
    image: previewVideoConsult,
    route: "/book",
  },
  {
    title: "FMCSA Verified",
    desc: "Real-time safety data checks from official databases.",
    image: scanRoomPreview,
    route: "/vetting",
  },
];

export default function FeatureCarousel() {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  // Autoplay with 4s interval, pauses on hover
  useEffect(() => {
    if (!api || isPaused) {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
      return;
    }

    scrollIntervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [api, isPaused]);

  // Pause autoplay on hover/interaction
  const handleMouseEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPaused(false);
    setHoveredIndex(null);
  }, []);

  return (
    <div 
      className="features-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, dragFree: true }}
        className="features-carousel-container"
      >
        <CarouselContent className="features-carousel-content">
          {features.map((feature, index) => (
            <CarouselItem key={index} className="features-carousel-item basis-1/2 md:basis-1/4">
              <div 
                className="features-carousel-card"
                onClick={() => navigate(feature.route)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(feature.route)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="features-carousel-card-header">
                  <div className="features-carousel-card-text">
                    <h3 className="features-carousel-card-title">{feature.title}</h3>
                    <p className="features-carousel-card-desc">{feature.desc}</p>
                  </div>
                </div>
                <div className="features-carousel-card-image-wrapper">
                  <img src={feature.image} alt={`${feature.title} Preview`} />
                </div>
                
                {/* Hover label */}
                {hoveredIndex === index && (
                  <span className="features-carousel-hover-label">Click to explore</span>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="features-carousel-prev" />
        <CarouselNext className="features-carousel-next" />
      </Carousel>
    </div>
  );
}
