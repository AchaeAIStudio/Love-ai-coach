import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI 클라이언트
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/analyze", async (req, res) => {
    try {
        const { my_mbti, other_mbti, chat_text, my_message, tendencies } = req.body;

        if (!my_mbti || !other_mbti || !chat_text) {
            return res.status(400).json({ error: "필수 항목 누락" });
        }

        const prompt = `
        [AI 관계 분석]
        내 MBTI: ${my_mbti}
        상대 MBTI: ${other_mbti}
        내 성향: ${tendencies.join(", ")}
        카톡 대화: ${chat_text}
        내가 하고 싶은 말: ${my_message}

        위 정보를 기반으로
        1) 상대의 의도
        2) 당신에게 필요한 전략
        3) 추천 멘트 3개
        JSON 형태로 출력해줘.
        `;

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        });

        const output = response.output[0].content[0].text();
        const json = JSON.parse(output);

        res.json(json);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI 분석 실패", detail: err.message });
    }
});

app.listen(10000, () => {
    console.log("Server running on port 10000");
});
