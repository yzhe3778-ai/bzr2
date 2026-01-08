
import { GoogleGenAI, Type } from "@google/genai";
import { ThemeStyle, CommentData } from "../types";

export const generateComment = async (
  teacherName: string,
  studentName: string,
  themeId: ThemeStyle,
  keywords: string
): Promise<CommentData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const themeNames: Record<ThemeStyle, string> = {
    'classic': '经典教育风格（温馨、严谨、充满希望）',
    'zootopia': '疯狂动物城风格（强调多元、勇敢、寻找属于自己的位置）',
    'spongebob': '海绵宝宝风格（极其活泼、幽默、使用“比奇堡”、“蟹堡王”等比喻）',
    'demon-slayer': '鬼灭之刃风格（热血、坚韧、提到“呼吸流派”、“全集中”或“柱”的意志）',
    'minions': '小黄人风格（搞怪、快乐、简单直接的赞美）',
    'harry-potter': '哈利波特风格（神秘、优雅、提到“霍格沃茨”、“学院分”、“魔法咒语”）'
  };

  const prompt = `
    你是一位极具创意和共情能力的金牌教师。请为学生 "${studentName}" 撰写一份独特的期末评语卡片内容。
    
    【核心信息】
    - 教师（发件人）：${teacherName}
    - 主题风格：${themeNames[themeId] || themeId}
    - 学生表现关键词：${keywords || "学习努力，乐于助人"}
    
    【撰写准则】
    1. **深度沉浸**：语气、用词必须高度契合所选主题。不要只是简单提及，要像那个世界的角色在说话。
    2. **真诚鼓励**：即使是幽默风格，也要传达出对学生优点的认可和对未来的期许。
    3. **文案精炼**：正文约150字左右，排版优美。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            badgeTitle: { 
              type: Type.STRING, 
              description: "创意奖项或勋章的名称（如：海王星守护者勋章、全集中努力奖）" 
            },
            content: { 
              type: Type.STRING, 
              description: "评语正文内容" 
            },
            signOff: { 
              type: Type.STRING, 
              description: "老师的创意署名（如：你的魔法导师 XX老师）" 
            },
          },
          required: ["badgeTitle", "content", "signOff"],
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("AI 返回内容为空");
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Generation failed:", error);
    // 降级兜底方案
    return {
      badgeTitle: "闪耀新星奖",
      content: `${studentName}同学，在这一学期中你展现出了令人惊喜的成长。正如你在"${keywords}"方面的表现一样，你总是能带给身边人力量。希望你继续保持热爱，奔赴山海！`,
      signOff: `爱你的${teacherName}`
    };
  }
};
