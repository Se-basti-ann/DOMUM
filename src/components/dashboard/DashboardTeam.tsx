import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  create_at?: string;
}

const DashboardUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState('Componente inicializado');

  const API_BASE_URL = 'https://domumarquitectura.com/assets';

  useEffect(() => {
    setDebugInfo('useEffect ejecutado');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setDebugInfo('Iniciando fetchUsers...');
      setLoading(true);
      setError('');
      
      setDebugInfo('Haciendo petición a la API...');
      
      const response = await fetch(`${API_BASE_URL}/API_AllUser.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setDebugInfo(`Respuesta recibida. Status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDebugInfo(`Datos parseados: ${JSON.stringify(data)}`);
      
      if (data.success && data.users) {
        setUsers(data.users);
        setDebugInfo(`${data.users.length} usuarios cargados correctamente`);
      } else {
        setError(data.error || 'Error loading users');
        setDebugInfo('Error en la respuesta de la API');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError('Error connecting to server: ' + errorMsg);
      setDebugInfo(`Error capturado: ${errorMsg}`);
    } finally {
      setLoading(false);
      setDebugInfo(prev => prev + ' - Loading finalizado');
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/API_DeleteUser.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.filter(user => user.id !== id));
        alert('Usuario eliminado correctamente');
      } else {
        setError(data.error || 'Error deleting user');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  // Renderizado simple y directo
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Usuarios</h1>
      
      {/* Información de debug siempre visible */}
      {/* <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded">
        <h3 className="font-bold">Estado:</h3>
        <p><strong>Loading:</strong> {loading.toString()}</p>
        <p><strong>Error:</strong> {error || 'Ninguno'}</p>
        <p><strong>Usuarios count:</strong> {users.length}</p>
        <p><strong>Debug:</strong> {debugInfo}</p>
      </div> */}

      {/* Estado de carga */}
      {loading && (
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded mb-4">
          <p>🔄 Cargando usuarios...</p>
        </div>
      )}

      {/* Mostrar errores */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Botón para agregar usuario */}
      <div className="mb-4">
        <Link
          to="/dashboard/usuarios/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Usuario
        </Link>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white border border-gray-300 rounded">
        {users.length === 0 && !loading ? (
          <div className="p-4 text-center text-gray-500">
            No hay usuarios para mostrar
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {/* <th className="border border-gray-300 px-4 py-2 text-left">ID</th> */}
                  <th className="border border-gray-300 px-4 py-2 text-left">Nombre</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id || index} className="hover:bg-gray-50">
                    {/* <td className="border border-gray-300 px-4 py-2">{user.id}</td> */}
                    <td className="border border-gray-300 px-4 py-2">{user.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.create_at ? new Date(user.create_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex gap-2">
                        <Link
                          to={`/dashboard/usuarios/${user.id}`}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar usuario"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Botón manual para testing */}
      <div className="mt-4">
        <button
          onClick={fetchUsers}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🔄 Cargar Usuarios Manualmente
        </button>
      </div>

      {/* Raw data para debugging */}
      {/* <div className="mt-4 p-4 bg-gray-100 border rounded">
        <h3 className="font-bold mb-2">Raw Users Data:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(users, null, 2)}
        </pre>
      </div> */}
    </div>
  );
};

export default DashboardUsers;