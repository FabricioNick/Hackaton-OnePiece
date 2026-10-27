import { useState, useEffect } from 'react';
import axios from 'axios';
import { CrewIndicators } from '../features/dashboard/CrewIndicators';

// Interfaces estrictas para evitar el uso de 'any' (Regla del Hackathon)
interface SummaryData {
  totalBounties?: number;
  rank?: string;
}

interface LogPoseData {
  status?: string;
}

interface DashboardState {
  summary: SummaryData;
  logPose: LogPoseData;
}

export const Dashboard = () => {
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      
      // Llamadas concurrentes a los dos endpoints exigidos
      const [summaryRes, logPoseRes] = await Promise.all([
        axios.get(`${baseURL}/dashboard/summary`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${baseURL}/log-pose`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setData({ summary: summaryRes.data, logPose: logPoseRes.data });
    } catch (err) {
      setError('Error al obtener los datos de la tripulación. La Marina bloqueó la señal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-amber-500 p-10 flex justify-center text-2xl font-bold animate-pulse">Cargando datos del Grand Line...</div>;
  }
  
  if (error) {
    return (
      <div className="bg-red-900/30 p-8 rounded-xl border border-red-700 text-center max-w-lg mx-auto mt-10">
        <p className="text-red-400 mb-6 text-lg">{error}</p>
        <button 
          onClick={fetchDashboardData} 
          className="px-6 py-2 bg-red-800 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
        >
          Reintentar Conexión
        </button>
      </div>
    );
  }

  if (!data) {
    return <div className="text-slate-400 p-10 text-center">No hay datos disponibles para esta tripulación.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-black text-slate-100 mb-8 border-b border-slate-700 pb-4">Panel de Control de la Guild</h2>
      <CrewIndicators 
        bountiesCollected={data.summary?.totalBounties || 0}
        crewRank={data.summary?.rank || 'Desconocido'}
        logPoseStatus={data.logPose?.status || 'Buscando magnetismo...'}
      />
    </div>
  );
};