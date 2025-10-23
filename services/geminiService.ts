
import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { MoodBoardItem } from '../types';
import { ItemType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const itemPositions = [
  { top: '5%', left: '10%', transform: 'rotate(-4deg)', zIndex: 1, position: 'absolute' as const },
  { top: '15%', left: '45%', transform: 'rotate(2deg)', zIndex: 2, position: 'absolute' as const },
  { top: '40%', left: '65%', transform: 'rotate(5deg)', zIndex: 3, position: 'absolute' as const },
  { top: '55%', left: '5%', transform: 'rotate(3deg)', zIndex: 4, position: 'absolute' as const },
  { top: '2%', left: '70%', transform: 'rotate(-2deg)', zIndex: 5, position: 'absolute' as const },
  { top: '60%', left: '30%', transform: 'rotate(-5deg)', zIndex: 6, position: 'absolute' as const },
  { top: '30%', left: '20%', transform: 'rotate(1deg)', zIndex: 7, position: 'absolute' as const },
  { top: '70%', left: '60%', transform: 'rotate(4deg)', zIndex: 8, position: 'absolute' as const },
  { top: '25%', left: '5%', transform: 'rotate(-3deg)', zIndex: 9, position: 'absolute' as const },
  { top: '50%', left: '50%', transform: 'rotate(1deg)', zIndex: 10, position: 'absolute' as const },
];

export const analyzeTopic = async (topic: string): Promise<{ isClear: boolean; questions?: string[] }> => {
  const prompt = `
    You are an assistant helping a user build a visual mood board. Analyze the user's topic: "${topic}".
    If the topic is specific enough to create a rich, detailed mood board (e.g., 'mid-century modern living room', 'cyberpunk city at night'), respond with:
    { "isClear": true }
    If the topic is too vague (e.g., 'happiness', 'coding', 'food'), respond with 2-3 helpful, open-ended questions to get more context. Frame the questions to inspire creativity.
    Respond with:
    { "isClear": false, "questions": ["What style are you imagining?", "What is the primary mood?", "Are there any specific colors you're drawn to?"] }
    Your response must be a valid JSON object.
  `;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isClear: { type: Type.BOOLEAN },
          questions: { 
            type: Type.ARRAY,
            items: { type: Type.STRING },
            nullable: true 
          },
        },
        required: ['isClear']
      }
    }
  });

  return JSON.parse(response.text);
}


const generateTextAndPrompts = async (topic: string, answers: Record<string, string>) => {
  const clarificationContext = Object.entries(answers).map(([q, a]) => `- ${q}: ${a}`).join('\n');
  
  const prompt = `
    You are a creative director and aesthetic curator. For the given topic, "${topic}", generate a concept for a mood board.
    The user has provided the following clarifications:
    ${clarificationContext || "No clarifications provided."}

    Provide a response in JSON format. The JSON object should contain:
    1. "themeTitle": A short, evocative title for the mood board (e.g., "Metropolis Bloom").
    2. "inspirationalQuote": A brief, inspiring quote related to the topic.
    3. "colorPalette": An array of two color objects, each with a "name" (like a Pantone code, e.g., PANTONE 132 C) and a "hex" code.
    4. "imagePrompts": An array of 3 distinct, descriptive prompts for an AI image generator. The prompts should be photographic and artistic, focusing on mood, texture, and light. Make them very specific based on the topic and clarifications.
    5. "keyConcepts": An array of two short, key concepts or words related to the topic.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          themeTitle: { type: Type.STRING },
          inspirationalQuote: { type: Type.STRING },
          colorPalette: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { name: { type: Type.STRING }, hex: { type: Type.STRING } },
              required: ['name', 'hex']
            },
          },
          imagePrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['themeTitle', 'inspirationalQuote', 'colorPalette', 'imagePrompts', 'keyConcepts']
      },
    },
  });
  
  return JSON.parse(response.text);
};


const generateImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { responseModalities: [Modality.IMAGE] },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error('Image generation failed: No image data received.');
};

export const generateMoodBoardContent = async (
  topic: string, 
  answers: Record<string, string>, 
  onProgress: (message: string) => void
): Promise<MoodBoardItem[]> => {
  onProgress('Crafting your core concepts...');
  const textData = await generateTextAndPrompts(topic, answers);
  
  const imageUrls: string[] = [];
  for (let i = 0; i < textData.imagePrompts.length; i++) {
    onProgress(`Generating image ${i + 1} of ${textData.imagePrompts.length}...`);
    const url = await generateImage(textData.imagePrompts[i]);
    imageUrls.push(url);
  }

  onProgress('Assembling your mood board...');
  const items: MoodBoardItem[] = [];
  let itemIndex = 0;

  imageUrls.forEach((url, i) => {
    items.push({
      id: `img-${i}`, type: ItemType.Image, imageUrl: url, caption: textData.imagePrompts[i].split(',')[0],
      style: itemPositions[itemIndex++ % itemPositions.length],
    });
  });

  textData.colorPalette.forEach((color: { name: string, hex: string }, i: number) => {
    items.push({
      id: `color-${i}`, type: ItemType.Pantone, colorName: color.name, hex: color.hex,
      style: itemPositions[itemIndex++ % itemPositions.length],
    });
  });
  
  items.push({
    id: 'ticket-1', type: ItemType.Ticket, title: textData.themeTitle,
    details: { where: 'Curated by AI', when: 'Just now' },
    style: itemPositions[itemIndex++ % itemPositions.length],
  });

  items.push({
    id: 'quote-1', type: ItemType.Quote, text: textData.inspirationalQuote,
    style: itemPositions[itemIndex++ % itemPositions.length],
  })

  textData.keyConcepts.forEach((concept: string, i: number) => {
    items.push({
      id: `note-${i}`, type: ItemType.Note, text: concept,
      style: itemPositions[itemIndex++ % itemPositions.length],
    });
  });

  return items;
};


export const generateMoreItems = async (
  topic: string,
  currentItemCount: number,
  onProgress: (message: string) => void
): Promise<MoodBoardItem[]> => {
  onProgress('Brainstorming new ideas...');
  const prompt = `
    Based on the topic "${topic}", generate one new image prompt and one new short note for a mood board.
    The response should be a valid JSON object.
    Example response: { "imagePrompt": "A close up of rain drops on a green leaf, cinematic lighting", "note": "Natural textures" }
  `;
  const textResponse = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          imagePrompt: { type: Type.STRING },
          note: { type: Type.STRING },
        },
        required: ['imagePrompt', 'note']
      },
    },
  });
  const textData = JSON.parse(textResponse.text);

  onProgress('Generating new image...');
  const imageUrl = await generateImage(textData.imagePrompt);

  const newItems: MoodBoardItem[] = [];
  const timestamp = Date.now();
  
  newItems.push({
    id: `img-more-${timestamp}`,
    type: ItemType.Image,
    imageUrl: imageUrl,
    caption: textData.imagePrompt.split(',')[0],
    style: itemPositions[(currentItemCount) % itemPositions.length],
  });
  
  newItems.push({
    id: `note-more-${timestamp}`,
    type: ItemType.Note,
    text: textData.note,
    style: itemPositions[(currentItemCount + 1) % itemPositions.length],
  });
  
  return newItems;
};
