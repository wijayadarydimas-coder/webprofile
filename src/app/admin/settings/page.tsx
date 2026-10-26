"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Key,
  Bot,
  MessageSquare,
  HelpCircle,
  Eye,
  Sliders,
} from "lucide-react";
import type { SiteSettings } from "@/types";

const PERSONA_PRESETS = [
  {
    id: "friendly",
    label: "🌟 Friendly & Casual",
    desc: "Warm, relaxed, empathetic, supportive, and loves friendly conversations.",
    value:
      "You are friendly, warm, casual, empathetic, wise, and polite. You do NOT only answer rigid portfolio questions. You CAN engage in friendly chats, discuss various topics (technology, coding, career, life, college), and you are ready to listen when users want to share thoughts by providing soothing, supportive, and empathetic responses.",
  },
  {
    id: "academic",
    label: "🎓 Academic & Researcher",
    desc: "Structured, scientific, analytical, and in-depth regarding YOLOv11 & Computer Vision research.",
    value:
      "You act as an intelligent, science-based, structured, and deep academic assistant. Your main focus is explaining research methodologies, technical implementations of modified YOLOv11 for PPE, and Computer Vision & Software Engineering concepts clearly and professionally.",
  },
  {
    id: "cheerful",
    label: "😄 Cheerful & Witty",
    desc: "Full of positive energy, lightly humorous, friendly, and engaging.",
    value:
      "You are cheerful, lightly witty, full of smiles and positive energy! You communicate in a relaxed, friendly, and delightful tone, while staying polite and knowledgeable about all the website owner's projects and research.",
  },
  {
    id: "supportive",
    label: "🤝 Attentive Listener",
    desc: "Extremely patient, supportive, calming, and a great listener for any discussion.",
    value:
      "You are an extremely patient, attentive, calming, and supportive assistant. You always provide words of encouragement to anyone who feels tired or confused, while remaining ready to answer questions about the portfolio owner's work.",
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    aiProvider: "gemini",
    aiModel: "gemini-1.5-flash",
    aiAssistantName: "Paijo",
    aiPersona: "",
    aiWelcomeMessage: "",
    aiSystemPrompt: "",
    contactEmail: "",
    enableAiAssistant: true,
    enableComments: true,
    notifyOnComment: false,
  });

  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  useEffect(() => {
    fetch("/api/admin/content?entity=settings")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setSettings((prev) => ({
            ...prev,
            ...json.data,
            aiAssistantName: json.data.aiAssistantName || "Paijo",
          }));
        }
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: "" });

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: "settings",
          action: "update",
          data: settings,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save configuration.");

      setSettings(data.data);
      setStatus({ type: "success", message: "System & AI Assistant settings saved and applied to API successfully!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setStatus({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  const previewName = settings.aiAssistantName?.trim() || "Paijo";
  const previewGreeting =
    settings.aiWelcomeMessage?.trim() ||
    `Hello! Nice to meet you. I am ${previewName}, virtual assistant for Wijaya Dary Dimas's personal portfolio. How can I help you or what would you like to talk about today? 😊`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-[#202228]">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#6D8DFF]" />
          <h1 className="text-xl font-bold text-[#F3F4F6]">System &amp; AI Assistant Settings</h1>
        </div>
        <p className="text-xs text-[#A1A1AA]">
          Configure AI identity, persona, greeting message, model engine, and public chat integrations.
        </p>
      </div>

      {status.type && (
        <div
          className={`p-3.5 rounded-lg flex items-center gap-2.5 text-xs ${
            status.type === "success"
              ? "bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]"
              : "bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Security Best-Practice Banner */}
      <div className="p-4 rounded-xl bg-[#6D8DFF]/10 border border-[#6D8DFF]/25 flex items-start gap-3">
        <Key className="w-5 h-5 text-[#6D8DFF] shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-xs">
          <span className="font-semibold text-[#F3F4F6]">Direct API Integration &amp; API Key Security</span>
          <p className="text-[#A1A1AA] leading-relaxed">
            AI identity and persona settings saved on this page are <strong>directly injected into the chat API (Google Gemini)</strong> as official system instructions. The secret <code>AI_API_KEY</code> remains securely stored in server environment variables (<code>.env.local</code>) and protected from public exposure.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 text-xs">
        {/* AI Persona & Identity Config */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#8B9CFF]">
              <Bot className="w-4 h-4" />
              <h2 className="text-sm font-semibold text-[#F3F4F6]">AI Assistant Identity &amp; Persona</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#8B9CFF]/10 border border-[#8B9CFF]/20 text-[11px] text-[#8B9CFF]">
              Live API Prompt
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama AI */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[#F3F4F6] font-medium flex items-center gap-1.5">
                <span>Official AI Assistant Name</span>
                <span className="text-[#EF4444]">*</span>
                <span className="text-[10px] text-[#71717A] font-normal">
                  (Recognized by AI when visitors ask &quot;what is your name?&quot; or &quot;are you {previewName}?&quot;)
                </span>
              </label>
              <input
                type="text"
                value={settings.aiAssistantName || ""}
                onChange={(e) => setSettings({ ...settings, aiAssistantName: e.target.value })}
                placeholder="e.g. Paijo"
                required
                className="p-3 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] focus:border-[#6D8DFF] outline-none text-sm font-semibold"
              />
            </div>

            {/* Sapaan Pembuka Chat */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[#F3F4F6] font-medium flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#6D8DFF]" />
                  <span>Initial Chat Greeting Message</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      aiWelcomeMessage: `Hello! Nice to meet you. I am ${previewName}, virtual assistant for Wijaya Dary Dimas's personal portfolio. How can I help you or what would you like to talk about today? 😊`,
                    })
                  }
                  className="text-[11px] text-[#6D8DFF] hover:underline cursor-pointer"
                >
                  Use Default Template
                </button>
              </label>
              <textarea
                rows={2}
                value={settings.aiWelcomeMessage || ""}
                onChange={(e) => setSettings({ ...settings, aiWelcomeMessage: e.target.value })}
                placeholder={`Hello! Nice to meet you. I am ${previewName}, virtual assistant for Wijaya Dary Dimas's personal portfolio. How can I help you or what would you like to talk about today? 😊`}
                className="p-3 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] focus:border-[#6D8DFF] outline-none leading-relaxed"
              />
              <p className="text-[11px] text-[#71717A]">
                The first message displayed in the chat bubble when a visitor opens the AI widget.
              </p>
            </div>

            {/* Persona Preset Selector */}
            <div className="flex flex-col gap-2 md:col-span-2 pt-1">
              <label className="text-[#F3F4F6] font-medium flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Quick Persona Presets</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {PERSONA_PRESETS.map((preset) => {
                  const isSelected = settings.aiPersona === preset.value;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSettings({ ...settings, aiPersona: preset.value })}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? "bg-[#6D8DFF]/15 border-[#6D8DFF] text-[#F3F4F6]"
                          : "bg-[#1B1D23] border-[#2B2D34] text-[#A1A1AA] hover:border-[#3F424E] hover:text-[#E4E4E7]"
                      }`}
                    >
                      <span className="font-semibold text-xs text-[#F3F4F6]">{preset.label}</span>
                      <span className="text-[11px] leading-relaxed line-clamp-2">{preset.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persona Textarea Detail */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[#A1A1AA]">
                AI Character &amp; Persona Description (Freely Editable):
              </label>
              <textarea
                rows={3}
                value={settings.aiPersona || ""}
                onChange={(e) => setSettings({ ...settings, aiPersona: e.target.value })}
                placeholder="Describe custom persona style (e.g. casual, friendly, supportive, or formal)..."
                className="p-3 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] focus:border-[#6D8DFF] outline-none leading-relaxed font-mono text-xs"
              />
            </div>

            {/* Custom System Prompt Extra */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-[#A1A1AA] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Additional System Instructions (Custom System Prompt)</span>
                <span className="text-[10px] text-[#71717A]">(Optional)</span>
              </label>
              <textarea
                rows={2}
                value={settings.aiSystemPrompt || ""}
                onChange={(e) => setSettings({ ...settings, aiSystemPrompt: e.target.value })}
                placeholder="e.g. Remind visitors to check chapter 4 of the YOLOv11 research in the Research section, etc."
                className="p-3 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] focus:border-[#6D8DFF] outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Interactive Live Preview Box */}
          <div className="mt-2 p-4 rounded-xl bg-[#0F1116] border border-[#262832] flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8B9CFF]">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview of Visitor Chat Widget</span>
            </div>
            <div className="rounded-xl border border-[#2A2E3B] bg-[#171A24] overflow-hidden max-w-lg shadow-lg">
              {/* Header preview */}
              <div className="px-4 py-2.5 bg-[#0B0D12] border-b border-[#292D39] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-[#1F2330] border border-[#7790FF]/40 flex items-center justify-center text-[#7790FF]">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#F1F2F5]">{previewName}</span>
                    <span className="text-[10px] text-[#22C55E] flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      Online
                    </span>
                  </div>
                </div>
              </div>
              {/* Bubble preview */}
              <div className="p-4 bg-[#171A24] flex flex-col gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#1F2330] border border-[#7790FF]/30 flex items-center justify-center text-[#7790FF] shrink-0 text-xs">
                    <Bot className="w-3 h-3" />
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-sm bg-[#1E222E] border border-[#2E3342] text-xs text-[#E4E4E7] leading-relaxed max-w-md">
                    {previewGreeting}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engine & Connectivity */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#8B9CFF]">
            <Sparkles className="w-4 h-4" />
            <h2 className="text-sm font-semibold text-[#F3F4F6]">AI Engine &amp; Provider</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">AI Service Provider</label>
              <select
                value={settings.aiProvider}
                onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6]"
              >
                <option value="gemini">Google Gemini (Recommended)</option>
                <option value="openai">OpenAI / Compatible Endpoint</option>
                <option value="custom">Custom Server Endpoint</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[#A1A1AA]">Model Identifier</label>
              <input
                type="text"
                value={settings.aiModel}
                onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                placeholder="gemini-1.5-flash"
                className="p-2.5 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-[#F3F4F6] font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-[#2B2D34]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAiAssistant}
                onChange={(e) => setSettings({ ...settings, enableAiAssistant: e.target.checked })}
                className="rounded bg-[#1B1D23] border-[#2B2D34]"
              />
              <span className="text-[#F3F4F6]">Enable AI Assistant Button &amp; Widget on Public Pages</span>
            </label>
          </div>
        </div>

        {/* Community & Moderation */}
        <div className="p-6 rounded-xl bg-[#15171C] border border-[#2B2D34] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#22C55E]">
            <Shield className="w-4 h-4" />
            <h2 className="text-sm font-semibold text-[#F3F4F6]">Community &amp; Security Settings</h2>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableComments}
                onChange={(e) => setSettings({ ...settings, enableComments: e.target.checked })}
                className="rounded bg-[#1B1D23] border-[#2B2D34]"
              />
              <span className="text-[#F3F4F6]">Enable Public Comment Section &amp; Discussions</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifyOnComment}
                onChange={(e) => setSettings({ ...settings, notifyOnComment: e.target.checked })}
                className="rounded bg-[#1B1D23] border-[#2B2D34]"
              />
              <span className="text-[#F3F4F6]">Save Notification Logs for New Comments</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pb-8">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-2.5 px-6 font-semibold disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
