const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 메인 페이지
app.get("/", (req, res) => {
  res.send("Love AI Coach 서버가 잘 돌아가는 중입니다!");
});

// POST API 테스트
app.post("/api/coach", (req, res) => {
  console.log("요청 body:", req.body);
  res.json({
    ok: true,
    message: "API 테스트 성공! 여기서 나중에 AI 분석 붙일 거야.",
    received: req.body
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`)
);
