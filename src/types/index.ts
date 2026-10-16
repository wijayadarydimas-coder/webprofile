export type UserRole = "admin" | "visitor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ExternalProviderLink {
  provider: string; // e.g. "github", "roboflow", "huggingface", etc.
  url: string;
  label?: string; // Optional custom display label
}

export interface SiteProfile {
  id: string;
  fullName: string;
  headline: string;
  shortBio: string;
  aboutMe: string;
  aboutTitle?: string;
  avatarUrl: string;
  avatarAlt: string;
  cvUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  location: string;
  statusText: string;
  roleTitle?: string;
  brandName?: string;
  logoUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  problem?: string;
  solution?: string;
  results?: string;
  category: string;
  technologies: string[];
  coverImage: string;
  repoUrl?: string;
  liveUrl?: string;
  externalLinks?: ExternalProviderLink[];
  featured: boolean;
  published: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  organization: string;
  role: string;
  period: string;
  description: string;
  type: "work" | "internship" | "organization";
  orderIndex: number;
  url?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  description: string;
  orderIndex: number;
  url?: string;
}

export type ResearchSectionType =
  | "text"
  | "markdown"
  | "methodology"
  | "architecture"
  | "dataset"
  | "results"
  | "integration"
  | "references";

export interface ResearchSectionItem {
  id: string;
  title: string;
  type: ResearchSectionType;
  content: string;
  orderIndex: number;
  isVisible: boolean;
}

export interface ResearchItem {
  id: string;
  title: string;
  summary: string;
  background: string;
  objective: string;
  methodology: string;
  modelModification: string;
  datasetNotes: string;
  publishedStatus: string;
  repoUrl?: string;
  pdfUrl?: string;
  externalLinks?: ExternalProviderLink[];
  orderIndex: number;
  institution?: string;
  studyProgram?: string;
  technologies?: string[];
  sections?: ResearchSectionItem[];
  updatedAt: string;
}

export interface Comment {
  id: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  isDeleted: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  altText: string;
  createdAt: string;
}

export interface SiteSettings {
  aiProvider: string;
  aiModel: string;
  aiAssistantName?: string;
  contactEmail: string;
  enableAiAssistant: boolean;
  enableComments: boolean;
  notifyOnComment: boolean;
}
