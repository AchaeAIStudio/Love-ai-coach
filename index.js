const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

// CORS 허용
app.use(cors());

// JSON 파싱
app.use(express.json());

// OpenAI API 클라이언트 설정 (환경변수 읽음)
const client = new OpenAI({
  apiKey: process.env.AICoachTalk
});

// 메인 페이지
app.get("/", (req, res) => {
  res.send("Love AI Coach 서버가 잘 돌아가는 중입니다!");
});

// 연애 코치 API
app.post("/api/coach", async (req, res) => {
  try {
    console.log("요청 body:", req.body);

    const { myMbti, partnerMbti, relationshipStage, goal, dialogText } = req.body;

    const prompt = `
당신은 연애 전문 AI 코치입니다.
유저의 MBTI: ${myMbti}
상대의 MBTI: ${partnerMbti}
관계 단계: ${relationshipStage}
목표: ${goal}
최근 대화 내용: ${dialogText}

위 상황을 분석해서 "짧고 명확한 코칭 조언"을 3줄 이내로 제공하세요.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const aiText = completion.choices[0].message.content;

    res.json({
      ok: true,
      coach: aiText,
      received: req.body
    });

  } catch (error) {
    console.error("OpenAI API 오류:", error);
    res.status(500).json({
      ok: false,
      error: "GPT 호출 실패",
      detail: error.message
    });
  }
});

// Render 배포용 포트
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
