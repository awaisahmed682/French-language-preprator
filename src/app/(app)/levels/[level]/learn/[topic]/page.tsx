import { notFound } from "next/navigation";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { TopicRunner } from "@/components/exercise/topic-runner";

type Params = { level: string; topic: string };

export default async function LearnTopicPage({ params }: { params: Promise<Params> }) {
  const { level: slug, topic: topicId } = await params;
  const level = slug.toUpperCase() as Level;
  if (!LEVEL_ORDER.includes(level)) notFound();

  const content = getLevelContent(level);
  const topic = content.grammar.find((t) => t.id === topicId);
  if (!topic) notFound();

  return <TopicRunner level={slug} topic={topic} />;
}