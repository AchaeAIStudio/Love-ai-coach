app.use(express.static("public"));


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 public 폴더 정적서빙
app.use(express.static("public"));

// OpenAI 클라이언트
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 분석 API
app.post("/analyze", async (req, res) => {
    try {
        const { my_mbti, other_mbti, tendencies, chat_text, my_message } = req.body;

        if (!chat_text) {
            return res.status(400).json({ error: "chat_text is required" });
        }

        console.log("📩 받은 요청:", req.body);

        const prompt = `
[당신의 MBTI]: ${my_mbti}
[상대 MBTI]: ${other_mbti}
[당신의 성향]: ${tendencies}
[카톡 대화]: ${chat_text}
[내가 하고 싶은 말]: ${my_message}

아래 항목을 JSON 형태로 출력하라.

{
  "intent": "...",
  "strategy": "...",
  "suggested_messages": ["...", "...", "..."]
}
`;

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        });

        const output = response.output_text;

        const jsonStart = output.indexOf("{");
        const jsonEnd = output.lastIndexOf("}");

        const cleanJson = output.slice(jsonStart, jsonEnd + 1);
        const resultData = JSON.parse(cleanJson);

        res.json(resultData);

    } catch (err) {
        console.error("❌ 서버 오류:", err);
        res.status(500).json({ error: "AI 분석 실패" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
