import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserItem, SuggestedCoordinate } from "../types";
import { FASHION_MANUAL } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a fashion coordinate suggestion based on the user's item and the Fashion Manual.
 */
export const generateCoordinateSuggestion = async (item: UserItem): Promise<SuggestedCoordinate> => {
  const modelId = "gemini-3-flash-preview";
  
  const systemInstruction = `
    あなたはプロのファッションスタイリストです。
    提供された「ファッションマニュアル」の理論（シルエット、色合わせ、素材バランス）を厳密に適用し、
    ユーザーが持っているアイテムに最適なトータルコーディネートを提案してください。
    
    # ファッションマニュアル
    ${FASHION_MANUAL}
    
    # 制約
    - ユーザーのアイテムを必ず主役にしてください。
    - なぜそのコーディネートが良いのか、マニュアルの理論（Iライン、Aライン、Yライン、色相環など）を引用して論理的に説明してください。
    - 「色合わせの実践テクニック」に基づき、ユーザーのアイテムの「トーン」を考慮した提案を行ってください。
    - visualPromptは画像生成AIに入力するための英語のプロンプトです。モデルの服装、ポーズ、背景を含めて具体的に記述してください。
  `;

  const prompt = `
    ユーザーの所持アイテム情報:
    - カテゴリ: ${item.category}
    - カラー: ${item.color}
    - トーン: ${item.tone}
    - 属性: ${item.attribute}
    - デザイン: ${item.design}
    - 素材: ${item.material}
    - 身幅: ${item.width}
    - 着丈: ${item.length}
    - シルエット: ${item.silhouette}

    このアイテムを使った最高におしゃれなコーディネートを提案してください。
    特にトーンの分類（${item.tone}）に基づいた色合わせのテクニック（トーンずらし、トーン統一、セパレーションなど）を活用し、解説に含めてください。
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "コーディネートのタイトル" },
      description: { type: Type.STRING, description: "コーディネートの全体的な解説" },
      silhouetteTheory: { type: Type.STRING, description: "採用したシルエット理論とその理由" },
      colorTheory: { type: Type.STRING, description: "採用した配色理論（トーン理論含む）とその理由" },
      items: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "合わせる他のアイテムのリスト（具体的アイテム名）"
      },
      visualPrompt: { type: Type.STRING, description: "A detailed English description of the person wearing the full outfit for image generation. Include details about the clothing textures, fit, colors, and a neutral fashion studio background." }
    },
    required: ["title", "description", "silhouetteTheory", "colorTheory", "items", "visualPrompt"]
  };

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No suggestion generated");
  }

  return JSON.parse(text) as SuggestedCoordinate;
};

/**
 * Generates an image of the coordinate using the Nano Banana model.
 */
export const generateCoordinateImage = async (visualPrompt: string): Promise<string> => {
  // Using gemini-2.5-flash-image (Nano Banana) for image generation
  const modelId = "gemini-2.5-flash-image";

  const response = await ai.models.generateContent({
    model: modelId,
    contents: {
      parts: [
        { text: visualPrompt }
      ]
    },
    config: {
      // nano banana does not support responseSchema or mimeType configs for images in this way usually,
      // but strictly we just need the inline data in the response.
      // We rely on the model to return an image part.
    }
  });

  // Iterate parts to find the image
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  
  throw new Error("No image generated");
};
