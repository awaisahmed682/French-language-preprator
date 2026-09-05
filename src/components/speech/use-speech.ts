"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

function getSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

const serverSnapshot = () => false;

function pickFrenchVoice(): SpeechSynthesisVoice | null {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith("fr") && v.localService) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("fr")) ||
    null
  );
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const supported = useSyncExternalStore(
    subscribeNoop,
    getSpeechSynthesisSupported,
    serverSnapshot
  );
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    voiceRef.current = pickFrenchVoice();
    const handler = () => {
      voiceRef.current = pickFrenchVoice();
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string, rate = 0.88) => {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = rate;
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const stop = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
}