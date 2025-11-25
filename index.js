// index.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(cors());

// 1) 정적 파일 (public 폴더)
app.use(express.static("public"));

// 2) OpenAI 클라이언트 준비
const client = new OpenAI({
  apiKey: process.env.AICoachTalk
});

// 3) 테스트용 GET 홈
app.get("/", (req, res) => {
  res.send("Love AI Coach 서버 준비 완료!");
});

// 4) GPT 호출 API
app.post("/api/coach", async (req, res) => {
  try {
    const { myMbti, partnerMbti, relationshipStage, goal, dialogText } = req.body;

    console.log("👉 서버 받은 데이터:", req.body);

    // OpenAI GPT 호출
    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
당신은 연애 코치 AI입니다.
유저 MBTI: ${myMbti}
상대 MBTI: ${partnerMbti}
관계 단계: ${relationshipStage}
목표: ${goal}
상황: ${dialogText}

위 정보를 바탕으로 친절하고 구체적인 연애 조언을 5문장 이내로 해주세요.
`
    });

    const aiMessage = completion.output[0].content[0].text;

    res.json({
      ok: true,
      message: "GPT 응답 성공",
      aiMessage
    });

  } catch (error) {
    console.error("❌ GPT 오류:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// 5) 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 서버 실행 중: ${PORT}`));
