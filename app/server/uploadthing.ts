import {createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing();

export const ourFileRouter = {
    paperUpload: f({
        pdf: {
            maxFileSize: "8MB",
            maxFileCount: 1
        }
    })
    .onUploadComplete(async ({file, metadata}) => {
        console.log("Uploaded", file);
        console.log("Metadata",metadata);
        
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;