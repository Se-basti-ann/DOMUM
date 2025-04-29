import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Folder, MessageSquare, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const navItems = [
    { to: '/dashboard', label: 'Inicio', icon: <Home size={20} /> },
    { to: '/dashboard/blog', label: 'Blog', icon: <FileText size={20} /> },
    { to: '/dashboard/proyectos', label: 'Proyectos', icon: <Folder size={20} /> },
    { to: '/dashboard/mensajes', label: 'Mensajes', icon: <MessageSquare size={20} /> },
    { to: '/dashboard/equipo', label: 'Equipo', icon: <Users size={20} /> },
  ];
  
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="bg-white border-r border-primary-100 h-full">
      <div className="p-6 border-b border-primary-100">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-primary-900 flex items-center justify-center text-white rounded">
            <span className="font-serif text-lg font-bold">A</span>
          </div>
          <span className="font-serif text-xl font-medium text-primary-900">
            Dashboard
          </span>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-md transition-colors
                  ${isActive ? 'bg-primary-50 text-primary-800' : 'hover:bg-primary-50 text-primary-600 hover:text-primary-800'}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="border-t border-primary-100 mt-6 pt-6">
          <button
            onClick={() => signOut()}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-md text-primary-600 hover:bg-primary-50 hover:text-primary-800 transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default DashboardSidebar;