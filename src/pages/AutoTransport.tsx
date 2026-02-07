import { useState } from "react";
import { ChevronRight, ChevronLeft, Shield, Star, CheckCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

// ═══════════════════════════════════════════════════════════════════
// HOWARD VAN LINES AUTO TRANSPORT
// ═══════════════════════════════════════════════════════════════════

export default function AutoTransport() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const stepLabels = ["Vehicle Info", "Pickup & Delivery", "Review & Book"];

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="hvl-page">
      {/* RED HEADER BAR */}
      <header className="hvl-header">
        <div className="hvl-header-inner">
          <div className="hvl-logo">
            <Truck className="w-8 h-8" />
            <span>Howard Van Lines</span>
          </div>
          <div className="hvl-header-contact">
            <span>Call Us: 1-800-555-MOVE</span>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hvl-hero">
        <div className="hvl-hero-inner">
          {/* Left: Headline */}
          <div className="hvl-hero-text">
            <h1>Reliable Auto Transport</h1>
            <p>
              Trust Howard Van Lines for safe, insured vehicle shipping across the nation. 
              Get your free quote in minutes.
            </p>
          </div>

          {/* Right: Wizard Card */}
          <div className="hvl-wizard-card">
            {/* Step Indicator */}
            <div className="hvl-step-indicator">
              <span className="hvl-step-label">Step {currentStep} of {totalSteps}</span>
              <div className="hvl-step-dots">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`hvl-step-dot ${step === currentStep ? "active" : ""} ${step < currentStep ? "completed" : ""}`}
                  />
                ))}
              </div>
              <span className="hvl-step-name">{stepLabels[currentStep - 1]}</span>
            </div>

            {/* Wizard Content Placeholder */}
            <div className="hvl-wizard-content">
              <div className="hvl-wizard-placeholder">
                <p>Step {currentStep} content will go here</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="hvl-wizard-buttons">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="hvl-btn-back"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentStep === totalSteps}
                className="hvl-btn-next"
              >
                {currentStep === totalSteps ? "Get Quote" : "Next"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="hvl-trust-strip">
        <div className="hvl-trust-inner">
          <div className="hvl-trust-item">
            <Star className="w-5 h-5" />
            <span>Google Reviews</span>
          </div>
          <div className="hvl-trust-item">
            <Shield className="w-5 h-5" />
            <span>BBB Accredited</span>
          </div>
          <div className="hvl-trust-item">
            <CheckCircle className="w-5 h-5" />
            <span>Trustpilot</span>
          </div>
          <div className="hvl-trust-item">
            <Shield className="w-5 h-5" />
            <span>FMCSA Registered</span>
          </div>
          <div className="hvl-trust-item">
            <Truck className="w-5 h-5" />
            <span>USDOT Certified</span>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="hvl-footer">
        <p>© 2025 Howard Van Lines. All rights reserved.</p>
      </footer>
    </div>
  );
}
