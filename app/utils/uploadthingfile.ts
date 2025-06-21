import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "../api/upload/core";

export const { useUploadThing } = generateReactHelpers<OurFileRouter>({
  url: "/api/upload",
});