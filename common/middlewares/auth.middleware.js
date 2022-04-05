const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env.config');

checkAuthorization = (req, res, next) => {
  // console.log(req.cookies)
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'No Access token found',
    });
  }
  try {
    const decoded = jwt.verify(token, jwtSecret);
    // console.log(decoded)
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(403).json({
      status: 'Forbidden',
      message: 'Invalid or expired token',
    });
  }
};

module.exports = checkAuthorization;
