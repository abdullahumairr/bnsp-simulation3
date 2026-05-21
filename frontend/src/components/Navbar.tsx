
export default function Navbar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  return (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between shadow-sm">
      <h2 className="text-xl font-bold text-slate-800">Selamat Datang Kembali 👋</h2>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <span className="block text-sm font-semibold text-slate-700">{user.name}</span>
          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-bold uppercase tracking-wider">{user.role}</span>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow">
          {user.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}