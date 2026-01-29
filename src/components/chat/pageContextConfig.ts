import { LucideIcon, Video, Phone, ScanLine, Lightbulb, Truck, Scale, HelpCircle, CloudSun, Headphones } from 'lucide-react';

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  action: 'navigate' | 'quote' | 'call' | 'message';
  target?: string;
  message?: string;
}

export interface PageContext {
  key: string;
  firstMessage: string;
  quickActions: QuickAction[];
  agentContext: string;
}

const pageContexts: Record<string, PageContext> = {
  home: {
    key: 'home',
    firstMessage: "Hi! I'm TruDy, your TruMove moving assistant. I can help you understand our services, answer moving questions, or connect you with a specialist for pricing. What can I help with today?",
    quickActions: [
      { id: 'services', label: 'Our Services', icon: Truck, action: 'message', message: 'What moving services does TruMove offer?' },
      { id: 'video', label: 'Video Consult', icon: Video, action: 'navigate', target: '/book' },
      { id: 'call', label: 'Speak to Agent', icon: Phone, action: 'call' },
    ],
    agentContext: "User is on the home page. Help them learn about TruMove services. Do NOT provide pricing - direct them to speak with an agent for quotes.",
  },
  estimate: {
    key: 'estimate',
    firstMessage: "Need help building your inventory? I can explain how our AI scanning works, suggest what to include, or answer any questions about the moving process.",
    quickActions: [
      { id: 'scan', label: 'Scan Room', icon: ScanLine, action: 'navigate', target: '/scan-room' },
      { id: 'tips', label: 'Inventory Tips', icon: Lightbulb, action: 'message', message: 'What are some tips for building an accurate moving inventory?' },
      { id: 'agent', label: 'Talk to Agent', icon: Phone, action: 'call' },
    ],
    agentContext: "User is building their inventory. Help with item selection and process questions. For pricing, suggest speaking with an agent.",
  },
  'video-consult': {
    key: 'video-consult',
    firstMessage: "Looking to book a consultation? I can explain what to expect, help you prepare, or answer questions about our virtual survey process. For scheduling, I'd recommend speaking with an agent.",
    quickActions: [
      { id: 'what-expect', label: 'What to Expect', icon: HelpCircle, action: 'message', message: 'What happens during a video consultation?' },
      { id: 'prepare', label: 'How to Prepare', icon: Lightbulb, action: 'message', message: 'How should I prepare for a video consultation?' },
      { id: 'schedule', label: 'Schedule with Agent', icon: Phone, action: 'call' },
    ],
    agentContext: "User wants to book a video consultation. Help with preparation and process info. For scheduling, connect them to an agent.",
  },
  tracking: {
    key: 'tracking',
    firstMessage: "Tracking your shipment? I can explain the tracking features, check weather conditions, or connect you with your move coordinator for specific updates.",
    quickActions: [
      { id: 'how-tracking', label: 'How Tracking Works', icon: Truck, action: 'message', message: 'How does the live tracking feature work?' },
      { id: 'weather', label: 'Route Weather', icon: CloudSun, action: 'message', message: 'What is the weather like along typical moving routes?' },
      { id: 'coordinator', label: 'Call Coordinator', icon: Headphones, action: 'call' },
    ],
    agentContext: "User is tracking their move. Help with feature explanations. For specific shipment status, connect to their coordinator.",
  },
  vetting: {
    key: 'vetting',
    firstMessage: "Looking to verify a moving company? I can explain what safety scores mean, share red flags to watch for, or help you understand carrier ratings.",
    quickActions: [
      { id: 'scores', label: 'Safety Scores', icon: Scale, action: 'message', message: 'What do the carrier safety scores mean?' },
      { id: 'flags', label: 'Red Flags', icon: HelpCircle, action: 'message', message: 'What are red flags to watch for when hiring movers?' },
      { id: 'agent', label: 'Get Agent Help', icon: Phone, action: 'call' },
    ],
    agentContext: "User is vetting movers. Explain ratings and red flags. For carrier recommendations, connect to an agent.",
  },
  'scan-room': {
    key: 'scan-room',
    firstMessage: "Ready to scan your room? I can guide you through the AI scanning process or share tips for best results.",
    quickActions: [
      { id: 'how-scan', label: 'How It Works', icon: ScanLine, action: 'message', message: 'How does the room scanning feature work?' },
      { id: 'tips', label: 'Scanning Tips', icon: Lightbulb, action: 'message', message: 'What are tips for getting accurate room scans?' },
      { id: 'help', label: 'Get Help', icon: Phone, action: 'call' },
    ],
    agentContext: "User is scanning rooms for inventory. Help with the scanning process. For pricing questions, connect to an agent.",
  },
  info: {
    key: 'info',
    firstMessage: "Have questions about TruMove? I'm TruDy, here to help! Ask me about our services or anything you'd like to know.",
    quickActions: [
      { id: 'services', label: 'Our Services', icon: Truck, action: 'message', message: 'What moving services does TruMove offer?' },
      { id: 'video', label: 'Video Consult', icon: Video, action: 'navigate', target: '/book' },
      { id: 'agent', label: 'Speak to Agent', icon: Phone, action: 'call' },
    ],
    agentContext: "User is on an informational page. Help with questions but direct to agents for pricing and scheduling.",
  },
  general: {
    key: 'general',
    firstMessage: "Hi! I'm TruDy, your TruMove moving assistant. I can answer questions about our services, help you understand the moving process, or connect you with a specialist. How can I help?",
    quickActions: [
      { id: 'services', label: 'Our Services', icon: Truck, action: 'message', message: 'What moving services does TruMove offer?' },
      { id: 'video', label: 'Video Consult', icon: Video, action: 'navigate', target: '/book' },
      { id: 'agent', label: 'Speak to Agent', icon: Phone, action: 'call' },
    ],
    agentContext: "General moving assistance. Help with questions but direct to agents for pricing and scheduling.",
  },
};

export function getPageContext(pathname: string): PageContext {
  // Exact matches first
  if (pathname === '/' || pathname === '') {
    return pageContexts.home;
  }
  
  // Path prefix matching
  if (pathname.startsWith('/online-estimate')) {
    return pageContexts.estimate;
  }
  if (pathname.startsWith('/book')) {
    return pageContexts['video-consult'];
  }
  if (pathname.startsWith('/track') || pathname.startsWith('/live-tracking')) {
    return pageContexts.tracking;
  }
  if (pathname.startsWith('/carrier-vetting') || pathname.startsWith('/vetting')) {
    return pageContexts.vetting;
  }
  if (pathname.startsWith('/scan-room')) {
    return pageContexts['scan-room'];
  }
  if (pathname.startsWith('/about') || pathname.startsWith('/faq') || pathname.startsWith('/terms') || pathname.startsWith('/privacy')) {
    return pageContexts.info;
  }
  
  // Default fallback
  return pageContexts.general;
}
