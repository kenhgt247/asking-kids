
import { GoogleGenAI, Type } from "@google/genai";

// QUAN TRỌNG: Dùng NEXT_PUBLIC_ cho biến môi trường phía client
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = 'gemini-2.5-flash';

// --- Speaking Game Service ---

export const generateSpeakingWord = async (): Promise<{ word: string; hint: string }> => {
  if (!apiKey) return { word: "Apple", hint: "Quả táo (Thiếu API Key)" };
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Generate a single simple English word suitable for a 4-6 year old to practice pronouncing (e.g., Apple, Dog, Ball). Also provide a very short, simple hint in Vietnamese.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            hint: { type: Type.STRING },
          },
          required: ["word", "hint"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating word:", error);
    return { word: "Apple", hint: "Quả táo" };
  }
};

export const evaluatePronunciation = async (targetWord: string, spokenText: string): Promise<{ isCorrect: boolean; feedback: string }> => {
  if (!apiKey) return { isCorrect: true, feedback: "Giỏi lắm! (Chế độ offline)" };
  try {
    const prompt = `
      Target word: "${targetWord}"
      Child said: "${spokenText}"
      
      Evaluate if the child said the word correctly (allow for minor variations). 
      Return JSON. 
      Feedback should be encouraging and in Vietnamese.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
          },
          required: ["isCorrect", "feedback"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error evaluating:", error);
    const isMatch = spokenText.toLowerCase().includes(targetWord.toLowerCase());
    return { 
      isCorrect: isMatch, 
      feedback: isMatch ? "Giỏi lắm! Con nói đúng rồi." : "Gần đúng rồi, con thử lại nhé!" 
    };
  }
};

// --- Blog Service ---

export const generateBlogArticle = async (topic: string): Promise<string> => {
  if (!apiKey) return "Vui lòng cấu hình API Key để tạo nội dung tự động.";
  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `Write a short, helpful blog post (about 300 words) for parents about: "${topic}". 
      Use Markdown formatting. 
      Tone: Warm, encouraging, expert. 
      Language: Vietnamese.`,
    });
    return response.text || "Xin lỗi, hiện tại không thể tải bài viết.";
  } catch (error) {
    console.error("Error generating blog:", error);
    return "Đang cập nhật nội dung...";
  }
};

// --- Q&A Service ---

export const askAIExpert = async (question: string, category: string): Promise<string> => {
  if (!apiKey) return "Chức năng hỏi AI đang bảo trì (Thiếu API Key).";
  try {
    const prompt = `
      You are a friendly and knowledgeable expert on the Asking Kids platform.
      Category: ${category}
      User Question: "${question}"
      
      Please provide a helpful, concise, and encouraging answer in Vietnamese. 
      If the question is about code or math, explain it simply.
      If it's about parenting, be empathetic.
      Keep it under 150 words.
      Format with simple Markdown (bold key points).
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    
    return response.text || "Hệ thống đang bận, vui lòng thử lại sau.";
  } catch (error) {
    console.error("Error answering question:", error);
    return "Xin lỗi, chuyên gia AI đang tạm nghỉ. Bạn hãy chờ cộng đồng trả lời nhé!";
  }
};

export const generateDiscussionQuestion = async (category: string): Promise<{ title: string; content: string; tags: string[] }> => {
  if (!apiKey) return { title: "Gợi ý câu hỏi", content: "Hãy nhập nội dung bạn muốn hỏi...", tags: ["Thảo luận"] };
  try {
    const prompt = `
      Generate an engaging, open-ended question for a community of Vietnamese parents and students.
      Category: ${category === 'ALL' ? 'General Education & Parenting' : category}.
      
      The question should encourage debate, sharing of experiences, or seeking advice.
      Language: Vietnamese.
      Return JSON.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "content", "tags"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating question:", error);
    return {
      title: "Làm sao để giúp con tự tin hơn?",
      content: "Bé nhà mình khá nhút nhát khi ra đám đông. Các mẹ có kinh nghiệm gì chia sẻ giúp mình với!",
      tags: ["Kỹ năng sống", "Tâm lý"]
    };
  }
};
