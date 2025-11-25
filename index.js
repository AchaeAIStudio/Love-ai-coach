const express = require("express");
const cors = require("cors");
const app = express();

// CORS 허용
app.use(cors());

// JSON 파싱
app.use(express.json());

// 정적 파일 제공 (public 폴더)
app.use(express.static("public"));

// 메인 라우트
app.get("/", (req, res) => {
  res.send("Love AI Coach 서버가 잘 돌아가는 중입니다!");
});

// /api/coach 엔드포인트
app.post("/api/coach", (req, res) => {
  console.log("요청 body:", req.body);

  res.json({
    ok: true,
    message: "API 테스트 성공!",
    received: req.body
  });
});

// Render 제공 포트 사용
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
