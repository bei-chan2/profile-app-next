"use client";

import { useEffect } from "react";

/**
 * prefers-reduced-motion が有効なとき、CSS のスタッガーフェードを無効化（元 script.js と同じ）
 */
export function ReducedMotion() {
  useEffect(() => {
    if (!window.matchMedia) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.documentElement.classList.add("reduce-motion");
    }
  }, []);
  return null;
}
