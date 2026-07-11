import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults: IconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function IconBold(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M6 4h8a4 4 0 0 1 0 8H6z" />
      <path d="M6 12h9a4 4 0 0 1 0 8H6z" />
    </svg>
  );
}

export function IconItalic(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <line x1="19" y1="4" x2="10" y2="4" />
      <line x1="14" y1="20" x2="5" y2="20" />
      <line x1="15" y1="4" x2="9" y2="20" />
    </svg>
  );
}

export function IconStrikethrough(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M16 4H9a3 3 0 0 0-2.83 4" />
      <path d="M14 12a4 4 0 0 1 0 8H6" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

export function IconCode(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

export function IconQuote(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M3 10h4v7H3z" />
      <path d="M13 10h4v7h-4z" />
    </svg>
  );
}

export function IconCodeBlock(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 10l2 2-2 2" />
      <path d="M13 14h3" />
    </svg>
  );
}

export function IconBulletList(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <circle cx="5" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconNumberedList(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <line x1="10" y1="6" x2="20" y2="6" />
      <line x1="10" y1="12" x2="20" y2="12" />
      <line x1="10" y1="18" x2="20" y2="18" />
      <path d="M4 6h1v4H4" />
      <path d="M4 16h2" />
      <path d="M6 14H4" />
    </svg>
  );
}

export function IconLink(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.54-.54L3.54 13.4a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  );
}

export function IconHeading(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M4 12V4h4v16H4v-8" />
      <path d="M12 4h8" />
      <path d="M16 4v16" />
    </svg>
  );
}

export function IconMention(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </svg>
  );
}

export function IconSpoiler(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <line x1="3" y1="3" x2="21" y2="21" />
    </svg>
  );
}
