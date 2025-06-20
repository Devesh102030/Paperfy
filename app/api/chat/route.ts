import { CohereEmbeddings } from "@langchain/cohere";
import { NextRequest, NextResponse } from "next/server";
import { QdrantVectorStore } from "@langchain/qdrant";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyArmAmGCdWzihI5Q78TAsrN3H5T05X_aYY" });

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
      url: "https://c1ced9de-55f4-4ece-9fb5-12d97bf51073.us-west-2-0.aws.cloud.qdrant.io",
      apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.Qkz1tL1HMpcIgXkHc8WzP9jJZGd8xMdKt8VnpfecDKI",
      collectionName: `pdf-${paperId}`,
    });

    const retriever = vectorStore.asRetriever({ k: 3 });
    const results = await retriever.invoke(userQuery);
    const context = results.map((doc) => doc.pageContent).join("\n\n");

    console.log("Results: ",results);
    

    const prompt = `
    You are an expert research assistant. Answer the user's question using only the context provided from a scientific research paper.

    Context:
    ${context}

    User's Question:
    ${userQuery}

    Instructions:
    - Base your answer primarily on the context above.
    - If the exact answer is not directly found, use logical reasoning from the context to provide a meaningful, concise answer.
    - If the question is unclear or irrelevant to the context, say: "The information is not clearly available in the provided context."
    - Use formal academic language appropriate for a scientific setting.
    `;


    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
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
