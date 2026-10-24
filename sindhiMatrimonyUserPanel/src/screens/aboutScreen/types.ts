export interface AboutStatItem {
  id: string;
  value: string;
  label: string;
  sublabel?: string;
  iconName?: string;
}

export interface AboutPillarItem {
  id: string;
  title: string;
  description: string;
  highlight: string;
  icon: string;
}

export interface AboutSubcasteItem {
  name: string;
  origin: string;
  description: string;
}

export interface AboutFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AboutContentData {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    leadParagraph: string;
  };
  stats: AboutStatItem[];
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  pillars: AboutPillarItem[];
  subcastes: AboutSubcasteItem[];
  faqs: AboutFaqItem[];
}
