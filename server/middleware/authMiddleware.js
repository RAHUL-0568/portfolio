const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header or cookie
  let token = req.header('Authorization');
  if (!token && req.cookies) {
    token = req.cookies.token;
  }

  // Handle Bearer prefix
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length).trimLeft();
  }

  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied. No token provided.' });
  }

  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is invalid or expired.' });
  }
};
