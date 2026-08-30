import { cn } from "@/lib/utils";

export type BuddyGender = "girl" | "boy";

export type BuddyOutfit = {
  top: string;
  bottom: string;
  shoes: string;
  accent: string;
};

/**
 * A cute chibi style buddy drawn as pure SVG so it can wear any colour
 * combination pulled from the user's own wardrobe.
 */
export function StyleBuddy({
  gender,
  outfit,
  className,
  waving = true,
}: {
  gender: BuddyGender;
  outfit: BuddyOutfit;
  className?: string;
  waving?: boolean;
}) {
  const skin = "#f6d8c6";
  const hair = gender === "girl" ? "#5c3a42" : "#4a3038";

  return (
    <svg
      viewBox="0 0 120 170"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Your ${gender} style buddy wearing the outfit you picked`}
    >
      <ellipse cx="60" cy="163" rx="30" ry="5" fill="currentColor" opacity="0.08" />

      {/* legs */}
      <rect x="47" y="112" width="10" height="30" rx="5" fill={skin} />
      <rect x="63" y="112" width="10" height="30" rx="5" fill={skin} />

      {/* bottom */}
      {gender === "girl" ? (
        <path d="M40 96 L80 96 L88 126 Q60 136 32 126 Z" fill={outfit.bottom} />
      ) : (
        <>
          <rect x="42" y="96" width="16" height="34" rx="6" fill={outfit.bottom} />
          <rect x="62" y="96" width="16" height="34" rx="6" fill={outfit.bottom} />
        </>
      )}

      {/* shoes */}
      <rect x="43" y="138" width="18" height="10" rx="5" fill={outfit.shoes} />
      <rect x="59" y="138" width="18" height="10" rx="5" fill={outfit.shoes} />

      {/* top */}
      <path d="M42 60 Q60 54 78 60 L82 100 Q60 106 38 100 Z" fill={outfit.top} />
      {/* arms */}
      <rect x="30" y="62" width="10" height="30" rx="5" fill={outfit.top} />
      <rect x="80" y="62" width="10" height="30" rx="5" fill={outfit.top} />
      <circle cx="35" cy="95" r="5.5" fill={skin} />
      <g className={waving ? "buddy-wave" : undefined} style={{ transformOrigin: "85px 66px" }}>
        <rect x="80" y="46" width="10" height="24" rx="5" fill={outfit.top} />
        <circle cx="85" cy="44" r="5.5" fill={skin} />
      </g>

      {/* neck + head */}
      <rect x="55" y="50" width="10" height="10" rx="4" fill={skin} />
      <circle cx="60" cy="34" r="22" fill={skin} />

      {/* hair */}
      {gender === "girl" ? (
        <>
          <path d="M38 34 Q38 10 60 10 Q82 10 82 34 L82 40 Q76 24 60 24 Q44 24 38 40 Z" fill={hair} />
          <path d="M36 34 Q28 52 32 70 Q40 62 40 40 Z" fill={hair} />
          <path d="M84 34 Q92 52 88 70 Q80 62 80 40 Z" fill={hair} />
          <path d="M74 16 q10 2 10 10 q-6 -6 -12 -6 z" fill={outfit.accent} />
          <circle cx="80" cy="19" r="5" fill={outfit.accent} />
        </>
      ) : (
        <path d="M38 32 Q40 10 60 10 Q80 10 82 32 Q74 22 60 24 Q46 26 38 32 Z" fill={hair} />
      )}

      {/* face */}
      <circle cx="52" cy="36" r="3.1" fill="#3d2830" />
      <circle cx="68" cy="36" r="3.1" fill="#3d2830" />
      <circle cx="53.2" cy="34.8" r="1" fill="#fff" />
      <circle cx="69.2" cy="34.8" r="1" fill="#fff" />
      <ellipse cx="45" cy="42" rx="4" ry="2.6" fill="#f4a9b8" opacity="0.75" />
      <ellipse cx="75" cy="42" rx="4" ry="2.6" fill="#f4a9b8" opacity="0.75" />
      <path d="M56 43 q4 4 8 0" stroke="#3d2830" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}
