import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) alert(error.message);
    else navigate('/dashboard'); // Si loguea bien, lo mandamos a su agenda
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-sm rounded-lg bg-gray-800 p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Barber-Flow</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email del barbero" 
            className="rounded bg-gray-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="rounded bg-gray-700 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="mt-2 rounded bg-blue-600 p-3 font-bold text-white hover:bg-blue-700">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}