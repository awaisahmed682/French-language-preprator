"use client";

import { useEffect, useRef, useState } from "react";
import { submitSpeaking } from "@/actions/community";
import { useSpeechRecognition } from "@/components/speech/use-speech-recognition";
import { SpeakButton } from "@/components/speech/speak-button";
import { Button, Card } from "@/components/ui/primitives";

export function SpeakingPromptCard({
  title,
  scenario,
  hint,
  level,
}: {
  title: string;
  scenario: string;
  hint: string;
  level: string;
}) {
  const { supported, listening, result, start, stop } = useSpeechRecognition();
  const [transcript, setTranscript] = useState("");
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<{ ok?: boolean; error?: string } | null>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    if (result && result.transcript) {
      transcriptRef.current = transcriptRef.current
        ? `${transcriptRef.current} ${result.transcript}`
        : result.transcript;
      setTranscript(transcriptRef.current);
    }
  }, [result]);

  const submit = async () => {
    setBusy(true);
    setOutcome(null);
    try {
      const res = await submitSpeaking(transcriptRef.current, level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2");
      setOutcome(res.error ? { error: res.error } : { ok: true });
      if (!res.error) {
        transcriptRef.current = "";
        setTranscript("");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{scenario}</p>
        <p className="mt-1 text-xs text-zinc-400">Tip: {hint}</p>
      </div>
      <SpeakButton text={scenario} label="Listen to the scenario" />
      <div className="flex items-center gap-2">
        {supported ? (
          !listening ? (
            <Button
              onClick={() => {
                setBusy(false);
                start();
              }}
            >
              🎤 Record my answer
            </Button>
          ) : (
            <Button variant="outline" onClick={stop}>
              ⏹ Stop
            </Button>
          )
        ) : (
          <p className="text-xs text-zinc-500">Speech recognition isn&apos;t supported here.</p>
        )}
        {listening ? <span className="text-sm text-rose-600">● Recording…</span> : null}
      </div>
      {transcript ? (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          <span className="text-xs font-medium uppercase text-zinc-400">Transcript: </span>
          {transcript}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-zinc-400">
          {transcript.split(" ").filter(Boolean).length} words captured
        </span>
        <Button onClick={submit} disabled={busy || !transcript.trim()}>
          {busy ? "Sending…" : "Share with the community"}
        </Button>
      </div>
      {outcome?.error ? (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
          {outcome.error}
        </p>
      ) : null}
      {outcome?.ok ? (
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          Response shared! +15 XP.
        </p>
      ) : null}
    </Card>
  );
}