import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';
import { NotFound } from './pages/NotFound';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (El login va aquí) */}
        <Route path="/login" element={<div className="p-10 text-white">Login en construcción...</div>} />
        
        {/* Rutas Privadas (Requieren token) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Renderizamos tu componente inteligente aquí */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Espacio reservado para el CP2 */}
            <Route path="/wanted" element={<div className="text-white">Se Busca (CP2 en construcción...)</div>} />
            
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;