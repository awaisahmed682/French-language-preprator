"use client";

import { useState } from "react";
import { tutorChat } from "@/actions/ai";
import { SpeakButton } from "@/components/speech/speak-button";
import { Button, Card, inputCls } from "@/components/ui/primitives";

export function TutorPanel({ level }: { level: string }) {
  const [messages, setMessages] = useState<{ by: "user" | "ai"; text: string; source?: string }[]>([
    {
      by: "ai",
      text: `Hi! I'm your French tutor (level ${level}). Write a sentence in French: I'll correct it and explain why.`,
      source: "rules",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { by: "user", text }]);
    setBusy(true);
    try {
      const res = await tutorChat(level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2", text);
      setMessages((m) => [...m, { by: "ai", text: res.reply, source: res.source }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <Card className="flex min-h-72 flex-col gap-3 p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex max-w-[85%] flex-col gap-1 rounded-2xl px-3 py-2 text-sm ${
              m.by === "user"
                ? "self-end bg-indigo-600 text-white"
                : "self-start bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
            }`}
          >
            <span className="whitespace-pre-wrap">{m.text}</span>
            {m.by === "ai" ? (
              <div className="mt-1 flex items-center gap-2">
                {m.source === "ai" ? (
                  <span className="text-xs text-zinc-400">answer from AI</span>
                ) : (
                  <span className="text-xs text-zinc-400">manual answer</span>
                )}
                <SpeakButton text={m.text.slice(0, 400)} label="" />
              </div>
            ) : null}
          </div>
        ))}
        {busy ? (
          <span className="self-start rounded-2xl bg-zinc-100 px-3 py-2 text-sm text-zinc-400 dark:bg-zinc-800">
            …
          </span>
        ) : null}
      </Card>
      <div className="flex items-center gap-2">
        <input
          className={inputCls + " flex-1"}
          placeholder="Your sentence in French…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <Button onClick={send} disabled={busy || !input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}