import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is not set.");
const ai = new GoogleGenAI({ apiKey });

const storeName = "fileSearchStores/trinity-health-solution-app-yj2tjeqz3qi8";

const uploadedFiles = [
  "files/u3wod6wy9pda",
  "files/u7h7ci6txel4",
  "files/hq9v7uooo433",
];

console.log("Checking methods on ai.fileSearchStores...");
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(ai.fileSearchStores)));

for (const file of uploadedFiles) {
  try {
    console.log(`Adding ${file} to store ${storeName}...`);
    // Check if there is an import or add file method
    if (typeof ai.fileSearchStores.importFile === "function") {
      await ai.fileSearchStores.importFile({
        fileSearchStoreName: storeName,
        fileName: file,
      });
      console.log(`Imported ${file}`);
    }
  } catch (err) {
    console.error(`Error adding ${file}:`, err.message || err);
  }
}
