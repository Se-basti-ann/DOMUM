import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Eliminando completamente el padding vertical para subir los elementos
  const navbarClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white shadow-md py-0' : 'bg-transparent py-0'
  }`;

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Proyectos', path: '/proyectos' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contacto', path: '/contacto' },
  ];

  return (
    <nav className={navbarClasses}>
      {/* Aplicando margen negativo al contenedor principal para subir todo */}
      <div className="container-custom flex items-center justify-between py-0 -mt-1">
        <NavLink to="/" className="flex items-center gap-2">
          {/* Ajustando la posición del logo con margin negativo más pronunciado */}
          <div className="h-15 w-80 rounded overflow-hidden -mt-4">
            <img 
              src="https://www.domumarquitectura.com/wp-content/uploads/2025/02/LOGOS-09.png" 
              alt="Modern office interior"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Ajustando la posición del texto */}
          <span className="font-serif text-xl font-medium text-primary-900 -mt-4">
            DOMUM Arquitectura
          </span>
        </NavLink>

        {/* Desktop Navigation - subiendo los elementos con margin negativo más pronunciado */}
        <div className="hidden md:flex md:items-center md:gap-8 -mt-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? 'nav-link-active' : 'nav-link'
              }
            >
              {link.label}
            </NavLink>
          ))}
          
          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1 nav-link">
                <span>Mi Cuenta</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                {isAdmin && (
                  <NavLink
                    to="/dashboard"
                    className="block px-4 py-2 text-primary-800 hover:bg-primary-50"
                  >
                    Dashboard
                  </NavLink>
                )}
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-primary-800 hover:bg-primary-50"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <NavLink to="/login" className="button-primary">
              Iniciar Sesión
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button - subiendo con margin negativo más pronunciado */}
        <button
          className="md:hidden -mt-4"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - ajustando la posición para que aparezca correctamente */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white mt-0"
          >
            <div className="container-custom py-3 flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? 'nav-link-active' : 'nav-link'
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              
              {user ? (
                <div className="flex flex-col gap-2">
                  {isAdmin && (
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="nav-link"
                    >
                      Dashboard
                    </NavLink>
                  )}
                  <button onClick={handleSignOut} className="text-left nav-link">
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="button-primary self-start"
                >
                  Iniciar Sesión
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;