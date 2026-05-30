import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
    useEffect(() => {
  const probarConexion = async () => {
    const { data, error } = await supabase.from('sucursales').select('*');
    if (error) {
      console.error("❌ Error de conexión con Supabase:", error.message);
    } else {
      console.log("🚀 ¡Conexión exitosa! Datos de sucursales:", data);
    }
  };
  probarConexion();
}, []);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold text-green-400">Agenda del Día</h1>
            <p className="text-gray-400 mt-2">Aquí irán los turnos en tiempo real...</p>
        </div>
  );
}