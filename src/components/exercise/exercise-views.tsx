"use client";

import { useState } from "react";
import type {
  Exercise,
  FillBlankExercise,
  ListenExercise,
  MCQExercise,
  OrderingExercise,
  PronunciationExercise,
  TranslationExercise,
} from "@/lib/types";
import { answersMatch, className as cn, levenshtein } from "@/lib/utils";
import { Button, inputCls } from "@/components/ui/primitives";
import { SpeakButton } from "@/components/speech/speak-button";
import { useSpeechRecognition } from "@/components/speech/use-speech-recognition";

export interface Grade {
  correct: boolean;
  score: number;
}

export function Feedback({ correct, explain }: { correct: boolean; explain?: string }) {
  return (
    <div
      className={cn(
        "mt-3 rounded-lg px-4 py-3 text-sm font-medium",
        correct
          ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
      )}
    >
      <p>{correct ? "Excellent, that's correct!" : "Not quite right."}</p>
      {explain ? <p className="mt-1 font-normal opacity-90">{explain}</p> : null}
    </div>
  );
}

function OptionRow({
  index,
  option,
  selected,
  reveal,
  answer,
  onPick,
  disabled,
}: {
  index: number;
  option: string;
  selected: boolean;
  reveal: boolean;
  answer: number;
  onPick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={disabled}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors disabled:cursor-not-allowed",
        reveal && index === answer
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50"
          : reveal && selected
            ? "border-rose-500 bg-rose-50 dark:bg-rose-950/50"
            : selected
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50"
              : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-200/60 dark:border-zinc-700 dark:hover:bg-zinc-800"
      )}
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-300 text-xs font-semibold dark:border-zinc-600">
        {String.fromCharCode(65 + index)}
      </span>
      <span className="text-zinc-800 dark:text-zinc-100">{option}</span>
    </button>
  );
}

export function MultipleChoiceView({
  exercise,
  onGrade,
  showSpeak,
}: {
  exercise: MCQExercise;
  onGrade: (g: Grade) => void;
  showSpeak?: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = selected === exercise.answer;

  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    onGrade({ correct, score: correct ? 1 : 0 });
  };

  return (
    <div className="flex flex-col gap-3">
      {showSpeak && exercise.audio ? (
        <div className="flex items-center gap-2">
          <SpeakButton text={exercise.audio} />
          <span className="text-xs text-zinc-700 dark:text-zinc-200">Tap to listen, then answer.</span>
        </div>
      ) : null}
      {exercise.options.map((option, i) => (
        <OptionRow
          key={i}
          index={i}
          option={option}
          selected={selected === i}
          reveal={submitted}
          answer={exercise.answer}
          onPick={() => !submitted && setSelected(i)}
          disabled={submitted}
        />
      ))}
      {!submitted ? (
        <div>
          <Button onClick={submit} disabled={selected === null}>
            Check
          </Button>
        </div>
      ) : (
        <Feedback correct={correct} explain={exercise.explain} />
      )}
    </div>
  );
}

