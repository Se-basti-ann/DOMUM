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