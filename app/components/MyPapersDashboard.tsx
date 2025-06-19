import axios from "axios";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Paper {
    id: string,
    content: string,
    overview: string,
    pdfUrl: string,
    createdAt: string,
    title: string
    status: string
}

export async function MyPaperDashboard({userId,page}:{userId: string, page: number}){

    const limit = 10;

    const res = await axios.get("/api/getpapers",{
        params:{
            userId,
            page,
            limit
        }
    })
    
    const { papers, totalPages, currentPage } = res.data;

    return(
        <div className="flex-1 overflow-y-auto">
            <div className="min-h-full p-4 md:p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">
                    My Uploaded Papers
                </h1>

                {papers.length === 0 ? (
                    <p className="text-center text-gray-600 dark:text-gray-300">
                    No papers found.
                    </p>
                ) : (
                <>
                    {papers.map((paper: Paper, index: number) => (
                        <PaperCard paper={paper} key={index} />
                    ))}

                    <div className="flex justify-center gap-4 mt-8">
                        {currentPage > 1 && (
                        <Link
                            href={`/mypapers?page=${currentPage - 1}`}
                            className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-neutral-700 rounded hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
                        >
                            Previous
                        </Link>
                        )}
                        {currentPage < totalPages && (
                        <Link
                            href={`/mypapers?page=${currentPage + 1}`}
                            className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-neutral-700 rounded hover:bg-gray-300 dark:hover:bg-neutral-600 transition"
                        >
                            Next
                        </Link>
                        )}
                    </div>
                </>
                )}
            </div>
        </div>
    )
}


function PaperCard({ paper }: { paper: Paper }) {
  let text = "";

  if (paper.overview)
    text = extractCleanedIntro(paper.overview);
  else
    text = "This paper presents a novel approach to a broad problem domain, e.g., optimizing resource allocation or understanding neural network behavior.";

  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 mb-6 max-w-3xl w-full mx-auto">
      <Link href={`/paper/${paper.id}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:underline">
          {paper.title}
        </h2>
      </Link>

      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 prose prose-zinc prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {text}
        </ReactMarkdown>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Uploaded on: {new Date(paper.createdAt as string).toLocaleDateString()}
      </div>
    </div>
  );
}


function extractCleanedIntro(text: string): string {
  const marker = "### Key Innovations and Contributions";
  const index = text.indexOf(marker);

  if (index === -1) return "Section not found";

  const intro = text.slice(0, index).trim();

  return intro.trim();
}