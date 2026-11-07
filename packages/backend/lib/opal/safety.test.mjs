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

test("classifyOpalQuestion allows general public health and emergency guideline learning questions", () => {
  assert.equal(classifyOpalQuestion("How do I make drinking water safe at home?"), "safe");
  assert.equal(classifyOpalQuestion("What foods contain iron for pregnancy nutrition?"), "safe");
  assert.equal(classifyOpalQuestion("ለ 6 ወር ህጻን ምን አይነት ተጨማሪ ምግብ መስጠት አለብኝ?"), "safe");
  // The exact user query from Breastfeeding in Emergencies guideline
  assert.equal(
    classifyOpalQuestion(
      "What are some recommended practices for breastfeeding during an emergency when clean water, privacy, or regular food supplies may be limited?"
    ),
    "safe"
  );
  assert.equal(
    classifyOpalQuestion("What are the recommended practices for infant feeding in emergencies?"),
    "safe"
  );
  assert.equal(
    classifyOpalQuestion("What is the guidance on emergency contraception in family planning?"),
    "safe"
  );
  assert.equal(
    classifyOpalQuestion("What are the guidelines for managing maternal anemia?"),
    "safe"
  );
});

test("containsLikelyPersonalDetails detects sensitive health and contact disclosures without blocking normal maternal questions", () => {
  assert.equal(containsLikelyPersonalDetails("My name is Sara and my email is sara@example.com"), true);
  assert.equal(containsLikelyPersonalDetails("I weigh 75 kg and my height is 165 cm"), true);
  assert.equal(containsLikelyPersonalDetails("I am pregnant and have diabetes"), true);
  assert.equal(containsLikelyPersonalDetails("እርጉዝ ነኝ እና ደም ግፊት አለብኝ"), true);
  assert.equal(containsLikelyPersonalDetails("How do families boil water safely?"), false);
  // Mothers asking about their baby or breastfeeding should not be rejected
  assert.equal(containsLikelyPersonalDetails("What foods can I give my baby at 6 months?"), false);
  assert.equal(containsLikelyPersonalDetails("I am breastfeeding, what nutritious foods should I eat?"), false);
});
