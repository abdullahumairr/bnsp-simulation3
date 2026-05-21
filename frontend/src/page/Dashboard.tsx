import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FaUserShield, FaGraduationCap, FaCheckCircle } from "react-icons/fa";
import api from "../service/api";

// 1. Definisikan Interface agar TypeScript tahu bentuk data dari API Backend
interface ChartItem {
  status: "Hadir" | "Izin" | "Sakit" | "Alpha";
  count: number;
}

interface DashboardStats {
  totalUsers: number;
  totalSubjects: number;
  totalAttendances: number;
  chart: ChartItem[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#64748b"];

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => setStats(res.data.data))
      .catch(() => {});
  }, []);

  if (!stats)
    return (
      <div className="p-8 text-slate-500">Memuat analisis dashboard...</div>
    );

  const cardItems = [
    {
      label: "Total Pengguna",
      val: stats.totalUsers,
      icon: <FaUserShield className="text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      label: "Total Mata Pelajaran",
      val: stats.totalSubjects,
      icon: <FaGraduationCap className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Total Riwayat Absen",
      val: stats.totalAttendances,
      icon: <FaCheckCircle className="text-amber-600" />,
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardItems.map((c, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-slate-400">{c.label}</p>
              <h3 className="text-3xl font-black text-slate-700 mt-1">
                {c.val}
              </h3>
            </div>
            <div className={`p-4 ${c.bg} rounded-2xl text-xl`}>{c.icon}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          Grafik Rasio Kehadiran
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {stats.chart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
