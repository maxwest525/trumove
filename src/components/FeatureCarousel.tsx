import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

// Preview images
import previewAiScanner from "@/assets/preview-ai-scanner.jpg";
import previewCarrierVetting from "@/assets/preview-carrier-vetting.jpg";
import trudyVideoCall from "@/assets/trudy-video-call.jpg";
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
    image: trudyVideoCall,
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
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);
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
        opts={{ align: "start", loop: true, dragFree: false, duration: 30, skipSnaps: false }}
        className="features-carousel-container"
      >
        <CarouselContent className="features-carousel-content">
          {features.map((feature, index) => (
            <CarouselItem key={index} className="features-carousel-item basis-1/2 md:basis-1/4">
              <div 
                className="features-carousel-card"
                onClick={() => setSelectedFeature(feature)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedFeature(feature)}
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

      {/* Feature Preview Modal */}
      <Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
        <DialogContent className="feature-preview-modal">
          <DialogTitle className="sr-only">{selectedFeature?.title}</DialogTitle>
          <DialogDescription className="sr-only">{selectedFeature?.desc}</DialogDescription>
          <DialogClose className="feature-preview-close">
            <X className="h-5 w-5" />
          </DialogClose>
          {selectedFeature && (
            <div className="feature-preview-content">
              <div className="feature-preview-image">
                <img src={selectedFeature.image} alt={selectedFeature.title} />
              </div>
              <div className="feature-preview-info">
                <h3>{selectedFeature.title}</h3>
                <p>{selectedFeature.desc}</p>
                <button 
                  className="feature-preview-cta"
                  onClick={() => {
                    setSelectedFeature(null);
                    navigate(selectedFeature.route);
                  }}
                >
                  Explore Feature
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
