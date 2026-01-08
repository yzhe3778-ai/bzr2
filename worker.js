export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        if (url.pathname !== '/api/generate') {
            return new Response('Not Found', { status: 404 });
        }
        const body = await request.json();
        const DEEPSEEK_API_KEY = env.DEEPSEEK_API_KEY;
        const deepseekResp = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是一个专业的评语生成助手，只返回JSON格式的内容，不要有任何其他文字。' },
                    {
                        role: 'user', content: `
            你是一位极具创意和共情能力的金牌教师。请为学生 "${body.studentName}" 撰写一份独特的期末评语卡片内容。
            
            【核心信息】
            - 教师（发件人）：${body.teacherName}
            - 主题风格：${body.themeId}
            - 学生表现关键词：${body.keywords || '学习努力，乐于助人'}
            
            【撰写准则】
            1. 深度沉浸：语气、用词必须高度契合所选主题。
            2. 真诚鼓励：即使是幽默风格，也要传达对学生优点的认可和对未来的期许。
            3. 文案精炼：正文约150字左右，排版优美。
            
            请严格按照以下JSON格式返回，不要返回任何其他内容：
            {
              "badgeTitle": "创意奖项或勋章的名称",
              "content": "评语正文内容",
              "signOff": "老师的创意署名"
            }
          ` }
                ],
                response_format: { type: 'json_object' }
            })
        });
        const data = await deepseekResp.json();
        const jsonStr = data.choices?.[0]?.message?.content;
        if (!jsonStr) {
            return new Response(JSON.stringify({ error: 'AI 返回内容为空' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(jsonStr, { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
};
