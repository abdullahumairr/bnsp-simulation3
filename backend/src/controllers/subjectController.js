const subjectService = require("../services/subjectService");

// Mendapatkan semua mata pelajaran
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Menambah mata pelajaran baru
exports.createSubject = async (req, res) => {
  try {
    const subject = await subjectService.createSubject(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE: Mengubah data mata pelajaran (Baru)
exports.updateSubject = async (req, res) => {
  try {
    const subject = await subjectService.updateSubject(req.params.id, req.body);
    res.json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Menghapus mata pelajaran
exports.deleteSubject = async (req, res) => {
  try {
    await subjectService.deleteSubject(req.params.id);
    res.json({ success: true, message: "Mata pelajaran berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
