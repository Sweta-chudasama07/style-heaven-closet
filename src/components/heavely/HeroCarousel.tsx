import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

const IMAGES = [
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png",
    bg: "#F4845F",
    panel: "#F79B7F",
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png",
    bg: "#6BBF7A",
    panel: "#85CC92",
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png",
    bg: "#E882B4",
    panel: "#ED9DC4",
  },
  {
    src: "https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png",
    bg: "#6EB5FF",
    panel: "#8DC4FF",
  },
];

const EASE = "cubic-bezier(0.4,0,0.2,1)";
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")";

type Role = "center" | "left" | "right" | "back";

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640,
  );

  useEffect(() => {
    IMAGES.forEach((img) => {
      const i = new Image();
      i.src = img.src;
    });
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navigate = useCallback(
    (dir: "next" | "prev") => {
      if (isAnimating) return;
      setIsAnimating(true);
      setActiveIndex((p) => (dir === "next" ? (p + 1) % 4 : (p + 3) % 4));
      window.setTimeout(() => setIsAnimating(false), 650);
    },
    [isAnimating],
  );

  const roleFor = (i: number): Role => {
    if (i === activeIndex) return "center";
    if (i === (activeIndex + 3) % 4) return "left";
    if (i === (activeIndex + 1) % 4) return "right";
    return "back";
  };

  const roleStyle = (role: Role): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      aspectRatio: "0.6 / 1",
      transition: `transform 650ms ${EASE}, filter 650ms ${EASE}, opacity 650ms ${EASE}, left 650ms ${EASE}`,
      willChange: "transform, filter, opacity",
    };
    switch (role) {
      case "center":
        return {
          ...base,
          left: "50%",
          bottom: isMobile ? "22%" : 0,
          height: isMobile ? "60%" : "92%",
          transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`,
          filter: "blur(0px)",
          opacity: 1,
          zIndex: 20,
        };
      case "left":
        return {
          ...base,
          left: isMobile ? "20%" : "30%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "16%" : "28%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
        };
      case "right":
        return {
          ...base,
          left: isMobile ? "80%" : "70%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "16%" : "28%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(2px)",
          opacity: 0.85,
          zIndex: 10,
        };
      case "back":
        return {
          ...base,
          left: "50%",
          bottom: isMobile ? "32%" : "12%",
          height: isMobile ? "13%" : "22%",
          transform: "translateX(-50%) scale(1)",
          filter: "blur(4px)",
          opacity: 1,
          zIndex: 5,
        };
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex]!.bg,
        transition: `background-color 650ms ${EASE}`,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div className="relative w-full" style={{ height: "100vh", overflow: "hidden" }}>
        {/* Grain overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 50,
            backgroundImage: GRAIN,
            backgroundSize: "200px 200px",
            backgroundRepeat: "repeat",
            opacity: 0.4,
          }}
        />

        {/* Giant ghost text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 flex select-none items-center justify-center"
          style={{ zIndex: 2, top: "18%" }}
        >
          <span
            style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: "clamp(90px, 28vw, 380px)",
              fontWeight: 900,
              color: "#fff",
              opacity: 1,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Heavely
          </span>
        </div>

        {/* Brand label */}
        <div
          className="absolute top-6 left-4 text-xs font-semibold uppercase text-white sm:left-8"
          style={{ zIndex: 60, opacity: 0.9, letterSpacing: "0.18em" }}
        >
          Heavely
        </div>

        {/* Carousel */}
        <div className="absolute inset-0" style={{ zIndex: 3 }}>
          {IMAGES.map((img, i) => (
            <div key={img.src} style={roleStyle(roleFor(i))}>
              <img
                src={img.src}
                alt={`HEAVELY style muse ${i + 1}`}
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                }}
              />
            </div>
          ))}
        </div>

        {/* Bottom-left copy + nav */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24"
          style={{ zIndex: 60, maxWidth: 320 }}
        >
          <p
            className="mb-2 text-base font-bold uppercase tracking-widest text-white sm:mb-3 sm:text-[22px]"
            style={{ opacity: 0.95, letterSpacing: "0.02em" }}
          >
            Heavely Muses
          </p>
          <p
            className="mb-4 hidden text-xs text-white sm:mb-5 sm:block sm:text-sm"
            style={{ opacity: 0.85, lineHeight: 1.6 }}
          >
            Your wardrobe already holds more looks than you think. Spin the studio, pick a muse,
            and let HEAVELY style the rest — outfit, jewellery, hair and makeup.
          </p>
          <div className="flex gap-3">
            {(
              [
                { dir: "prev" as const, Icon: ArrowLeft, label: "Previous muse" },
                { dir: "next" as const, Icon: ArrowRight, label: "Next muse" },
              ] as const
            ).map(({ dir, Icon, label }) => (
              <button
                key={dir}
                type="button"
                aria-label={label}
                onClick={() => navigate(dir)}
                className="flex h-12 w-12 items-center justify-center rounded-full text-white sm:h-16 sm:w-16"
                style={{
                  background: "transparent",
                  border: "2px solid #fff",
                  transition: "transform 150ms, background-color 150ms",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Icon size={26} strokeWidth={2.25} aria-hidden />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom-right link */}
        <Link
          to="/closet"
          className="absolute bottom-6 right-4 flex items-center gap-2 text-white no-underline sm:bottom-20 sm:right-10"
          style={{
            zIndex: 60,
            fontFamily: "'Anton', sans-serif",
            fontSize: "clamp(20px, 4vw, 56px)",
            fontWeight: 400,
            opacity: 0.95,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            textTransform: "uppercase",
            transition: "opacity 200ms",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.95")}
        >
          Enter My Closet
          <ArrowRight className="h-5 w-5 sm:h-8 sm:w-8" strokeWidth={2.25} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
