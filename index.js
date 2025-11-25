// index.js — 완성본 (전체 복붙 OK)

import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

// CORS 허용
app.use(cors());

// JSON 파싱
app.use(express.json());

// Render의 public 폴더(static 파일) 사용
app.use(express.static("public"));

// 메인 GET 페이지
app.get("/", (req, res) => {
  res.send("Love AI Coach 서버가 잘 돌아가는 중입니다!");
});

// GPT 클라이언트 준비
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 연애 AI API
app.post("/api/coach", async (req, res) => {
  const { myMbti, partnerMbti, relationshipStage, goal, dialogText } = req.body;

  try {
    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: `
      너는 연애 상담 코치 AI야.
      나의 MBTI: ${myMbti}
      상대 MBTI: ${partnerMbti}
      단계: ${relationshipStage}
      목표: ${goal}
      대화내용: ${dialogText}

      위 내용을 기반으로 정서적 지지를 주면서 핵심적인 조언을 3문장으로 요약해서 말해줘.
      `,
    });

    const aiReply = completion.output[0].content[0].text;

    res.json({
      ok: true,
      reply: aiReply,
    });
  } catch (error) {
    console.error("GPT 오류:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Render에서 포트 환경 변수 사용
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
