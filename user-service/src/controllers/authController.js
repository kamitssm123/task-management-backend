import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, sequelize } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();


export const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password are required' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  
  try {
    const user = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
    res.status(201).json({user, token});
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Username, and password are required' });
  }
  
  try {
    const user = await User.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(400).json({ error: `Unable to log in ${error}` });
  }
};


export const logout = async (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(400).json({ message: 'No Token Provided' });

  try {
    await sequelize.query(
      'INSERT INTO blacklisted_tokens (token) VALUES (:token)',
      {
        replacements: { token },
        type: sequelize.QueryTypes.INSERT,
      }
    );
    res.status(200).json({ message: 'Logged Out Successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to Logout' });
    console.log(err);
  }
};
