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

// Interfaz principal de Project (corregida)
export interface Project {
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
  meters: string; // Solo meters, no area
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

// Tipos para operaciones CRUD
export type CreateProjectData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProjectData = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type CreateBlogData = Omit<Blog, 'id' | 'created_at' | 'updated_at'>;
export type UpdateBlogData = Omit<Blog, 'id' | 'created_at' | 'updated_at'>;

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

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ImageUploadResponse {
  success: boolean;
  url: string;
  fileName?: string;
  isGallery?: boolean;
}

// Tipo para mapear las columnas genéricas de la API
export interface APIProjectRaw {
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

// Tipos para listas de dashboard
export interface ProjectListItem {
  id: string;
  title: string;
  category: string;
  client: string;
  year: string;
  created_at?: string;
}

export interface BlogListItem {
  id: string;
  title: string;
  category: string;
  author: string;
  published_at: string;
  created_at?: string;
}

// Tipos para validación
export interface ValidationError {
  field: string;
  message: string;
}

// Tipos para galería
export interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}