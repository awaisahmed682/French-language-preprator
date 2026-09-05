"use client";

import { useState } from "react";
import { roleplayReply } from "@/actions/ai";
import type { Scenario } from "@/lib/types";
import { SpeakButton } from "@/components/speech/speak-button";
import { Button, Card, inputCls } from "@/components/ui/primitives";

export function RoleplayPanel({
  level,
  scenarios,
  initialRole,
}: {
  level: string;
  scenarios: Scenario[];
  initialRole: string;
}) {
  const [scenario, setScenario] = useState<Scenario | null>(
    scenarios.length > 0 ? scenarios[0] : null
  );
  const [messages, setMessages] = useState<{ by: "user" | "ai"; text: string; speaker?: string }[]>(
    scenario ? [{ by: "ai", text: scenario.dialogue[0]?.text ?? "", speaker: scenario.dialogue[0]?.speaker }] : []
  );
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const selectScenario = (s: Scenario | null) => {
    setScenario(s);
    setMessages(
      s ? [{ by: "ai", text: s.dialogue[0]?.text ?? "Bonjour !", speaker: s.dialogue[0]?.speaker }] : []
    );
  };

  const send = async () => {
    const text = input.trim();
    if (!text || !scenario || busy) return;
    setInput("");
    setMessages((m) => [...m, { by: "user", text }]);
    setBusy(true);
    try {
      const res = await roleplayReply(
        level.toUpperCase() as "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
        scenario.id,
        text
      );
      setMessages((m) => [...m, { by: "ai", text: res.reply, speaker: res.speaker }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-200" htmlFor="scenario">
          Scenario ({initialRole} — partner here to answer)
        </label>
        <select
          id="scenario"
          className={inputCls}
          value={scenario?.id ?? ""}
          onChange={(e) => {
            const s = scenarios.find((x) => x.id === e.target.value) ?? null;
            selectScenario(s);
          }}
        >
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title} — {s.setting}
            </option>
          ))}
        </select>
        {scenario ? (
          <p className="text-xs text-zinc-400">
            📍 {scenario.setting}. The partner starts the conversation; answer in French!
          </p>
        ) : null}
      </div>

      {scenario ? (
        <>
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
                {m.speaker && m.by === "ai" ? (
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                    {m.speaker}
                  </span>
                ) : null}
                <span>{m.text}</span>
                {m.by === "ai" ? <SpeakButton text={m.text} label="" variant="outline" /> : null}
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
              placeholder="Your reply in French…"
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
        </>
      ) : (
        <Card>
          <p className="text-sm text-zinc-700 dark:text-zinc-200">No scenario available at this level.</p>
        </Card>
      )}
    </div>
  );
}