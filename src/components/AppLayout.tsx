import { Outlet, Link, useNavigate } from 'react-router-dom';

export const AppLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-800 p-4 shadow-md flex justify-between items-center border-b border-slate-700">
        <h1 className="text-2xl font-bold text-amber-500 tracking-wider">Log Pose Console</h1>
        <nav className="flex gap-6 items-center">
          <Link to="/dashboard" className="hover:text-amber-400 font-medium transition-colors">
            Dashboard
          </Link>
          <Link to="/wanted" className="hover:text-amber-400 font-medium transition-colors">
            Se Busca
          </Link>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-900/50 text-red-400 hover:bg-red-900 hover:text-red-100 rounded-md font-medium transition-colors"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};