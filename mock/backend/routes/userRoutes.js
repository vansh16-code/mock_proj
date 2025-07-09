import { Router } from 'express';
const router = Router();
import User from '../models/User.js';
// POST /register
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // or 'bcrypt'


router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, phone, password: hashedPassword });
  await user.save();

  // Create token
  const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1d' });

  // Send as cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // set true in production
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.status(201).json({ message: 'User registered successfully', user: { name, email, phone } });
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Incorrect password' });

  const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1d' });

  // Send token as HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // set to true in production (with HTTPS)
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: 'Login successful', user: { name: user.name, email: user.email } });
});
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
});
export default router;