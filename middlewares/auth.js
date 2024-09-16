const { validateToken } = require("../utils/authentication");

function checkForAuth(cookieName) {
  return (req, res, next) => {
    const tokenCookieName = req.cookies[cookieName];
    if (!tokenCookieName) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieName);
      req.user = userPayload;
    } catch (err) {}
    return next();
  };
}

module.exports = { checkForAuth };
