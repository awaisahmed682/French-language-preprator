import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getLevelContent } from "@/lib/content";
import { LEVEL_ORDER, type Level } from "@/lib/types";
import { StoryCard } from "@/components/stories/story-card";
import { ScenarioCard } from "@/components/scenarios/scenario-card";

type Params = { level: string };

export default async function StoriesPage({ params }: { params: Promise<Params> }) {
  const { level: slug } = await params;
  const level = slug.toUpperCase() as Level;
  if (!LEVEL_ORDER.includes(level)) notFound();
  await requireSession();

  const content = getLevelContent(level);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href={`/levels/${slug}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300">
          ← Level {level}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Stories & scenarios — {level}
        </h1>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-200">
          Read and listen to dialogues, then test your comprehension.
        </p>
      </div>

      {content.stories.map((story) => (
        <StoryCard key={story.id} story={story} level={level} />
      ))}

      {content.scenarios.length > 0 ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Everyday-life scenarios</h2>
          {content.scenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </section>
      ) : null}
    </div>
  );
}