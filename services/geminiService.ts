
import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { MoodBoardItem } from '../types';
import { ItemType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const itemPositions = [
  { top: '5%', left: '10%', transform: 'rotate(-4deg)', zIndex: 1 },
  { top: '15%', left: '45%', transform: 'rotate(2deg)', zIndex: 2 },
  { top: '40%', left: '65%', transform: 'rotate(5deg)', zIndex: 3 },
  { top: '55%', left: '5%', transform: 'rotate(3deg)', zIndex: 4 },
  { top: '2%', left: '70%', transform: 'rotate(-2deg)', zIndex: 5 },
  { top: '60%', left: '30%', transform: 'rotate(-5deg)', zIndex: 6 },
  { top: '30%', left: '20%', transform: 'rotate(1deg)', zIndex: 7 },
  { top: '70%', left: '60%', transform: 'rotate(4deg)', zIndex: 8 },
];

const generateTextAndPrompts = async (topic: string) => {
  const prompt = `
    You are a creative director and aesthetic curator. For the given topic, "${topic}", generate a concept for a mood board.
    Provide a response in JSON format. The JSON object should contain:
    1. "themeTitle": A short, evocative title for the mood board (e.g., "Metropolis Bloom").
    2. "inspirationalQuote": A brief, inspiring quote related to the topic.
    3. "colorPalette": An array of two color objects, each with a "name" (like a Pantone code, e.g., PANTONE 132 C) and a "hex" code.
    4. "imagePrompts": An array of 3 distinct, descriptive prompts for an AI image generator. The prompts should be photographic and artistic, focusing on mood, texture, and light. Examples: "A minimalist, sun-drenched concrete patio with a single potted plant, warm afternoon light", "Close-up of a textured linen fabric in a neutral beige tone", "An abstract shot of a cozy armchair in a dimly lit room, creating a sense of peace".
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
              properties: {
                name: { type: Type.STRING },
                hex: { type: Type.STRING },
              },
              required: ['name', 'hex']
            },
          },
          imagePrompts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          keyConcepts: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
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
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }
  throw new Error('Image generation failed: No image data received.');
};

export const generateMoodBoardContent = async (topic: string): Promise<MoodBoardItem[]> => {
  const textData = await generateTextAndPrompts(topic);
  
  const imagePromises = textData.imagePrompts.map((prompt: string) => generateImage(prompt));
  const imageUrls = await Promise.all(imagePromises);

  const items: MoodBoardItem[] = [];
  let itemIndex = 0;

  // Add Images
  imageUrls.forEach((url, i) => {
    items.push({
      id: `img-${i}`,
      type: ItemType.Image,
      imageUrl: url,
      caption: textData.imagePrompts[i].split(',')[0], // Use first part of prompt as caption
      style: itemPositions[itemIndex++ % itemPositions.length],
    });
  });

  // Add Pantone Swatches
  textData.colorPalette.forEach((color: { name: string, hex: string }, i: number) => {
    items.push({
      id: `color-${i}`,
      type: ItemType.Pantone,
      colorName: color.name,
      hex: color.hex,
      style: itemPositions[itemIndex++ % itemPositions.length],
    });
  });
  
  // Add Ticket
  items.push({
    id: 'ticket-1',
    type: ItemType.Ticket,
    title: textData.themeTitle,
    details: {
      where: 'Curated by AI',
      when: 'Just now',
    },
    style: itemPositions[itemIndex++ % itemPositions.length],
  });

  // Add Quote
  items.push({
    id: 'quote-1',
    type: ItemType.Quote,
    text: textData.inspirationalQuote,
    style: itemPositions[itemIndex++ % itemPositions.length],
  })

  // Add Notes
  textData.keyConcepts.forEach((concept: string, i: number) => {
    items.push({
      id: `note-${i}`,
      type: ItemType.Note,
      text: concept,
      style: itemPositions[itemIndex++ % itemPositions.length],
    });
  });


  return items;
};
