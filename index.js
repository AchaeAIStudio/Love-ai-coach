import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// OpenAI 클라이언트 생성
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 분석 요청 엔드포인트
app.post("/analyze", async (req, res) => {
    try {
        const { userMBTI, partnerMBTI, traits, chatText, myMessage } = req.body;

        if (!chatText) {
            return res.status(400).json({ error: "chatText is required" });
        }

        console.log("📩 받은 요청 데이터:", req.body);

        const prompt = `
[사용자 MBTI]: ${userMBTI}
[상대 MBTI]: ${partnerMBTI}
[사용자 성향]: ${JSON.stringify(traits)}
[카톡 대화 내용]: ${chatText}
[내가 하고 싶은 말]: ${myMessage}

위 내용을 바탕으로 아래 3개를 출력하라.

1) 상대방 의도 분석
2) 나(사용자)에게 필요한 대화 전략
3) 추천 멘트 3개
        `;

        const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "당신은 연애 & 인간관계 코치 전문가입니다." },
                { role: "user", content: prompt }
            ]
        });

        const output = completion.choices[0].message.content;

        res.json({ result: output });
    } catch (error) {
        console.error("❌ 분석 중 오류:", error);
        res.status(500).json({ error: "AI 분석 실패" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
