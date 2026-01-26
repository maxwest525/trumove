import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import { Boxes, Scan, Radar, Video, ShieldCheck, DollarSign } from "lucide-react";

// Preview images
import previewAiScanner from "@/assets/preview-ai-scanner.jpg";
import previewCarrierVetting from "@/assets/preview-carrier-vetting.jpg";
import previewVideoConsult from "@/assets/preview-video-consult.jpg";
import previewPropertyLookup from "@/assets/preview-property-lookup.jpg";
import sampleRoomLiving from "@/assets/sample-room-living.jpg";
import scanRoomPreview from "@/assets/scan-room-preview.jpg";

const features = [
  {
    icon: Boxes,
    title: "Inventory Builder",
    desc: "Build your item list room by room for accurate pricing estimates.",
    image: previewAiScanner,
    route: "/online-estimate",
  },
  {
    icon: Scan,
    title: "AI Room Scanner",
    desc: "Point your camera and AI detects furniture instantly.",
    image: sampleRoomLiving,
    route: "/scan-room",
  },
  {
    icon: Radar,
    title: "Smart Carrier Match",
    desc: "Our algorithm finds the best carrier for your route.",
    image: previewCarrierVetting,
    route: "/vetting",
  },
  {
    icon: Video,
    title: "TruMove Specialist",
    desc: "Live video consultation for personalized guidance.",
    image: previewVideoConsult,
    route: "/book",
  },
  {
    icon: ShieldCheck,
    title: "FMCSA Verified",
    desc: "Real-time safety data checks from official databases.",
    image: previewPropertyLookup,
    route: "/vetting",
  },
  {
    icon: DollarSign,
    title: "Instant Pricing",
    desc: "Get accurate quotes in minutes, not hours.",
    image: scanRoomPreview,
    route: "/online-estimate",
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
            <CarouselItem key={index} className="features-carousel-item">
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
                  <div className="features-carousel-card-icon">
                    <feature.icon className="w-5 h-5" />
                  </div>
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
