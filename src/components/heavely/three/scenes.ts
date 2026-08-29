import { lazyScene } from "./ClientScene";

export const HeroScene3D = lazyScene(() => import("./HeroScene"));
export const ClosetRoom3D = lazyScene(() => import("./ClosetRoomScene"));
export const Mannequin3D = lazyScene(() => import("./MannequinScene"));

export const HEX: Record<string, string> = {
  pink: "#f6bfd0",
  rose: "#e6a2b3",
  red: "#e08b8b",
  peach: "#f7c8a9",
  cream: "#f6ecda",
  white: "#f8f6f6",
  beige: "#e8d6c2",
  brown: "#c09c7e",
  black: "#6b6870",
  grey: "#c8c5c9",
  blue: "#bcd6ef",
  denim: "#9db4d3",
  lavender: "#d6c6ef",
  green: "#bfd7b7",
  yellow: "#f2e0a8",
  gold: "#e6cd94",
  silver: "#d9dde3",
  pearl: "#f6eeeb",
  multi: "#e9cfe6",
};

export function hexFor(color?: string) {
  return (color && HEX[color]) || "#f0cfe2";
}
