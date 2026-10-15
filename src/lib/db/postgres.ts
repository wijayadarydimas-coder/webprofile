import { Pool } from "pg";
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

declare global {
  // eslint-disable-next-line no-var
  var _postgresPool: Pool | undefined;
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
    connectionTimeoutMillis: 5000,
  });

  globalThis._postgresPool = pool;
  return pool;
}

export class PostgresRepository implements DatabaseRepository {
  private pool: Pool;

  constructor() {
    this.pool = getPool();
  }

  // 1. Profile
  async getProfile(): Promise<SiteProfile> {
    const res = await this.pool.query("SELECT * FROM site_profile WHERE id = 'primary' LIMIT 1");
    if (res.rows.length === 0) {
      // Fallback default
      return {
        id: "primary",
        fullName: "Wijaya Dary Dimas",
        headline: "Exploring Technology. Building Ideas. Creating Impact.",
        shortBio: "Mahasiswa Teknik Informatika UMP & Pranata Komputer BIG.",
        aboutMe: "Halo! Saya Wijaya Dary Dimas.",
        avatarUrl: "/images/profile-placeholder.svg",
        avatarAlt: "Foto Profil Wijaya Dary Dimas",
        cvUrl: "/files/cv-placeholder.pdf",
        githubUrl: "https://github.com/wijayadarydimas-coder",
        linkedinUrl: "",
        email: "",
        location: "Purwokerto, Indonesia",
        statusText: "Pranata Komputer di BIG & Riset Deteksi APD YOLOv11",
        updatedAt: new Date().toISOString(),
      };
    }
    const r = res.rows[0];
    return {
      id: r.id,
      fullName: r.full_name,
      headline: r.headline,
      shortBio: r.short_bio,
      aboutMe: r.about_me,
      avatarUrl: r.avatar_url,
      avatarAlt: r.avatar_alt,
      cvUrl: r.cv_url,
      githubUrl: r.github_url,
      linkedinUrl: r.linkedin_url,
      email: r.email,
      location: r.location,
      statusText: r.status_text,
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  async updateProfile(data: Partial<SiteProfile>): Promise<SiteProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...data };

    const query = `
      INSERT INTO site_profile (
        id, full_name, headline, short_bio, about_me, avatar_url, avatar_alt,
        cv_url, github_url, linkedin_url, email, location, status_text, updated_at
      ) VALUES (
        'primary', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        headline = EXCLUDED.headline,
        short_bio = EXCLUDED.short_bio,
        about_me = EXCLUDED.about_me,
        avatar_url = EXCLUDED.avatar_url,
        avatar_alt = EXCLUDED.avatar_alt,
        cv_url = EXCLUDED.cv_url,
        github_url = EXCLUDED.github_url,
        linkedin_url = EXCLUDED.linkedin_url,
        email = EXCLUDED.email,
        location = EXCLUDED.location,
        status_text = EXCLUDED.status_text,
        updated_at = NOW()
      RETURNING *;
    `;

    const res = await this.pool.query(query, [
      updated.fullName,
      updated.headline,
      updated.shortBio,
      updated.aboutMe,
      updated.avatarUrl,
      updated.avatarAlt,
      updated.cvUrl,
      updated.githubUrl,
      updated.linkedinUrl,
      updated.email,
      updated.location,
      updated.statusText,
    ]);

    const r = res.rows[0];
    return {
      id: r.id,
      fullName: r.full_name,
      headline: r.headline,
      shortBio: r.short_bio,
      aboutMe: r.about_me,
      avatarUrl: r.avatar_url,
      avatarAlt: r.avatar_alt,
      cvUrl: r.cv_url,
      githubUrl: r.github_url,
      linkedinUrl: r.linkedin_url,
      email: r.email,
      location: r.location,
      statusText: r.status_text,
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  // 2. Projects
  async getProjects(options?: { publishedOnly?: boolean; featuredOnly?: boolean }): Promise<Project[]> {
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
      featured: Boolean(r.featured),
      published: Boolean(r.published),
      orderIndex: r.order_index ?? 0,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    }));
  }

  async getProjectBySlug(slug: string): Promise<Project | null> {
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
      featured: Boolean(r.featured),
      published: Boolean(r.published),
      orderIndex: r.order_index ?? 0,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  async saveProject(proj: Omit<Project, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<Project> {
    if (proj.id) {
      const query = `
        UPDATE projects SET
          slug = $1, title = $2, short_description = $3, full_description = $4,
          problem = $5, solution = $6, results = $7, category = $8,
          technologies = $9, cover_image = $10, repo_url = $11, live_url = $12,
          featured = $13, published = $14, order_index = $15, updated_at = NOW()
        WHERE id = $16
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
        featured, published, order_index
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
      featured: Boolean(r.featured),
      published: Boolean(r.published),
      orderIndex: r.order_index,
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: new Date(r.updated_at).toISOString(),
    };
  }

  async deleteProject(id: string): Promise<boolean> {
    const res = await this.pool.query("DELETE FROM projects WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // 3. Experiences
  async getExperiences(): Promise<Experience[]> {
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
  }

  async saveExperience(exp: Omit<Experience, "id"> & { id?: string }): Promise<Experience> {
    if (exp.id) {
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
    const res = await this.pool.query("DELETE FROM experiences WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // 4. Educations
  async getEducation(): Promise<Education[]> {
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
  }

  async saveEducation(edu: Omit<Education, "id"> & { id?: string }): Promise<Education> {
    if (edu.id) {
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
    const res = await this.pool.query("DELETE FROM educations WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // 5. Research
  async getResearchItems(): Promise<ResearchItem[]> {
    const res = await this.pool.query("SELECT * FROM research_items ORDER BY order_index ASC, created_at DESC");
    return res.rows.map((r) => ({
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
      orderIndex: r.order_index ?? 0,
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    }));
  }

  async getResearchById(id: string): Promise<ResearchItem | null> {
    const res = await this.pool.query("SELECT * FROM research_items WHERE id = $1 LIMIT 1", [id]);
    if (res.rows.length === 0) return null;
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
      publishedStatus: r.published_status || "Penelitian Skripsi",
      repoUrl: r.repo_url || "",
      pdfUrl: r.pdf_url || "",
      orderIndex: r.order_index ?? 0,
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    };
  }

  async saveResearch(resItem: Omit<ResearchItem, "id" | "updatedAt"> & { id?: string }): Promise<ResearchItem> {
    if (resItem.id) {
      const query = `
        UPDATE research_items SET
          title = $1, summary = $2, background = $3, objective = $4,
          methodology = $5, model_modification = $6, dataset_notes = $7,
          published_status = $8, repo_url = $9, pdf_url = $10,
          order_index = $11, updated_at = NOW()
        WHERE id = $12
        RETURNING *;
      `;
      const res = await this.pool.query(query, [
        resItem.title,
        resItem.summary,
        resItem.background || "",
        resItem.objective || "",
        resItem.methodology || "",
        resItem.modelModification || "",
        resItem.datasetNotes || "",
        resItem.publishedStatus,
        resItem.repoUrl || "",
        resItem.pdfUrl || "",
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
        orderIndex: r.order_index,
        updatedAt: new Date(r.updated_at).toISOString(),
      };
    }

    const query = `
      INSERT INTO research_items (
        title, summary, background, objective, methodology, model_modification,
        dataset_notes, published_status, repo_url, pdf_url, order_index
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const res = await this.pool.query(query, [
      resItem.title,
      resItem.summary,
      resItem.background || "",
      resItem.objective || "",
      resItem.methodology || "",
      resItem.modelModification || "",
      resItem.datasetNotes || "",
      resItem.publishedStatus,
      resItem.repoUrl || "",
      resItem.pdfUrl || "",
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
      orderIndex: r.order_index,
      updatedAt: new Date(r.updated_at).toISOString(),
    };
  }

  async deleteResearch(id: string): Promise<boolean> {
    const res = await this.pool.query("DELETE FROM research_items WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  }

  // 6. Comments
  async getComments(options?: { includeHidden?: boolean }): Promise<Comment[]> {
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
    const res = await this.pool.query("SELECT * FROM site_settings WHERE id = 'primary' LIMIT 1");
    if (res.rows.length === 0) {
      return {
        aiProvider: "gemini",
        aiModel: "gemini-1.5-flash",
        contactEmail: "",
        enableAiAssistant: true,
        enableComments: true,
        notifyOnComment: false,
      };
    }
    const r = res.rows[0];
    return {
      aiProvider: r.ai_provider,
      aiModel: r.ai_model,
      contactEmail: r.contact_email || "",
      enableAiAssistant: Boolean(r.enable_ai_assistant),
      enableComments: Boolean(r.enable_comments),
      notifyOnComment: Boolean(r.notify_on_comment),
    };
  }

  async updateSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...data };

    const query = `
      INSERT INTO site_settings (id, ai_provider, ai_model, contact_email, enable_ai_assistant, enable_comments, notify_on_comment, updated_at)
      VALUES ('primary', $1, $2, $3, $4, $5, $6, NOW())
      ON CONFLICT (id) DO UPDATE SET
        ai_provider = EXCLUDED.ai_provider,
        ai_model = EXCLUDED.ai_model,
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
      updated.contactEmail,
      updated.enableAiAssistant,
      updated.enableComments,
      updated.notifyOnComment,
    ]);
    const r = res.rows[0];
    return {
      aiProvider: r.ai_provider,
      aiModel: r.ai_model,
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
  }

  async getUserPasswordHash(email: string): Promise<string | null> {
    const res = await this.pool.query("SELECT password_hash FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1", [email]);
    if (res.rows.length === 0) return null;
    return res.rows[0].password_hash;
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
    const res = await this.pool.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    return res.rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      message: r.message,
      createdAt: new Date(r.created_at).toISOString(),
      isRead: Boolean(r.is_read),
    }));
  }
}
