import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 이것 없어서 / 에서 index.html 안 뜬거임
app.use(express.static("public"));

// OpenAI
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
너는 연애 코치야.
내 MBTI: ${my_mbti}
상대 MBTI: ${other_mbti}
카톡: ${chat_text}
내 말: ${my_message}
성향: ${tendencies.join(",")}

1) 상대의 의도
2) 전략
3) 추천 멘트 3개
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt
    });

    const text = response.output_text;

    res.json({
      intent: text,
      strategy: "분석 완료",
      suggested_messages: ["OK", "좋아", "고마워"].map(t => t)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버 오류" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

app.use(express.static("public"));
