import { GoogleGenAI } from "@google/genai";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) {
  throw new Error("Set GEMINI_API_KEY before uploading AI resources.");
}

const scriptDirectory = fileURLToPath(new URL(".", import.meta.url));
const resourcesDirectory = join(scriptDirectory, "../../../AIReasources");
const ai = new GoogleGenAI({ apiKey });

const store = await ai.fileSearchStores.create({
  config: {
    displayName: "Trinity Health Solution approved AI resources",
  },
});

if (!store.name) {
  throw new Error("Gemini did not return a File Search Store name.");
}

const files = (await readdir(resourcesDirectory))
  .filter((fileName) => fileName.toLowerCase().endsWith(".pdf"))
  .sort();

if (!files.length) {
  throw new Error(`No PDF files found in ${resourcesDirectory}.`);
}

for (const fileName of files) {
  let operation = await ai.fileSearchStores.uploadToFileSearchStore({
    file: join(resourcesDirectory, fileName),
    fileSearchStoreName: store.name,
    config: {
      displayName: fileName,
      mimeType: "application/pdf",
    },
  });

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    operation = await ai.operations.get({ operation });
  }

  if (operation.error) {
    throw new Error(`Failed to index ${fileName}: ${JSON.stringify(operation.error)}`);
  }

  console.log(`Indexed ${fileName}`);
}

console.log(`GEMINI_FILE_SEARCH_STORE_NAME=${store.name}`);
