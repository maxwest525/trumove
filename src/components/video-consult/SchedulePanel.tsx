import { useState } from "react";
import { Video, Phone, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BookingCalendar } from "./BookingCalendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SchedulePanelProps {
  className?: string;
}

export function SchedulePanel({ className }: SchedulePanelProps) {
  const [callType, setCallType] = useState<'video' | 'voice'>('video');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [tcpaConsent, setTcpaConsent] = useState(false);

  const handleSchedule = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }
    if (!tcpaConsent) {
      toast.error("Please accept the consent to proceed");
      return;
    }

    toast.success(`${callType === 'video' ? 'Video' : 'Voice'} call scheduled for ${selectedTime} on ${selectedDate.toLocaleDateString()}`);
  };

  return (
    <Card className={cn("border-2 border-primary/20 shadow-lg shadow-primary/5 ring-1 ring-white/5 h-full flex flex-col", className)}>
      <CardHeader className="pb-3 pt-4 px-4 shrink-0">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Schedule a Call
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {/* Call Type Selector */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Call Type
          </Label>
          <RadioGroup
            value={callType}
            onValueChange={(v) => setCallType(v as 'video' | 'voice')}
            className="flex gap-3"
          >
            <label
              className={cn(
                "flex-1 flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all",
                callType === 'video'
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <RadioGroupItem value="video" id="video" className="sr-only" />
              <Video className={cn("w-4 h-4", callType === 'video' ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-sm font-medium", callType === 'video' ? "text-foreground" : "text-muted-foreground")}>
                Video
              </span>
            </label>
            <label
              className={cn(
                "flex-1 flex items-center gap-2 p-2.5 rounded-lg border-2 cursor-pointer transition-all",
                callType === 'voice'
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <RadioGroupItem value="voice" id="voice" className="sr-only" />
              <Phone className={cn("w-4 h-4", callType === 'voice' ? "text-primary" : "text-muted-foreground")} />
              <span className={cn("text-sm font-medium", callType === 'voice' ? "text-foreground" : "text-muted-foreground")}>
                Voice
              </span>
            </label>
          </RadioGroup>
        </div>

        {/* Compact Calendar */}
        <BookingCalendar
          onSelect={(date, time) => {
            setSelectedDate(date);
            setSelectedTime(time);
          }}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />

        {/* Contact Fields */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <Label htmlFor="schedule-name" className="text-xs">Name <span className="text-destructive">*</span></Label>
            <Input
              id="schedule-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="schedule-phone" className="text-xs">Phone <span className="text-destructive">*</span></Label>
            <Input
              id="schedule-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="schedule-email" className="text-xs">Email</Label>
            <Input
              id="schedule-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-9"
            />
          </div>
        </div>

        {/* TCPA Consent */}
        <div className="flex items-start gap-2">
          <Checkbox
            id="schedule-tcpa"
            checked={tcpaConsent}
            onCheckedChange={(checked) => setTcpaConsent(checked === true)}
            className="mt-0.5"
          />
          <Label htmlFor="schedule-tcpa" className="text-[10px] text-muted-foreground leading-tight cursor-pointer">
            I consent to receive calls and texts at the phone number provided. 
            Consent is not a condition of purchase. <span className="text-destructive">*</span>
          </Label>
        </div>

        {/* Schedule Button */}
        <Button
          onClick={handleSchedule}
          className="w-full h-10 font-semibold"
          disabled={!selectedDate || !selectedTime || !name.trim() || !phone.trim() || !tcpaConsent}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule {callType === 'video' ? 'Video' : 'Voice'} Call
        </Button>
      </CardContent>
    </Card>
  );
}
