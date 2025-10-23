import { GoogleGenAI } from "@google/genai";
import { User, Document } from '@prisma/client';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

type UserWithDocs = User & { documents: Document[] };

export const generateTenantSummary = async (user: UserWithDocs, documents: Document[]): Promise<string> => {
  const docList = documents.map(doc => `- ${doc.name} (${doc.type})`).join('\n');

  const prompt = `
    Generate a short, professional, and friendly tenant summary for a rental application.
    The summary should be about 2-3 sentences long.
    Use the following information:
    - Name: ${user.username}
    - Profession: ${user.profession || 'Not specified'}
    - Documents Provided:
    ${docList}

    Example: "Sarah, a 29-year-old marketing professional, is a reliable and tidy tenant with excellent references and proof of income. She is looking for a long-term rental in a quiet neighbourhood."

    Generate a new summary for ${user.username}:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating tenant summary:", error);
    throw new Error("Could not generate AI summary. Please try again later.");
  }
};

export const generateMatchExplanation = async (listingTitle: string, userPreferences: string): Promise<string> => {
    const prompt = `
        Explain in one friendly sentence why this property is a good match for the user.
        - Property: "${listingTitle}"
        - User's preferences: "${userPreferences}"

        Example: "This apartment in Ranelagh is a great fit because it matches your desired location and is within your budget for a 2-bedroom place."

        Generate a new explanation:
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating match explanation:", error);
        throw new Error("Could not generate AI explanation.");
    }
};
