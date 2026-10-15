import { OWNER_SYSTEM_KNOWLEDGE } from "./knowledge";
import { sanitizeMarkdownText } from "../security/sanitize";

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

  // If no API key is provided, provide a grounded fallback response
  if (!apiKey) {
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || "";
    let fallbackText = "";

    if (lastUserMsg.includes("skripsi") || lastUserMsg.includes("yolo") || lastUserMsg.includes("apd")) {
      fallbackText =
        "Skripsi Wijaya Dary Dimas berjudul: 'Implementasi YOLOv11 Modifikasi Untuk Deteksi Alat Pelindung Diri Helm Rompi, Sarung Tangan Dan Sepatu Dengan Alarm Otomatis' di Universitas Muhammadiyah Purwokerto. Penelitian ini memodifikasi model YOLOv11 agar mampu mendeteksi perlengkapan APD pekerja dan membunyikan alarm otomatis saat terdeteksi ketidakpatuhan.";
    } else if (lastUserMsg.includes("magang") || lastUserMsg.includes("kerja") || lastUserMsg.includes("big") || lastUserMsg.includes("geospasial")) {
      fallbackText =
        "Wijaya Dary Dimas memiliki pengalaman kerja sebagai Pranata Komputer di Badan Informasi Geospasial (BIG) untuk periode November 2025 sampai Mei 2026, berfokus pada sistem komputasi dan infrastruktur data spasial.";
    } else if (lastUserMsg.includes("github") || lastUserMsg.includes("kontak") || lastUserMsg.includes("hubungi")) {
      fallbackText =
        "Anda dapat mengunjungi GitHub resmi Wijaya di https://github.com/wijayadarydimas-coder atau mengirimkan pesan melalui form kontak pada website ini.";
    } else {
      fallbackText =
        `Halo! Saya Asisten AI Wijaya Dary Dimas. Wijaya adalah mahasiswa S1 Teknik Informatika di Universitas Muhammadiyah Purwokerto yang sedang meneliti modifikasi YOLOv11 untuk deteksi APD, serta berpengalaman sebagai Pranata Komputer di Badan Informasi Geospasial (BIG). 

Silakan tanyakan hal seputar portofolio proyek, skripsi, atau pengalaman kerjanya!`;
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
          parts: [{ text: `[INSTRUKSI SISTEM WAJIB]\n${OWNER_SYSTEM_KNOWLEDGE}` }],
        },
        {
          role: "model",
          parts: [{ text: "Dimengerti. Saya akan bertindak sebagai asisten resmi Wijaya Dary Dimas yang sopan, akurat, dan tidak mengarang data." }],
        },
        ...messages
          .filter((m) => m.role !== "system")
          .map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content.slice(0, 500) }],
          })),
      ];

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.4,
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
        message: "Maaf, layanan AI saat ini sedang mengalami gangguan teknis sementara. Anda tetap dapat menjelajahi informasi proyek dan skripsi langsung di halaman terkait.",
        provider: "gemini-fallback",
        model,
      };
    }
  }

  // 2. OpenAI / Compatible Provider
  try {
    const apiBase = baseUrl || "https://api.openai.com/v1";
    const endpoint = `${apiBase.replace(/\/$/, "")}/chat/completions`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: OWNER_SYSTEM_KNOWLEDGE },
          ...messages.map((m) => ({
            role: m.role,
            content: m.content.slice(0, 500),
          })),
        ],
        max_tokens: 500,
        temperature: 0.4,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Custom AI API error: ${res.status}`);
    }

    const json = await res.json();
    const rawText = json.choices?.[0]?.message?.content || "Tidak ada respon dari model.";
    return {
      message: sanitizeMarkdownText(rawText),
      provider: "openai-compatible",
      model,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Custom AI call failed:", message);
    return {
      message: "Layanan asisten AI sedang tidak merespon. Silakan hubungi pemilik secara langsung melalui kanal yang tersedia.",
      provider: "error-fallback",
      model,
    };
  }
}
