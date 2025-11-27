import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ---------------------------
// 🚀 AI 분석 API
// ---------------------------
app.post("/api/coach", async (req, res) => {
  try {
    console.log("🔥 요청 수신됨:", req.body);

    const {
      userName,
      userMbti,
      userTraits,
      targetMbti,
      chatText,
      whatYouWantToSay,
    } = req.body;

    if (!chatText || !userMbti) {
      return res.status(400).json({ ok: false, error: "필수 데이터 누락" });
    }

    const prompt = `
당신은 대화 분석·관계 코칭 전문가입니다. 아래 데이터를 기반으로 분석하세요.

[사용자 정보]
이름: ${userName}
MBTI: ${userMbti}
성향 점수: ${JSON.stringify(userTraits)}

[상대방 정보]
사용자가 추정한 상대 MBTI: ${targetMbti}

[카톡 대화 내용]
${chatText}

[사용자가 하고 싶은 말]
${whatYouWantToSay}

---

1) 상대의 감정·의도 분석  
2) 사용자와 상대 MBTI 조합 해석  
3) 앞으로 대화 전략 3가지  
4) 추천 멘트 5개 (복사 편하게 줄바꿈 포함)  
5) 조심해야 하는 점 3가지  

한국어로, 카드 UI에 넣는다는 느낌으로 깔끔하게 작성.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content;
    return res.json({ ok: true, result });
  } catch (err) {
    console.error("❌ 서버 오류:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// 서버 실행
app.listen(10000, () => console.log("🚀 서버 실행 중 (10000번 포트)"));
