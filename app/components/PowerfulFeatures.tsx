"use client";
import { Upload, MessageCircle, NotebookPen, Search, LayoutDashboard, Sparkles } from "lucide-react";
import { GlowingEffect } from "./ui/glowing-effect";

export function Features() {
  return (
    <div className="bg-gradient-to-r from-sky-100 to-white relative flex flex-col gap-4 items-center justify-center px-4 mt-16 py-8">
        <div className="font-semibold text-base md:text-4xl dark:text-neutral-200">
          Packed With Powerful Features
        </div>
        <div className="font-extralight text-base md:text-2xl dark:text-neutral-200 mb-8">
          Supercharge your research with blazing-fast insights, zero hassle, and pure AI power.
        </div>
        <div>
            <GlowingEffectDemo/>
        </div>
    </div>
  )
}



function GlowingEffectDemo() {
  return (
    <ul className="px-7 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <GridItem
        icon={<Upload className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Effortless PDF Upload & Parsing"
        description="Simply upload your research papers—our AI instantly reads and processes them for you."
      />

      <GridItem
        icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="AI-Powered Paper Overview"
        description="Get concise, insightful overviews of any paper in seconds, no skimming required."
      />

      <GridItem
        icon={<MessageCircle className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Semantic Search Inside Your Documents"
        description="Ask questions and instantly find answers from deep within your uploaded PDFs."
      />

      <GridItem
        icon={<NotebookPen className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Take Notes While You Read"
        description="Highlight important sections and jot down your thoughts—all in one place, synced with the paper."
      />

      <GridItem  
        icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Private, Secure Document Handling"
        description="Your data is encrypted and never shared—confidentiality is built in from the start."
      />

      <GridItem
        icon={<LayoutDashboard className="h-4 w-4 text-black dark:text-neutral-400" />}
        title="Personalized Research History Dashboard"
        description="Keep track of every paper, note, and AI interaction in a clean, organized space."
      />
    </ul>
  );
}

interface GridItemProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}

const GridItem = ({ icon, title, description }: GridItemProps) => {
  return (
    <li className={"min-h-[14rem] list-none"}>
      <div className="bg-white relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border border-gray-600 p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
