const express = require("express");
const app = express();

// JSON 읽기
app.use(express.json());

// 메인 페이지 (테스트용)
app.get("/", (req, res) => {
  res.send("Love AI Coach 서버가 잘 돌아가는 중입니다!");
});

// 우리 연애/관계 API 테스트 버전
app.post("/api/coach", (req, res) => {
  console.log("요청 body:", req.body);
  res.json({
    ok: true,
    message: "API 테스트 성공! 여기서 나중에 AI 분석 붙일 거야.",
    received: req.body
  });
});

// Render에서 PORT 환경변수 사용
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
