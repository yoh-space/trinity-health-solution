import { GoogleGenAI } from "@google/genai";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set.");
const resourcesDirectory = process.env.AI_RESOURCES_DIR ?? "C:\\dev\\trinity-health-solution\\AIReasources";
const ai = new GoogleGenAI({ apiKey });

const filesToUpload = [
  { file: "2.-healthy-diet-24-04-19.pdf", name: "Healthy Diet Guidelines" },
  { file: "Booklet_web.pdf", name: "Maternal Health Educational Booklet" },
  { file: "Guideline for Infant and Young Child Feeding in Emergencies.pdf", name: "Infant and Young Child Feeding in Emergencies" },
];

console.log("Uploading via files.upload first...");

for (const item of filesToUpload) {
  const filePath = resolve(resourcesDirectory, item.file);
  console.log(`\nTesting files.upload for: ${item.file}...`);
  try {
    const uploaded = await ai.files.upload({
      file: filePath,
      mimeType: "application/pdf",
    });
    console.log(`Uploaded: ${uploaded.name}, URI: ${uploaded.uri}`);
  } catch (err) {
    console.error(`files.upload failed for ${item.file}:`, err.message || err);
  }
}
