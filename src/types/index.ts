export type UserRole = "admin" | "visitor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface SiteProfile {
  id: string;
  fullName: string;
  headline: string;
  shortBio: string;
  aboutMe: string;
  avatarUrl: string;
  avatarAlt: string;
  cvUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  location: string;
  statusText: string;
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
  category: "Computer Vision" | "Geospatial" | "Full-Stack" | "System" | "Other";
  technologies: string[];
  coverImage: string;
  repoUrl?: string;
  liveUrl?: string;
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
  orderIndex: number;
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
  contactEmail: string;
  enableAiAssistant: boolean;
  enableComments: boolean;
  notifyOnComment: boolean;
}
