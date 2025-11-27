import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 분석 API
app.post("/analyze", async (req, res) => {
    try {
        const {
            userMBTI,
            partnerMBTI,
            traits,
            chatText,
            myMessage
        } = req.body;

        if (!chatText) {
            return res.status(400).json({ error: "chatText is required" });
        }

        const prompt = `
[사용자 MBTI]: ${userMBTI}
[상대 MBTI]: ${partnerMBTI}
[성향(1~5)]: ${traits}
[카톡 대화]: ${chatText}
[내가 하고 싶은 말]: ${myMessage}

아래 3가지를 출력하라:

1) 상대방의 의도 분석  
2) 내가 어떻게 대응해야 하는지 전략  
3) 지금 바로 보내면 좋은 추천 멘트 3개  
        `;

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        });

        const output = response.output_text;

        res.json({ result: output });

    } catch (error) {
        console.error("❌ 분석 오류:", error);
        res.status(500).json({ error: "AI 분석 실패" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