export function FillBlankView({
  exercise,
  onGrade,
}: {
  exercise: FillBlankExercise;
  onGrade: (g: Grade) => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const accepted = [exercise.answer, ...(exercise.answerVariants ?? [])];
  const correct = answersMatch(value, accepted);

  const submit = () => {
    if (submitted || value.trim().length === 0) return;
    setSubmitted(true);
    onGrade({ correct, score: correct ? 1 : 0 });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className={inputCls}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={submitted}
          placeholder="Type your answer…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {!submitted ? (
          <Button onClick={submit} disabled={value.trim().length === 0}>
            Check
          </Button>
        ) : null}
      </div>
      {submitted ? (
        <>
          <Feedback correct={correct} explain={exercise.explain} />
          {!correct ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Answer: <strong>{exercise.answer}</strong>
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export function TranslationView({
  exercise,
  onGrade,
}: {
  exercise: TranslationExercise;
  onGrade: (g: Grade) => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const accepted = [exercise.answer, ...(exercise.answerVariants ?? [])];
  const correct = answersMatch(value, accepted);

  const submit = () => {
    if (submitted || value.trim().length === 0) return;
    setSubmitted(true);
    onGrade({ correct, score: correct ? 1 : 0 });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className={inputCls}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={submitted}
          placeholder="Your translation…"
          autoComplete="off"
          autoCorrect="off"
        />
        {!submitted ? (
          <Button onClick={submit} disabled={value.trim().length === 0}>
            Check
          </Button>
        ) : null}
      </div>
      {submitted ? (
        <>
          <Feedback correct={correct} explain={exercise.explain} />
          {!correct ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Expected answer: <strong>{exercise.answer}</strong>
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export function ListenView({
  exercise,
  onGrade,
}: {
  exercise: ListenExercise;
  onGrade: (g: Grade) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = selected === exercise.answer;

  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    onGrade({ correct, score: correct ? 1 : 0 });
  };

  return (
    <div className="flex flex-col gap-3">
      <SpeakButton text={exercise.audio} label="Listen to the audio" />
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {exercise.question}
      </p>
      {(exercise.options ?? []).map((option, i) => (
        <OptionRow
          key={i}
          index={i}
          option={option}
          selected={selected === i}
          reveal={submitted}
          answer={exercise.answer ?? -1}
          onPick={() => !submitted && setSelected(i)}
          disabled={submitted}
        />
      ))}
      {!submitted ? (
        <div>
          <Button onClick={submit} disabled={selected === null}>
            Check
          </Button>
        </div>
      ) : (
        <Feedback correct={correct} />
      )}
    </div>
  );
}

export function OrderingView({
  exercise,
  onGrade,
}: {
  exercise: OrderingExercise;
  onGrade: (g: Grade) => void;
}) {
  const remaining = exercise.parts.map((part, i) => ({ part, index: i }));
  const [picked, setPicked] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const correct =
    picked.length === exercise.answer.length &&
    exercise.answer.every((value, i) => picked[i] === value);

  const pick = (index: number) => {
    if (submitted || picked.includes(index)) return;
    setPicked((prev) => [...prev, index]);
  };

  const undo = () => {
    if (submitted) return;
    setPicked((prev) => prev.slice(0, -1));
  };

  const submit = () => {
    if (submitted || picked.length !== exercise.parts.length) return;
    setSubmitted(true);
    onGrade({ correct, score: correct ? 1 : 0 });
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-700 dark:text-zinc-400">
        Click the words in the correct order
      </p>
      <div className="flex flex-wrap gap-2">
        {remaining.map(({ part, index }) =>
          picked.includes(index) ? null : (
            <button
              key={index}
              type="button"
              onClick={() => pick(index)}
              disabled={submitted}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-800 hover:border-indigo-400 hover:bg-indigo-50 disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {part}
            </button>
          )
        )}
      </div>
      {picked.length > 0 ? (
        <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/40 p-3 dark:border-indigo-700 dark:bg-indigo-950/30">
          {picked.map((index, pos) => (
            <span
              key={`${index}-${pos}`}
              className={
                submitted
                  ? cn(
                      pos < exercise.answer.length && exercise.answer[pos] === index
                        ? "rounded-md bg-emerald-500/20 px-2 py-1 text-sm font-medium text-emerald-700 dark:text-emerald-300"
                        : "rounded-md bg-rose-500/20 px-2 py-1 text-sm font-medium text-rose-700 dark:text-rose-300"
                    )
                  : "rounded-md bg-white px-2 py-1 text-sm font-medium shadow-sm dark:bg-zinc-800"
              }
            >
              {exercise.parts[index]}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex gap-2">
        {!submitted ? (
          <>
            <Button onClick={submit} disabled={picked.length !== exercise.parts.length}>
              Check
            </Button>
            {picked.length > 0 ? (
              <Button variant="ghost" onClick={undo}>
                Undo last
              </Button>
            ) : null}
          </>
        ) : null}
      </div>
      {submitted ? (
        <>
          <Feedback correct={correct} />
          {!correct ? (
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Correct order:{" "}
              <strong>
                {exercise.answer.map((i) => exercise.parts[i]).join(" ")}
              </strong>
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function pronunciationScore(transcript: string, target: string): number {
  const t = transcript.toLowerCase().trim();
  const s = target.toLowerCase().trim();
  if (!t) return 0;
  const maxLen = Math.max(t.length, s.length, 1);
  const similarity = 1 - levenshtein(t, s) / maxLen;
  return Math.round(similarity * 100);
}

export function PronunciationView({
  exercise,
  onGrade,
}: {
  exercise: PronunciationExercise;
  onGrade: (g: Grade) => void;
}) {
  const { supported, listening, result, start } = useSpeechRecognition("fr-FR");
  const [evaluated, setEvaluated] = useState(false);
  const [score, setScore] = useState(0);

  const evaluate = () => {
    if (!result || evaluated) return;
    const s = pronunciationScore(result.transcript, exercise.word);
    setScore(s);
    setEvaluated(true);
    onGrade({ correct: s >= 60, score: s / 100 });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {exercise.word}
        </span>
        <span className="text-sm text-zinc-700 dark:text-zinc-200">{exercise.ipa}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <SpeakButton text={exercise.word} label="Listen" />
        {supported ? (
          <Button
            variant="outline"
            onClick={start}
            disabled={listening || evaluated}
            className={listening ? "pointer-events-none opacity-70" : undefined}
          >
            {listening ? "🎙️ Listening…" : "🎙️ Record"}
          </Button>
        ) : (
          <span className="text-xs text-zinc-700 dark:text-zinc-200">
            Speech recognition is not available in this browser.
          </span>
        )}
      </div>
      {result ? (
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          You said: <em>{result.transcript}</em>
          {result.confidence > 0 ? ` (confidence ${Math.round(result.confidence * 100)}%)` : ""}
        </p>
      ) : null}
      {!evaluated && result ? (
        <div>
          <Button onClick={evaluate}>Evaluate my pronunciation</Button>
        </div>
      ) : null}
      {evaluated ? (
        <Feedback
          correct={score >= 60}
          explain={
            score >= 60
              ? `Pronunciation score: ${score}/100.`
              : `Pronunciation score: ${score}/100. Listen again and retry the word « ${exercise.word} ».`
          }
        />
      ) : null}
    </div>
  );
}

export function ExerciseView({
  exercise,
  onGrade,
}: {
  exercise: Exercise;
  onGrade: (g: Grade) => void;
}) {
  switch (exercise.type) {
    case "multiple_choice":
      return <MultipleChoiceView exercise={exercise} onGrade={onGrade} />;
    case "fill_in_blank":
      return <FillBlankView exercise={exercise} onGrade={onGrade} />;
    case "translation":
      return <TranslationView exercise={exercise} onGrade={onGrade} />;
    case "listen":
      return <ListenView exercise={exercise} onGrade={onGrade} />;
    case "ordering":
      return <OrderingView exercise={exercise} onGrade={onGrade} />;
    case "pronunciation":
      return <PronunciationView exercise={exercise} onGrade={onGrade} />;
    default:
      return (
        <p className="text-sm text-zinc-700 dark:text-zinc-200">Exercise type not supported.</p>
      );
  }
}

export function skillTone(skill: string): "green" | "blue" | "violet" | "rose" | "amber" | "zinc" {
  switch (skill) {
    case "grammar":
      return "violet";
    case "vocabulary":
      return "blue";
    case "listening":
      return "amber";
    case "reading":
      return "green";
    case "writing":
      return "rose";
    case "speaking":
      return "zinc";
    case "pronunciation":
      return "zinc";
    default:
      return "zinc";
  }
}