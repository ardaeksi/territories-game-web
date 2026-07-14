import type { ReactNode } from "react";
import type { ResourceType } from "../../types/domain";

interface ResourceIconProps {
  type: ResourceType;
  size?: number;
  className?: string;
  color?: string;
}

const PATHS: Record<ResourceType, ReactNode> = {
  WOOD: (
    <>
      <rect x="3" y="9" width="18" height="6" rx="2" fill="currentColor" opacity="0.85" />
      <ellipse cx="4.5" cy="12" rx="1.8" ry="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="19.5" cy="12" rx="1.8" ry="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </>
  ),
  STONE: (
    <path
      d="M5 14 L8 7 L15 6 L20 11 L18 18 L7 19 Z"
      fill="currentColor"
      opacity="0.85"
      stroke="currentColor"
      strokeWidth="0.5"
      strokeLinejoin="round"
    />
  ),
  METAL: (
    <path
      d="M6 6 L18 6 L21 12 L18 18 L6 18 L3 12 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  ),
  GUNPOWDER: (
    <>
      <rect x="6" y="4" width="12" height="16" rx="3" fill="currentColor" opacity="0.85" />
      <line x1="6" y1="9" x2="18" y2="9" stroke="#0c2f4f" strokeWidth="1" />
      <line x1="6" y1="15" x2="18" y2="15" stroke="#0c2f4f" strokeWidth="1" />
    </>
  ),
  OIL: (
    <path
      d="M12 3 C12 3 6 11 6 15 a6 6 0 0 0 12 0 C18 11 12 3 12 3 Z"
      fill="currentColor"
      opacity="0.85"
    />
  ),
  FOOD: (
    <>
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M12 6 C9 6 7 8 6 10 M12 6 C15 6 17 8 18 10 M12 10 C9 10 7 12 6 14 M12 10 C15 10 17 12 18 14 M12 14 C9 14 7 16 6 18 M12 14 C15 14 17 16 18 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </>
  ),
};

export function ResourceIcon({ type, size = 18, className, color }: ResourceIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ flexShrink: 0, color }}
    >
      {PATHS[type]}
    </svg>
  );
}
