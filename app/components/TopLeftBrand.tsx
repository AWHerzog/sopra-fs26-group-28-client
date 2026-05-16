"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopLeftBrand(): React.ReactElement | null {
  const pathname = usePathname() ?? "/";

  // hide on any in-game routes
  if (pathname.startsWith("/game")) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 12,
        left: 12,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Link
        href="/home"
        className="drigleit-brand"
        style={{
          color: "#2f74b5",
          fontWeight: 700,
          fontSize: 22,
          textDecoration: "none",
          padding: "9px 12px",
          borderRadius: 8,
          background: "rgba(47,116,181,0.06)",
        }}
      >
        DRIGLEIT
      </Link>
    </div>
  );
}
