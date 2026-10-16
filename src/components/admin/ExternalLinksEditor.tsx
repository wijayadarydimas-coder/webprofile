"use client";

import { useState } from "react";
import { Plus, Trash2, Globe, Search, X, ExternalLink } from "lucide-react";
import { ALL_PROVIDERS, PROVIDER_CATEGORIES, getProviderMeta } from "@/lib/constants/providers";
import ProviderIcon from "@/components/ui/ProviderIcon";
import type { ExternalProviderLink } from "@/types";

interface ExternalLinksEditorProps {
  links: ExternalProviderLink[];
  onChange: (updatedLinks: ExternalProviderLink[]) => void;
  title?: string;
  description?: string;
}

export default function ExternalLinksEditor({
  links,
  onChange,
  title = "Tautan Platform Eksternal (Hugging Face, Roboflow, GitHub, Kaggle, dll.)",
  description = "Hubungkan proyek atau karya skripsi dengan repositori kode, model weights, dataset anotasi, notebook, atau live platform cloud.",
}: ExternalLinksEditorProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredProviders = ALL_PROVIDERS.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProvider = (providerId: string) => {
    const meta = getProviderMeta(providerId);
    const newLink: ExternalProviderLink = {
      provider: providerId,
      url: "",
      label: meta.name,
    };
    onChange([...links, newLink]);
    setIsPickerOpen(false);
    setSearchQuery("");
  };

  const handleUpdateLink = (index: number, field: keyof ExternalProviderLink, value: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleUrlBlur = (index: number) => {
    const raw = links[index]?.url?.trim();
    if (raw && !/^https?:\/\//i.test(raw) && !raw.startsWith("/")) {
      handleUpdateLink(index, "url", `https://${raw}`);
    }
  };

  const handleRemoveLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-3 p-4 sm:p-5 rounded-xl bg-[#1B1D23]/80 border border-[#2B2D34]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#252831]">
        <div>
          <h4 className="text-xs font-semibold text-[#F3F4F6] flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#6D8DFF]" />
            <span>{title}</span>
          </h4>
          <p className="text-[11px] text-[#A1A1AA] mt-0.5">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="btn-secondary text-xs py-1.5 px-3 self-start sm:self-auto flex items-center gap-1.5 hover:border-[#6D8DFF] text-[#F3F4F6]"
        >
          <Plus className="w-3.5 h-3.5 text-[#6D8DFF]" />
          <span>Tambah Provider (+)</span>
        </button>
      </div>

      {/* Current Links List */}
      {links.length === 0 ? (
        <div className="py-4 px-3 text-center rounded-lg bg-[#15171C] border border-dashed border-[#2B2D34] text-xs text-[#71717A]">
          Belum ada tautan platform eksternal ditambahkan. Klik tombol &quot;Tambah Provider (+)&quot; untuk memilih Roboflow, Hugging Face, Kaggle, CVAT, dsb.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {links.map((link, idx) => {
            const meta = getProviderMeta(link.provider);
            return (
              <div
                key={`${link.provider}-${idx}`}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 p-2.5 rounded-lg bg-[#15171C] border border-[#2B2D34]"
              >
                {/* Provider Badge Tag */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] font-mono shrink-0 ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder}`}
                >
                  <ProviderIcon provider={link.provider} className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-semibold">{meta.name}</span>
                </div>

                {/* Custom Label (Optional) */}
                <input
                  type="text"
                  value={link.label || ""}
                  onChange={(e) => handleUpdateLink(idx, "label", e.target.value)}
                  placeholder="Label Tampilan (Opsional)"
                  className="w-full sm:w-44 px-2.5 py-1.5 rounded-md bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                  title="Label Teks Tombol (opsional, default: nama provider)"
                />

                {/* URL Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleUpdateLink(idx, "url", e.target.value)}
                    onBlur={() => handleUrlBlur(idx)}
                    placeholder={meta.placeholder}
                    className="w-full px-2.5 py-1.5 rounded-md bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none pr-7 font-mono"
                  />
                  {link.url && (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2 top-2 text-[#71717A] hover:text-[#6D8DFF]"
                      title="Buka link di tab baru"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => handleRemoveLink(idx)}
                  className="p-1.5 rounded-md text-[#71717A] hover:text-[#EF4444] hover:bg-[#251515] self-end sm:self-auto transition-colors"
                  title="Hapus tautan ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Provider Selector Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#15171C] border border-[#2B2D34] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#202228] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#6D8DFF]" />
                <h3 className="text-sm sm:text-base font-bold text-[#F3F4F6]">
                  Pilih Platform / Provider Eksternal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="p-1 rounded-lg text-[#71717A] hover:text-[#F3F4F6] hover:bg-[#1B1D23]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-[#202228] flex flex-col gap-3 bg-[#111317]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari provider (contoh: roboflow, huggingface, kaggle, cvat, modal, vercel...)"
                  className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#1B1D23] border border-[#2B2D34] text-xs text-[#F3F4F6] focus:border-[#6D8DFF] focus:outline-none"
                />
              </div>

              {/* Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                <button
                  type="button"
                  onClick={() => setSelectedCategory("all")}
                  className={`px-2.5 py-1 rounded-md font-medium shrink-0 transition-colors ${
                    selectedCategory === "all"
                      ? "bg-[#6D8DFF] text-white"
                      : "bg-[#1B1D23] text-[#A1A1AA] hover:text-[#F3F4F6]"
                  }`}
                >
                  Semua ({ALL_PROVIDERS.length})
                </button>
                {PROVIDER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-md font-medium shrink-0 transition-colors ${
                      selectedCategory === cat
                        ? "bg-[#6D8DFF] text-white"
                        : "bg-[#1B1D23] text-[#A1A1AA] hover:text-[#F3F4F6]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Providers Grid */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {filteredProviders.length === 0 ? (
                <div className="col-span-full py-8 text-center text-xs text-[#71717A]">
                  Tidak ada provider yang cocok dengan pencarian &quot;{searchQuery}&quot;.
                </div>
              ) : (
                filteredProviders.map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => handleAddProvider(prov.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all hover:scale-[1.02] ${prov.badgeBg} ${prov.badgeBorder} hover:border-[#6D8DFF]/60`}
                  >
                    <ProviderIcon provider={prov.id} className="w-4 h-4 shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-semibold truncate ${prov.badgeText}`}>
                        {prov.name}
                      </span>
                      <span className="text-[10px] text-[#71717A] truncate">
                        {prov.category}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
