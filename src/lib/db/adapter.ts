import type {
  SiteProfile,
  Project,
  Experience,
  Education,
  ResearchItem,
  Comment,
  MediaItem,
  SiteSettings,
  User,
} from "@/types";

export interface DatabaseRepository {
  // Profile
  getProfile(): Promise<SiteProfile>;
  updateProfile(data: Partial<SiteProfile>): Promise<SiteProfile>;

  // Projects
  getProjects(options?: { publishedOnly?: boolean; featuredOnly?: boolean }): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;
  saveProject(project: Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;

  // Experience
  getExperiences(): Promise<Experience[]>;
  saveExperience(exp: Omit<Experience, "id"> & { id?: string }): Promise<Experience>;
  deleteExperience(id: string): Promise<boolean>;

  // Education
  getEducation(): Promise<Education[]>;
  saveEducation(edu: Omit<Education, "id"> & { id?: string }): Promise<Education>;
  deleteEducation(id: string): Promise<boolean>;

  // Research
  getResearchItems(): Promise<ResearchItem[]>;
  getResearchById(id: string): Promise<ResearchItem | null>;
  saveResearch(res: Omit<ResearchItem, "id" | "updatedAt"> & { id?: string }): Promise<ResearchItem>;
  deleteResearch(id: string): Promise<boolean>;

  // Comments
  getComments(options?: { includeHidden?: boolean }): Promise<Comment[]>;
  createComment(data: {
    parentId?: string | null;
    authorId: string;
    authorName: string;
    authorRole: "admin" | "visitor";
    content: string;
  }): Promise<Comment>;
  updateComment(id: string, content: string, userId: string): Promise<Comment | null>;
  deleteComment(id: string, userId: string, isAdmin: boolean): Promise<boolean>;
  moderateComment(id: string, isHidden: boolean): Promise<boolean>;

  // Media
  getMediaItems(): Promise<MediaItem[]>;
  saveMediaItem(media: Omit<MediaItem, "id" | "createdAt">): Promise<MediaItem>;
  deleteMediaItem(id: string): Promise<boolean>;

  // Site Settings
  getSettings(): Promise<SiteSettings>;
  updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings>;

  // Users
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  getUserPasswordHash(email: string): Promise<string | null>;
  createUser(user: Omit<User, "id" | "createdAt"> & { passwordHash: string }): Promise<User>;

  // Contact Messages
  saveContactMessage(name: string, email: string, message: string): Promise<{ id: string }>;
  getContactMessages(): Promise<Array<{ id: string; name: string; email: string; message: string; createdAt: string; isRead: boolean }>>;
}
