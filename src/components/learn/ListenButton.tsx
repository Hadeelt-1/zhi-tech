"use client";

import { useEffect, useState } from "react";

/**
 * Reads Chinese aloud with the browser's own speech engine.
 * Shown only when the device has a Chinese voice, so it never appears as a broken button.
 */
export default function ListenButton({ text, label, small = false }: { text: string; label: string; small?: boolean }) {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      setVoice(voices.find((v) => /^zh(-|_)?(CN|Hans)/i.test(v.lang)) ?? voices.find((v) => v.lang.toLowerCase().startsWith("zh")) ?? null);
    };
    pick();
    window.speechSynthesis.addEventListener("voiceschanged", pick);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", pick);
  }, []);

  if (!voice) return null;

  const speak = () => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  return (
    <button type="button" className={small ? "ibtn listen-sm" : "btn"} onClick={speak} aria-label={label} title={label}>
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {!small && <span style={{ marginInlineStart: 8 }}>{label}</span>}
    </button>
  );
}
