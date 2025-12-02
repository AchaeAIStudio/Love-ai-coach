import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// public 폴더 정적 서빙
app.use(express.static(path.join(__dirname, "public")));

// OpenAI 클라이언트
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 분석 API
app.post("/analyze", async (req, res) => {
  try {
    const {
      userMBTI,
      partnerMBTI,
      chatText,
      myMessage,
      traits
    } = req.body;

    if (!userMBTI || !partnerMBTI || !chatText) {
      return res.status(400).json({ error: "필수 항목 누락" });
    }

    const prompt = `
너는 연애 코치야.
내 MBTI: ${userMBTI}
상대 MBTI: ${partnerMBTI}
카톡: ${chatText}
내 말: ${myMessage}
성향: ${traits.join(",")}

다음 항목을 출력해라:

1) 상대의 의도
2) 전략
3) 추천 멘트 3개
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = response.output_text;

    res.json({
      result: text
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  }
});

// 루트 경로에서 index.html 반환
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
