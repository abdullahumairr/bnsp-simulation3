const userService = require("../services/userService");

// 1. FIX: getUsers sekarang mendukung filter berdasarkan role (?role=guru)
exports.getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    // Memanggil service dengan parameter search dan role
    const users = await userService.getAllUsers({ search, role });

    // Kembalikan response dengan struktur json data yang bersih
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ success: true, message: "User berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
