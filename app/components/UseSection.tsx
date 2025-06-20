import { TracingBeam } from "./ui/tracing-beam"
import { UseSectionCard } from "./UseSectionCard"

export function UseSection() {
    const headings = [
        {
            headingOne: "Drop Your Paper In",
            headingTwo: "Easily drag and drop your PDF — no complex setup needed.",
            image: "images/newDrop.png"
        },
        {
            headingOne: "Let the AI Do the Reading",
            headingTwo: "Get instant insights without skimming a single page.",
            image: "images/newOverview.jpeg"
        },
        {
            headingOne: "Chat, Learn, Remember",
            headingTwo: "Ask anything, get answers, and keep your notes in one place.",
            image: "images/newChat.jpeg"
        }
    ]
  return (
    <div className="relative flex flex-col gap-4 items-center justify-center px-4 mt-16">
        <div className="font-semibold text-base md:text-4xl dark:text-neutral-200">
          How Paperfy Works
        </div>
        <div className="font-extralight text-base md:text-2xl dark:text-neutral-200 mb-16">
          From upload to insight. A seamless journey powered by AI.
        </div>
        <TracingBeam className="py-4">
        {headings.map((heading,index) => (
            <div
            key={index}
            className={`mb-4 max-w-[80%] ${
                index % 2 === 0 ? "mr-auto -translate-x-8" : "ml-auto translate-x-8"
            }`}
            >
            <UseSectionCard headingOne={heading.headingOne} headingTwo={heading.headingTwo} image={heading.image} />
            </div>
        ))}
        </TracingBeam>
    </div>
  )
}