"use client";

import type { Scenario } from "@/lib/types";
import { SpeakButton } from "@/components/speech/speak-button";
import { Card } from "@/components/ui/primitives";

export function ScenarioCard({ scenario }: { scenario: Scenario }) {
  return (
    <Card className="flex flex-col gap-3">
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{scenario.title}</h3>
        <p className="mt-1 text-sm text-zinc-500">{scenario.setting}</p>
      </div>
      <div className="flex flex-col gap-2">
        {scenario.dialogue.map((line, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-1 shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              {line.speaker}
            </span>
            <p className="min-w-0 flex-1 rounded-xl bg-zinc-50 px-3 py-2 text-sm leading-relaxed dark:bg-zinc-900">
              {line.text}
            </p>
            <SpeakButton text={line.text} label="" size="sm" />
          </div>
        ))}
      </div>
    </Card>
  );
}