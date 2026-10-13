export interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalPath?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface ProfilePreviewSchemaData {
  name: string;
  gender: "Male" | "Female";
  jobTitle?: string;
  city?: string;
  image?: string;
}
