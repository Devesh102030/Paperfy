import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    audioUploader: f({
        audio: {
            maxFileSize: "16MB",
            maxFileCount: 1
        }
    })
    .onUploadComplete(async ({ file, metadata }) => {
        console.log("Uploaded", file);
        console.log("Metadata", metadata);
        
        return { uploadedBy: "user", url: file.ufsUrl };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;



