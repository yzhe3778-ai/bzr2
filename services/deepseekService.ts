import { ThemeStyle, CommentData } from "../types";

// 本地开发时使用直接调用，生产环境通过 API 路由
const isDev = import.meta.env.DEV;
const DEEPSEEK_API_KEY = "sk-48719e0bcab64462b6d14b0ff70f4700";
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

export const generateComment = async (
    teacherName: string,
    studentName: string,
    themeId: ThemeStyle,
    keywords: string
): Promise<CommentData> => {
    // 生产环境使用 API 路由
    if (!isDev) {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teacherName, studentName, themeId, keywords })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("API Generation failed:", error);
            return getFallbackComment(studentName, teacherName, keywords);
        }
    }

    // 开发环境直接调用 DeepSeek
    const themeNames: Record<ThemeStyle, string> = {
        'classic': '经典教育风格（温馨、严谨、充满希望）',
        'zootopia': '疯狂动物城风格（强调多元、勇敢、寻找属于自己的位置）',
        'spongebob': '海绵宝宝风格（极其活泼、幽默、使用"比奇堡"、"蟹堡王"等比喻）',
        'demon-slayer': '鬼灭之刃风格（热血、坚韧、提到"呼吸流派"、"全集中"或"柱"的意志）',
        'minions': '小黄人风格（搞怪、快乐、简单直接的赞美）',
        'harry-potter': '哈利波特风格（神秘、优雅、提到"霍格沃茨"、"学院分"、"魔法咒语"）'
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
    
    请严格按照以下JSON格式返回，不要返回任何其他内容：
    {
      "badgeTitle": "创意奖项或勋章的名称（如：海王星守护者勋章、全集中努力奖）",
      "content": "评语正文内容",
      "signOff": "老师的创意署名（如：你的魔法导师 XX老师）"
    }
  `;

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "你是一个专业的评语生成助手，只返回JSON格式的内容，不要有任何其他文字。"
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const jsonStr = data.choices?.[0]?.message?.content;

        if (!jsonStr) throw new Error("AI 返回内容为空");

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("DeepSeek Generation failed:", error);
        return getFallbackComment(studentName, teacherName, keywords);
    }
};

function getFallbackComment(studentName: string, teacherName: string, keywords: string): CommentData {
    return {
        badgeTitle: "闪耀新星奖",
        content: `${studentName}同学，在这一学期中你展现出了令人惊喜的成长。正如你在"${keywords}"方面的表现一样，你总是能带给身边人力量。希望你继续保持热爱，奔赴山海！`,
        signOff: `爱你的${teacherName}`
    };
}
