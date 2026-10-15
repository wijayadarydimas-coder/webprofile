import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { DatabaseRepository } from "./adapter";
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

interface DataStoreSchema {
  profile: SiteProfile;
  projects: Project[];
  experiences: Experience[];
  educations: Education[];
  research: ResearchItem[];
  comments: Comment[];
  media: MediaItem[];
  settings: SiteSettings;
  users: Array<User & { passwordHash: string }>;
  messages: Array<{ id: string; name: string; email: string; message: string; createdAt: string; isRead: boolean }>;
}

const initialSeed: DataStoreSchema = {
  profile: {
    id: "primary",
    fullName: "Wijaya Dary Dimas",
    headline: "Exploring Technology. Building Ideas. Creating Impact.",
    shortBio:
      "Saya memiliki latar belakang Teknik Informatika dan senang mengeksplorasi teknologi melalui proyek, penelitian, dan pengalaman praktik. Website ini menjadi tempat saya mendokumentasikan karya, proses belajar, dan perjalanan profesional.",
    aboutMe:
      "Halo! Saya Wijaya Dary Dimas, mahasiswa Teknik Informatika di Universitas Muhammadiyah Purwokerto dengan fokus minat pada rekayasa perangkat lunak, sistem berbasis machine learning / computer vision, dan komputasi terapan.\n\nMelalui studi dan pengalaman praktik di Badan Informasi Geospasial sebagai Pranata Komputer, saya terbiasa memecahkan masalah teknis dengan pendekatan terstruktur, menguji implementasi secara langsung, dan membangun sistem yang andal serta bermanfaat bagi pengguna.\n\nSaya percaya bahwa teknologi terbaik adalah teknologi yang dibangun dengan rasa ingin tahu tinggi, pemahaman mendalam pada masalah nyata, dan komitmen terhadap kualitas rekayasa.",
    avatarUrl: "/images/profile-placeholder.svg",
    avatarAlt: "Foto Profil Wijaya Dary Dimas",
    cvUrl: "/files/cv-placeholder.pdf",
    githubUrl: "https://github.com/wijayadarydimas-coder",
    linkedinUrl: "",
    email: "",
    location: "Purwokerto, Indonesia",
    statusText: "Pranata Komputer di BIG & Riset Deteksi APD YOLOv11",
    updatedAt: new Date().toISOString(),
  },
  projects: [
    {
      id: "proj-1",
      slug: "yolov11-safety-detection",
      title: "Sistem Deteksi APD Real-Time & Alarm Otomatis Berbasis YOLOv11",
      shortDescription:
        "Sistem computer vision cerdas untuk mendeteksi kelengkapan APD (helm, rompi, sarung tangan, sepatu keselamatan) pada pekerja industri dengan pemicu alarm otomatis.",
      fullDescription:
        "Proyek ini merupakan implementasi dan rekayasa sistem dari penelitian skripsi di Universitas Muhammadiyah Purwokerto. Sistem dirancang untuk memantau keselamatan kerja di area industri dan konstruksi secara otomatis tanpa kelelahan visual operator manusia.\n\nArsitektur YOLOv11 dimodifikasi untuk meningkatkan sensitivitas deteksi pada objek kecil seperti sarung tangan kerja dan sepatu keselamatan dari sudut pandang kamera pengawas, kemudian dipasangkan dengan modul pemicu alarm peringatan otomatis saat mendeteksi pelanggaran APD.",
      problem:
        "Pengawasan kepatuhan K3 manual menggunakan CCTV konvensional membutuhkan fokus visual konstan dari petugas dan rentan terhadap kelalaian manusia pada area kerja yang luas.",
      solution:
        "Mengembangkan pipeline Computer Vision end-to-end yang mengintegrasikan streaming kamera, model modifikasi YOLOv11 untuk inferensi multi-objek APD, serta trigger alarm instan ketika terdeteksi pekerja tanpa APD lengkap di zona bahaya.",
      results:
        "Sistem berhasil melakukan inferensi video secara stabil dan memicu sinyal peringatan otomatis secara tepat waktu pada simulasi lingkungan kerja.",
      category: "Computer Vision",
      technologies: ["Python", "YOLOv11", "PyTorch", "OpenCV", "FastAPI", "Computer Vision"],
      coverImage: "/images/project-yolo.svg",
      repoUrl: "https://github.com/wijayadarydimas-coder",
      liveUrl: "",
      featured: true,
      published: true,
      orderIndex: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "proj-2",
      slug: "spatial-data-infrastructure",
      title: "Geospatial Data Pipeline & Management Portal",
      shortDescription:
        "Eksplorasi infrastruktur dan katalogisasi data geospasial berbasis web untuk efisiensi distribusi informasi spasial.",
      fullDescription:
        "Proyek pendukung dan studi kasus eksplorasi teknologi informasi geospasial. Menghubungkan visualisasi peta interaktif dengan backend pengelolaan metadata yang terstruktur untuk mendukung keterbukaan dan kemudahan akses data spasial.",
      problem:
        "Distribusi dataset geospasial berukuran besar memerlukan sistem pengindeksan metadata yang rapi dan antarmuka penelusuran yang mudah digunakan.",
      solution:
        "Membangun portal penelusuran spasial interaktif dengan filtering atribut, preview layer koordinat, dan endpoint API modular.",
      results:
        "Katalog data dapat diakses cepat dengan rendering layer peta responsif di berbagai perangkat.",
      category: "Geospatial",
      technologies: ["TypeScript", "Next.js", "PostgreSQL", "PostGIS", "Tailwind CSS"],
      coverImage: "/images/project-geo.svg",
      repoUrl: "https://github.com/wijayadarydimas-coder",
      liveUrl: "",
      featured: true,
      published: true,
      orderIndex: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "proj-3",
      slug: "personal-digital-hub",
      title: "Modern Personal Digital Hub & AI Assistant Platform",
      shortDescription:
        "Platform website personal production-ready dengan arsitektur modern Next.js App Router, integrasi AI kustom, dan sistem diskusi komunitas aman.",
      fullDescription:
        "Sistem digital hub yang dirancang dari nol untuk menjadi representasi profesional jangka panjang. Dilengkapi dengan dashboard manajemen konten, autentikasi terverifikasi, adapter database fleksibel (PostgreSQL/Supabase/Local), dan asisten AI berbasis pengetahuan terverifikasi pemilik.",
      problem:
        "Template portofolio statis konvensional sulit diperbarui secara dinamis dan tidak memiliki kapabilitas interaktivitas dua arah.",
      solution:
        "Membangun arsitektur full-stack dengan pemisahan repository layer, proteksi admin server-side, kontrol akses ketat, dan antarmuka gelap modern dengan aksen 3D ringan.",
      results:
        "Website interaktif yang cepat, aman, memenuhi standar aksesibilitas dan SEO, serta mudah dikelola secara mandiri.",
      category: "Full-Stack",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js", "PostgreSQL", "Zod"],
      coverImage: "/images/project-web.svg",
      repoUrl: "https://github.com/wijayadarydimas-coder",
      liveUrl: "",
      featured: true,
      published: true,
      orderIndex: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  experiences: [
    {
      id: "exp-1",
      organization: "Badan Informasi Geospasial",
      role: "Pranata Komputer",
      period: "November 2025 – Mei 2026",
      description:
        "Bertanggung jawab dalam pengelolaan sistem teknologi informasi dan infrastruktur data spasial, pemeliharaan perangkat lunak layanan internal, serta memberikan dukungan teknis komputasi pada instansi.",
      type: "internship",
      orderIndex: 1,
      url: "https://big.go.id",
    },
  ],
  educations: [
    {
      id: "edu-1",
      institution: "Universitas Muhammadiyah Purwokerto",
      degree: "S1 Teknik Informatika",
      period: "2021 – Sekarang",
      description:
        "Mendalami ilmu rekayasa perangkat lunak, algoritma dan struktur data, kecerdasan buatan, jaringan komputer, serta pengolahan citra digital. Mengembangkan skripsi modifikasi arsitektur YOLOv11 untuk deteksi APD.",
      orderIndex: 1,
      url: "https://ump.ac.id",
    },
  ],
  research: [
    {
      id: "res-1",
      title:
        "Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis.",
      summary:
        "Penelitian skripsi mengenai pengembangan model deteksi objek modifikasi YOLOv11 untuk mengidentifikasi 4 kelas Alat Pelindung Diri (APD) keselamatan kerja secara simultan dengan integrasi peringatan otomatis.",
      background:
        "Tingginya angka kecelakaan kerja pada sektor konstruksi dan industri manufaktur sebagian besar dipicu oleh kelalaian pekerja dalam memakai APD lengkap. Diperlukan sistem pengawasan digital otomatis yang mampu mendeteksi pelanggaran secara real-time.",
      objective:
        "Mengembangkan model deteksi modifikasi YOLOv11 yang efisien dalam mengklasifikasikan helm, rompi, sarung tangan, dan sepatu pelindung, serta menghubungkan hasil inferensi dengan sistem alarm audio-visual otomatis.",
      methodology:
        "Metodologi mencakup: studi literatur, akuisisi dan anotasi dataset APD, modifikasi arsitektur model YOLOv11 pada modul ekstraksi fitur, proses training dan validasi, serta pengujian sistem alarm otomatis di lingkungan uji coba.",
      modelModification:
        "Optimalisasi penangkapan fitur multi-skala guna meminimalisir miss-detection pada objek berskala kecil dan sering terhalang (seperti sarung tangan dan sepatu), serta mempertahankan frame rate tinggi untuk streaming kamera.",
      datasetNotes:
        "Dataset dikurasi secara terarah mencakup beragam sudut pandang kamera pengawas, variasi pencahayaan ruangan/lapangan, dan berbagai warna APD standar keselamatan.",
      publishedStatus: "Penelitian Skripsi",
      repoUrl: "https://github.com/wijayadarydimas-coder",
      pdfUrl: "",
      orderIndex: 1,
      updatedAt: new Date().toISOString(),
    },
  ],
  comments: [
    {
      id: "comm-1",
      parentId: null,
      authorId: "author-owner",
      authorName: "Wijaya Dary Dimas",
      authorRole: "admin",
      content:
        "Selamat datang di website personal saya! Silakan bagikan masukan, diskusi teknologi, atau pertanyaan Anda di kolom komunitas ini.",
      isDeleted: false,
      isHidden: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  media: [
    {
      id: "media-1",
      name: "profile-placeholder.svg",
      url: "/images/profile-placeholder.svg",
      mimeType: "image/svg+xml",
      sizeBytes: 1024,
      altText: "Avatar Wijaya Dary Dimas",
      createdAt: new Date().toISOString(),
    },
  ],
  settings: {
    aiProvider: "gemini",
    aiModel: "gemini-1.5-flash",
    contactEmail: "",
    enableAiAssistant: true,
    enableComments: true,
    notifyOnComment: false,
  },
  users: [],
  messages: [],
};

export class LocalStoreRepository implements DatabaseRepository {
  private filePath: string;

  constructor() {
    const dataDir = path.join(process.cwd(), ".data");
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {}
    }
    this.filePath = path.join(dataDir, "db.json");
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!fs.existsSync(this.filePath)) {
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(initialSeed, null, 2), "utf8");
      } catch {}
    }
  }

  private readData(): DataStoreSchema {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf8");
        return JSON.parse(raw);
      }
    } catch {}
    return JSON.parse(JSON.stringify(initialSeed));
  }

  private writeData(data: DataStoreSchema) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
      console.error("LocalStore write error:", e);
    }
  }

  async getProfile(): Promise<SiteProfile> {
    const data = this.readData();
    return data.profile || initialSeed.profile;
  }

  async updateProfile(updates: Partial<SiteProfile>): Promise<SiteProfile> {
    const data = this.readData();
    data.profile = {
      ...data.profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.writeData(data);
    return data.profile;
  }

  async getProjects(options?: { publishedOnly?: boolean; featuredOnly?: boolean }): Promise<Project[]> {
    const data = this.readData();
    let list = data.projects || [];
    if (options?.publishedOnly) {
      list = list.filter((p) => p.published);
    }
    if (options?.featuredOnly) {
      list = list.filter((p) => p.featured);
    }
    return list.sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const data = this.readData();
    return data.projects?.find((p) => p.slug === slug) || null;
  }

  async saveProject(proj: Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<Project> {
    const data = this.readData();
    const now = new Date().toISOString();
    if (proj.id) {
      const idx = data.projects.findIndex((p) => p.id === proj.id);
      if (idx !== -1) {
        const updated: Project = {
          ...data.projects[idx],
          ...proj,
          updatedAt: now,
        };
        data.projects[idx] = updated;
        this.writeData(data);
        return updated;
      }
    }
    const newProj: Project = {
      ...proj,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    data.projects.push(newProj);
    this.writeData(data);
    return newProj;
  }

  async deleteProject(id: string): Promise<boolean> {
    const data = this.readData();
    const before = data.projects.length;
    data.projects = data.projects.filter((p) => p.id !== id);
    if (data.projects.length !== before) {
      this.writeData(data);
      return true;
    }
    return false;
  }

  async getExperiences(): Promise<Experience[]> {
    const data = this.readData();
    return (data.experiences || []).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async saveExperience(exp: Omit<Experience, "id"> & { id?: string }): Promise<Experience> {
    const data = this.readData();
    if (exp.id) {
      const idx = data.experiences.findIndex((e) => e.id === exp.id);
      if (idx !== -1) {
        data.experiences[idx] = { ...data.experiences[idx], ...exp };
        this.writeData(data);
        return data.experiences[idx];
      }
    }
    const newExp: Experience = {
      ...exp,
      id: crypto.randomUUID(),
    };
    data.experiences.push(newExp);
    this.writeData(data);
    return newExp;
  }

  async deleteExperience(id: string): Promise<boolean> {
    const data = this.readData();
    const before = data.experiences.length;
    data.experiences = data.experiences.filter((e) => e.id !== id);
    if (data.experiences.length !== before) {
      this.writeData(data);
      return true;
    }
    return false;
  }

  async getEducation(): Promise<Education[]> {
    const data = this.readData();
    return (data.educations || []).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async saveEducation(edu: Omit<Education, "id"> & { id?: string }): Promise<Education> {
    const data = this.readData();
    if (edu.id) {
      const idx = data.educations.findIndex((e) => e.id === edu.id);
      if (idx !== -1) {
        data.educations[idx] = { ...data.educations[idx], ...edu };
        this.writeData(data);
        return data.educations[idx];
      }
    }
    const newEdu: Education = {
      ...edu,
      id: crypto.randomUUID(),
    };
    data.educations.push(newEdu);
    this.writeData(data);
    return newEdu;
  }

  async deleteEducation(id: string): Promise<boolean> {
    const data = this.readData();
    const before = data.educations.length;
    data.educations = data.educations.filter((e) => e.id !== id);
    if (data.educations.length !== before) {
      this.writeData(data);
      return true;
    }
    return false;
  }

  async getResearchItems(): Promise<ResearchItem[]> {
    const data = this.readData();
    return (data.research || []).sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getResearchById(id: string): Promise<ResearchItem | null> {
    const data = this.readData();
    return data.research?.find((r) => r.id === id) || null;
  }

  async saveResearch(res: Omit<ResearchItem, "id" | "updatedAt"> & { id?: string }): Promise<ResearchItem> {
    const data = this.readData();
    const now = new Date().toISOString();
    if (res.id) {
      const idx = data.research.findIndex((r) => r.id === res.id);
      if (idx !== -1) {
        data.research[idx] = { ...data.research[idx], ...res, updatedAt: now };
        this.writeData(data);
        return data.research[idx];
      }
    }
    const newRes: ResearchItem = {
      ...res,
      id: crypto.randomUUID(),
      updatedAt: now,
    };
    data.research.push(newRes);
    this.writeData(data);
    return newRes;
  }

  async deleteResearch(id: string): Promise<boolean> {
    const data = this.readData();
    const before = data.research.length;
    data.research = data.research.filter((r) => r.id !== id);
    if (data.research.length !== before) {
      this.writeData(data);
      return true;
    }
    return false;
  }

  async getComments(options?: { includeHidden?: boolean }): Promise<Comment[]> {
    const data = this.readData();
    let list = data.comments || [];
    if (!options?.includeHidden) {
      list = list.filter((c) => !c.isHidden);
    }
    return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createComment(input: {
    parentId?: string | null;
    authorId: string;
    authorName: string;
    authorRole: "admin" | "visitor";
    content: string;
  }): Promise<Comment> {
    const data = this.readData();
    const now = new Date().toISOString();
    const newComment: Comment = {
      id: crypto.randomUUID(),
      parentId: input.parentId || null,
      authorId: input.authorId,
      authorName: input.authorName,
      authorRole: input.authorRole,
      content: input.content,
      isDeleted: false,
      isHidden: false,
      createdAt: now,
      updatedAt: now,
    };
    data.comments.push(newComment);
    this.writeData(data);
    return newComment;
  }

  async updateComment(id: string, content: string, userId: string): Promise<Comment | null> {
    const data = this.readData();
    const idx = data.comments.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    if (data.comments[idx].authorId !== userId) {
      throw new Error("Unauthorized to edit this comment");
    }
    data.comments[idx].content = content;
    data.comments[idx].updatedAt = new Date().toISOString();
    this.writeData(data);
    return data.comments[idx];
  }

  async deleteComment(id: string, userId: string, isAdmin: boolean): Promise<boolean> {
    const data = this.readData();
    const idx = data.comments.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    const comment = data.comments[idx];
    if (!isAdmin && comment.authorId !== userId) {
      throw new Error("Unauthorized to delete this comment");
    }

    // Check if it has replies. If it has replies, soft delete to preserve thread tree!
    const hasReplies = data.comments.some((c) => c.parentId === id);
    if (hasReplies) {
      comment.isDeleted = true;
      comment.content = "[Komentar ini telah dihapus oleh penulis]";
      comment.updatedAt = new Date().toISOString();
    } else {
      data.comments.splice(idx, 1);
    }

    this.writeData(data);
    return true;
  }

  async moderateComment(id: string, isHidden: boolean): Promise<boolean> {
    const data = this.readData();
    const idx = data.comments.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    data.comments[idx].isHidden = isHidden;
    data.comments[idx].updatedAt = new Date().toISOString();
    this.writeData(data);
    return true;
  }

  async getMediaItems(): Promise<MediaItem[]> {
    const data = this.readData();
    return data.media || [];
  }

  async saveMediaItem(media: Omit<MediaItem, "id" | "createdAt">): Promise<MediaItem> {
    const data = this.readData();
    const item: MediaItem = {
      ...media,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    data.media.unshift(item);
    this.writeData(data);
    return item;
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    const data = this.readData();
    const before = data.media.length;
    data.media = data.media.filter((m) => m.id !== id);
    if (data.media.length !== before) {
      this.writeData(data);
      return true;
    }
    return false;
  }

  async getSettings(): Promise<SiteSettings> {
    const data = this.readData();
    return data.settings || initialSeed.settings;
  }

  async updateSettings(settingsUpdates: Partial<SiteSettings>): Promise<SiteSettings> {
    const data = this.readData();
    data.settings = { ...data.settings, ...settingsUpdates };
    this.writeData(data);
    return data.settings;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const data = this.readData();
    const found = data.users?.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return null;
    return {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      createdAt: found.createdAt,
    };
  }

  async findUserById(id: string): Promise<User | null> {
    const data = this.readData();
    const found = data.users?.find((u) => u.id === id);
    if (!found) return null;
    return {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      createdAt: found.createdAt,
    };
  }

  async getUserPasswordHash(email: string): Promise<string | null> {
    const data = this.readData();
    const found = data.users?.find((u) => u.email.toLowerCase() === email.toLowerCase());
    return found?.passwordHash || null;
  }

  async createUser(user: Omit<User, "id" | "createdAt"> & { passwordHash: string }): Promise<User> {
    const data = this.readData();
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    if (!data.users) data.users = [];
    data.users.push(newUser);
    this.writeData(data);
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };
  }

  async saveContactMessage(name: string, email: string, message: string): Promise<{ id: string }> {
    const data = this.readData();
    if (!data.messages) data.messages = [];
    const msg = {
      id: crypto.randomUUID(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    data.messages.unshift(msg);
    this.writeData(data);
    return { id: msg.id };
  }

  async getContactMessages(): Promise<Array<{ id: string; name: string; email: string; message: string; createdAt: string; isRead: boolean }>> {
    const data = this.readData();
    return data.messages || [];
  }
}
