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

export default function FeatureCarousel() {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Track current slide for center emphasis
  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="features-carousel">
      <Carousel
        setApi={setApi}
        opts={{ align: "center", loop: true, dragFree: true }}
        className="features-carousel-container"
      >
        <CarouselContent className="features-carousel-content">
          {features.map((feature, index) => (
            <CarouselItem key={index} className="features-carousel-item">
              <div 
                className="features-carousel-card" 
                data-active={current === index}
                onClick={() => navigate(feature.route)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(feature.route)}
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
