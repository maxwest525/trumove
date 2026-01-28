import { useState, useEffect } from "react";
import { format } from "date-fns";
import SiteShell from "@/components/layout/SiteShell";
import { DailyVideoRoom } from "@/components/video-consult/DailyVideoRoom";
import { BookingCalendar } from "@/components/video-consult/BookingCalendar";
import { WhatHappensCard, QuickCallCard, TrustBadges, MiniFAQ } from "@/components/video-consult/ConsultInfoCards";
import { Video, Shield, ExternalLink, User, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Scroll to top on mount
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

type BookingStep = "schedule" | "details" | "confirmed";

interface BookingDetails {
  date: Date | null;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export default function Book() {
  useScrollToTop();
  
  const [step, setStep] = useState<BookingStep>("schedule");
  const [activeTab, setActiveTab] = useState<"book" | "join">("book");
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingDetails>({
    date: null,
    time: "",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const handleDateTimeSelect = (date: Date, time: string) => {
    setBooking(prev => ({ ...prev, date, time }));
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!booking.name || !booking.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    // In production, this would create a Daily.co room and send confirmation email
    // For now, we'll simulate the booking confirmation
    setStep("confirmed");
    toast.success("Your video consult has been scheduled!");
    
    // Simulate getting a room URL after booking
    // In production, this would come from your backend after creating the room
    // setRoomUrl("https://your-domain.daily.co/room-id");
  };

  const handleJoinExisting = () => {
    // In production, this would validate the room URL or meeting code
    const testRoomUrl = "https://trumove.daily.co/demo-room";
    setRoomUrl(testRoomUrl);
    setActiveTab("join");
  };

  return (
    <SiteShell>
      <div className="max-w-[1480px] mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="text-[10px] font-black tracking-[0.24em] uppercase text-muted-foreground mb-3">
            Video Consult
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
            Book a live TruMove session.
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pick a time that works for you and meet face to face with a TruMove client advocate to review quotes and plan your move.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Booking/Video (3 cols) */}
          <div className="lg:col-span-3 space-y-8">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "book" | "join")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="book" className="gap-2">
                  <Video className="w-4 h-4" />
                  Schedule New
                </TabsTrigger>
                <TabsTrigger value="join" className="gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Join Existing
                </TabsTrigger>
              </TabsList>

              {/* Schedule New Tab */}
              <TabsContent value="book" className="space-y-6">
                {step === "schedule" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg font-bold">Select Date & Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BookingCalendar 
                        onSelect={handleDateTimeSelect}
                        selectedDate={booking.date ?? undefined}
                        selectedTime={booking.time}
                      />
                      
                      {booking.time && (
                        <div className="mt-6 pt-6 border-t border-border/40">
                          <Button 
                            onClick={() => setStep("details")} 
                            className="w-full h-12 text-sm font-bold"
                          >
                            Continue to Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {step === "details" && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">Your Details</CardTitle>
                        <button 
                          onClick={() => setStep("schedule")}
                          className="text-sm text-primary hover:underline"
                        >
                          ← Change time
                        </button>
                      </div>
                      {booking.date && booking.time && (
                        <p className="text-sm text-muted-foreground">
                          {format(booking.date, "EEEE, MMMM d")} at {booking.time}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleDetailsSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="name"
                                value={booking.name}
                                onChange={(e) => setBooking(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="John Smith"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                value={booking.email}
                                onChange={(e) => setBooking(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="john@example.com"
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone (optional)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={booking.phone}
                            onChange={(e) => setBooking(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="(555) 123-4567"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">What would you like to discuss? (optional)</Label>
                          <textarea
                            id="notes"
                            value={booking.notes}
                            onChange={(e) => setBooking(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="E.g., I have 3 quotes and want help comparing them..."
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>

                        <Button type="submit" className="w-full h-12 text-sm font-bold">
                          Confirm Video Consult
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {step === "confirmed" && (
                  <Card className="border-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Video className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl font-bold text-center">You're All Set!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <p className="text-muted-foreground">
                        Your video consult is scheduled for:
                      </p>
                      {booking.date && (
                        <div className="p-4 rounded-xl bg-card border border-border/60">
                          <div className="text-lg font-bold text-foreground">
                            {format(booking.date, "EEEE, MMMM d")}
                          </div>
                          <div className="text-primary font-semibold">{booking.time}</div>
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        We've sent a confirmation email to <strong>{booking.email}</strong> with your video link.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            setStep("schedule");
                            setBooking({ date: null, time: "", name: "", email: "", phone: "", notes: "" });
                          }}
                        >
                          Schedule Another
                        </Button>
                        <Button 
                          className="flex-1"
                          onClick={() => setActiveTab("join")}
                        >
                          Join Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* External Calendly Link */}
                <a
                  href="https://calendly.com/trumove"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-border/60 bg-card text-foreground text-sm font-semibold transition-all hover:bg-muted/50"
                >
                  Choose another date and time
                  <ExternalLink className="w-4 h-4" />
                </a>
              </TabsContent>

              {/* Join Existing Tab */}
              <TabsContent value="join" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold">Video Room</CardTitle>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40 text-xs font-bold text-foreground/70">
                        <Shield className="w-3.5 h-3.5" />
                        Secure
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <DailyVideoRoom 
                      roomUrl={roomUrl}
                      userName={booking.name || "Guest"}
                      onLeave={() => setRoomUrl(null)}
                      className="min-h-[450px]"
                    />
                  </CardContent>
                </Card>

                {!roomUrl && (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-sm text-muted-foreground mb-4">
                        Have a meeting link or code? Enter it below to join your scheduled consult.
                      </p>
                      <div className="flex gap-3">
                        <Input 
                          placeholder="Enter room code or paste link..."
                          className="flex-1"
                        />
                        <Button onClick={handleJoinExisting}>
                          Join Room
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Info (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* What Happens */}
            <WhatHappensCard />

            {/* Quick Call */}
            <QuickCallCard />

            {/* Trust Badges */}
            <TrustBadges />

            {/* Mini FAQ */}
            <MiniFAQ />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
