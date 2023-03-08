const jwt = require("jsonwebtoken");
const {Users} = require("../models");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? "").split(" ");

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, "custom-secret-key");
    const user = await Users.findOne({where: {userId}});
    if(!user) {
      res.clearCookie("Authorization");
      return res.status(401).json({message: "토큰 사용자가 존재하지 않습니다."})
    }
    // User스키마에서 nickname 필드를 조회하여 가져온다.
    res.locals.user = user;
    next();
  } catch (err) {
    res.clearCookie("Authorization");
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};