export type OpalLanguage = "en" | "am";

export type OpalSource = {
  id: string;
  title: string;
  titleAm: string;
};

export function getOpalErrorMessage(
  error: unknown,
  language: OpalLanguage,
): string {
  const message = error instanceof Error ? error.message : String(error);

  if (
    message.includes("OPAL_NOT_CONFIGURED") ||
    message.includes("OPAL_INVALID_API_KEY")
  ) {
    return language === "am"
      ? "የኦፓል የAI አገልግሎት በትክክል አልተዋቀረም። እባክዎ ድጋፍን ያነጋግሩ።"
      : "Opal's AI service is not configured correctly. Please contact support.";
  }

  if (
    message.includes("OPAL_RATE_LIMIT") ||
    message.includes("OPAL_PROVIDER_UNAVAILABLE")
  ) {
    return language === "am"
      ? "የኦፓል አገልግሎት ለጊዜው አይገኝም። እባክዎ ቆይተው እንደገና ይሞክሩ።"
      : "Opal is temporarily unavailable. Please try again in a moment.";
  }

  if (message.includes("OPAL_QUESTION_TOO_LONG")) {
    return language === "am"
      ? "ጥያቄዎ ከ1,000 ቁምፊዎች መብለጥ የለበትም።"
      : "Please keep your question under 1,000 characters.";
  }

  return language === "am"
    ? "ኦፓል አሁን መልስ መስጠት አልቻለም። እባክዎ እንደገና ይሞክሩ።"
    : "Opal couldn't answer right now. Please try again.";
}
