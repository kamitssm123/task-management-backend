import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  const secret_key = process.env.JWT_SECRET;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, secret_key, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
