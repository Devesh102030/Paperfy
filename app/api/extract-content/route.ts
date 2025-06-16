// // import { NextRequest, NextResponse } from "next/server";
// // import { extractTextFromPDF } from "@/app/lib/adobe/extract";
// // import prisma from "@/app/lib/db";
// // import { getCurrentUser } from "@/app/lib/serverAuth";
// // import path from "path";
// // import fs from "fs";

// // export async function POST() {
// // //   const body = await req.json();
// // //   const { pdfUrl, title } = body;

// //   const user = await getCurrentUser();
// //   if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// //   const filePath = path.join(process.cwd(), "temp", `${Date.now()}.pdf`);
// //   const response = await fetch(pdfUrl);
// //   const buffer = await response.arrayBuffer();
// //   fs.writeFileSync(filePath, Buffer.from(buffer));

// //   const extractedText = await extractTextFromPDF(filePath);
// //   fs.unlinkSync(filePath); 

// //   console.log(extractedText);

// // //   await prisma.paper.create({
// // //     data: {
// // //       title,
// // //       pdfUrl,
// // //       content: extractedText,
// // //       userId: user.id,
// // //     }
// // //   });

// //   return NextResponse.json({ success: true });
// // }
// import { NextRequest, NextResponse } from "next/server";
// import { extractTextFromPDF } from "@/app/lib/adobe/extract";
// import prisma from "@/app/lib/db";
// import { getCurrentUser } from "@/app/lib/serverAuth";
// import path from "path";
// import fs from "fs/promises";
// import { writeFileSync, unlinkSync, createReadStream } from "fs";
// import unzipper from "unzipper"

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get("file") as File;

//   if (!file || file.type !== "application/pdf") {
//     return NextResponse.json({ error: "Invalid file" }, { status: 400 });
//   }

//   const user = await getCurrentUser();
//   if (!user?.id) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const tempDir = path.join(process.cwd(), "temp");
//   await fs.mkdir(tempDir, { recursive: true });

//   const filePath = path.join(tempDir, `${Date.now()}-${file.name}`);
//   const buffer = Buffer.from(await file.arrayBuffer());
//   writeFileSync(filePath, buffer);

//   try {
//     const zipPath = await extractTextFromPDF(filePath);
//     unlinkSync(filePath); // Delete original uploaded file

//     const zipExtractDir = path.join(tempDir, `unzipped-${Date.now()}`);
//     await fs.mkdir(zipExtractDir, { recursive: true });

//     // Unzip the result into the zipExtractDir
//     await new Promise((resolve, reject) => {
//       createReadStream(zipPath)
//         .pipe(unzipper.Extract({ path: zipExtractDir }))
//         .on("close", resolve)
//         .on("error", reject);
//     });

//     unlinkSync(zipPath); // Delete the zip after extraction

//     // Read structuredData.json
//     const jsonPath = path.join(zipExtractDir, "structuredData.json");
//     const jsonData = await fs.readFile(jsonPath, "utf-8");
//     const extractedJSON = JSON.parse(jsonData);

//     // Optional: Save to DB
//     // await prisma.paper.create({
//     //   data: {
//     //     title: file.name,
//     //     pdfUrl: "", // URL if uploaded elsewhere
//     //     content: JSON.stringify(extractedJSON),
//     //     userId: user.id,
//     //   }
//     // });
//     //const finalData = groupData(extractedJSON);

//     return NextResponse.json({ success: true, extractedData: extractedJSON });
//   } catch (err) {
//     unlinkSync(filePath);
//     console.error("Extraction failed:", err);
//     return NextResponse.json({ error: "Extraction failed" }, { status: 500 });
//   }
// }

// function groupData(extractedData: any) {
//   const elementsByPath: Record<string, string[]> = {};

//   for (const el of extractedData.elements) {
//     const path = el.Path;
//     if (!elementsByPath[path]) elementsByPath[path] = [];
//     elementsByPath[path].push(el.Text);
//   }

//   const parsedSections = {
//     title: (elementsByPath["//Document/Title"] || []).join(" "),
//     abstract: (elementsByPath["//Document/Aside/P[2]"] || []).join(" "),
//     authors: (elementsByPath["//Document/Figure"] || []).join(" "),
//     correspondence: (elementsByPath["//Document/Footnote"] || []).join(" "),
//     journal: (elementsByPath["//Document/P[2]"] || []).join(" "),
//     doi: (elementsByPath["//Document/P"] || []).join(" "),
//     metadata: extractedData.extended_metadata,
//   };

//   return parsedSections;
// }


