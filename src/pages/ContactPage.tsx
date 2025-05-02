import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';

const ContactPage = () => {
  useEffect(() => {
    document.title = 'Contacto | DOMUM Arquitectura';
  }, []);

  return (
    <>
      {/* Header */}
      <section className="bg-primary-900 py-20 md:py-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-white mb-6">Contáctanos</h1>
            <p className="text-primary-100 text-lg">
              Estamos aquí para ayudarte con tu próximo proyecto. Contáctanos 
              hoy para discutir tus ideas y cómo podemos hacerlas realidad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 md:py-24 bg-primary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-medium mb-6">Información de Contacto</h2>
                
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg text-primary-800">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Correo Electrónico</h3>
                        <a 
                          href="mailto:jvanegas@domumarquitectura.com" 
                          className="text-primary-700 hover:text-primary-900 transition-colors"
                        >
                          jvanegas@domumarquitectura.com
                        </a>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg text-primary-800">
                        <Phone size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Teléfono</h3>
                        <a 
                          href="tel:1-555-123-4567" 
                          className="text-primary-700 hover:text-primary-900 transition-colors"
                        >
                          1-555-123-4567
                        </a>
                        <br />
                        <a 
                          href="tel:1-800-123-4567" 
                          className="text-primary-700 hover:text-primary-900 transition-colors"
                        >
                          1-800-123-4567
                        </a>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg text-primary-800">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Ubicación</h3>
                        <p className="text-primary-700">
                          Bogotá, Colombia<br />
                          Código Postal 110110
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-4">
                      <div className="bg-primary-100 p-3 rounded-lg text-primary-800">
                        <Clock size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Horario de Oficina</h3>
                        <p className="text-primary-700">
                          Lunes - Viernes: 06:00 - 17:00<br />
                          Sábados: 06:00 - 11:30<br />
                          Domingos: Cerrado
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-accent-50 rounded-lg shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-accent-100 p-3 rounded-lg text-accent-700">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">WhatsApp</h3>
                      <p className="text-primary-700 mb-3">
                        Contáctanos directamente vía WhatsApp para una respuesta rápida.
                      </p>
                      <a 
                        href="https://wa.me/1234567890" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-accent-600 hover:bg-accent-700 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        <MessageSquare size={16} />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-2xl font-medium mb-6">Envíanos un Mensaje</h2>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map */}
      <section className="h-[500px] relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254508.39280650293!2d-74.24789682453324!3d4.648625942145595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1ses!2sco!4v1652458995415!5m2!1ses!2sco" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Bogotá"
            className="filter grayscale-[0.2] contrast-[1.1]"
          ></iframe>
        </motion.div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-primary-900/10 to-transparent"></div>
        <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-white p-4 rounded-lg shadow-md z-10">
          <h3 className="font-medium text-primary-900 flex items-center gap-2">
            <MapPin size={18} className="text-primary-600" />
            DOMUM Arquitectura
          </h3>
          <p className="text-sm text-primary-700 mt-1">Bogotá, Colombia</p>
        </div>
      </section>
    </>
  );
};

export default ContactPage;