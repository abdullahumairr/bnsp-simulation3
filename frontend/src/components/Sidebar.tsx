import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaUserMd,
  FaClipboardCheck,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FaTachometerAlt />,
      roles: ["admin", "guru", "siswa"],
    },
    {
      name: "Kelola User",
      path: "/users",
      icon: <FaUserMd />,
      roles: ["admin"],
    },
    {
      name: "Mata Pelajaran",
      path: "/subjects",
      icon: <FaBook />,
      roles: ["admin", "guru", "siswa"],
    },
    {
      name: "Absensi",
      path: "/attendance",
      icon: <FaClipboardCheck />,
      roles: ["admin", "guru", "siswa"],
    },
  ];

  return (
    <div className="w-64 bg-brand-dark min-h-screen text-white flex flex-col justify-between shadow-xl">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-brand-primary rounded-xl flex items-center justify-center font-bold text-lg text-slate-400 shadow-lg shadow-indigo-500/30">
            A
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-400 tracking-wide">ATTENDIFY</h1>
            <p className="text-xs text-slate-400 capitalize">
              {user.role} Panel
            </p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map(
            (item) =>
              item.roles.includes(user.role) && (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "bg-brand-primary text-black/50 shadow-md shadow-indigo-600/20 font-semibold"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              ),
          )}
        </nav>
      </div>

      <div className="p-5 border-t border-slate-800">
        <div className="mb-4">
          <p className="text-sm font-medium text-slate-200 truncate">
            {user.name}
          </p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all duration-300 font-medium text-sm"
        >
          <FaSignOutAlt />
          Keluar Sistem
        </button>
      </div>
    </div>
  );
}
