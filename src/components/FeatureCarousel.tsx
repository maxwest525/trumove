import { useState, useEffect, useCallback } from "react";
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

interface FeatureCarouselProps {
  autoplayInterval?: number;
}

export default function FeatureCarousel({ autoplayInterval = 4000 }: FeatureCarouselProps) {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Track current slide
  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (!api || isPaused) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [api, isPaused, autoplayInterval]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  return (
    <div 
      className="tru-feature-carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, dragFree: true }}
        className="tru-value-carousel"
      >
        <CarouselContent className="tru-value-carousel-content">
          {features.map((feature, index) => (
            <CarouselItem key={index} className="tru-value-carousel-item">
              <div 
                className="tru-value-card-carousel tru-value-card-expanded" 
                onClick={() => navigate(feature.route)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(feature.route)}
              >
                <div className="tru-value-card-carousel-header">
                  <div className="tru-value-card-icon">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div className="tru-value-card-content">
                    <h3 className="tru-value-card-title">{feature.title}</h3>
                    <p className="tru-value-card-desc">{feature.desc}</p>
                  </div>
                </div>
                <div className="tru-value-card-carousel-preview tru-preview-always-visible">
                  <img src={feature.image} alt={`${feature.title} Preview`} />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="tru-value-carousel-prev" />
        <CarouselNext className="tru-value-carousel-next" />
      </Carousel>

    </div>
  );
}
