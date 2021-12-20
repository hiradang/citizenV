const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const accessToken = req.headers.authorization;
  console.log('cookie' + req.cookie)
    console.log(accessToken)
  if (!accessToken || accessToken === 'null') return res.json({ error: "User not logged in!" });

  try {
    const validToken = verify(accessToken, "importantsecret");

    if (validToken) {
      return next();
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };