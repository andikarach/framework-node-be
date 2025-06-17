const jwt = require('jsonwebtoken');
const logger = require('../helper/logger');

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (error) {
    logger.error('Error verifying token:', error);
    return null;
  }
};

const getTokenData = (req) =>{
  try {
    const token = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logger.error('Error verifying token:', error);
    return null;
  }
}

module.exports = { verifyToken,getTokenData };
