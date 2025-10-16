import { GoogleGenAI } from "@google/genai";

const geminiAPIKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: geminiAPIKey });

/**
 * Generates content from a text prompt using the Gemini API.
 * @param {string} prompt The user's input prompt.
 * @returns {string} The text response from the model.
 */
export async function generateContent(template, templateHtml, input) {
  try {
    const prompt = templateHtml 
      ? `You are a text transformation assistant. Your task is to transform the user's input according to the template's style, structure, format, and VISUAL FORMATTING (fonts, sizes, spacing, bold, italic, etc.). 
        CRITICAL: Return the transformed text as HTML that preserves all the formatting from the template using Tailwind CSS utility classes:
        - Use Tailwind classes for font styles and sizes (text-xs, text-sm, text-base, text-lg, text-xl, text-2xl, etc.)
        - Use Tailwind classes for font weights (font-normal, font-semibold, font-bold)
        - Use Tailwind classes for text styling (italic, underline)
        - Use Tailwind classes for spacing (mb-2, mb-4, mt-6, p-4, space-y-4, etc.)
        - Use Tailwind classes for text colors (text-gray-700, text-blue-600, etc.)
        - Use Tailwind classes for backgrounds if needed (bg-white, bg-gray-50, etc.)
        - Use semantic HTML tags (h1, h2, h3, p, ul, ol, li, etc.)
        - DO NOT use inline styles
        - Return clean, semantic HTML with Tailwind classes only
        The HTML should be clean, use only Tailwind CSS classes, and match the visual appearance of the template.
        Template (with formatting):\n${templateHtml}\n\nPlain template text:\n${template}\n\nUser Input:\n${input}\n\nPlease transform the user input to match the template's style and formatting. Return HTML that preserves all visual formatting.
        Template:\n${template}\n\nUser Input:\n${input}\n\nPlease transform the user input to match the style and format of the template.`
      : `You are a text transformation assistant. You will receive a template and user input. Your task is to transform the user's input according to the template's style, structure, and format. Maintain the essence of the user's input while adapting it to match the template's characteristics including spacing, paragraph structure, and tone.`;


    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt,
    });
    console.log(response.text);
    return response.text
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "Sorry, I could not generate a response.";
  }
}