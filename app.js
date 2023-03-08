const express = require('express');
const cookieparser = require("cookie-parser")
const GlobalRouter = require('./routes/index.js');
const app = express();
const port = 3018;
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true}));
app.use("/", GlobalRouter);

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});


