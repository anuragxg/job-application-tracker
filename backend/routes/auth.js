const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

function signToken(user) {
  return jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// Generates a 6-digit OTP, hashes it (never store OTPs in plain text, same idea
// as passwords), saves it on the user with a 10-minute expiry, and emails it.
async function generateAndSendOtp(user, subject, purposeText) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  await sendEmail(
    user.email,
    subject,
    `<p>Your ${purposeText} code is:</p><h2>${otp}</h2><p>This code expires in 10 minutes.</p>`
  );
}

// ---------- Register ----------
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email and password required' });
    }

    const existing = await User.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });
    if (existing) {
      return res.status(400).json({ error: 'Username or email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email: email.toLowerCase(), password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Login with password ----------
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid username or password' });

    res.json({ token: signToken(user), username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Forgot password: request OTP ----------
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    // Always respond the same way whether or not the email exists — this
    // stops someone from using this endpoint to discover registered emails.
    if (user) {
      await generateAndSendOtp(user, 'Password Reset', 'password reset');
    }
    res.json({ message: 'If that email is registered, a reset code has been sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Forgot password: submit OTP + new password ----------
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !user.otpHash || !user.otpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ error: 'Code has expired, request a new one' });
    }
    const otpMatches = await bcrypt.compare(otp, user.otpHash);
    if (!otpMatches) return res.status(400).json({ error: 'Incorrect code' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otpHash = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully — you can now log in.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Login via email OTP: request code ----------
router.post('/send-login-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (user) {
      await generateAndSendOtp(user, 'Your Login Code', 'login');
    }
    res.json({ message: 'If that email is registered, a login code has been sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Login via email OTP: verify code ----------
router.post('/verify-login-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user || !user.otpHash || !user.otpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired code' });
    }
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ error: 'Code has expired, request a new one' });
    }
    const otpMatches = await bcrypt.compare(otp, user.otpHash);
    if (!otpMatches) return res.status(400).json({ error: 'Incorrect code' });

    user.otpHash = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ token: signToken(user), username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
