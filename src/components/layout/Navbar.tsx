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

  // Bloquear el scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Ajustando las clases para mejor compatibilidad móvil
  const navbarClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
  } py-2 md:py-0`;

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Proyectos', path: '/proyectos' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contacto', path: '/contacto' },
  ];

  return (
    <nav className={navbarClasses}>
      {/* Contenedor principal con padding ajustado para móviles */}
      <div className="container-custom flex items-center justify-between py-2 md:py-0 md:-mt-1">
        <NavLink to="/" className="flex items-center gap-2">
          {/* Ajustando la posición del logo para que sea visible en móviles */}
          <div className="h-12 w-60 md:h-15 md:w-80 rounded overflow-hidden md:-mt-4">
            <img 
              src="https://www.domumarquitectura.com/wp-content/uploads/2025/02/LOGOS-09.png" 
              alt="DOMUM Arquitectura"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Ocultando el texto en móviles para ahorrar espacio */}
          <span className="hidden md:inline-block font-serif text-xl font-medium text-primary-900 md:-mt-4">
            DOMUM Arquitectura
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8 md:-mt-4">
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

        {/* Mobile Menu Button - eliminando margen negativo que podría causar problemas */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu - ajustando para que aparezca correctamente */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg fixed top-[60px] left-0 w-full z-40 overflow-y-auto max-h-[calc(100vh-60px)]"
          >
            <div className="container-custom py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-2 ${isActive ? 'nav-link-active' : 'nav-link'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              
              {user ? (
                <div className="flex flex-col gap-3 border-t border-gray-200 pt-3">
                  <div className="text-sm text-gray-500">Mi Cuenta</div>
                  {isAdmin && (
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 nav-link"
                    >
                      Dashboard
                    </NavLink>
                  )}
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="text-left py-2 nav-link text-red-600"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="button-primary self-start mt-2"
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