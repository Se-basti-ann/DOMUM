import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Folder, PlusCircle, Users } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    blogPosts: 0,
    projects: 0,
    users: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // URL base de tu API - ajusta según tu configuración
  const API_BASE_URL = 'https://domumarquitectura.com/assets';

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Obtener estadísticas de blogs
      const blogResponse = await fetch(`${API_BASE_URL}/API_blogs.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Obtener estadísticas de proyectos
      const projectsResponse = await fetch(`${API_BASE_URL}/API_Projects.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Obtener estadísticas de usuarios
      const usersResponse = await fetch(`${API_BASE_URL}/API_AllUser.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Procesar respuestas
      const blogData = await blogResponse.json();
      const projectsData = await projectsResponse.json();
      const usersData = await usersResponse.json();

      // Contar elementos
      const blogCount = Array.isArray(blogData) ? blogData.length : 0;
      const projectsCount = Array.isArray(projectsData) ? projectsData.length : 0;
      const usersCount = usersData.success && Array.isArray(usersData.users) ? usersData.users.length : 0;

      setStats({
        blogPosts: blogCount,
        projects: projectsCount,
        users: usersCount,
      });

    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Error al cargar las estadísticas del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Blog Posts',
      count: stats.blogPosts,
      icon: <FileText size={24} className="text-blue-500" />,
      linkTo: '/dashboard/blog',
      linkText: 'Administrar Blog',
      color: 'bg-blue-50',
      textColor: 'text-blue-500',
    },
    {
      title: 'Proyectos',
      count: stats.projects,
      icon: <Folder size={24} className="text-green-500" />,
      linkTo: '/dashboard/proyectos',
      linkText: 'Administrar Proyectos',
      color: 'bg-green-50',
      textColor: 'text-green-500',
    },
    {
      title: 'Usuarios',
      count: stats.users,
      icon: <Users size={24} className="text-purple-500" />,
      linkTo: '/dashboard/usuarios',
      linkText: 'Administrar Usuarios',
      color: 'bg-purple-50',
      textColor: 'text-purple-500',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <div className="flex gap-3">
          <Link 
            to="/dashboard/blog/nuevo" 
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            <PlusCircle size={16} />
            Nuevo Blog
          </Link>
          <Link 
            to="/dashboard/proyectos/nuevo" 
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            <PlusCircle size={16} />
            Nuevo Proyecto
          </Link>
          <Link 
            to="/dashboard/usuarios/nuevo" 
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            <PlusCircle size={16} />
            Nuevo Usuario
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <button 
            onClick={fetchStats}
            className="ml-4 text-sm underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <div 
              key={card.title} 
              className={`${card.color} rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">{card.title}</h3>
                  <p className="text-3xl font-semibold mt-2 text-gray-900">
                    {card.count}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-white shadow-sm">
                  {card.icon}
                </div>
              </div>
              <Link 
                to={card.linkTo} 
                className={`inline-block ${card.textColor} font-medium hover:underline transition-colors`}
              >
                {card.linkText}
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* Quick Help Section */}
      <div className="bg-primary-50 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-medium mb-4 text-primary-900">Bienvenido al Dashboard</h2>
        <p className="mb-4 text-primary-800">
          Desde aquí puedes administrar todo el contenido de tu sitio web. 
          Utiliza las opciones del menú lateral para navegar entre las diferentes secciones.
        </p>
        <ul className="list-disc list-inside space-y-2 text-primary-700">
          <li>Crea y edita publicaciones de blog</li>
          <li>Administra los proyectos de arquitectura</li>
          <li>Gestiona los usuarios del sistema</li>
          <li>Revisa las estadísticas de contenido</li>
        </ul>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Link 
              to="/dashboard/blog/nuevo"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              📝 Crear nueva publicación de blog
            </Link>
            <Link 
              to="/dashboard/proyectos/nuevo"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              🏗️ Agregar nuevo proyecto
            </Link>
            <Link 
              to="/dashboard/usuarios/nuevo"
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              👤 Registrar nuevo usuario
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4 text-gray-900">Resumen del Sistema</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Total de contenido:</span>
              <span className="font-medium">{stats.blogPosts + stats.projects} elementos</span>
            </div>
            <div className="flex justify-between">
              <span>Usuarios registrados:</span>
              <span className="font-medium">{stats.users} usuarios</span>
            </div>
            <div className="flex justify-between">
              <span>Última actualización:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;