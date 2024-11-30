const jwt = require("jsonwebtoken");
const { ADMIN_SECRET } = require("./../config");

function adminMiddleware(req, res, next) {
  const token = req.headers.token;
  try {
    const decoded = jwt.verify(token, ADMIN_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({
      message: "You are not signed in"
    });
  }
}

module.exports = {
  adminMiddleware: adminMiddleware,
};
