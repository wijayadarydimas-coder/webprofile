import { ExternalLink } from "lucide-react";
import { getProviderMeta } from "@/lib/constants/providers";
import ProviderIcon from "@/components/ui/ProviderIcon";
import type { ExternalProviderLink } from "@/types";

interface ProviderBadgeProps {
  link: ExternalProviderLink;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export default function ProviderBadge({ link, size = "sm", showIcon = true }: ProviderBadgeProps) {
  const meta = getProviderMeta(link.provider);
  const displayName = link.label || meta.name;

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2.5 py-1 gap-1.5"
      : "text-xs px-3 py-1.5 gap-2";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center rounded-lg font-mono font-medium transition-all duration-200 border ${meta.badgeBg} ${meta.badgeText} ${meta.badgeBorder} hover:scale-[1.03] hover:shadow-lg ${sizeClasses}`}
      title={`${meta.name}: ${link.url}`}
    >
      {/* Official Provider Brand Icon */}
      <ProviderIcon provider={link.provider} className="w-3.5 h-3.5 shrink-0" />
      <span className="truncate max-w-[140px] sm:max-w-[180px]">{displayName}</span>
      {showIcon && <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />}
    </a>
  );
}

export function ProviderBadgeList({
  links,
  size = "sm",
  maxVisible,
}: {
  links?: ExternalProviderLink[];
  size?: "sm" | "md";
  maxVisible?: number;
}) {
  const validLinks = (links || []).filter((l) => l && l.url && l.url.trim() !== "");
  if (validLinks.length === 0) return null;

  const displayLinks = maxVisible ? validLinks.slice(0, maxVisible) : validLinks;
  const remainingCount = maxVisible && validLinks.length > maxVisible ? validLinks.length - maxVisible : 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {displayLinks.map((link, idx) => (
        <ProviderBadge key={`${link.provider}-${idx}`} link={link} size={size} />
      ))}
      {remainingCount > 0 && (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#171A24] text-[#A1A6B5] border border-[#292D39]">
          +{remainingCount} platform
        </span>
      )}
    </div>
  );
}
