import { Pool } from "pg";
import type { DatabaseRepository } from "./adapter";
import type {
  SiteProfile,
  Project,
  Experience,
  Education,
  ResearchItem,
  ResearchSectionItem,
  Comment,
  MediaItem,
  SiteSettings,
  User,
  ExternalProviderLink,
} from "@/types";

declare global {
  // eslint-disable-next-line no-var
  var _postgresPool: Pool | undefined;
}

function parseExternalLinks(val: unknown): ExternalProviderLink[] {
  if (!val) return [];
  if (Array.isArray(val)) return val as ExternalProviderLink[];
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? (parsed as ExternalProviderLink[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function getPool(): Pool {
  if (globalThis._postgresPool) {
    return globalThis._postgresPool;
  }

  let connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

  if (!connectionString && (process.env.host || process.env.HOST || process.env.PGHOST)) {
    const user = process.env.user || process.env.USER || process.env.PGUSER || "postgres";
    const password = encodeURIComponent(process.env.password || process.env.PASSWORD || process.env.PGPASSWORD || "");
    const host = process.env.host || process.env.HOST || process.env.PGHOST;
    const port = process.env.port || process.env.PORT || process.env.PGPORT || "5432";
    const database = process.env.database || process.env.DATABASE || process.env.PGDATABASE || "postgres";
    connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }

  if (!connectionString) {
    throw new Error("PostgreSQL connection string is not defined.");
  }

  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 8000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  });

  pool.on("error", (err) => {
    console.warn("⚠️ [PostgresPool] Idle client error:", err.message);
  });

  globalThis._postgresPool = pool;
  return pool;
}

function isUuid(val?: string | null): boolean {
  if (!val) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function parseJsonArray<T>(val: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(val)) return val as T[];
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed as T[];
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function buildDefaultResearchSections(r: {
  summary?: string;
  background?: string;
  objective?: string;
  modelModification?: string;
  methodology?: string;
  datasetNotes?: string;
}): ResearchSectionItem[] {
  const sections: ResearchSectionItem[] = [];

  if (r.background) {
    sections.push({
      id: "sec-background",
      title: "Latar Belakang Masalah",
      type: "text",
      content: r.background,
      orderIndex: 1,
      isVisible: true,
    });
  }

  if (r.objective) {
    sections.push({
      id: "sec-objective",
      title: "Tujuan Penelitian & Sasaran",
      type: "text",
      content: r.objective,
      orderIndex: 2,
      isVisible: true,
    });
  }

  if (r.modelModification) {
    sections.push({
      id: "sec-architecture",
      title: "Modifikasi Arsitektur Model",
      type: "architecture",
      content: r.modelModification,
      orderIndex: 3,
      isVisible: true,
    });
  }

  if (r.methodology) {
    sections.push({
      id: "sec-methodology",
      title: "Metodologi & Alur Pengujian",
      type: "methodology",
      content: r.methodology,
      orderIndex: 4,
      isVisible: true,
    });
  }

  if (r.datasetNotes) {
    sections.push({
      id: "sec-dataset",
      title: "Akuisisi Dataset & Batasan Uji",
      type: "dataset",
      content: r.datasetNotes,
      orderIndex: 5,
      isVisible: true,
    });
  }

  sections.push({
    id: "sec-alarm",
    title: "Logika Integrasi Alarm Otomatis",
    type: "integration",
    content:
      "Output inferensi deteksi objek dipetakan ke aturan kepatuhan zona keselamatan kerja. Apabila seorang pekerja terdeteksi berada di dalam area bahaya tanpa perlengkapan APD esensial selama durasi ambang batas tertentu, sistem kontrol mengirim sinyal pemicu alarm peringatan (audio-visual) untuk mencegah risiko insiden secara preventif.",
    orderIndex: 6,
    isVisible: true,
  });

  return sections;
}

export class PostgresRepository implements DatabaseRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  private getDefaultProfile(): SiteProfile {
    return {
      id: "primary",
      fullName: "Wijaya Dary Dimas",
      headline: "Exploring Technology. Building Ideas. Creating Impact.",
      shortBio: "Mahasiswa Teknik Informatika UMP & Pranata Komputer BIG.",
      aboutMe: "Halo! Saya Wijaya Dary Dimas.",
      aboutTitle: "Profil, Prinsip Belajar & Fokus Teknis",
      avatarUrl: "/images/profile-placeholder.svg",
      avatarAlt: "Foto Profil Wijaya Dary Dimas",
      cvUrl: "/files/cv-placeholder.pdf",
      githubUrl: "https://github.com/wijayadarydimas-coder",
      linkedinUrl: "",
      email: "",
      location: "Purwokerto, Indonesia",
      statusText: "Pranata Komputer di BIG & Riset Deteksi APD YOLOv11",
      roleTitle: "Informatics & CV Engineer",
      brandName: "Wijaya Dary Dimas",
      logoUrl: "",
      instagramUrl: "",
      tiktokUrl: "",
      aboutEducationId: null,
      aboutExperienceId: null,
      aboutResearchId: null,
      updatedAt: new Date().toISOString(),
    };
  }

  // 1. Profile
  async getProfile(): Promise<SiteProfile> {
    try {
      const res = await this.pool.query("SELECT * FROM site_profile WHERE id = 'primary' LIMIT 1");
      if (res.rows.length === 0) {
        return this.getDefaultProfile();
      }
      const r = res.rows[0];
      return {
        id: r.id,
        fullName: r.full_name,
        headline: r.headline,
        shortBio: r.short_bio,
        aboutMe: r.about_me,
        aboutTitle: r.about_title || "Profil, Prinsip Belajar & Fokus Teknis",
        avatarUrl: r.avatar_url,
        avatarAlt: r.avatar_alt,
        cvUrl: r.cv_url,
        githubUrl: r.github_url,
        linkedinUrl: r.linkedin_url,
        email: r.email,
        location: r.location,
        statusText: r.status_text,
        roleTitle: r.role_title || "Informatics & CV Engineer",
        brandName: r.brand_name || "Wijaya Dary Dimas",
        logoUrl: r.logo_url || "",
        instagramUrl: r.instagram_url || "",
        tiktokUrl: r.tiktok_url || "",
        aboutEducationId: r.about_education_id || null,
        aboutExperienceId: r.about_experience_id || null,
        aboutResearchId: r.about_research_id || null,
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      };
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getProfile warning, using fallback:", err);
      return this.getDefaultProfile();
    }
  }

  async updateProfile(data: Partial<SiteProfile>): Promise<SiteProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...data };

    const query = `
      INSERT INTO site_profile (
        id, full_name, headline, short_bio, about_me, about_title, avatar_url, avatar_alt,
        cv_url, github_url, linkedin_url, email, location, status_text,
        role_title, brand_name, logo_url, instagram_url, tiktok_url,
        about_education_id, about_experience_id, about_research_id, updated_at
      ) VALUES (
        'primary', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        headline = EXCLUDED.headline,
        short_bio = EXCLUDED.short_bio,
        about_me = EXCLUDED.about_me,
        about_title = EXCLUDED.about_title,
        avatar_url = EXCLUDED.avatar_url,
        avatar_alt = EXCLUDED.avatar_alt,
        cv_url = EXCLUDED.cv_url,
        github_url = EXCLUDED.github_url,
        linkedin_url = EXCLUDED.linkedin_url,
        email = EXCLUDED.email,
        location = EXCLUDED.location,
        status_text = EXCLUDED.status_text,
        role_title = EXCLUDED.role_title,
        brand_name = EXCLUDED.brand_name,
        logo_url = EXCLUDED.logo_url,
        instagram_url = EXCLUDED.instagram_url,
        tiktok_url = EXCLUDED.tiktok_url,
        about_education_id = EXCLUDED.about_education_id,
        about_experience_id = EXCLUDED.about_experience_id,
        about_research_id = EXCLUDED.about_research_id,
        updated_at = NOW()
      RETURNING *;
    `;

    const res = await this.pool.query(query, [
      updated.fullName,
      updated.headline,
      updated.shortBio,
      updated.aboutMe,
      updated.aboutTitle || "Profil, Prinsip Belajar & Fokus Teknis",
      updated.avatarUrl,
      updated.avatarAlt,
      updated.cvUrl,
      updated.githubUrl,
      updated.linkedinUrl,
      updated.email,
      updated.location,
      updated.statusText,
      updated.roleTitle || "Informatics & CV Engineer",
      updated.brandName || "Wijaya Dary Dimas",
      updated.logoUrl || "",
      updated.instagramUrl || "",
      updated.tiktokUrl || "",
      updated.aboutEducationId || null,
      updated.aboutExperienceId || null,
      updated.aboutResearchId || null,
    ]);

    const r = res.rows[0];
    return {
      id: r.id,
      fullName: r.full_name,
      headline: r.headline,
      shortBio: r.short_bio,
      aboutMe: r.about_me,
      aboutTitle: r.about_title || "Profil, Prinsip Belajar & Fokus Teknis",
      avatarUrl: r.avatar_url,
      avatarAlt: r.avatar_alt,
      cvUrl: r.cv_url,
      githubUrl: r.github_url,
      linkedinUrl: r.linkedin_url,
      email: r.email,
      location: r.location,
      statusText: r.status_text,
      roleTitle: r.role_title || "Informatics & CV Engineer",
      brandName: r.brand_name || "Wijaya Dary Dimas",
      logoUrl: r.logo_url || "",
      instagramUrl: r.instagram_url || "",
      tiktokUrl: r.tiktok_url || "",
      aboutEducationId: r.about_education_id || null,
      aboutExperienceId: r.about_experience_id || null,
      aboutResearchId: r.about_research_id || null,
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  // 2. Projects
  async getProjects(options?: { publishedOnly?: boolean; featuredOnly?: boolean }): Promise<Project[]> {
    try {
      let query = "SELECT * FROM projects WHERE 1=1";
      const params: unknown[] = [];

      if (options?.publishedOnly) {
        params.push(true);
        query += ` AND published = $${params.length}`;
      }
      if (options?.featuredOnly) {
        params.push(true);
        query += ` AND featured = $${params.length}`;
      }
      query += " ORDER BY order_index ASC, created_at DESC";

      const res = await this.pool.query(query, params);
      return res.rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        shortDescription: r.short_description,
        fullDescription: r.full_description,
        problem: r.problem || "",
        solution: r.solution || "",
        results: r.results || "",
        category: r.category,
        technologies: Array.isArray(r.technologies) ? r.technologies : [],
        coverImage: r.cover_image,
        repoUrl: r.repo_url || "",
        liveUrl: r.live_url || "",
        externalLinks: parseExternalLinks(r.external_links),
        featured: Boolean(r.featured),
        published: Boolean(r.published),
        orderIndex: r.order_index ?? 0,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      }));
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getProjects warning, returning empty array:", err);
      return [];
    }
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      const res = await this.pool.query("SELECT * FROM projects WHERE slug = $1 LIMIT 1", [slug]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        shortDescription: r.short_description,
        fullDescription: r.full_description,
        problem: r.problem || "",
        solution: r.solution || "",
        results: r.results || "",
        category: r.category,
        technologies: Array.isArray(r.technologies) ? r.technologies : [],
        coverImage: r.cover_image,
        repoUrl: r.repo_url || "",
        liveUrl: r.live_url || "",
        externalLinks: parseExternalLinks(r.external_links),
        featured: Boolean(r.featured),
        published: Boolean(r.published),
        orderIndex: r.order_index ?? 0,
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      };
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getProjectBySlug warning:", err);
      return null;
    }
  }

  async saveProject(proj: Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<Project> {
    const externalLinksJson = JSON.stringify(proj.externalLinks || []);

    if (proj.id && isUuid(proj.id)) {
      const query = `
        UPDATE projects SET
          slug = $1, title = $2, short_description = $3, full_description = $4,
          problem = $5, solution = $6, results = $7, category = $8,
          technologies = $9, cover_image = $10, repo_url = $11, live_url = $12,
          external_links = $13, featured = $14, published = $15, order_index = $16, updated_at = NOW()
        WHERE id = $17
        RETURNING *;
      `;
      const res = await this.pool.query(query, [
        proj.slug,
        proj.title,
        proj.shortDescription,
        proj.fullDescription,
        proj.problem || "",
        proj.solution || "",
        proj.results || "",
        proj.category,
        proj.technologies,
        proj.coverImage,
        proj.repoUrl || "",
        proj.liveUrl || "",
        externalLinksJson,
        proj.featured,
        proj.published,
        proj.orderIndex,
        proj.id,
      ]);
      const r = res.rows[0];
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        shortDescription: r.short_description,
        fullDescription: r.full_description,
        problem: r.problem || "",
        solution: r.solution || "",
        results: r.results || "",
        category: r.category,
        technologies: r.technologies,
        coverImage: r.cover_image,
        repoUrl: r.repo_url || "",
        liveUrl: r.live_url || "",
        externalLinks: parseExternalLinks(r.external_links),
        featured: Boolean(r.featured),
        published: Boolean(r.published),
        orderIndex: r.order_index,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      };
    }

    const query = `
      INSERT INTO projects (
        slug, title, short_description, full_description, problem, solution,
        results, category, technologies, cover_image, repo_url, live_url,
        external_links, featured, published, order_index
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;
    const res = await this.pool.query(query, [
      proj.slug,
      proj.title,
      proj.shortDescription,
      proj.fullDescription,
      proj.problem || "",
      proj.solution || "",
      proj.results || "",
      proj.category,
      proj.technologies,
      proj.coverImage,
      proj.repoUrl || "",
      proj.liveUrl || "",
      externalLinksJson,
      proj.featured,
      proj.published,
      proj.orderIndex,
    ]);
    const r = res.rows[0];
    return {
      id: r.id,
      slug: r.slug,
      title: r.title,
      shortDescription: r.short_description,
      fullDescription: r.full_description,
      problem: r.problem || "",
      solution: r.solution || "",
      results: r.results || "",
      category: r.category,
      technologies: r.technologies,
      coverImage: r.cover_image,
      repoUrl: r.repo_url || "",
      liveUrl: r.live_url || "",
      externalLinks: parseExternalLinks(r.external_links),
      featured: Boolean(r.featured),
      published: Boolean(r.published),
      orderIndex: r.order_index,
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    };
  }

  async deleteProject(id: string): Promise<boolean> {
    if (!isUuid(id)) return true;
    const res = await this.pool.query("DELETE FROM projects WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // 3. Experiences
  async getExperiences(): Promise<Experience[]> {
    try {
      const res = await this.pool.query("SELECT * FROM experiences ORDER BY order_index ASC, created_at DESC");
      return res.rows.map((r) => ({
        id: r.id,
        organization: r.organization,
        role: r.role,
        period: r.period,
        description: r.description || "",
        type: r.type,
        orderIndex: r.order_index ?? 0,
        url: r.url || "",
      }));
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getExperiences warning, returning empty array:", err);
      return [];
    }
  }

  async saveExperience(exp: Omit<Experience, "id"> & { id?: string }): Promise<Experience> {
    if (exp.id && isUuid(exp.id)) {
      const query = `
        UPDATE experiences SET
          organization = $1, role = $2, period = $3, description = $4,
          type = $5, order_index = $6, url = $7, updated_at = NOW()
        WHERE id = $8
        RETURNING *;
      `;
      const res = await this.pool.query(query, [
        exp.organization,
        exp.role,
        exp.period,
        exp.description,
        exp.type,
        exp.orderIndex,
        exp.url || "",
        exp.id,
      ]);
      const r = res.rows[0];
      return {
        id: r.id,
        organization: r.organization,
        role: r.role,
        period: r.period,
        description: r.description,
        type: r.type,
        orderIndex: r.order_index,
        url: r.url || "",
      };
    }

    const query = `
      INSERT INTO experiences (organization, role, period, description, type, order_index, url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const res = await this.pool.query(query, [
      exp.organization,
      exp.role,
      exp.period,
      exp.description,
      exp.type,
      exp.orderIndex,
      exp.url || "",
    ]);
    const r = res.rows[0];
    return {
      id: r.id,
      organization: r.organization,
      role: r.role,
      period: r.period,
      description: r.description,
      type: r.type,
      orderIndex: r.order_index,
      url: r.url || "",
    };
  }

  async deleteExperience(id: string): Promise<boolean> {
    if (!isUuid(id)) return true;
    const res = await this.pool.query("DELETE FROM experiences WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // 4. Educations
  async getEducation(): Promise<Education[]> {
    try {
      const res = await this.pool.query("SELECT * FROM educations ORDER BY order_index ASC, created_at DESC");
      return res.rows.map((r) => ({
        id: r.id,
        institution: r.institution,
        degree: r.degree,
        period: r.period,
        description: r.description || "",
        orderIndex: r.order_index ?? 0,
        url: r.url || "",
      }));
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getEducation warning, returning empty array:", err);
      return [];
    }
  }

  async saveEducation(edu: Omit<Education, "id"> & { id?: string }): Promise<Education> {
    if (edu.id && isUuid(edu.id)) {
      const query = `
        UPDATE educations SET
          institution = $1, degree = $2, period = $3, description = $4,
          order_index = $5, url = $6, updated_at = NOW()
        WHERE id = $7
        RETURNING *;
      `;
      const res = await this.pool.query(query, [
        edu.institution,
        edu.degree,
        edu.period,
        edu.description,
        edu.orderIndex,
        edu.url || "",
        edu.id,
      ]);
      const r = res.rows[0];
      return {
        id: r.id,
        institution: r.institution,
        degree: r.degree,
        period: r.period,
        description: r.description,
        orderIndex: r.order_index,
        url: r.url || "",
      };
    }

    const query = `
      INSERT INTO educations (institution, degree, period, description, order_index, url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const res = await this.pool.query(query, [
      edu.institution,
      edu.degree,
      edu.period,
      edu.description,
      edu.orderIndex,
      edu.url || "",
    ]);
    const r = res.rows[0];
    return {
      id: r.id,
      institution: r.institution,
      degree: r.degree,
      period: r.period,
      description: r.description,
      orderIndex: r.order_index,
      url: r.url || "",
    };
  }

  async deleteEducation(id: string): Promise<boolean> {
    if (!isUuid(id)) return true;
    const res = await this.pool.query("DELETE FROM educations WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // 5. Research
  async getResearchItems(): Promise<ResearchItem[]> {
    try {
      const res = await this.pool.query("SELECT * FROM research_items ORDER BY order_index ASC, created_at DESC");
      return res.rows.map((r) => {
        const rawSections = parseJsonArray<ResearchSectionItem>(r.sections, []);
        const sections =
          rawSections.length > 0
            ? rawSections
            : buildDefaultResearchSections({
                summary: r.summary,
                background: r.background,
                objective: r.objective,
                modelModification: r.model_modification,
                methodology: r.methodology,
                datasetNotes: r.dataset_notes,
              });

        return {
          id: r.id,
          title: r.title,
          summary: r.summary,
          background: r.background || "",
          objective: r.objective || "",
          methodology: r.methodology || "",
          modelModification: r.model_modification || "",
          datasetNotes: r.dataset_notes || "",
          publishedStatus: r.published_status || "Penelitian Skripsi",
          repoUrl: r.repo_url || "",
          pdfUrl: r.pdf_url || "",
          externalLinks: parseExternalLinks(r.external_links),
          institution: r.institution || "Universitas Muhammadiyah Purwokerto",
          studyProgram: r.study_program || "S1 Teknik Informatika",
          technologies: parseJsonArray<string>(r.technologies, ["Python", "PyTorch", "YOLOv11", "OpenCV", "Roboflow"]),
          sections,
          orderIndex: r.order_index ?? 0,
          updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
        };
      });
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getResearchItems warning, returning empty array:", err);
      return [];
    }
  }

  async getResearchById(id: string): Promise<ResearchItem | null> {
    try {
      const res = await this.pool.query("SELECT * FROM research_items WHERE id = $1 LIMIT 1", [id]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];

      const rawSections = parseJsonArray<ResearchSectionItem>(r.sections, []);
      const sections =
        rawSections.length > 0
          ? rawSections
          : buildDefaultResearchSections({
              summary: r.summary,
              background: r.background,
              objective: r.objective,
              modelModification: r.model_modification,
              methodology: r.methodology,
              datasetNotes: r.dataset_notes,
            });

      return {
        id: r.id,
        title: r.title,
        summary: r.summary,
        background: r.background || "",
        objective: r.objective || "",
        methodology: r.methodology || "",
        modelModification: r.model_modification || "",
        datasetNotes: r.dataset_notes || "",
        publishedStatus: r.published_status || "Penelitian Skripsi",
        repoUrl: r.repo_url || "",
        pdfUrl: r.pdf_url || "",
        externalLinks: parseExternalLinks(r.external_links),
        institution: r.institution || "Universitas Muhammadiyah Purwokerto",
        studyProgram: r.study_program || "S1 Teknik Informatika",
        technologies: parseJsonArray<string>(r.technologies, ["Python", "PyTorch", "YOLOv11", "OpenCV", "Roboflow"]),
        sections,
        orderIndex: r.order_index ?? 0,
        updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
      };
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getResearchById warning:", err);
      return null;
    }
  }

  async saveResearch(resItem: Omit<ResearchItem, "id" | "updatedAt"> & { id?: string }): Promise<ResearchItem> {
    const externalLinksJson = JSON.stringify(resItem.externalLinks || []);
    const technologiesJson = JSON.stringify(resItem.technologies || ["Python", "PyTorch", "YOLOv11", "OpenCV"]);
    const sectionsJson = JSON.stringify(resItem.sections || []);
    const institution = resItem.institution || "Universitas Muhammadiyah Purwokerto";
    const studyProgram = resItem.studyProgram || "S1 Teknik Informatika";

    // Sync legacy text columns from sections if provided
    let background = resItem.background || "";
    let objective = resItem.objective || "";
    let methodology = resItem.methodology || "";
    let modelModification = resItem.modelModification || "";
    let datasetNotes = resItem.datasetNotes || "";

    if (Array.isArray(resItem.sections) && resItem.sections.length > 0) {
      for (const s of resItem.sections) {
        const titleLower = s.title.toLowerCase();
        if (titleLower.includes("latar belakang") && s.content) background = s.content;
        else if (titleLower.includes("tujuan") && s.content) objective = s.content;
        else if ((titleLower.includes("metodologi") || titleLower.includes("metode")) && s.content) methodology = s.content;
        else if ((titleLower.includes("modifikasi") || titleLower.includes("arsitektur")) && s.content) modelModification = s.content;
        else if (titleLower.includes("dataset") && s.content) datasetNotes = s.content;
      }
    }

    if (resItem.id && isUuid(resItem.id)) {
      const query = `
        UPDATE research_items SET
          title = $1, summary = $2, background = $3, objective = $4,
          methodology = $5, model_modification = $6, dataset_notes = $7,
          published_status = $8, repo_url = $9, pdf_url = $10,
          external_links = $11, institution = $12, study_program = $13,
          technologies = $14, sections = $15, order_index = $16, updated_at = NOW()
        WHERE id = $17
        RETURNING *;
      `;
      const res = await this.pool.query(query, [
        resItem.title,
        resItem.summary,
        background,
        objective,
        methodology,
        modelModification,
        datasetNotes,
        resItem.publishedStatus,
        resItem.repoUrl || "",
        resItem.pdfUrl || "",
        externalLinksJson,
        institution,
        studyProgram,
        technologiesJson,
        sectionsJson,
        resItem.orderIndex,
        resItem.id,
      ]);
      const r = res.rows[0];
      return {
        id: r.id,
        title: r.title,
        summary: r.summary,
        background: r.background || "",
        objective: r.objective || "",
        methodology: r.methodology || "",
        modelModification: r.model_modification || "",
        datasetNotes: r.dataset_notes || "",
        publishedStatus: r.published_status,
        repoUrl: r.repo_url || "",
        pdfUrl: r.pdf_url || "",
        externalLinks: parseExternalLinks(r.external_links),
        institution: r.institution,
        studyProgram: r.study_program,
        technologies: parseJsonArray<string>(r.technologies, []),
        sections: parseJsonArray<ResearchSectionItem>(r.sections, []),
        orderIndex: r.order_index,
        updatedAt: new Date(r.updated_at).toISOString(),
      };
    }

    const query = `
      INSERT INTO research_items (
        title, summary, background, objective, methodology, model_modification,
        dataset_notes, published_status, repo_url, pdf_url, external_links,
        institution, study_program, technologies, sections, order_index
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *;
    `;
    const res = await this.pool.query(query, [
      resItem.title,
      resItem.summary,
      background,
      objective,
      methodology,
      modelModification,
      datasetNotes,
      resItem.publishedStatus,
      resItem.repoUrl || "",
      resItem.pdfUrl || "",
      externalLinksJson,
      institution,
      studyProgram,
      technologiesJson,
      sectionsJson,
      resItem.orderIndex,
    ]);
    const r = res.rows[0];
    return {
      id: r.id,
      title: r.title,
      summary: r.summary,
      background: r.background || "",
      objective: r.objective || "",
      methodology: r.methodology || "",
      modelModification: r.model_modification || "",
      datasetNotes: r.dataset_notes || "",
      publishedStatus: r.published_status,
      repoUrl: r.repo_url || "",
      pdfUrl: r.pdf_url || "",
      externalLinks: parseExternalLinks(r.external_links),
      institution: r.institution,
      studyProgram: r.study_program,
      technologies: parseJsonArray<string>(r.technologies, []),
      sections: parseJsonArray<ResearchSectionItem>(r.sections, []),
      orderIndex: r.order_index,
      updatedAt: new Date(r.updated_at).toISOString(),
    };
  }

  async deleteResearch(id: string): Promise<boolean> {
    if (!isUuid(id)) return true;
    const res = await this.pool.query("DELETE FROM research_items WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // 6. Comments
  async getComments(options?: { includeHidden?: boolean }): Promise<Comment[]> {
    try {
      let query = "SELECT * FROM comments";
      if (!options?.includeHidden) {
        query += " WHERE is_hidden = false";
      }
      query += " ORDER BY created_at ASC";

      const res = await this.pool.query(query);
      return res.rows.map((r) => ({
        id: r.id,
        parentId: r.parent_id || null,
        authorId: r.author_id,
        authorName: r.author_name,
        authorRole: r.author_role,
        content: r.content,
        isDeleted: Boolean(r.is_deleted),
        isHidden: Boolean(r.is_hidden),
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      }));
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getComments warning, returning empty array:", err);
      return [];
    }
  }

  async createComment(data: {
    parentId?: string | null;
    authorId: string;
    authorName: string;
    authorRole: "admin" | "visitor";
    content: string;
  }): Promise<Comment> {
    const query = `
      INSERT INTO comments (parent_id, author_id, author_name, author_role, content)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const res = await this.pool.query(query, [
      data.parentId || null,
      data.authorId,
      data.authorName,
      data.authorRole,
      data.content,
    ]);
    const r = res.rows[0];
    return {
      id: r.id,
      parentId: r.parent_id || null,
      authorId: r.author_id,
      authorName: r.author_name,
      authorRole: r.author_role,
      content: r.content,
      isDeleted: Boolean(r.is_deleted),
      isHidden: Boolean(r.is_hidden),
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    };
  }

  async updateComment(id: string, content: string, userId: string): Promise<Comment | null> {
    const check = await this.pool.query("SELECT * FROM comments WHERE id = $1", [id]);
    if (check.rows.length === 0) return null;
    if (check.rows[0].author_id !== userId) {
      throw new Error("Unauthorized to edit this comment");
    }

    const res = await this.pool.query(
      "UPDATE comments SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [content, id]
    );
    const r = res.rows[0];
    return {
      id: r.id,
      parentId: r.parent_id || null,
      authorId: r.author_id,
      authorName: r.author_name,
      authorRole: r.author_role,
      content: r.content,
      isDeleted: Boolean(r.is_deleted),
      isHidden: Boolean(r.is_hidden),
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    };
  }

  async deleteComment(id: string, userId: string, isAdmin: boolean): Promise<boolean> {
    const check = await this.pool.query("SELECT * FROM comments WHERE id = $1", [id]);
    if (check.rows.length === 0) return false;
    const comment = check.rows[0];
    if (!isAdmin && comment.author_id !== userId) {
      throw new Error("Unauthorized to delete this comment");
    }

    // Check if it has replies; if so, soft delete
    const replies = await this.pool.query("SELECT id FROM comments WHERE parent_id = $1 LIMIT 1", [id]);
    if (replies.rows.length > 0) {
      await this.pool.query(
        "UPDATE comments SET is_deleted = true, content = '[Komentar ini telah dihapus oleh penulis]', updated_at = NOW() WHERE id = $1",
        [id]
      );
    } else {
      await this.pool.query("DELETE FROM comments WHERE id = $1", [id]);
    }
    return true;
  }

  async moderateComment(id: string, isHidden: boolean): Promise<boolean> {
    const res = await this.pool.query(
      "UPDATE comments SET is_hidden = $1, updated_at = NOW() WHERE id = $2",
      [isHidden, id]
    );
    return (res.rowCount ?? 0) > 0;
  }

  // 7. Media Items
  async getMediaItems(): Promise<MediaItem[]> {
    try {
      const res = await this.pool.query("SELECT * FROM media_items ORDER BY created_at DESC");
      return res.rows.map((r) => ({
        id: r.id,
        name: r.name,
        url: r.url,
        mimeType: r.mime_type,
        sizeBytes: Number(r.size_bytes),
        altText: r.alt_text || "",
        createdAt: new Date(r.created_at).toISOString(),
      }));
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getMediaItems warning, returning empty array:", err);
      return [];
    }
  }

  async saveMediaItem(media: Omit<MediaItem, "id" | "createdAt">): Promise<MediaItem> {
    const query = `
      INSERT INTO media_items (name, url, mime_type, size_bytes, alt_text)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const res = await this.pool.query(query, [
      media.name,
      media.url,
      media.mimeType,
      media.sizeBytes,
      media.altText || "",
    ]);
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      url: r.url,
      mimeType: r.mime_type,
      sizeBytes: Number(r.size_bytes),
      altText: r.alt_text || "",
      createdAt: new Date(r.created_at).toISOString(),
    };
  }

  async deleteMediaItem(id: string): Promise<boolean> {
    const res = await this.pool.query("DELETE FROM media_items WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // 8. Site Settings
  async getSettings(): Promise<SiteSettings> {
    try {
      const res = await this.pool.query("SELECT * FROM site_settings WHERE id = 'primary' LIMIT 1");
      if (res.rows.length === 0) {
        return {
          aiProvider: "gemini",
          aiModel: "gemini-1.5-flash",
          aiAssistantName: "Asisten AI — Wijaya Dary Dimas",
          aiPersona: "",
          aiWelcomeMessage: "",
          aiSystemPrompt: "",
          contactEmail: "",
          enableAiAssistant: true,
          enableComments: true,
          notifyOnComment: false,
        };
      }
      const r = res.rows[0];
      return {
        aiProvider: r.ai_provider || "gemini",
        aiModel: r.ai_model || "gemini-1.5-flash",
        aiAssistantName: r.ai_assistant_name || "Asisten AI — Wijaya Dary Dimas",
        aiPersona: r.ai_persona || "",
        aiWelcomeMessage: r.ai_welcome_message || "",
        aiSystemPrompt: r.ai_system_prompt || "",
        contactEmail: r.contact_email || "",
        enableAiAssistant: Boolean(r.enable_ai_assistant),
        enableComments: Boolean(r.enable_comments),
        notifyOnComment: Boolean(r.notify_on_comment),
      };
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getSettings warning, returning defaults:", err);
      return {
        aiProvider: "gemini",
        aiModel: "gemini-1.5-flash",
        aiAssistantName: "Asisten AI — Wijaya Dary Dimas",
        aiPersona: "",
        aiWelcomeMessage: "",
        aiSystemPrompt: "",
        contactEmail: "",
        enableAiAssistant: true,
        enableComments: true,
        notifyOnComment: false,
      };
    }
  }

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...data };

    try {
      await this.pool.query(`
        ALTER TABLE site_settings 
        ADD COLUMN IF NOT EXISTS ai_assistant_name VARCHAR(120) NOT NULL DEFAULT 'Asisten AI — Wijaya Dary Dimas',
        ADD COLUMN IF NOT EXISTS ai_persona TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS ai_welcome_message TEXT NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS ai_system_prompt TEXT NOT NULL DEFAULT '';
      `);
    } catch {
      // Ignore if columns already exist or permission restricted
    }

    const query = `
      INSERT INTO site_settings (
        id, ai_provider, ai_model, ai_assistant_name, ai_persona, ai_welcome_message, ai_system_prompt,
        contact_email, enable_ai_assistant, enable_comments, notify_on_comment, updated_at
      )
      VALUES ('primary', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
      ON CONFLICT (id) DO UPDATE SET
        ai_provider = EXCLUDED.ai_provider,
        ai_model = EXCLUDED.ai_model,
        ai_assistant_name = EXCLUDED.ai_assistant_name,
        ai_persona = EXCLUDED.ai_persona,
        ai_welcome_message = EXCLUDED.ai_welcome_message,
        ai_system_prompt = EXCLUDED.ai_system_prompt,
        contact_email = EXCLUDED.contact_email,
        enable_ai_assistant = EXCLUDED.enable_ai_assistant,
        enable_comments = EXCLUDED.enable_comments,
        notify_on_comment = EXCLUDED.notify_on_comment,
        updated_at = NOW()
      RETURNING *;
    `;
    const res = await this.pool.query(query, [
      updated.aiProvider,
      updated.aiModel,
      updated.aiAssistantName || "Asisten AI — Wijaya Dary Dimas",
      updated.aiPersona || "",
      updated.aiWelcomeMessage || "",
      updated.aiSystemPrompt || "",
      updated.contactEmail,
      updated.enableAiAssistant,
      updated.enableComments,
      updated.notifyOnComment,
    ]);
    const r = res.rows[0];
    return {
      aiProvider: r.ai_provider,
      aiModel: r.ai_model,
      aiAssistantName: r.ai_assistant_name || "Asisten AI — Wijaya Dary Dimas",
      aiPersona: r.ai_persona || "",
      aiWelcomeMessage: r.ai_welcome_message || "",
      aiSystemPrompt: r.ai_system_prompt || "",
      contactEmail: r.contact_email || "",
      enableAiAssistant: Boolean(r.enable_ai_assistant),
      enableComments: Boolean(r.enable_comments),
      notifyOnComment: Boolean(r.notify_on_comment),
    };
  }

  // 9. Users & Auth
  async findUserByEmail(email: string): Promise<User | null> {
    const res = await this.pool.query("SELECT id, name, email, role, created_at FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1", [email]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      createdAt: new Date(r.created_at).toISOString(),
    };
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      const res = await this.pool.query("SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1", [id]);
      if (res.rows.length === 0) return null;
      const r = res.rows[0];
      return {
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role,
        createdAt: new Date(r.created_at).toISOString(),
      };
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] findUserById warning:", err);
      return null;
    }
  }

  async getUserPasswordHash(email: string): Promise<string | null> {
    try {
      const res = await this.pool.query("SELECT password_hash FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1", [email]);
      if (res.rows.length === 0) return null;
      return res.rows[0].password_hash;
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getUserPasswordHash warning:", err);
      return null;
    }
  }

  async createUser(user: Omit<User, "id" | "createdAt"> & { passwordHash: string }): Promise<User> {
    const query = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at;
    `;
    const res = await this.pool.query(query, [
      user.name,
      user.email,
      user.passwordHash,
      user.role || "visitor",
    ]);
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      createdAt: new Date(r.created_at).toISOString(),
    };
  }

  // 10. Contact Messages
  async saveContactMessage(name: string, email: string, message: string): Promise<{ id: string }> {
    const res = await this.pool.query(
      "INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING id",
      [name, email, message]
    );
    return { id: res.rows[0].id };
  }

  async getContactMessages(): Promise<Array<{ id: string; name: string; email: string; message: string; createdAt: string; isRead: boolean }>> {
    try {
      const res = await this.pool.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
      return res.rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        message: r.message,
        createdAt: new Date(r.created_at).toISOString(),
        isRead: Boolean(r.is_read),
      }));
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getContactMessages warning, returning empty array:", err);
      return [];
    }
  }

  // 11. AI Chat Memories
  async getAIChatMemories(userId: string): Promise<Array<{ id: string; role: "user" | "assistant"; content: string; createdAt: string }>> {
    if (!isUuid(userId)) return [];
    try {
      const res = await this.pool.query(
        "SELECT id, role, content, created_at FROM ai_chat_memories WHERE user_id = $1 ORDER BY created_at ASC LIMIT 100",
        [userId]
      );
      return res.rows.map((r) => ({
        id: r.id,
        role: r.role as "user" | "assistant",
        content: r.content,
        createdAt: new Date(r.created_at).toISOString(),
      }));
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] getAIChatMemories warning, returning empty array:", err);
      return [];
    }
  }

  async saveAIChatMemory(userId: string, role: "user" | "assistant", content: string): Promise<void> {
    if (!isUuid(userId) || !content.trim()) return;
    try {
      await this.pool.query(
        "INSERT INTO ai_chat_memories (user_id, role, content) VALUES ($1, $2, $3)",
        [userId, role, content.trim()]
      );
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] saveAIChatMemory warning:", err);
    }
  }

  async clearAIChatMemories(userId: string): Promise<boolean> {
    if (!isUuid(userId)) return false;
    try {
      const res = await this.pool.query("DELETE FROM ai_chat_memories WHERE user_id = $1", [userId]);
      return (res.rowCount ?? 0) >= 0;
    } catch (err) {
      console.warn("⚠️ [PostgresRepository] clearAIChatMemories warning:", err);
      return false;
    }
  }
}
