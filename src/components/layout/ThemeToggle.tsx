"use client";

import { useEffect, useState } from "react";

/** 白天/暗黑模式切换：类挂在 <html> 上，偏好存 localStorage（yq-theme） */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("yq-theme", next ? "dark" : "light");
    } catch {
      /* 隐私模式下忽略 */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? "切换到白天模式" : "切换到暗黑模式"}
      title={dark ? "切换到白天模式" : "切换到暗黑模式"}
      className="flex h-8 w-14 items-center rounded-full border border-ink-600 bg-ink-800 px-1 transition-colors"
    >
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs text-ink-950 transition-transform duration-200 ${
          dark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        <span aria-hidden>{dark ? "🌙" : "☀️"}</span>
      </span>
    </button>
  );
}
