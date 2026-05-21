export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "guru" | "siswa";
}

export interface Subject {
  id: number;
  name: string;
  code: string;
  teacher_id: number;
  teacher_name?: string;
}

export interface Attendance {
  id: number;
  student_id: number;
  student_name?: string;
  subject_id: number;
  subject_name?: string;
  date: string;
  status: "Hadir" | "Izin" | "Sakit" | "Alpha";
  notes: string;
}
