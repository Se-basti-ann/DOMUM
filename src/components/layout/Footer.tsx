import { NavLink } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              {/* Reemplazando el div con la letra A por la imagen */}
              <div className="h-12 w-40 rounded overflow-hidden bg-white">
                <img 
                  src="https://www.domumarquitectura.com/wp-content/uploads/2025/02/LOGOS-09.png" 
                  alt="DOMUM Arquitectura Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif text-xl font-medium">DOMUM Arquitectura</span>
            </div>
            <p className="text-primary-100 mb-6">
              Transformamos espacios con arquitectura innovadora y sostenible, 
              creando ambientes que inspiran.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-primary-700 flex items-center justify-center hover:bg-white hover:text-primary-900 transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-primary-700 flex items-center justify-center hover:bg-white hover:text-primary-900 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-primary-700 flex items-center justify-center hover:bg-white hover:text-primary-900 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-6">Enlaces Rápidos</h4>
            <ul className="flex flex-col gap-3">
              <li>
                <NavLink to="/" className="text-primary-100 hover:text-white transition-colors">
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink to="/nosotros" className="text-primary-100 hover:text-white transition-colors">
                  Nosotros
                </NavLink>
              </li>
              <li>
                <NavLink to="/proyectos" className="text-primary-100 hover:text-white transition-colors">
                  Proyectos
                </NavLink>
              </li>
               {/*<li>
                <NavLink to="/blog" className="text-primary-100 hover:text-white transition-colors">
                  Blog
                </NavLink>
              </li> */}
              <li>
                <NavLink to="/contacto" className="text-primary-100 hover:text-white transition-colors">
                  Contacto
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-medium mb-6">Servicios</h4>
            <ul className="flex flex-col gap-3">
              <li className="text-primary-100">Diseño Arquitectónico</li>
              <li className="text-primary-100">Remodelaciones</li>
              <li className="text-primary-100">Consultoría</li>
              <li className="text-primary-100">Diseño de Interiores</li>
              <li className="text-primary-100">Planificación Urbana</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-medium mb-6">Contacto</h4>
            <div className="flex flex-col gap-6">
              {/* Mt.Arq Hernando Jimenez */}
              <div className="border-b border-primary-700 pb-4">
                <h5 className="text-white font-medium mb-3">Mt.Arq Hernando Jiménez</h5>
                <div className="flex flex-col gap-2">
                  <a 
                    href="tel:3134678695" 
                    className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    <Phone size={16} />
                    <span>313 467 8695</span>
                  </a>
                  <a 
                    href="mailto:hjimenez@domumarquitectura.com" 
                    className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    <Mail size={16} />
                    <span>hjimenez@domumarquitectura.com</span>
                  </a>
                </div>
              </div>

              {/* Mt.Arq Julián Vanegas */}
              <div className="border-b border-primary-700 pb-4">
                <h5 className="text-white font-medium mb-3">Mt.Arq Julián Vanegas</h5>
                <div className="flex flex-col gap-2">
                  <a 
                    href="tel:3214749187" 
                    className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    <Phone size={16} />
                    <span>321 474 9187</span>
                  </a>
                  <a 
                    href="mailto:jvanegas@domumarquitectura.com" 
                    className="flex items-center gap-2 text-primary-100 hover:text-white transition-colors text-sm"
                  >
                    <Mail size={16} />
                    <span>jvanegas@domumarquitectura.com</span>
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="text-primary-100 text-sm">                
                <p>Bogotá, Colombia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-700 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-300 text-sm">
            &copy; {currentYear} DOMUM Arquitectura. Todos los derechos reservados. Sebastian Rodriguez Poveda
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-primary-300 hover:text-white transition-colors">
              Términos de Servicio
            </a>
            <a href="#" className="text-sm text-primary-300 hover:text-white transition-colors">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;