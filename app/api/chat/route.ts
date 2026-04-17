import { CohereEmbeddings } from "@langchain/cohere";
import { NextRequest, NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AQ.Ab8RN6ICImBAgTaRNxjGPjPkyFpgbX88tKp9xUjvUvPT9xdlrg" });

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const userQuery = searchParams.get("message");
    const paperId = searchParams.get("paperId");

    if (!userQuery || !paperId) {
      return NextResponse.json({ success: false, message: "Missing query or paperId" });
    }

    const embeddings = new CohereEmbeddings({
      model: "embed-english-v3.0",
      apiKey: process.env.COHERE_API_KEY!,
    });

    const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
      //url: process.env.QDRANT_URL || "http://localhost:6333",
       url="https://e446722b-5de9-4aa9-b8e0-3b1d718bf18c.us-east-1-1.aws.cloud.qdrant.io", 
       api_key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIiwic3ViamVjdCI6ImFwaS1rZXk6YTIwMWVjNDUtMzg2Mi00MmFkLTg5ZWItOTAxNTgwNmRmOTdlIn0.pXYWO9WwqhxdiDbxhg001hRFmvS9d-NHQfIbN14BWeo",
      collectionName: `pdf-${paperId}`,
    });

    const retriever = vectorStore.asRetriever({ k: 3 });
    const results = await retriever.invoke(userQuery);
    const context = results.map((doc) => doc.pageContent).join("\n\n");

    console.log("Results: ",results);
    

    const prompt = `
    You are an expert research assistant with the communication ability of ChatGPT. 
    Your task is to answer the user's question using only the context provided from the research paper.

    Context:
    ${context}

    User's Question:
    ${userQuery}

    Instructions:
    - Base your answers strictly on the provided context. Do not invent or hallucinate information.
    - Rephrase and synthesize content into clear, natural, and academically appropriate language. Avoid copy-paste.
    - If the answer is partially available, summarize what can be inferred from the context and clearly mention any missing pieces.
    - If the information is not present, respond: "The information is not clearly available in the provided context." You may briefly explain why it may not be covered.
    - For definitions or acronyms, expand them concisely if the meaning is obvious from context.
    - When presenting findings, results, or numerical values, summarize their implications (e.g., improvement, decline, comparison) rather than just listing raw numbers.
    - Structure answers for clarity: short paragraphs for explanations, or bullet points for key findings.
    - Maintain a neutral, scholarly tone suitable for scientific discussion, while still sounding natural and approachable.
    - If the user asks something unrelated to the paper, politely indicate that only paper-related context can be used.
    `;


    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${prompt}`,
    });
    const textResponse = response.text;

    return NextResponse.json({
        success: true,
        answer: textResponse,
        sources: results.map((doc, idx) => ({
        page: doc.metadata?.page || idx + 1,
        snippet: doc.pageContent.slice(0, 300),
      })),
    });
  } catch (err) {
    console.error("Error handling user query:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" });
  }
};
