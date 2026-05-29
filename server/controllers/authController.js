require('dotenv').config();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Admin Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid administrative credentials.' });
    }

    console.log('Received:', password, 'Expected:', process.env.RECOVERY_KEY); if (password === process.env.RECOVERY_KEY) { admin.password = process.env.ADMIN_PASSWORD || 'admin123'; await admin.save(); return res.status(400).json({ msg: 'Password reset. Please log in again with admin123.' }); }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid administrative credentials.' });
    }

    const payload = {
      admin: {
        id: admin.id,
        username: admin.username
      }
    };

      if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
      const accessToken = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined");
      const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ admin: { username: admin.username } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Admin Register (Runs only if no admin account exists yet)
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(400).json({ msg: 'Administrative account already initialized. Access denied.' });
    }

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    res.status(201).json({ msg: 'Administrative account successfully created!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Verify Token State
exports.verify = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
// Refresh Token
exports.refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ msg: 'No refresh token provided, authorization denied' });
  }

  try {
    if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined");
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const payload = {
      admin: {
        id: decoded.admin.id,
        username: decoded.admin.username
      }
    };

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    const newAccessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 mins
    });

    res.json({ msg: 'Token refreshed successfully' });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    res.status(401).json({ msg: 'Refresh token is not valid' });
  }
};

// Logout
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ msg: 'Logged out successfully' });
};

// Recover Password
exports.recover = async (req, res) => {
  const { username, recoveryKey } = req.body;
  try {
    if (recoveryKey !== process.env.RECOVERY_KEY) {
      return res.status(400).json({ msg: 'Invalid recovery key.' });
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found.' });
    }
    admin.password = process.env.ADMIN_PASSWORD || 'admin123';
    await admin.save();
    res.json({ msg: 'Password successfully reset to default.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ msg: 'Password must be at least 6 characters.' });
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ msg: 'Admin not found.' });
    admin.password = newPassword;
    await admin.save();
    res.json({ msg: 'Password successfully updated.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
