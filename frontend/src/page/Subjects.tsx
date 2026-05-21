/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaEdit, FaTimes } from "react-icons/fa";
import api from "../service/api";
import type { Subject } from "../types";

interface Teacher {
  id: number;
  name: string;
  role: string;
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // STATE BARU: Untuk menyimpan status jika Admin sedang mengedit data
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { register, handleSubmit, reset, setValue } = useForm();

  // Ambil Data Mata Pelajaran
  const fetchSubjects = async () => {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data.data || res.data || []);
    } catch (error) {
      console.error("Gagal mengambil data mapel", error);
    }
  };

  // Ambil Data Guru untuk Dropdown
  const fetchTeachers = async () => {
    try {
      const res = await api.get("/users?role=guru");
      const rawData = res.data.data || res.data || [];
      if (Array.isArray(rawData)) {
        setTeachers(rawData as Teacher[]);
      }
    } catch (error) {
      console.error("Gagal mengambil data guru", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    if (user.role !== "siswa") {
      fetchTeachers();
    }
  }, []);

  // Handle Create & Update Data
  const onSubmit = async (data: { [key: string]: string }) => {
    try {
      if (isEditing && editingId) {
        // JIKA SEDANG EDIT: Panggil API PUT ke /subjects/:id
        await api.put(`/subjects/${editingId}`, data);
        toast.success("Mata pelajaran berhasil diperbarui");
      } else {
        // JIKA TAMBAH BARU: Panggil API POST
        await api.post("/subjects", data);
        toast.success("Mata pelajaran berhasil ditambah");
      }
      cancelEdit();
      fetchSubjects();
    } catch {
      toast.error(
        isEditing
          ? "Gagal memperbarui mata pelajaran"
          : "Gagal menambah mata pelajaran",
      );
    }
  };

  // Fungsi saat tombol Edit di tabel diklik
  const handleEditClick = (sub: Subject) => {
    setIsEditing(true);
    setEditingId(sub.id);

    // Set nilai form sesuai data mata pelajaran yang dipilih
    setValue("code", sub.code);
    setValue("name", sub.name);
    setValue("teacher_id", sub.teacher_id);
  };

  // Fungsi membatalkan mode edit
  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    reset();
    setValue("teacher_id", "");
  };

  // Handle Delete Data
  const handleDelete = async (id: number) => {
    if (confirm("Hapus mapel ini?")) {
      try {
        await api.delete(`/subjects/${id}`);
        toast.success("Berhasil dihapus");
        fetchSubjects();
      } catch {
        toast.error("Gagal menghapus mata pelajaran");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      {user.role !== "siswa" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {isEditing ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Kode Mapel
              </label>
              <input
                type="text"
                {...register("code")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500 text-slate-700"
                placeholder="WEB-101"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Nama Mata Pelajaran
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500 text-slate-700"
                placeholder="Pemrograman Web Lanjut"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Guru Pengampu
              </label>
              <select
                {...register("teacher_id", { required: true })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 cursor-pointer"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  -- Pilih Guru Pengampu --
                </option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className={`w-full py-2.5 ${isEditing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"} transition-colors text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2`}
              >
                {isEditing ? <FaEdit /> : <FaPlus />}{" "}
                {isEditing ? "Simpan Perubahan" : "Simpan"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 transition-colors text-slate-600 font-semibold rounded-xl text-sm flex items-center justify-center"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div
        className={`${
          user.role === "siswa" ? "lg:col-span-3" : "lg:col-span-2"
        } bg-white p-6 rounded-2xl border border-slate-100 shadow-sm`}
      >
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Daftar Mata Pelajaran Aktif
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Nama Pelajaran</th>
                <th className="py-3 px-4">Guru Pengampu</th>
                {user.role !== "siswa" && (
                  <th className="py-3 px-4 text-center">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subjects.map((sub) => (
                <tr
                  key={sub.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-600">
                    {sub.code}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {sub.name}
                  </td>
                  <td className="py-3.5 px-4">
                    {sub.teacher_name || `ID Guru: ${sub.teacher_id}`}
                  </td>
                  {user.role !== "siswa" && (
                    <td className="py-3.5 px-4 text-center flex justify-center gap-1">
                      {/* TOMBOL EDIT BARU (Hanya muncul jika bukan siswa) */}
                      <button
                        onClick={() => handleEditClick(sub)}
                        className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                        title="Edit Mapel"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        title="Hapus Mapel"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
