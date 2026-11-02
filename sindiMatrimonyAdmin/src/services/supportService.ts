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
  email: 'support@sindhimarriage.in',
  escalationPhone: '+91 98200 11223',
  escalationEmail: 'escalations@sindhimarriage.in',
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

const INITIAL_TICKETS: SupportTicket[] = [];

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
