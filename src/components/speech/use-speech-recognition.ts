"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

export interface RecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: {
    results: { [i: number]: { [j: number]: { transcript?: string; confidence?: number } } };
  }) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionWindow = {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

const subscribeNoop = () => () => {};

function getSpeechRecognitionSupported(): boolean {
  const w = window as unknown as SpeechRecognitionWindow;
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

const serverSnapshot = () => false;

export function useSpeechRecognition(
  lang = "fr-FR",
  onResult?: (res: RecognitionResult) => void
) {
  const supported = useSyncExternalStore(
    subscribeNoop,
    getSpeechRecognitionSupported,
    serverSnapshot
  );
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognizerRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const start = useCallback(() => {
    const recognizer = recognizerRef.current;
    if (!recognizer) return;
    shouldListenRef.current = true;
    setError(null);
    setResult(null);
    setListening(true);
    try {
      recognizer.start();
    } catch {
      shouldListenRef.current = false;
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    shouldListenRef.current = false;
    recognizerRef.current?.stop();
  }, []);

  useEffect(() => {
    if (!supported || typeof window === "undefined") return;
    const w = window as unknown as SpeechRecognitionWindow;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return;
    const recognizer = new SR();
    recognizer.lang = lang;
    recognizer.continuous = false;
    recognizer.interimResults = false;
    recognizer.onresult = (event) => {
      const item = event.results[0]?.[0];
      if (item) {
        const res = { transcript: item.transcript ?? "", confidence: item.confidence ?? 0 };
        setResult(res);
        onResultRef.current?.(res);
      }
    };
    recognizer.onerror = () => {
      shouldListenRef.current = false;
      setError("Couldn't access the microphone. Check your browser permission and try again.");
      setListening(false);
    };
    recognizer.onend = () => {
      if (!shouldListenRef.current) {
        setListening(false);
        return;
      }
      try {
        recognizerRef.current?.start();
      } catch {
        shouldListenRef.current = false;
        setListening(false);
      }
    };
    recognizerRef.current = recognizer;
    return () => {
      shouldListenRef.current = false;
      if (recognizerRef.current === recognizer) recognizerRef.current = null;
      try {
        recognizer.abort();
      } catch {
        // ignore
      }
    };
  }, [lang, supported]);

  return { supported, listening, result, error, start, stop };
}