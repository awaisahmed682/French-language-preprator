"use client";

import { useSpeech } from "./use-speech";
import { Button } from "@/components/ui/primitives";

export function SpeakButton({
  text,
  label = "Listen",
  variant = "secondary",
  size = "sm",
  className,
}: {
  text: string;
  label?: string;
  variant?: "secondary" | "primary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { speak, supported } = useSpeech();
  if (!supported) return null;
  return (
    <Button variant={variant} size={size} onClick={() => speak(text)} className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
        <path d="M18.5 5.5a9 9 0 0 1 0 13" />
      </svg>
      {label}
    </Button>
  );
}