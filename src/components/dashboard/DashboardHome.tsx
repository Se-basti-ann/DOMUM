
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Folder, PlusCircle } from 'lucide-react';
import { useSupabase } from '../../contexts/SupabaseContext';

const DashboardHome = () => {
  const supabase = useSupabase();
  const [stats, setStats] = useState({
    blogPosts: 0,
    projects: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      
      try {
        // Get blog posts count
        const { count: blogCount } = await supabase
          .from('blogs')
          .select('*', { count: 'exact', head: true });

        // Get projects count
        const { count: projectsCount } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });

        setStats({
          blogPosts: blogCount || 0,
          projects: projectsCount || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [supabase]);

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
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <div className="flex gap-3">
          <Link 
            to="/dashboard/blog/nuevo" 
            className="flex items-center gap-2 button-primary"
          >
            <PlusCircle size={16} />
            Nuevo Blog
          </Link>
          <Link 
            to="/dashboard/proyectos/nuevo" 
            className="flex items-center gap-2 button-primary"
          >
            <PlusCircle size={16} />
            Nuevo Proyecto
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {statCards.map((card) => (
            <div 
              key={card.title} 
              className={`${card.color} rounded-lg shadow-sm p-6`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">{card.title}</h3>
                  <p className="text-3xl font-semibold mt-2">
                    {card.count}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-white">
                  {card.icon}
                </div>
              </div>
              <Link 
                to={card.linkTo} 
                className={`inline-block ${card.textColor} font-medium hover:underline`}
              >
                {card.linkText}
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* Quick Help Section */}
      <div className="bg-primary-50 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-medium mb-4">Bienvenido al Dashboard</h2>
        <p className="mb-4">
          Desde aquí puedes administrar todo el contenido de tu sitio web. 
          Utiliza las opciones del menú lateral para navegar entre las diferentes secciones.
        </p>
        <ul className="list-disc list-inside space-y-2 text-primary-700">
          <li>Crea y edita publicaciones de blog</li>
          <li>Administra los proyectos de arquitectura</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardHome;
