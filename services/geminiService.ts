
import { GoogleGenAI } from "@google/genai";
import { PortfolioData, CATEGORY_LABELS } from "../types";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFinancialDiary = async (portfolio: PortfolioData): Promise<string> => {
  const ai = getGeminiClient();
  if (!ai) return "API Key missing. Please configure your environment.";

  const totalAssets = portfolio.positions.reduce((sum, p) => sum + p.amount, 0);
  const totalMonthlyGain = portfolio.positions.reduce((sum, p) => sum + p.monthlyGain, 0);

  const summary = portfolio.positions.map(p => 
    `- ${p.name} (${CATEGORY_LABELS[p.category]}): Amount ${p.amount}, Month Gain ${p.monthlyGain}, Total Gain ${p.totalGain}`
  ).join('\n');

  const prompt = `
    You are a helpful, encouraging personal finance assistant. 
    Write a short, "Monthly Financial Diary" entry (max 100 words) for this month based on this data.
    
    Data:
    Month: ${portfolio.date}
    Total Assets: ${totalAssets}
    Total Monthly Gain: ${totalMonthlyGain}
    Holdings:
    ${summary}

    Style: Warm, concise, and professional. Mention the biggest winner of the month.
    If the monthly result is positive, be celebratory. If negative, be reassuring and focus on long-term accumulation.
    Output straight text, no markdown headers.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate AI summary at this time.";
  }
};
