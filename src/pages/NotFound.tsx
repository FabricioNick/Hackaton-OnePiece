import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
      <h1 className="text-7xl font-black text-red-500 mb-4 tracking-tighter">404</h1>
      <p className="text-2xl mb-8 text-slate-400">Esta zona del Grand Line no existe.</p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-900 rounded-lg font-bold transition-colors"
      >
        Volver al Log Pose
      </Link>
    </div>
  );
};