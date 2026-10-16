import { z } from "zod";

// Safe URL validator
const optionalUrl = z
  .string()
  .trim()
  .refine(
    (val) => val === "" || /^https?:\/\//i.test(val) || val.startsWith("/"),
    { message: "URL harus diawali dengan http://, https://, atau /" }
  )
  .optional()
  .or(z.literal(""));

export const authLoginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const authRegisterSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").max(100),
});

export const commentCreateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(3, "Komentar minimal 3 karakter")
    .max(1000, "Komentar maksimal 1000 karakter"),
  parentId: z.string().uuid().nullable().optional(),
});

export const commentUpdateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(3, "Komentar minimal 3 karakter")
    .max(1000, "Komentar maksimal 1000 karakter"),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().trim().email("Format email tidak valid"),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(2000),
  // Honeypot field for bot protection
  hp: z.string().max(0).optional(),
});

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  headline: z.string().trim().min(5).max(200),
  shortBio: z.string().trim().min(10).max(1000),
  aboutMe: z.string().trim().min(20).max(5000),
  avatarUrl: z.string().trim(),
  avatarAlt: z.string().trim().max(150),
  cvUrl: z.string().trim(),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  email: z.string().trim().email().or(z.literal("")),
  location: z.string().trim().max(100),
  statusText: z.string().trim().max(150),
  roleTitle: z.string().trim().max(120).optional().default("Informatics & CV Engineer"),
  brandName: z.string().trim().max(120).optional().default("Wijaya Dary Dimas"),
  logoUrl: z.string().trim().optional().default(""),
  instagramUrl: optionalUrl,
  tiktokUrl: optionalUrl,
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3).max(150),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan strip (-)"),
  shortDescription: z.string().trim().min(10).max(300),
  fullDescription: z.string().trim().min(20).max(8000),
  problem: z.string().trim().max(2000).optional().default(""),
  solution: z.string().trim().max(2000).optional().default(""),
  results: z.string().trim().max(2000).optional().default(""),
  category: z.enum(["Computer Vision", "Geospatial", "Full-Stack", "System", "Other"]),
  technologies: z.array(z.string().trim()).min(1, "Minimal satu teknologi"),
  coverImage: z.string().trim().min(1, "Cover image wajib diisi"),
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  orderIndex: z.number().int().default(0),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  organization: z.string().trim().min(2).max(150),
  role: z.string().trim().min(2).max(150),
  period: z.string().trim().min(2).max(100),
  description: z.string().trim().max(3000).default(""),
  type: z.enum(["work", "internship", "organization"]),
  orderIndex: z.number().int().default(0),
  url: optionalUrl,
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().trim().min(2).max(150),
  degree: z.string().trim().min(2).max(150),
  period: z.string().trim().min(2).max(100),
  description: z.string().trim().max(2000).default(""),
  orderIndex: z.number().int().default(0),
  url: optionalUrl,
});

export const researchSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(5).max(300),
  summary: z.string().trim().min(10).max(1000),
  background: z.string().trim().max(3000).default(""),
  objective: z.string().trim().max(2000).default(""),
  methodology: z.string().trim().max(4000).default(""),
  modelModification: z.string().trim().max(4000).default(""),
  datasetNotes: z.string().trim().max(2000).default(""),
  publishedStatus: z.string().trim().default("Penelitian Skripsi"),
  repoUrl: optionalUrl,
  pdfUrl: optionalUrl,
  orderIndex: z.number().int().default(0),
});

export const siteSettingsSchema = z.object({
  aiProvider: z.string().default("gemini"),
  aiModel: z.string().default("gemini-1.5-flash"),
  aiAssistantName: z.string().trim().max(120).optional().default("Asisten AI — Wijaya Dary Dimas"),
  contactEmail: z.string().email().or(z.literal("")),
  enableAiAssistant: z.boolean().default(true),
  enableComments: z.boolean().default(true),
  notifyOnComment: z.boolean().default(false),
});
