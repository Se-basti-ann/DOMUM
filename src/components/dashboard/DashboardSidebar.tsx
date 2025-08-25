import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Folder, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const navItems = [
    { to: '/dashboard', label: 'Inicio', icon: <Home size={20} /> },
    { to: '/dashboard/blog', label: 'Blog', icon: <FileText size={20} /> },
    { to: '/dashboard/proyectos', label: 'Proyectos', icon: <Folder size={20} /> },
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Solo colapsar si se hace scroll hacia abajo más de 100px
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsCollapsed(true);
      } else if (currentScrollY < lastScrollY - 50) {
        // Expandir cuando se hace scroll hacia arriba
        setIsCollapsed(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  return (
    <div className={`
      bg-white border-r border-primary-100 min-h-screen flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out shadow-sm
      ${isCollapsed ? 'w-20' : 'w-64'}
    `}>
      {/* Header con logo */}
      <div className="p-6 border-b border-primary-100 flex-shrink-0 relative mt-20">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary-900 flex items-center justify-center text-white rounded flex-shrink-0">
            <span className="font-serif text-lg font-bold">A</span>
          </div>
          <span className={`
            font-serif text-xl font-medium text-primary-900 transition-all duration-300
            ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
          `}>
            Dashboard
          </span>
        </div>
        
        {/* Botón para toggle manual */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border border-primary-200 rounded-full p-1 hover:bg-primary-50 transition-colors shadow-sm"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      
      {/* Navegación - estructura mejorada */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        {/* Lista de navegación principal */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 group relative
                    ${isActive ? 'bg-primary-50 text-primary-800' : 'hover:bg-primary-50 text-primary-600 hover:text-primary-800'}
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className={`
                    transition-all duration-300 whitespace-nowrap
                    ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
                  `}>
                    {item.label}
                  </span>
                  
                  {/* Tooltip para cuando está colapsado */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-primary-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Botón de cerrar sesión - siempre visible en la parte inferior */}
        <div className="flex-shrink-0 border-t border-primary-100 pt-4 mt-4">
          <button
            onClick={() => signOut()}
            className={`
              flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative
              text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent hover:border-red-200
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}
            title={isCollapsed ? 'Cerrar Sesión' : undefined}
          >
            <div className="flex-shrink-0">
              <LogOut size={20} />
            </div>
            <span className={`
              transition-all duration-300 whitespace-nowrap font-medium
              ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
            `}>
              Cerrar Sesión
            </span>
            
            {/* Tooltip para cerrar sesión cuando está colapsado */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                <span className="font-medium">Cerrar Sesión</span>
                <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;