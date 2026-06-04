import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabase';
export default function ProtectedRoute({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
        });
    }, []);

    if (loading) return <div className="min-h-screen bg-gray-900 text-white p-4">Cargando...</div>;
    if (!session) return <Navigate to="/" replace />; // Lo patea al login si no está logueado

    return children;
}