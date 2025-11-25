app.use(express.static("public"));


const express = require("express");
const cors = require("cors");
const app = express();

// CORS 허용
app.use(cors());

// JSON 읽기
app.use(express.json());

// 메인 페이지
app.get("/", (req, res) => {
  res.send("Love AI Coach 서버가 잘 돌아가는 중입니다!");
});

// 연애코치 테스트용 API
app.post("/api/coach", (req, res) => {
  console.log("요청 body:", req.body);
  res.json({
    ok: true,
    message: "API 테스트 성공! 이제 GPT 붙이면 끝!",
    received: req.body
  });
});

// Render 포트
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
