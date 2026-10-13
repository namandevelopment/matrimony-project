export type TicketCategory =
  | 'CRM_LEADS'
  | 'TELEPHONY_VOIP'
  | 'PAYMENTS_REFUNDS'
  | 'KYC_VERIFICATION'
  | 'PERMISSIONS_ACCESS'
  | 'TECHNICAL_BUG'
  | 'OTHER';

export type TicketPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface TicketResponse {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isStaff: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface DirectContactChannels {
  phone: string;
  whatsapp: string;
  email: string;
  escalationPhone: string;
  escalationEmail: string;
  hours: string;
  averageResponseTime: string;
}

export const DIRECT_CONTACT: DirectContactChannels = {
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'support@sindhimatrimony.com',
  escalationPhone: '+91 98200 11223',
  escalationEmail: 'escalations@sindhimatrimony.com',
  hours: 'Monday – Sunday: 9:00 AM to 9:00 PM IST',
  averageResponseTime: 'Phone: Instant | WhatsApp: <5 Mins | Email: <2 Hours',
};

export const FAQ_LIST: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'CRM & Calling',
    question: 'How do I unmask a member or lead mobile number during a consultation?',
    answer:
      'In the CRM Leads table, click the "Reveal" (Eye icon) button next to the masked number. Depending on your role permissions, the full 10-digit number will be unlocked for verified customer contact.',
  },
  {
    id: 'faq_2',
    category: 'CRM & Calling',
    question: 'What is the 15-minute exclusivity lock on leads?',
    answer:
      'When an agent initiates a phone call or opens a lead disposition modal, the lead is temporarily locked for 15 minutes to prevent multiple agents from double-calling the same customer at the same time.',
  },
  {
    id: 'faq_3',
    category: 'Payments',
    question: 'How do I submit or approve a membership refund request?',
    answer:
      'Navigate to Payment Report (/finance). Open the transaction details and select "Initiate Refund". Finance Managers and Super Admins can approve and process the refund with bank reference tracking.',
  },
  {
    id: 'faq_4',
    category: 'Telephony',
    question: 'What should I do if the browser microphone is blocked for VoIP calls?',
    answer:
      'Click the padlock/site settings icon in your browser address bar next to the URL. Set "Microphone" to "Allow" and refresh the portal. You can also click "Simulate Call" in the top bar to test audio.',
  },
  {
    id: 'faq_5',
    category: 'Permissions',
    question: 'How do I request access to additional sidebar modules?',
    answer:
      'Submit a direct ticket using the form on this screen selecting "Account Access & Permissions". Your request is sent directly to the Super Admin who can grant section clearances in the Employees & Access module.',
  },
];

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TKT-1082',
    userId: 'emp_003',
    userName: 'Priya Sharma',
    userEmail: 'priya@sindhimatrimony.com',
    userPhone: '+91 98765 43212',
    category: 'CRM_LEADS',
    priority: 'HIGH',
    subject: 'Lead LD-1089 reassignment approval needed',
    description: 'Customer is requesting an agent who speaks Sindhi and Gujarati. Need to transfer lead to western zone team.',
    status: 'IN_PROGRESS',
    createdAt: '2026-10-12T14:30:00Z',
    updatedAt: '2026-10-12T15:00:00Z',
    responses: [
      {
        id: 'resp_1',
        sender: 'Priya Sharma (CRM Agent)',
        message: 'Client preferred Gujarati-speaking coordinator. Please approve transfer.',
        timestamp: '2026-10-12 14:30',
        isStaff: false,
      },
      {
        id: 'resp_2',
        sender: 'Rajesh Mulchandani (Super Admin)',
        message: 'Lead reassigned to Western Region queue. Verified and resolved.',
        timestamp: '2026-10-12 15:00',
        isStaff: true,
      },
    ],
  },
  {
    id: 'TKT-1081',
    userId: 'emp_002',
    userName: 'Kavita Chhabria',
    userEmail: 'kavita.c@sindhimatrimony.com',
    userPhone: '+91 98211 44556',
    category: 'TELEPHONY_VOIP',
    priority: 'MEDIUM',
    subject: 'SIP WebRTC audio lag during peak hours',
    description: 'Noticed a 2-second audio latency when dialing numbers in Delhi region between 5 PM and 6 PM.',
    status: 'RESOLVED',
    createdAt: '2026-10-11T16:15:00Z',
    updatedAt: '2026-10-11T18:45:00Z',
    responses: [
      {
        id: 'resp_1',
        sender: 'Kavita Chhabria',
        message: 'Audio delay noted on Mumbai gateway.',
        timestamp: '2026-10-11 16:15',
        isStaff: false,
      },
      {
        id: 'resp_2',
        sender: 'IT Telecom Team',
        message: 'VoIP gateway load balanced to secondary low-latency Singapore node. Latency normalized under 80ms.',
        timestamp: '2026-10-11 18:45',
        isStaff: true,
      },
    ],
  },
];

const STORAGE_KEY = 'sindhi_matrimony_support_tickets_v1';

class SupportService {
  private tickets: SupportTicket[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    if (typeof window === 'undefined') {
      this.tickets = [...INITIAL_TICKETS];
      return;
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.tickets = JSON.parse(data);
      } else {
        this.tickets = [...INITIAL_TICKETS];
        this.saveState();
      }
    } catch {
      this.tickets = [...INITIAL_TICKETS];
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tickets));
    } catch {
      // ignore write error
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('SupportService subscriber error:', err);
      }
    });
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  public getTickets(): SupportTicket[] {
    return [...this.tickets];
  }

  public getTicketById(id: string): SupportTicket | undefined {
    return this.tickets.find((t) => t.id === id);
  }

  public createTicket(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    category: TicketCategory;
    priority: TicketPriority;
    subject: string;
    description: string;
  }): SupportTicket {
    const nextNum = 1083 + this.tickets.length;
    const ticketId = `TKT-${nextNum}`;
    const now = new Date().toISOString();

    const newTicket: SupportTicket = {
      id: ticketId,
      ...data,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now,
      responses: [
        {
          id: `resp_${Date.now()}`,
          sender: data.userName,
          message: data.description,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStaff: false,
        },
      ],
    };

    this.tickets = [newTicket, ...this.tickets];
    this.saveState();
    return newTicket;
  }

  public addResponse(ticketId: string, sender: string, message: string, isStaff: boolean = false): void {
    this.tickets = this.tickets.map((t) => {
      if (t.id === ticketId) {
        const newResponse: TicketResponse = {
          id: `resp_${Date.now()}`,
          sender,
          message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStaff,
        };
        return {
          ...t,
          updatedAt: new Date().toISOString(),
          responses: [...t.responses, newResponse],
        };
      }
      return t;
    });
    this.saveState();
  }

  public updateStatus(ticketId: string, status: TicketStatus): void {
    this.tickets = this.tickets.map((t) =>
      t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t
    );
    this.saveState();
  }
}

export const supportService = new SupportService();
