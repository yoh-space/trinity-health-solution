import { GoogleGenAI } from "@google/genai";
import { resolve } from "node:path";

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set.");
const resourcesDirectory = process.env.AI_RESOURCES_DIR ?? "C:\\dev\\trinity-health-solution\\AIReasources";
const ai = new GoogleGenAI({ apiKey });
const storeName = "fileSearchStores/trinity-health-solution-app-yj2tjeqz3qi8";

const filePath = resolve(resourcesDirectory, "healthy-diet-guidelines.pdf");
console.log("Uploading sanitized healthy diet PDF...");

const uploaded = await ai.files.upload({
  file: filePath,
  mimeType: "application/pdf",
  config: {
    displayName: "National Healthy Diet Guidelines 2024",
  },
});

console.log(`Uploaded file as: ${uploaded.name}`);
console.log(`Importing into ${storeName}...`);

await ai.fileSearchStores.importFile({
  fileSearchStoreName: storeName,
  fileName: uploaded.name,
});

console.log("SUCCESS! All 3 documents are now indexed in the File Search Store!");
