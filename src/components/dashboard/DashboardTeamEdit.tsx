import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

const DashboardUserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [user, setUser] = useState<User>({
    id: '',
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // URL base de tu API
  const API_BASE_URL = 'https://domumarquitectura.com/assets';

  useEffect(() => {
    console.log('DashboardUserEdit mounted');
    console.log('ID from params:', id);
    console.log('isEditing:', isEditing);
    
    if (id) {
      setDebugInfo(`Cargando usuario con ID: ${id}`);
      loadUser();
    } else {
      setDebugInfo('Modo creación - no se carga usuario');
    }
  }, [id]);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError('');
      setDebugInfo(`Enviando petición para usuario ID: ${id}`);
      
      console.log('Fetching user with ID:', id);
      console.log('URL:', `${API_BASE_URL}/API_GetUser.php`);
      
      const response = await fetch(`${API_BASE_URL}/API_GetUser.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      console.log('Response status:', response.status);
      setDebugInfo(`Respuesta recibida. Status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      setDebugInfo(`Datos recibidos: ${JSON.stringify(data)}`);
      
      if (data.success) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          password: '' // No cargar la contraseña por seguridad
        });
        setDebugInfo('Usuario cargado correctamente');
        console.log('User loaded successfully:', data.user);
      } else {
        setError(data.error || 'Error loading user');
        setDebugInfo(`Error de API: ${data.error}`);
        console.error('API Error:', data.error);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError('Error connecting to server: ' + errorMsg);
      setDebugInfo(`Error capturado: ${errorMsg}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setDebugInfo('Iniciando envío del formulario...');

    console.log('Form submitted with data:', user);

    // Validaciones
    if (!user.name || !user.email) {
      setError('Nombre y email son obligatorios');
      setLoading(false);
      return;
    }

    if (!isEditing && !user.password) {
      setError('La contraseña es obligatoria para nuevos usuarios');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isEditing ? 'API_UpdateUser.php' : 'API_Register.php';
      const payload = isEditing 
        ? { id, name: user.name, email: user.email, ...(user.password && { password: user.password }) }
        : { name: user.name, email: user.email, password: user.password };

      console.log('Sending to endpoint:', endpoint);
      console.log('Payload:', payload);
      setDebugInfo(`Enviando a ${endpoint} con payload: ${JSON.stringify(payload)}`);

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Submit response:', data);
      setDebugInfo(`Respuesta: ${JSON.stringify(data)}`);

      if (data.success) {
        setDebugInfo('Usuario guardado exitosamente, redirigiendo...');
        console.log('User saved successfully, redirecting...');
        navigate('/dashboard/usuarios');
      } else {
        setError(data.error || 'Error saving user');
        console.error('Save error:', data.error);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError('Error connecting to server: ' + errorMsg);
      setDebugInfo(`Error: ${errorMsg}`);
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');
    setDebugInfo(`Eliminando usuario ID: ${id}`);

    try {
      const response = await fetch(`${API_BASE_URL}/API_DeleteUser.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      setDebugInfo(`Respuesta eliminación: ${JSON.stringify(data)}`);

      if (data.success) {
        setDebugInfo('Usuario eliminado exitosamente, redirigiendo...');
        navigate('/dashboard/usuarios');
      } else {
        setError(data.error || 'Error deleting user');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
      setError('Error connecting to server: ' + errorMsg);
      setDebugInfo(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Mostrar información de debug siempre
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Debug info expandida */}
      {/* <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-bold text-blue-800 mb-2">🔍 Información de Debug</h3>
        <div className="text-sm space-y-1">
          <p><strong>ID del parámetro:</strong> {id || 'No definido'}</p>
          <p><strong>Modo:</strong> {isEditing ? 'Edición' : 'Creación'}</p>
          <p><strong>Loading:</strong> {loading.toString()}</p>
          <p><strong>Usuario cargado:</strong> {user.name || 'No cargado'}</p>
          <p><strong>Email cargado:</strong> {user.email || 'No cargado'}</p>
          <p><strong>Debug info:</strong> {debugInfo}</p>
          <p><strong>URL actual:</strong> {window.location.pathname}</p>
        </div>
      </div> */}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? `Editar Usuario (ID: ${id})` : 'Agregar Nuevo Usuario'}
        </h1>
        
        {isEditing && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar Usuario
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
          {isEditing && (
            <button 
              onClick={loadUser}
              className="ml-4 text-sm underline hover:no-underline"
            >
              Reintentar carga
            </button>
          )}
        </div>
      )}

      {loading && isEditing && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          🔄 Cargando datos del usuario...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre *
          </label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
            disabled={loading}
            placeholder="Ingrese el nombre del usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            required
            disabled={loading}
            placeholder="Ingrese el email del usuario"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña {isEditing ? '(dejar vacío para mantener actual)' : '*'}
          </label>
          <input
            type="password"
            value={user.password || ''}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            required={!isEditing}
            placeholder={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/usuarios')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>

      {/* Botones de testing */}
      {/* <div className="mt-6 p-4 bg-gray-50 border rounded">
        <h3 className="font-bold mb-2">🧪 Herramientas de Testing</h3>
        <div className="flex gap-2">
          {isEditing && (
            <button
              onClick={loadUser}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔄 Recargar Usuario
            </button>
          )}
          <button
            onClick={() => console.log('Current user state:', user)}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
          >
            📊 Log Estado
          </button>
          <button
            onClick={() => {
              console.log('Window location:', window.location);
              console.log('useParams result:', { id });
            }}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            🔍 Log Rutas
          </button>
        </div>
      </div> */}

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ¿Confirmar eliminación?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardUserEdit;