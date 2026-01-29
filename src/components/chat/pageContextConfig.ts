import { LucideIcon, Zap, Video, Phone, ScanLine, Lightbulb, Truck, Search, Scale, HelpCircle, Calendar, MessageSquare, MapPin, CloudSun, Headphones } from 'lucide-react';

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
    firstMessage: "Hi! Ready to get your instant moving quote? I can help you estimate costs, find vetted movers, or answer any questions about your upcoming move.",
    quickActions: [
      { id: 'quote', label: 'Quick Quote', icon: Zap, action: 'quote' },
      { id: 'video', label: 'Video Consult', icon: Video, action: 'navigate', target: '/book' },
      { id: 'call', label: 'Call Now', icon: Phone, action: 'call' },
    ],
    agentContext: "User is on the home page and may be starting their moving journey. They might want a quote, information about services, or general moving advice.",
  },
  estimate: {
    key: 'estimate',
    firstMessage: "Need help building your inventory? I can suggest items based on your home size, explain how our AI estimation works, or help you find specific furniture to add.",
    quickActions: [
      { id: 'scan', label: 'Scan Room', icon: ScanLine, action: 'navigate', target: '/scan-room' },
      { id: 'tips', label: 'Inventory Tips', icon: Lightbulb, action: 'message', message: 'What are some tips for building an accurate moving inventory?' },
      { id: 'estimate', label: 'Get AI Estimate', icon: Zap, action: 'message', message: 'How does the AI estimation work?' },
    ],
    agentContext: "User is on the inventory builder page and may need help adding items, understanding item categories, or getting an accurate estimate for their move.",
  },
  'video-consult': {
    key: 'video-consult',
    firstMessage: "Looking to book a video consultation? I can help you understand what to expect, find the best time slot, or answer questions about our virtual survey process.",
    quickActions: [
      { id: 'schedule', label: 'Schedule Call', icon: Calendar, action: 'message', message: 'Help me schedule a video consultation' },
      { id: 'what-expect', label: 'What to Expect', icon: HelpCircle, action: 'message', message: 'What happens during a video consultation?' },
      { id: 'call', label: 'Phone Support', icon: Phone, action: 'call' },
    ],
    agentContext: "User is on the video consultation booking page. They may want to schedule a call, understand the process, or have questions about virtual moving surveys.",
  },
  tracking: {
    key: 'tracking',
    firstMessage: "Tracking your shipment? I can help you understand your delivery timeline, check weather conditions along the route, or connect you with your driver coordinator.",
    quickActions: [
      { id: 'booking', label: 'Enter Booking #', icon: Truck, action: 'message', message: 'I need to enter my booking number to track my shipment' },
      { id: 'weather', label: 'Check Weather', icon: CloudSun, action: 'message', message: 'What is the weather like along my moving route?' },
      { id: 'support', label: 'Contact Support', icon: Headphones, action: 'call' },
    ],
    agentContext: "User is on the live tracking page. They may want to track a shipment, understand ETAs, check route conditions, or contact their driver.",
  },
  vetting: {
    key: 'vetting',
    firstMessage: "Looking to verify a moving company? I can explain what the safety scores mean, help you compare carriers, or guide you through the vetting process.",
    quickActions: [
      { id: 'search', label: 'How to Search', icon: Search, action: 'message', message: 'How do I search for and verify a moving company?' },
      { id: 'compare', label: 'Compare Tips', icon: Scale, action: 'message', message: 'What should I compare when choosing between movers?' },
      { id: 'flags', label: 'Red Flags', icon: HelpCircle, action: 'message', message: 'What are red flags to watch for when hiring movers?' },
    ],
    agentContext: "User is on the carrier vetting page. They may want to verify a moving company, understand safety ratings, or learn how to avoid moving scams.",
  },
  'scan-room': {
    key: 'scan-room',
    firstMessage: "Ready to scan your room? I can guide you through the AI scanning process, explain how to get the best results, or help troubleshoot any issues.",
    quickActions: [
      { id: 'how-scan', label: 'How It Works', icon: ScanLine, action: 'message', message: 'How does the room scanning feature work?' },
      { id: 'tips', label: 'Scanning Tips', icon: Lightbulb, action: 'message', message: 'What are tips for getting accurate room scans?' },
      { id: 'manual', label: 'Add Manually', icon: Zap, action: 'navigate', target: '/online-estimate' },
    ],
    agentContext: "User is on the room scanning page. They may need help with the AI scanning process, camera permissions, or understanding how items are detected.",
  },
  info: {
    key: 'info',
    firstMessage: "Have questions about TruMove? I'm here to help! Ask me about our services, pricing, or anything else you'd like to know.",
    quickActions: [
      { id: 'quote', label: 'Get Quote', icon: Zap, action: 'quote' },
      { id: 'services', label: 'Our Services', icon: Truck, action: 'message', message: 'What moving services does TruMove offer?' },
      { id: 'contact', label: 'Contact Us', icon: MessageSquare, action: 'call' },
    ],
    agentContext: "User is on an informational page (About, FAQ, Terms, etc). They may have general questions about the company, services, or policies.",
  },
  general: {
    key: 'general',
    firstMessage: "Hi! I'm your TruMove AI assistant. I can help you with moving quotes, answer questions about our services, or connect you with a specialist. What can I help you with today?",
    quickActions: [
      { id: 'quote', label: 'Quick Quote', icon: Zap, action: 'quote' },
      { id: 'video', label: 'Video Consult', icon: Video, action: 'navigate', target: '/book' },
      { id: 'call', label: 'Call Us', icon: Phone, action: 'call' },
    ],
    agentContext: "User opened the AI assistant from a page without specific context. Provide general moving assistance.",
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
