import { ReactNode } from "react";

// Supabase Database Types
export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  author: string;
  category: string;
  slug: string;
}

export interface Project {
  meters: any;
  area: ReactNode;
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  year: string;
  location: string;
  client: string;
  image_url: string;
  gallery: string[];
  created_at: string;
  updated_at: string;
  slug: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  read: boolean;
}

// Form Types
export interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Component Props Types
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export interface BlogCardProps {
  post: Blog;
}

export interface ProjectCardProps {
  project: Project;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface ProjectAPI {
  meters: any;
  area: ReactNode;
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  year: string;
  location: string;
  client: string;
  image_url: string;
  gallery: string[];
  created_at: string;
  updated_at: string;
  slug: string;
}

export interface APIProject {
  "COL 1": string; // id
  "COL 2": string; // title
  "COL 3": string; // description
  "COL 4": string; // content
  "COL 5": string; // category
  "COL 6": string; // year
  "COL 7": string; // location
  "COL 8": string; // client
  "COL 9": string; // image_url
  "COL 10": string; // gallery (JSON string)
  "COL 11": string; // created_at
  "COL 12": string; // updated_at
  "COL 13": string; // slug
  "COL 14": string; // meters
}