import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export default function Dashboard() {
  const [turnos, setTurnos] = useState([]);
  const [barberoId, setBarberoId] = useState(null);

  useEffect(() => {
    // 1. Obtener el ID del barbero logueado
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setBarberoId(user?.id);
      cargarTurnosDelDia(user?.id);
    };

    fetchUser();

    // 2. Suscribirse a los cambios en tiempo real en la tabla "turnos"
    const canalTurnos = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'turnos' },
        (payload) => {
          console.log('¡Cambio detectado por el bot!', payload);
          // Si hay un cambio en la base de datos, recargamos la lista
          
          cargarTurnosDelDia(barberoId); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalTurnos); // Limpiamos al desmontar
    };
  }, [barberoId]);

  // Función para traer solo los turnos de HOY de ESTE barbero
  const cargarTurnosDelDia = async (id) => {
    if (!id) return;
    
    // Obtenemos la fecha de hoy para filtrar
    const hoy = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('turnos')
      .select('*')
      .eq('barbero_id', id)
      // .gte('fecha_hora', `${hoy}T00:00:00`) // Descomentar según tu estructura de base de datos
      .order('fecha_hora', { ascending: true }); // Ordenados por hora

    if (!error) setTurnos(data);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agenda de Hoy</h1>
        <button 
          onClick={() => supabase.auth.signOut()} 
          className="text-sm text-red-400 hover:text-red-300"
        >
          Salir
        </button>
      </header>

      <main className="flex flex-col gap-4">
        {turnos.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">No tenés turnos asignados por ahora.</p>
        ) : (
          turnos.map((turno) => (
            <div key={turno.id} className="flex items-center justify-between rounded-lg bg-gray-800 p-4 shadow border border-gray-700">
              <div>
                {/* Asumiendo que la columna se llama hora o fecha_hora */}
                <p className="text-lg font-bold text-blue-400">{turno.hora}</p>
                <p className="text-md font-semibold">{turno.nombre_cliente}</p>
                <p className="text-sm text-gray-400">{turno.servicio}</p>
              </div>
              {/* Espacio reservado para los botones de la Feature 3 */}
              <div className="text-right">
                <span className="rounded-full bg-yellow-600/20 px-2 py-1 text-xs font-bold text-yellow-500">
                  Pendiente
                </span>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}