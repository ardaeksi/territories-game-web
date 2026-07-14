import type { ReactNode } from "react";
import type { BuildingType } from "../../types/domain";

interface BuildingIconProps {
  type: BuildingType;
  size?: number;
  className?: string;
  color?: string;
}

const PATHS: Record<BuildingType, ReactNode> = {
  MINE: (
    <>
      <path d="M3 20 L9 5 L15 5 L21 20 Z" fill="currentColor" opacity="0.85" />
      <path d="M9.5 20 a2.5 3.5 0 0 1 5 0 Z" fill="#0c2f4f" />
    </>
  ),
  OIL_RIG: (
    <>
      <path d="M12 3 L6 20 M12 3 L18 20 M8 13 L16 13 M9.5 8 L14.5 8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="21" r="1.4" fill="currentColor" />
    </>
  ),
  GUNPOWDER_FACTORY: (
    <>
      <rect x="7" y="10" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.85" />
      <path d="M9 10 V6 h6 v4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 2 c1.4 1.4 1.4 2.6 0 4 c-1.4 -1.4 -1.4 -2.6 0 -4 Z" fill="currentColor" opacity="0.6" />
    </>
  ),
  BOAT_FACTORY: (
    <>
      <path d="M4 16 L20 16 L17 21 L7 21 Z" fill="currentColor" opacity="0.85" />
      <line x1="12" y1="16" x2="12" y2="4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 4 L18 10 L12 10 Z" fill="currentColor" opacity="0.6" />
    </>
  ),
  ARMY_CAMP: (
    <>
      <path d="M12 4 L20 20 H4 Z" fill="currentColor" opacity="0.85" />
      <path d="M12 4 L12 20 M12 4 L8 20" fill="none" stroke="#0c2f4f" strokeWidth="1" />
    </>
  ),
  ARMY_FACTORY: (
    <>
      <rect x="4" y="11" width="16" height="9" fill="currentColor" opacity="0.85" />
      <path d="M4 11 L9 7 L9 11 M9 11 L14 7 L14 11 M14 11 L19 7 L19 11" fill="currentColor" opacity="0.85" />
      <circle cx="17" cy="5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </>
  ),
};

export function BuildingIcon({ type, size = 20, className, color }: BuildingIconProps) {
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
