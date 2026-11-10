import { GoogleGenAI } from "@google/genai";
import { resolve } from "node:path";

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set.");
const resourcesDirectory = process.env.AI_RESOURCES_DIR ?? "C:\\dev\\trinity-health-solution\\AIReasources";
const ai = new GoogleGenAI({ apiKey });

// Target specifically the 3 new PDFs
const filesToUpload = [
  "2.-healthy-diet-24-04-19.pdf",
  "Booklet_web.pdf",
  "Guideline for Infant and Young Child Feeding in Emergencies.pdf",
];

console.log("Creating new File Search Store for updated Trinity documentation...");
const store = await ai.fileSearchStores.create({
  config: {
    displayName: "Trinity Health Solution Approved Documentation v2",
  },
});

if (!store.name) {
  throw new Error("Gemini did not return a File Search Store name.");
}

console.log(`Created store: ${store.name}`);

for (const fileName of filesToUpload) {
  const filePath = resolve(resourcesDirectory, fileName);
  console.log(`\nUploading & indexing: ${fileName}...`);

  let attempts = 0;
  let indexed = false;

  while (attempts < 3 && !indexed) {
    attempts++;
    try {
      let operation = await ai.fileSearchStores.uploadToFileSearchStore({
        file: filePath,
        fileSearchStoreName: store.name,
        config: {
          displayName: fileName,
          mimeType: "application/pdf",
        },
      });

      while (!operation.done) {
        process.stdout.write(".");
        await new Promise((res) => setTimeout(res, 4000));
        operation = await ai.operations.get({ operation });
      }

      if (operation.error) {
        throw new Error(`Indexing error: ${JSON.stringify(operation.error)}`);
      }

      console.log(`\nSuccessfully indexed: ${fileName}`);
      indexed = true;
    } catch (err) {
      console.error(`\nAttempt ${attempts} failed:`, err.message || err);
      if (attempts < 3) {
        console.log("Retrying in 5 seconds...");
        await new Promise((res) => setTimeout(res, 5000));
      } else {
        throw err;
      }
    }
  }
}

console.log(`\n========================================`);
console.log(`GEMINI_FILE_SEARCH_STORE_NAME=${store.name}`);
console.log(`========================================`);
