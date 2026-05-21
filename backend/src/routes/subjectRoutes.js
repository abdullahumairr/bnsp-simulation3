const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subjectController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

// Semua user terautentikasi (Admin, Guru, Siswa) bisa melihat mata pelajaran
router.get("/", subjectController.getSubjects);

// Hanya Admin yang bisa menambah, mengubah, dan menghapus mata pelajaran
router.post("/", authorize('admin', 'guru'), subjectController.createSubject);
router.put("/:id", authorize('admin', 'guru'), subjectController.updateSubject); // Fitur Edit Mapel
router.delete("/:id", authorize('admin', 'guru'), subjectController.deleteSubject);

module.exports = router;
