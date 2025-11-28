import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ====== 🔥 정적 파일 서비스 설정 (이거 없어서 Cannot GET / 발생) ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));
// ====================================================================

// OpenAI client
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// API endpoint
app.post("/analyze", async (req, res) => {
    try {
        const { my_mbti, other_mbti, tendencies, chat_text, my_message } = req.body;

        if (!chat_text) {
            return res.status(400).json({ error: "chat_text is required" });
        }

        const prompt = `
[나의 MBTI]: ${my_mbti}
[상대 MBTI]: ${other_mbti}
[성향 점수]: ${tendencies}
[카톡 대화]: ${chat_text}
[내가 하고 싶은 말]: ${my_message}

아래 내용을 출력하라:
1) 상대방 의도
2) 나에게 필요한 전략
3) 추천 멘트 3개
        `;

        const response = await client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        });

        const output = response.output_text;

        // 원하는 형태로 분리해서 리턴
        res.json({
            intent: output,
            strategy: output,
            suggested_messages: ["메시지 1", "메시지 2", "메시지 3"]
        });

    } catch (error) {
        console.error("❌ 분석 오류:", error);
        res.status(500).json({ error: "AI 분석 오류" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
