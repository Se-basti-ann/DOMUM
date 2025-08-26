import { NavLink } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              {/* Logo actualizado */}
              <div className="h-12 w-40 rounded overflow-hidden bg-white">
                <img 
                  src="https://www.domumarquitectura.com/wp-content/uploads/2025/02/LOGOS-09.png" 
                  alt="DOMUM Arquitectura Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-primary text-xl font-semibold">DOMUM Arquitectura</span>
            </div>
            <p className="text-gray-300 mb-6 font-secondary leading-relaxed">
              Transformamos espacios con arquitectura innovadora y sostenible, 
              creando ambientes que inspiran.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-primary font-semibold mb-6 text-accent">Enlaces Rápidos</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <NavLink 
                  to="/" 
                  className="text-gray-300 hover:text-accent transition-colors duration-300 font-secondary hover:translate-x-1 inline-block"
                >
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/nosotros" 
                  className="text-gray-300 hover:text-accent transition-colors duration-300 font-secondary hover:translate-x-1 inline-block"
                >
                  Nosotros
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/proyectos" 
                  className="text-gray-300 hover:text-accent transition-colors duration-300 font-secondary hover:translate-x-1 inline-block"
                >
                  Proyectos
                </NavLink>
              </li>
              {/*<li>
                <NavLink 
                  to="/blog" 
                  className="text-gray-300 hover:text-accent transition-colors duration-300 font-secondary hover:translate-x-1 inline-block"
                >
                  Blog
                </NavLink>
              </li>*/}
              <li>
                <NavLink 
                  to="/contacto" 
                  className="text-gray-300 hover:text-accent transition-colors duration-300 font-secondary hover:translate-x-1 inline-block"
                >
                  Contacto
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-primary font-semibold mb-6 text-accent">Servicios</h4>
            <ul className="flex flex-col gap-3">
              <li className="text-gray-300 font-secondary">Diseño Arquitectónico</li>
              <li className="text-gray-300 font-secondary">Remodelaciones</li>
              <li className="text-gray-300 font-secondary">Consultoría</li>
              <li className="text-gray-300 font-secondary">Diseño de Interiores</li>
              <li className="text-gray-300 font-secondary">Planificación Urbana</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-primary font-semibold mb-6 text-accent">Contacto</h4>
            <div className="flex flex-col gap-6">
              {/* Mt.Arq Hernando Jimenez */}
              <div className="border-b border-secondary pb-4">
                <h5 className="text-white font-primary font-medium mb-3">Mt.Arq Hernando Jiménez</h5>
                <div className="flex flex-col gap-2">
                  <a 
                    href="tel:3134678695" 
                    className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors duration-300 text-sm font-secondary"
                  >
                    <Phone size={16} />
                    <span>313 467 8695</span>
                  </a>
                  <a 
                    href="mailto:hjimenez@domumarquitectura.com" 
                    className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors duration-300 text-sm font-secondary"
                  >
                    <Mail size={16} />
                    <span>hjimenez@domumarquitectura.com</span>
                  </a>
                </div>
              </div>

              {/* Mt.Arq Julián Vanegas */}
              <div className="border-b border-secondary pb-4">
                <h5 className="text-white font-primary font-medium mb-3">Mt.Arq Julián Vanegas</h5>
                <div className="flex flex-col gap-2">
                  <a 
                    href="tel:3214749187" 
                    className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors duration-300 text-sm font-secondary"
                  >
                    <Phone size={16} />
                    <span>321 474 9187</span>
                  </a>
                  <a 
                    href="mailto:jvanegas@domumarquitectura.com" 
                    className="flex items-center gap-2 text-gray-300 hover:text-accent transition-colors duration-300 text-sm font-secondary"
                  >
                    <Mail size={16} />
                    <span>jvanegas@domumarquitectura.com</span>
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="text-gray-300 text-sm font-secondary">                
                <p>Bogotá, Colombia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-secondary">
            &copy; {currentYear} DOMUM Arquitectura. Todos los derechos reservados. Sebastian Rodriguez Poveda
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-accent transition-colors duration-300 font-secondary">
              Términos de Servicio
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-accent transition-colors duration-300 font-secondary">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;