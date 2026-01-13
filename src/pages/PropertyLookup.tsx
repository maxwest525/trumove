import { useState } from "react";
import SiteShell from "@/components/layout/SiteShell";
import { MapPin, Eye } from "lucide-react";

export default function PropertyLookup() {
  const [address, setAddress] = useState("");
  const [previewAddress, setPreviewAddress] = useState("");

  const handlePreview = () => {
    if (address.trim()) {
      setPreviewAddress(address.trim());
    }
  };

  const embedUrl = previewAddress
    ? `https://www.google.com/maps/embed/v1/streetview?key=YOUR_API_KEY&location=${encodeURIComponent(previewAddress)}&heading=210&pitch=10&fov=90`
    : "";

  return (
    <SiteShell>
      <div className="max-w-[900px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-[10px] font-black tracking-[0.24em] uppercase text-muted-foreground mb-3">
            TruMove Property Preview
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground mb-4">
            Type an address and instantly see Street View.
          </h1>
          <p className="text-muted-foreground">
            Free mockup using publicly available Google Street View embed. No paid data sources.
          </p>
        </div>

        {/* Input Section */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 mb-8">
          <div className="text-[10px] font-black tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Street View Embed
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-2">
                Street address
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="1600 Amphitheatre Parkway, Mountain View, CA"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-border/60 bg-background text-sm font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={!address.trim()}
                  className="h-12 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-bold tracking-wide uppercase transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_hsl(var(--primary)/0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Preview Street View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden mb-8">
          <div className="aspect-video bg-muted/30 flex items-center justify-center">
            {previewAddress ? (
              <div className="w-full h-full relative">
                {/* In production, you'd use a real Google Maps API key */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-muted/50">
                  <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Street View for:
                  </p>
                  <p className="text-muted-foreground mb-4">{previewAddress}</p>
                  <p className="text-sm text-muted-foreground max-w-md">
                    To enable Street View, add a valid Google Maps Embed API key. The embed URL is ready: just replace YOUR_API_KEY with your actual key.
                  </p>
                </div>
                {/* Uncomment this when you have an API key:
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                /> */}
              </div>
            ) : (
              <div className="text-center p-8">
                <MapPin className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter an address and click preview.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="rounded-xl border border-border/60 bg-card p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-muted-foreground">Address</span>
            <span className="text-sm font-semibold text-foreground">
              {previewAddress || "Not set"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Source</span>
            <span className="text-sm font-semibold text-foreground">Google Maps</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          If Street View does not load, make sure Maps Embed API is enabled and the key is unrestricted or allowed for this domain.
        </p>
      </div>
    </SiteShell>
  );
}
