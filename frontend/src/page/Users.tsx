/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaEdit, FaTimes } from "react-icons/fa";
import api from "../service/api";

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);

  // STATE MODE EDIT
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data || res.data || []);
    } catch (error) {
      console.error("Gagal mengambil data users", error);
      toast.error("Gagal memuat data user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      if (isEditing && editingId) {
        if (!data.password) {
          delete data.password;
        }
        await api.put(`/users/${editingId}`, data);
        toast.success("Data user berhasil diperbarui");
      } else {
        if (!data.password) {
          toast.error("Password wajib diisi untuk user baru");
          return;
        }
        await api.post("/users", data);
        toast.success("User baru berhasil ditambahkan");
      }
      cancelEdit();
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    }
  };

  const handleEditClick = (user: UserType) => {
    setIsEditing(true);
    setEditingId(user.id);

    setValue("name", user.name);
    setValue("email", user.email);
    setValue("role", user.role);
    setValue("password", ""); 
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    reset();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        await api.delete(`/users/${id}`);
        toast.success("User berhasil dihapus");
        fetchUsers();
      } catch {
        toast.error("Gagal menghapus user");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      {/* FORM KIRI: TAMBAH / EDIT USER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          {isEditing ? "Edit Data User" : "Tambah User Baru"}
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500 text-slate-700"
              placeholder="Nama Lengkap"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500 text-slate-700"
              placeholder="nama@sekolah.sch.id"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Password{" "}
              {isEditing && (
                <span className="text-slate-400 font-normal">
                  (Kosongkan jika tidak diubah)
                </span>
              )}
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-500 text-slate-700"
              placeholder="••••••••"
              required={!isEditing}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">
              Role / Hak Akses
            </label>
            <select
              {...register("role")}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 cursor-pointer"
              required
            >
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className={`w-full py-2.5 ${isEditing ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"} transition-colors text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2`}
            >
              {isEditing ? <FaEdit /> : <FaPlus />}{" "}
              {isEditing ? "Simpan Perubahan" : "Simpan User"}
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

      {/* TABEL KANAN: DAFTAR USERS */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          Daftar Pengguna Sistem
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {u.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        u.role === "admin"
                          ? "bg-rose-50 text-rose-600"
                          : u.role === "guru"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center flex justify-center gap-1">
                    <button
                      onClick={() => handleEditClick(u)}
                      className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                      title="Hapus User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
