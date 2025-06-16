"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const qdrant_1 = require("@langchain/qdrant");
const prompts_1 = require("@langchain/core/prompts");
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const text_splitter_1 = require("langchain/text_splitter");
const cohere_1 = require("@langchain/cohere");
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const google_genai_1 = require("@langchain/google-genai");
const runnables_1 = require("@langchain/core/runnables");
const redisConnection = {
    host: 'localhost',
    port: 6379
};
const headingKeywords = [
    "abstract",
    "introduction",
    "related work",
    "literature review",
    "background",
    "methodology",
    "methods",
    "experiments",
    "results",
    "discussion",
    "conclusion",
    "future work",
    "references"
];
const worker = new bullmq_1.Worker("file-upload-queue", async (job) => {
    try {
        const { paperId, pdfUrl } = job.data;
        console.log("Job received:", job.data);
        const localPath = await downloadPDF(pdfUrl);
        const loader = new pdf_1.PDFLoader(localPath);
        const docs = await loader.load();
        const fullText = docs.map((doc) => doc.pageContent).join("\n");
        const model = new google_genai_1.ChatGoogleGenerativeAI({
            model: "gemini-2.0-flash",
            apiKey: "AIzaSyArmAmGCdWzihI5Q78TAsrN3H5T05X_aYY"
        });
        const prompt = prompts_1.PromptTemplate.fromTemplate(`
                You are a helpful assistant. Read the academic paper below and summarize it in a **concise and well-structured Markdown format**. Start with the actual paper title as a level 2 Markdown heading (##), followed by a one-sentence overview of the problem and goal.

                Then include the following sections:

                ### Key Innovations and Contributions  
                - Summarize the 2–4 most important contributions using clear bullet points.

                ### Methodology  
                Summarize datasets used, model/architecture details, training parameters, and evaluation setup in 1–2 short paragraphs.

                ### Results and Implications  
                Clearly state key results (with numbers if available), efficiency insights, and the broader significance of the findings.

                ### Potential Applications  
                List 2–4 real-world applications.

                Make sure the output is no longer than **300–350 words** and includes valid Markdown only. Do not include any explanation outside the markdown.

                Paper Content:
                {paper}
            `);
        const chain = runnables_1.RunnableSequence.from([
            prompt, // step 1: fill the prompt
            model // step 2: call the model with filled prompt
        ]);
        const result = await chain.invoke({
            paper: fullText
        });
        const overview = extractText(result.content);
        // console.log(content);
        const res = await axios_1.default.post("http://localhost:3000/api/saveoverview", {
            paperId,
            overview
        });
        console.log(res);
        const newDocs = docs.map(doc => {
            doc.pageContent = doc.pageContent.replace(/\n[A-Z][A-Z\s\-]{2,}\n/g, match => `\n${match.trim().toLowerCase()}\n`);
            return doc;
        });
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
            separators: [
                "\n\n",
                "\n",
                ...headingKeywords.map(h => `\n${h}\n`),
                ". ",
                " ",
                "",
            ]
        });
        const splitDocs = await splitter.splitDocuments(newDocs.map((doc, i) => {
            doc.metadata = { ...doc.metadata, page: i + 1 };
            return doc;
        }));
        const embeddings = new cohere_1.CohereEmbeddings({
            model: "embed-english-v3.0",
            apiKey: "pxHHZy29DAsfH6TybW85qOuGB7OnHDfEcfaBUy0j"
        });
        const vectorStore = await qdrant_1.QdrantVectorStore.fromDocuments(splitDocs, embeddings, {
            url: "http://localhost:6333",
            collectionName: `pdf-${paperId}`,
        });
        await vectorStore.addDocuments(splitDocs);
        console.log("Vector embeddings added");
    }
    catch (err) {
        console.error("Worker failed:", err);
    }
}, {
    concurrency: 100,
    connection: redisConnection
});
async function downloadPDF(pdfUrl) {
    const res = await axios_1.default.get(pdfUrl, { responseType: 'arraybuffer' });
    const tempFilePath = path_1.default.join(os_1.default.tmpdir(), `temp-${Date.now()}.pdf`);
    await promises_1.default.writeFile(tempFilePath, res.data);
    return tempFilePath;
}
function extractText(content) {
    if (Array.isArray(content)) {
        return content
            .map(item => typeof item === "string"
            ? item
            : typeof item === "object" && "text" in item
                ? item.text
                : "")
            .join("\n");
    }
    if (typeof content === "object" && content !== null) {
        if ("text" in content && typeof content.text === "string") {
            return content.text;
        }
    }
    return String(content ?? "");
}
