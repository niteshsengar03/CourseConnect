const jwt = require("jsonwebtoken");
const {USER_SECRET} = require("./../config");

function userMiddleware(req, res, next) {
  const token = req.headers.token;
  try {
  const decoded = jwt.verify(token, USER_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({
      message: "You are not signed in",
    });
  }
}

module.exports = {
  userMiddleware: userMiddleware,
};
