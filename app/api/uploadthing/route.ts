import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/app/server/uploadthing";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
