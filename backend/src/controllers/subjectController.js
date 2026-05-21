const subjectService = require('../services/subjectService');

exports.getSubjects = async (req, res) => {
  const data = await subjectService.getSubjects();
  res.json({ success: true, data });
};

exports.createSubject = async (req, res) => {
  const data = await subjectService.createSubject(req.body);
  res.status(201).json({ success: true, data });
};

exports.updateSubject = async (req, res) => {
  const data = await subjectService.updateSubject(req.params.id, req.body);
  res.json({ success: true, data });
};

exports.deleteSubject = async (req, res) => {
  await subjectService.deleteSubject(req.params.id);
  res.json({ success: true, message: 'Mapel dihapus' });
};