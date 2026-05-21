const authService = require('../services/authService');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (role === 'admin') return res.status(400).json({ message: 'Tidak bisa mendaftar sebagai admin' });
    const user = await authService.registerUser(name, email, password, role);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
