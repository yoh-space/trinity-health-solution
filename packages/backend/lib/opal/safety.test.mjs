import assert from "node:assert/strict";
import { test } from "node:test";
import {
  classifyOpalQuestion,
  containsLikelyPersonalDetails,
  getOpalPrivacyResponse,
  getOpalSafetyResponse,
} from "./safety.ts";

test("classifyOpalQuestion detects urgent questions correctly in English and Amharic", () => {
  assert.equal(classifyOpalQuestion("I have heavy bleeding and severe pain"), "urgent");
  assert.equal(classifyOpalQuestion("አስቸኳይ እርዳታ እፈልጋለሁ መተንፈስ አልቻልኩም"), "urgent");
  assert.equal(classifyOpalQuestion("Can't breathe properly"), "urgent");
});

test("classifyOpalQuestion blocks clinical diagnosis and medicine questions", () => {
  assert.equal(classifyOpalQuestion("What medicine should I take for fever?"), "clinical");
  assert.equal(classifyOpalQuestion("Diagnose this rash on my arm"), "clinical");
  assert.equal(classifyOpalQuestion("ምን አይነት መድኃኒት መውሰድ አለብኝ?"), "clinical");
});

test("classifyOpalQuestion blocks personalized calorie calculations and diet prescriptions", () => {
  assert.equal(classifyOpalQuestion("Calculate my calories and BMR for weight loss"), "clinical");
  assert.equal(classifyOpalQuestion("Prescribe a diet plan for my body"), "clinical");
  assert.equal(classifyOpalQuestion("የካሎሪ መጠን አስላልኝ"), "clinical");
});

test("classifyOpalQuestion allows general public health learning questions", () => {
  assert.equal(classifyOpalQuestion("How do I make drinking water safe at home?"), "safe");
  assert.equal(classifyOpalQuestion("What foods contain iron for pregnancy nutrition?"), "safe");
  assert.equal(classifyOpalQuestion("ለ 6 ወር ህጻን ምን አይነት ተጨማሪ ምግብ መስጠት አለብኝ?"), "safe");
});

test("containsLikelyPersonalDetails detects sensitive health and contact disclosures", () => {
  assert.equal(containsLikelyPersonalDetails("My name is Sara and my email is sara@example.com"), true);
  assert.equal(containsLikelyPersonalDetails("I weigh 75 kg and my height is 165 cm"), true);
  assert.equal(containsLikelyPersonalDetails("I am pregnant and have diabetes"), true);
  assert.equal(containsLikelyPersonalDetails("እርጉዝ ነኝ እና ደም ግፊት አለብኝ"), true);
  assert.equal(containsLikelyPersonalDetails("How do families boil water safely?"), false);
});
