import React from "react";

interface ProviderIconProps {
  provider: string;
  className?: string;
  size?: number;
}

export default function ProviderIcon({
  provider,
  className = "w-4 h-4",
  size = 16,
}: ProviderIconProps) {
  const norm = provider.toLowerCase().trim();

  // 1. Code & Repositories
  if (norm === "github") {
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="currentColor"
        aria-hidden="true"
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  if (norm === "gitlab") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" aria-hidden="true">
        <path d="M22.65 14.39L20.31 7.2a.85.85 0 00-1.62 0l-2.34 7.19H7.65L5.31 7.2a.85.85 0 00-1.62 0L1.35 14.39a1.69 1.69 0 00.61 1.9l10 7.27 10-7.27a1.69 1.69 0 00.69-1.9z" fill="#E24329" />
        <path d="M12 23.56l-4.35-9.17h8.7L12 23.56z" fill="#E24329" />
        <path d="M1.35 14.39l2.34-7.19a.85.85 0 011.62 0l2.34 7.19H1.35z" fill="#FCA326" />
        <path d="M22.65 14.39l-2.34-7.19a.85.85 0 00-1.62 0l-2.34 7.19h6.3z" fill="#FCA326" />
        <path d="M1.35 14.39a1.69 1.69 0 00.61 1.9L12 23.56 7.65 14.39H1.35z" fill="#FC6D26" />
        <path d="M22.65 14.39a1.69 1.69 0 01-.61 1.9L12 23.56l4.35-9.17h6.3z" fill="#FC6D26" />
      </svg>
    );
  }

  if (norm === "bitbucket") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#2684FF" aria-hidden="true">
        <path d="M1.5 2.5a.75.75 0 00-.743.854l2.793 16.907a1.5 1.5 0 001.48 1.239h13.94a1.5 1.5 0 001.48-1.239L23.243 3.354A.75.75 0 0022.5 2.5H1.5zm13.12 12.5H9.38l-1.07-6.5h7.38l-1.07 6.5z" />
      </svg>
    );
  }

  if (norm === "codeberg") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#2185D0" fillOpacity="0.2" stroke="#2185D0" strokeWidth="1.5" />
        <path d="M12 5l4.5 9h-9L12 5zm0 10l-2.5 4h5L12 15z" fill="#2185D0" />
      </svg>
    );
  }

  if (norm === "sourcehut") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#BDA039" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 10l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
        <path d="M8 14h3m-3 4h8" />
      </svg>
    );
  }

  if (norm === "gitea") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#609926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M17 8h1a4 4 0 110 8h-1M5 8h12v10a3 3 0 01-3 3H8a3 3 0 01-3-3V8z" />
        <path d="M9 3v2m3-2v2m3-2v2" stroke="#85C240" />
      </svg>
    );
  }

  if (norm === "forgejo") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#FF5200" aria-hidden="true">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 3.2l6.2 3.4-6.2 3.5-6.2-3.5L12 5.2zM5.5 15.6V9.8l5.2 2.9v5.8l-5.2-2.9zm13 0l-5.2 2.9v-5.8l5.2-2.9v5.8z" />
      </svg>
    );
  }

  if (norm === "launchpad") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#E95420" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
        <path d="M12 15l-3-3a18.25 18.25 0 015.65-9.35 1 1 0 011.35 0c1.23 1.23 3.65 4.3 3.65 9.35l-3 3" />
        <path d="M9 12l-4 4m10-4l4 4" />
      </svg>
    );
  }

  // 2. Models & Datasets
  if (norm === "huggingface") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#FFD21E" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <circle cx="8" cy="10" r="1.5" fill="#181A20" />
        <circle cx="16" cy="10" r="1.5" fill="#181A20" />
        <path d="M7 14c1 2.5 9 2.5 10 0" stroke="#181A20" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M4 12c-1 0-2 1-2 2s1 2 2 1m16-3c1 0 2 1 2 2s-1 2-2 1" stroke="#FF9D00" strokeWidth="1.5" fill="none" />
      </svg>
    );
  }

  if (norm === "roboflow") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="5" fill="#9333EA" fillOpacity="0.2" />
        <path d="M7 5h7a4 4 0 014 4c0 2.2-1.8 4-4 4h-3v6H7V5zm4 5h3a1.5 1.5 0 000-3h-3v3z" fill="#C084FC" />
        <path d="M13.5 13l4.5 6h-3.8l-3.2-4.5 2.5-1.5z" fill="#9333EA" />
      </svg>
    );
  }

  if (norm === "civitai") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#1C7ED6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" />
        <path d="M12 6l5 3v6l-5 3-5-3V9l5-3z" fill="#1C7ED6" fillOpacity="0.4" />
      </svg>
    );
  }

  if (norm === "kaggle") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#20BEFF" aria-hidden="true">
        <path d="M6 3h3.5v18H6V3zm12 18h-4.2l-4.5-6.8 1.8-2.2L18 21zm-3.8-11.5L18 3h-4.2l-3.8 5.7.9 1.1 2.9-0.3z" />
      </svg>
    );
  }

  if (norm === "replicate") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
        <path d="M3 4h18v3.5H3V4zm0 6h11.5v3.5H3V10zm0 6h15v3.5H3V16z" />
      </svg>
    );
  }

  if (norm === "ollama") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 18h6m-6 3h6M10 3L8 7v4a4 4 0 004 4h0a4 4 0 004-4V7l-2-4" />
        <circle cx="10" cy="10" r="1" fill="#E2E8F0" />
        <circle cx="14" cy="10" r="1" fill="#E2E8F0" />
      </svg>
    );
  }

  if (norm === "papers with code") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#21CBCE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    );
  }

  if (norm === "lm studio") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#D946EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8m-4-4v4M9 9l3 3-3 3m5-6h2" />
      </svg>
    );
  }

  if (norm === "openxlab") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 5l14 14M19 5L5 19" />
        <circle cx="12" cy="12" r="3" fill="#3B82F6" />
      </svg>
    );
  }

  if (norm === "modelscope") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#8B5CF6" aria-hidden="true">
        <path d="M3 6l9-4 9 4v12l-9 4-9-4V6zm9 2L6 11v6l6 3 6-3v-6l-6-3z" />
      </svg>
    );
  }

  // 3. Computer Vision & Labeling
  if (norm === "cvat") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="3 3" />
        <circle cx="12" cy="12" r="3" fill="#10B981" fillOpacity="0.3" />
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
      </svg>
    );
  }

  if (norm === "label studio") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    );
  }

  if (norm === "supervisely") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
        <circle cx="12" cy="12" r="4" fill="#0284C7" fillOpacity="0.4" />
      </svg>
    );
  }

  if (norm === "v7 darwin") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 6h16l-8 14H8" />
        <circle cx="12" cy="6" r="2" fill="#A855F7" />
      </svg>
    );
  }

  if (norm === "encord") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#14B8A6" aria-hidden="true">
        <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm6 13h-7v-2h6v-2h-6V9h7V7H9v10h9v-2z" />
      </svg>
    );
  }

  if (norm === "scale ai") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    );
  }

  // 4. Compute, MLOps & Frameworks
  if (norm === "modal") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 9l4 4-4 4m6 0h2" />
      </svg>
    );
  }

  if (norm === "runpod") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
        <path d="M9 3h6m-6 18h6" />
      </svg>
    );
  }

  if (norm === "vast.ai") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#38BDF8" aria-hidden="true">
        <path d="M12 2L2 9v6l10 7 10-7V9L12 2zm0 3.3L18.7 10 12 14.7 5.3 10 12 5.3zM4.5 13.5l6.5 4.5v3.8L4.5 17.3v-3.8zm15 0v3.8l-6.5 4.5v-3.8l6.5-4.5z" />
      </svg>
    );
  }

  if (norm === "weights & biases") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#F59E0B" aria-hidden="true">
        <rect x="3" y="14" width="4" height="7" rx="1" />
        <rect x="8.5" y="10" width="4" height="11" rx="1" />
        <rect x="14" y="6" width="4" height="15" rx="1" />
        <rect x="19.5" y="3" width="3" height="18" rx="1" />
      </svg>
    );
  }

  if (norm === "bentoml") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="3" y1="12" x2="12" y2="12" />
      </svg>
    );
  }

  if (norm === "langchain") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    );
  }

  if (norm === "llamaindex") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#E879F9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3c-1.5 0-3 1-3 3v5l-3 2v6l3 2h6l3-2v-6l-3-2V6c0-2-1.5-3-3-3z" />
        <circle cx="10" cy="7" r="1" fill="#E879F9" />
        <circle cx="14" cy="7" r="1" fill="#E879F9" />
      </svg>
    );
  }

  // 5. Cloud & Deployment
  if (norm === "vercel") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor" aria-hidden="true">
        <path d="M12 2L24 22H0L12 2z" />
      </svg>
    );
  }

  if (norm === "supabase") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" aria-hidden="true">
        <path d="M13.2 2.5L3.8 13.9c-.4.5 0 1.2.6 1.2h8.1v6.4c0 .7.9 1.1 1.4.5l9.4-11.4c.4-.5 0-1.2-.6-1.2h-8.1V3c0-.7-.9-1.1-1.4-.5z" fill="#3ECF8E" />
      </svg>
    );
  }

  if (norm === "render") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#46B5D1" aria-hidden="true">
        <path d="M4 3h9a6 6 0 016 6 6 6 0 01-6 6H8v6H4V3zm4 8h5a2 2 0 002-2 2 2 0 00-2-2H8v4zm9.5 10l-4.5-6h4l4.5 6h-4z" />
      </svg>
    );
  }

  if (norm === "netlify") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#00C7B7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 21 8.5 21 15.5 12 22 3 15.5 3 8.5 12 2" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="3" y1="12" x2="21" y2="12" />
      </svg>
    );
  }

  if (norm === "railway") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="#E066FF" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="4" fillOpacity="0.2" stroke="#E066FF" strokeWidth="2" />
        <path d="M7 8h5a3 3 0 013 3 3 3 0 01-3 3H9v4H7V8zm2 4h3a1 1 0 001-1 1 1 0 00-1-1H9v2zm5 6l3.5-5h-2.5L12 18h2z" />
      </svg>
    );
  }

  if (norm === "fly.io") {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="#7790FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a6 6 0 00-6 6c0 3.5 4 8 6 10 2-2 6-6.5 6-10a6 6 0 00-6-6z" />
        <circle cx="12" cy="8" r="2" />
        <path d="M9 19h6m-4 3h2" />
      </svg>
    );
  }

  // Fallback for any unknown or generic provider
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  );
}
