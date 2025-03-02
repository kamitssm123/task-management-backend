import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sequelize } from '../models/Task.js';

dotenv.config();


export const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log("Token is ", token)
  const [blacklistedToken] = await sequelize.query(
    'SELECT token FROM blacklisted_tokens WHERE token = :token',
    { replacements: { token }, type: sequelize.QueryTypes.SELECT }
  );

  if (blacklistedToken) {
    return res.status(403).json({ message: 'Token is blacklisted. Please login again.' });
  }
  const secret_key = process.env.JWT_SECRET;
  if (token) {
    jwt.verify(token, secret_key, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

