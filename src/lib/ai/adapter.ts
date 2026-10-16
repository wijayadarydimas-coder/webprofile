import { OWNER_SYSTEM_KNOWLEDGE } from "./knowledge";
import { sanitizeMarkdownText } from "../security/sanitize";
import { db } from "../db";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  message: string;
  provider: string;
  model: string;
}

export async function generateAIChatResponse(
  messages: ChatMessage[],
  config?: { provider?: string; model?: string }
): Promise<ChatResponse> {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  const baseUrl = process.env.AI_API_BASE_URL;
  const model = process.env.AI_MODEL || process.env.GEMINI_MODEL || config?.model || "gemini-1.5-flash";
  const provider = (process.env.AI_PROVIDER || config?.provider || "gemini").toLowerCase();

  // Ambil konteks data live terbaru dari PostgreSQL (profil, riset skripsi, kontak, sosmed)
  let liveKnowledge = OWNER_SYSTEM_KNOWLEDGE;
  try {
    const [profile, researchList] = await Promise.all([
      db.getProfile().catch(() => null),
      db.getResearchItems().catch(() => []),
    ]);

    if (profile) {
      liveKnowledge += `\n\n--- KONTEKS AKTIF DARI DATABASE ---`;
      liveKnowledge += `\nNama Brand / Lengkap: ${profile.brandName || profile.fullName || "Wijaya Dary Dimas"}`;
      liveKnowledge += `\nSub-Title Profesi: ${profile.roleTitle || "Informatics & CV Engineer"}`;
      liveKnowledge += `\nHeadline: ${profile.headline}`;
      liveKnowledge += `\nBio Singkat: ${profile.shortBio}`;
      liveKnowledge += `\nStatus Badge: ${profile.statusText}`;
      liveKnowledge += `\nEmail Kontak: ${profile.email || "Tersedia di form website"}`;
      liveKnowledge += `\nMedia Sosial Terhubung:`;
      if (profile.githubUrl) liveKnowledge += `\n- GitHub: ${profile.githubUrl}`;
      if (profile.linkedinUrl) liveKnowledge += `\n- LinkedIn: ${profile.linkedinUrl}`;
      if (profile.instagramUrl) liveKnowledge += `\n- Instagram: ${profile.instagramUrl}`;
      if (profile.tiktokUrl) liveKnowledge += `\n- TikTok: ${profile.tiktokUrl}`;
    }

    if (researchList && researchList.length > 0) {
      liveKnowledge += `\n\nDAFTAR RISET / SKRIPSI DARI DATABASE:`;
      researchList.forEach((r, idx) => {
        liveKnowledge += `\n${idx + 1}. Judul: ${r.title}`;
        liveKnowledge += `\n   Status: ${r.publishedStatus}`;
        liveKnowledge += `\n   Ringkasan: ${r.summary}`;
      });
    }
  } catch (err) {
    console.warn("Gagal memuat dynamic knowledge untuk AI:", err);
  }

  // Jika tidak ada API key yang diatur, berikan respons empati & informatif lokal
  if (!apiKey) {
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || "";
    let fallbackText = "";

    // Deteksi curhat / sapaan / empati
    if (
      lastUserMsg.includes("lelah") ||
      lastUserMsg.includes("capek") ||
      lastUserMsg.includes("sedih") ||
      lastUserMsg.includes("bingung") ||
      lastUserMsg.includes("curhat") ||
      lastUserMsg.includes("stres")
    ) {
      fallbackText =
        "Terima kasih sudah mau berbagi. Wajar sekali merasa lelah atau bingung di tengah kesibukan. Tarik napas sejenak, istirahat secukupnya, dan jangan ragu untuk bercerita lebih banyak kalau itu bisa membuat perasaanmu lebih lega. Saya siap mendengarkan!";
    } else if (lastUserMsg.includes("halo") || lastUserMsg.includes("hai") || lastUserMsg.includes("pagi") || lastUserMsg.includes("malam")) {
      fallbackText = "Hai! Senang bisa menyapamu. Ada yang sedang ingin kamu tanyakan atau diskusikan hari ini?";
    } else if (lastUserMsg.includes("skripsi") || lastUserMsg.includes("yolo") || lastUserMsg.includes("apd")) {
      fallbackText =
        "Penelitian skripsi Wijaya Dary Dimas berfokus pada: 'Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis' di Universitas Muhammadiyah Purwokerto. Model YOLOv11 dimodifikasi agar mampu mendeteksi APD pekerja secara real-time dan memicu alarm otomatis ketika terdeteksi ketidakpatuhan.";
    } else if (lastUserMsg.includes("magang") || lastUserMsg.includes("kerja") || lastUserMsg.includes("big") || lastUserMsg.includes("geospasial")) {
      fallbackText =
        "Wijaya Dary Dimas memiliki pengalaman kerja sebagai Pranata Komputer di Badan Informasi Geospasial (BIG) periode November 2025 – Mei 2026, berfokus pada infrastruktur data geospasial dan komputasi.";
    } else if (lastUserMsg.includes("password") || lastUserMsg.includes("sandi") || lastUserMsg.includes("api") || lastUserMsg.includes("admin")) {
      fallbackText =
        "Maaf, demi menjaga privasi dan keamanan sistem, saya tidak dapat membagikan informasi sensitif seperti kata sandi, API key, atau kredensial sistem kepada siapa pun.";
    } else {
      fallbackText =
        "Hai! Saya asisten virtual Wijaya Dary Dimas. Saya siap mengobrol, mendengarkan curhatmu, bertukar pikiran seputar teknologi & perkuliahan, atau menjelaskan informasi portofolio dan penelitian skripsi Wijaya. Ada yang bisa saya bantu?";
    }

    return {
      message: fallbackText,
      provider: "system-grounded-preview",
      model: "built-in",
    };
  }

  // 1. Google Gemini Provider
  if (provider === "gemini") {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const contents = [
        {
          role: "user",
          parts: [{ text: `[INSTRUKSI SISTEM WAJIB]\n${liveKnowledge}` }],
        },
        {
          role: "model",
          parts: [{ text: "Dimengerti. Saya akan bertindak sebagai asisten yang empati, ramah, membantu, jujur, serta tegas menjaga batasan keamanan sistem." }],
        },
        ...messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content.slice(0, 800) }],
          })),
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 14000);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        console.error("Gemini API error status:", res.status, errText);
        throw new Error(`Gemini API error: ${res.status}`);
      }

      const json = await res.json();
      const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, respon tidak dapat dihasilkan.";
      return {
        message: sanitizeMarkdownText(rawText),
        provider: "gemini",
        model,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("AI Gemini call failed, returning safe fallback:", message);
      return {
        message: "Maaf, koneksi ke mesin AI sedang mengalami jeda sesaat. Anda dapat mencoba mengirimkan pesan kembali atau menjelajahi langsung rincian skripsi dan proyek di website ini.",
        provider: "gemini-fallback",
        model,
      };
    }
  }

  // 2. OpenAI / Compatible Provider
  try {
    const apiBase = baseUrl || "https://api.openai.com/v1";
    const endpoint = `${apiBase.replace(/\/$/, "")}/chat/completions`;

    const openAiMessages = [
      { role: "system", content: liveKnowledge },
      ...messages.map((m) => ({ role: m.role, content: m.content.slice(0, 800) })),
    ];

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 14000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: openAiMessages,
        max_tokens: 800,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OpenAI API error: ${res.status}`);
    }

    const json = await res.json();
    const rawText = json.choices?.[0]?.message?.content || "Maaf, tidak ada tanggapan.";
    return {
      message: sanitizeMarkdownText(rawText),
      provider: "openai-compatible",
      model,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("AI OpenAI-compatible call failed:", message);
    return {
      message: "Layanan asisten AI sedang sibuk saat ini. Silakan coba lagi beberapa saat lagi.",
      provider: "openai-fallback",
      model,
    };
  }
}

export interface ResearchAIAssistRequest {
  action:
    | "grammar"
    | "academic"
    | "concise"
    | "expand"
    | "structure"
    | "consistency"
    | "missing_info"
    | "check_alignment";
  sectionTitle: string;
  sectionType: string;
  currentContent: string;
  researchContext?: {
    title?: string;
    summary?: string;
    publishedStatus?: string;
  };
}

export interface ResearchAIAssistResponse {
  suggestion: string;
  explanation: string;
  isAiGenerated: boolean;
}

export async function assistResearchWriting(
  req: ResearchAIAssistRequest
): Promise<ResearchAIAssistResponse> {
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
  const model = process.env.AI_MODEL || process.env.GEMINI_MODEL || "gemini-1.5-flash";

  const actionDirectives: Record<string, string> = {
    grammar:
      "Perbaiki tata bahasa, tanda baca, ejaan (PUEBI/EYD), dan perbaiki kalimat berbelit tanpa mengubah substansi teknis.",
    academic:
      "Tingkatkan gaya penulisan agar lebih akademis, objektif, formal, dan presisi sesuai standar naskah skripsi / paper teknik informatika.",
    concise:
      "Ringkas teks menjadi lebih padat, ringkas, dan fokus tanpa menghilangkan informasi penting, parameter, atau metrik yang sudah ada.",
    expand:
      "Kembangkan kerangka atau poin-poin kalimat ini menjadi draf narasi paragraf teknis yang utuh dan mengalir. JANGAN mengarang data angka/metrik palsu.",
    structure:
      "Susun ulang struktur paragraf agar alur logika dari latar belakang, argumentasi, dan kesimpulan teknis mengalir lebih runut.",
    consistency:
      "Periksa konsistensi penggunaan istilah teknis (seperti APD, YOLOv11, Computer Vision, Dataset, Inference, mAP) dan seragamkan penulisannya.",
    missing_info:
      "Identifikasi dan tuliskan catatan konstruktif mengenai informasi penting apa yang biasanya dibutuhkan pada bagian ini tetapi belum ada (misal: metrik evaluasi, batasan alat, jumlah dataset).",
    check_alignment:
      "Periksa apakah isi bagian ini selaras dengan judul dan ringkasan penelitian, lalu berikan saran perbaikan teks yang lebih terarah.",
  };

  const directive = actionDirectives[req.action] || actionDirectives.grammar;

  // Fallback jika API key belum diisi di environment
  if (!apiKey) {
    let fallbackSuggestion = req.currentContent.trim();
    let explanation = "Mode Offline / Standby (GEMINI_API_KEY belum dikonfigurasi di .env.local).";

    if (req.action === "academic") {
      fallbackSuggestion = fallbackSuggestion
        .replace(/aku|saya/gi, "peneliti")
        .replace(/sangat bagus/gi, "optimal")
        .replace(/banget/gi, "signifikan");
      explanation = "Penyesuaian gaya bahasa pasif dan formal secara otomatis.";
    } else if (req.action === "grammar") {
      fallbackSuggestion = fallbackSuggestion.replace(/\s+/g, " ");
      explanation = "Normalisasi spasi dan tanda baca standar.";
    }

    return {
      suggestion: fallbackSuggestion,
      explanation,
      isAiGenerated: false,
    };
  }

  const prompt = `Anda adalah Asisten Akademik & Penulisan Riset Khusus Bidang Computer Vision & Rekayasa Perangkat Lunak.
TUGAS: ${directive}

ATURAN KRITIS:
1. Pertahankan fakta dan data asli yang diberikan penulis. Jangan pernah mengarang angka akurasi, DOI, sitasi fiktif, atau klaim ilmiah yang belum terbukti.
2. Format output berupa teks Markdown yang siap dipakai di naskah.
3. Berikan saran yang konkret, mudah dibaca, dan gunakan Bahasa Indonesia yang baik dan benar.

KONTEKS PENELITIAN:
- Judul: ${req.researchContext?.title || "Tidak disebutkan"}
- Ringkasan: ${req.researchContext?.summary || "Tidak disebutkan"}
- Bagian yang Diedit: ${req.sectionTitle} (${req.sectionType})

TEKS ASLI PENULIS:
"""
${req.currentContent || "(Teks kosong / mulai dari kerangka)"}
"""

FORMAT RESPON (WAJIB JSON VALID):
{
  "suggestion": "Teks lengkap hasil perbaikan atau draf baru dalam format Markdown",
  "explanation": "Penjelasan singkat (1-2 kalimat) mengenai perbaikan apa yang dilakukan"
}`;

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const rawJsonStr = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const parsed = JSON.parse(rawJsonStr);

    return {
      suggestion: parsed.suggestion || req.currentContent,
      explanation: parsed.explanation || "Perbaikan berhasil dihasilkan oleh Gemini AI.",
      isAiGenerated: true,
    };
  } catch (err: unknown) {
    console.warn("AI Research Assistant call failed, returning safe fallback:", err);
    return {
      suggestion: req.currentContent,
      explanation: "Layanan asisten AI sedang mengalami kendala jaringan. Konten Anda tetap aman.",
      isAiGenerated: false,
    };
  }
}
