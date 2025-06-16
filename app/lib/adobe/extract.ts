import {
  ServicePrincipalCredentials,
  PDFServices,
  MimeType,
  ExtractPDFParams,
  ExtractElementType,
  ExtractPDFJob,
  ExtractPDFResult,
  SDKError,
  ServiceUsageError,
  ServiceApiError
} from "@adobe/pdfservices-node-sdk";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extracts structured text data from a PDF file using Adobe PDF Services API.
 * @param {string} inputPath - Absolute or relative path to the input PDF file.
 * @returns {Promise<string>} - A Promise that resolves to the path of the extracted .zip file.
 */
export async function extractTextFromPDF(inputPath: string): Promise<string> {
  let readStream;
  try {
    // Setup credentials
    const credentials = new ServicePrincipalCredentials({
      clientId: process.env.PDF_SERVICES_CLIENT_ID!,
      clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET!
    });

    const pdfServices = new PDFServices({ credentials });

    // Upload input file
    readStream = fs.createReadStream(inputPath);
    const inputAsset = await pdfServices.upload({
      readStream,
      mimeType: MimeType.PDF
    });

    // Set extraction parameters
    const params = new ExtractPDFParams({
      elementsToExtract: [ExtractElementType.TEXT]
    });

    // Submit job
    const job = new ExtractPDFJob({ inputAsset, params });
    const pollingURL = await pdfServices.submit({ job });
    const response = await pdfServices.getJobResult({
      pollingURL,
      resultType: ExtractPDFResult
    });

    if(!response.result){
        return ""
    }
    // Get and save the result
    const resultAsset = response.result.resource;
    const streamAsset = await pdfServices.getContent({ asset: resultAsset });

    const outputFilePath = createOutputFilePath();
    const writeStream = fs.createWriteStream(outputFilePath);
    streamAsset.readStream.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on("finish", () => resolve(outputFilePath));
      writeStream.on("error", reject);
    });
  } catch (err) {
    if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
            console.log("Exception encountered while executing operation", err);
        } else {
            console.log("Exception encountered while executing operation", err);
        }
        throw err
  } finally {
    readStream?.destroy();
  }
}

// Generates a unique timestamped output file path
function createOutputFilePath() {
  const baseDir = path.join(__dirname, "output", "ExtractTextInfoFromPDF");
  fs.mkdirSync(baseDir, { recursive: true });

  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
  
  return path.join(baseDir, `extract-${timestamp}.zip`);
}
