/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../service/api";
import type { Attendance as AttendanceType, Subject } from "../types";

export default function Attendance() {
  const [attendances, setAttendances] = useState<AttendanceType[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { register, handleSubmit, reset } = useForm();

  const loadData = async () => {
    try {
      if (user.role === "siswa") {
        const res = await api.get("/attendances/siswa");
        setAttendances(res.data.data);
      } else {
        const res = await api.get("/attendances");
        setAttendances(res.data.data);
      }
      const subRes = await api.get("/subjects");
      setSubjects(subRes.data.data);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (data: { [key: string]: string }) => {
    try {
      await api.post("/attendances", data);
      toast.success("Absensi berhasil direkam");
      reset();
      loadData();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Gagal merekam absensi");
    }
  };

  return (
    <div className="space-y-8">
      {user.role === "siswa" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-xl">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Isi Presensi Mandiri
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Mata Pelajaran
                </label>
                <select
                  {...register("subject_id")}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Tanggal
                </label>
                <input
                  type="date"
                  {...register("date")}
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Status Kehadiran
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["Hadir", "Izin", "Sakit", "Alpha"].map((st) => (
                  <label
                    key={st}
                    className="border border-slate-200 rounded-xl p-2 text-center text-sm font-semibold text-slate-600 block cursor-pointer transition-all bg-slate-50 hover:bg-slate-100"
                  >
                    <input
                      type="radio"
                      value={st}
                      {...register("status", { required: true })}
                      className="mr-2 accent-indigo-600"
                    />
                    {st}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">
                Keterangan / Catatan
              </label>
              <input
                type="text"
                {...register("notes")}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700"
                placeholder="Hadir tepat waktu / Alasan izin..."
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-brand-primary text-black/40 font-bold rounded-xl text-sm"
            >
              Kirim Kehadiran
            </button>
          </form>
        </div>
      )}

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          {user.role === "siswa"
            ? "Riwayat Kehadiran Saya"
            : "Jurnal Absensi Siswa Keseluruhan"}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-600">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold text-slate-400 uppercase">
                <th className="py-3 px-4">Tanggal</th>
                {user.role !== "siswa" && (
                  <th className="py-3 px-4">Nama Siswa</th>
                )}
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendances.map((att) => (
                <tr
                  key={att.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-500">
                    {new Date(att.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {user.role !== "siswa" && (
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {att.student_name}
                    </td>
                  )}
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {att.subject_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                        att.status === "Hadir"
                          ? "bg-emerald-50 text-emerald-600"
                          : att.status === "Izin"
                            ? "bg-amber-50 text-amber-600"
                            : att.status === "Sakit"
                              ? "bg-rose-50 text-rose-600"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {att.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 italic text-xs">
                    {att.notes || "-"}
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
