import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight, Copy, Check } from 'lucide-react';
import ContactForm from '../components/contact/ContactForm';

const ContactPage = () => {
  useEffect(() => {
    document.title = 'Contacto | DOMUM Arquitectura';
  }, []);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'info'

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <>
      {/* Header with gradient background - Optimizado para móviles */}
      <section className="bg-gradient-to-r from-[#001D23] to-[#003E5E] py-12 sm:py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements - Ajustados para mejor visualización en móviles */}
        <div className="absolute top-0 right-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-[#6BC6C9]/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-[#6BC6C9]/5 rounded-full -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container-custom relative z-10 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="h-[2px] w-8 sm:w-12 bg-[#6BC6C9]"></div>
              <span className="text-[#6BC6C9] text-sm sm:text-base font-medium font-['Raleway']">CONTACTO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-white mb-4 sm:mb-6 font-['Avenir Next']">Contáctanos</h1>
            <p className="text-gray-300 text-base sm:text-lg font-['Raleway']">
              Estamos aquí para ayudarte con tu próximo proyecto. Contáctanos 
              hoy para discutir tus ideas y cómo podemos hacerlas realidad.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mobile Tabs - Mejorado para mejor interacción táctil */}
      <div className="md:hidden bg-white sticky top-0 z-20 shadow-md">
        <div className="flex">
          <button 
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'form' 
                ? 'text-[#003E5E] border-b-2 border-[#6BC6C9]' 
                : 'text-gray-500 hover:text-[#003E5E]'
            }`}
            onClick={() => setActiveTab('form')}
          >
            <span className="text-sm sm:text-base">Formulario</span>
          </button>
          <button 
            className={`flex-1 py-4 text-center font-medium transition-colors ${
              activeTab === 'info' 
                ? 'text-[#003E5E] border-b-2 border-[#6BC6C9]' 
                : 'text-gray-500 hover:text-[#003E5E]'
            }`}
            onClick={() => setActiveTab('info')}
          >
            <span className="text-sm sm:text-base">Información</span>
          </button>
        </div>
      </div>

      {/* Contact Info + Form - Optimizado para móviles */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* Contact Information - Optimizado para móviles */}
            <div className={`lg:col-span-1 ${activeTab === 'form' ? 'hidden md:block' : ''}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-[#001D23] font-['Avenir Next']">Información de Contacto</h2>
                
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <ul className="space-y-5 sm:space-y-6">
                    <li className="flex items-start gap-3 sm:gap-4 group">
                      <div className="bg-[#6BC6C9]/10 p-2 sm:p-3 rounded-lg text-[#6BC6C9] group-hover:bg-[#6BC6C9]/20 transition-colors">
                        <Mail size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1 text-[#001D23] text-sm sm:text-base font-['Avenir Next']">Correo Electrónico</h3>
                        <div className="flex items-center justify-between flex-wrap">
                          <a 
                            href="mailto:jvanegas@domumarquitectura.com" 
                            className="text-[#003E5E] hover:text-[#00303F] transition-colors text-sm sm:text-base break-all"
                          >
                            jvanegas@domumarquitectura.com
                          </a>
                          <button 
                            onClick={() => copyToClipboard('jvanegas@domumarquitectura.com', 'email')}
                            className="p-2 text-gray-400 hover:text-[#6BC6C9] transition-colors ml-1"
                            aria-label="Copiar correo electrónico"
                          >
                            <AnimatePresence mode="wait">
                              {copiedEmail ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Check size={16} className="text-green-500" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="copy"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Copy size={16} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3 sm:gap-4 group">
                      <div className="bg-[#6BC6C9]/10 p-2 sm:p-3 rounded-lg text-[#6BC6C9] group-hover:bg-[#6BC6C9]/20 transition-colors">
                        <Phone size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1 text-[#001D23] text-sm sm:text-base font-['Avenir Next']">Teléfono</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <a 
                              href="tel:1-555-123-4567" 
                              className="text-[#003E5E] hover:text-[#00303F] transition-colors block text-sm sm:text-base"
                            >
                              1-555-123-4567
                            </a>
                            <a 
                              href="tel:1-800-123-4567" 
                              className="text-[#003E5E] hover:text-[#00303F] transition-colors block text-sm sm:text-base"
                            >
                              1-800-123-4567
                            </a>
                          </div>
                          <button 
                            onClick={() => copyToClipboard('1-555-123-4567', 'phone')}
                            className="p-2 text-gray-400 hover:text-[#6BC6C9] transition-colors"
                            aria-label="Copiar número de teléfono"
                          >
                            <AnimatePresence mode="wait">
                              {copiedPhone ? (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Check size={16} className="text-green-500" />
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="copy"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Copy size={16} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>
                        </div>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3 sm:gap-4 group">
                      <div className="bg-[#6BC6C9]/10 p-2 sm:p-3 rounded-lg text-[#6BC6C9] group-hover:bg-[#6BC6C9]/20 transition-colors">
                        <MapPin size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1 text-[#001D23] text-sm sm:text-base font-['Avenir Next']">Ubicación</h3>
                        <p className="text-[#003E5E] text-sm sm:text-base">
                          Bogotá, Colombia<br />
                          Código Postal 110110
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start gap-3 sm:gap-4 group">
                      <div className="bg-[#6BC6C9]/10 p-2 sm:p-3 rounded-lg text-[#6BC6C9] group-hover:bg-[#6BC6C9]/20 transition-colors">
                        <Clock size={18} className="sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1 text-[#001D23] text-sm sm:text-base font-['Avenir Next']">Horario de Oficina</h3>
                        <p className="text-[#003E5E] text-sm sm:text-base">
                          Lunes - Viernes: 06:00 - 17:00<br />
                          Sábados: 06:00 - 11:30<br />
                          Domingos: Cerrado
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                {/* WhatsApp Card - Optimizado para móviles */}
                <div className="bg-gradient-to-br from-[#003E5E] to-[#001D23] rounded-lg shadow-md p-4 sm:p-6 text-white">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-[#6BC6C9] p-2 sm:p-3 rounded-lg text-[#001D23]">
                      <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-sm sm:text-base font-['Avenir Next']">WhatsApp</h3>
                      <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base font-['Raleway']">
                        Contáctanos directamente vía WhatsApp para una respuesta rápida.
                      </p>
                      <a 
                        href="https://wa.me/1234567890" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#6BC6C9] hover:bg-[#6BC6C9]/90 text-[#001D23] py-2 px-3 sm:px-4 rounded-md transition-colors font-medium text-sm sm:text-base"
                      >
                        <MessageSquare size={16} />
                        Chatear por WhatsApp
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight size={16} />
                        </motion.div>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Contact Form - Optimizado para móviles */}
            <div className={`lg:col-span-2 ${activeTab === 'info' ? 'hidden md:block' : ''}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6 text-[#001D23] font-['Avenir Next']">Envíanos un Mensaje</h2>
                <ContactForm />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map with enhanced styling - Optimizado para móviles */}
      <section className="h-[300px] sm:h-[400px] md:h-[500px] relative">
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
            className="filter grayscale-[0.5] contrast-[1.1]"
          ></iframe>
        </motion.div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-[#001D23]/20 to-transparent"></div>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 md:top-8 md:right-8 bg-white p-3 sm:p-4 rounded-lg shadow-lg z-10 border-l-4 border-[#6BC6C9] max-w-[180px] sm:max-w-none"
        >
          <h3 className="font-medium text-[#001D23] flex items-center gap-2 text-sm sm:text-base font-['Avenir Next']">
            <MapPin size={16} className="sm:w-[18px] sm:h-[18px] text-[#6BC6C9]" />
            DOMUM Arquitectura
          </h3>
          <p className="text-xs sm:text-sm text-[#003E5E] mt-1 font-['Raleway']">Bogotá, Colombia</p>
          <a 
            href="https://goo.gl/maps/1234567890" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-[#6BC6C9] hover:text-[#003E5E] mt-1 sm:mt-2 inline-flex items-center gap-1 transition-colors"
          >
            Ver en Google Maps
            <ArrowRight size={10} className="sm:w-3 sm:h-3" />
          </a>
        </motion.div>
      </section>

      {/* Botón flotante de WhatsApp para móviles */}
      <div className="md:hidden fixed bottom-4 right-4 z-30">
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-12 h-12 bg-[#6BC6C9] rounded-full shadow-lg hover:bg-[#6BC6C9]/90 transition-colors"
          aria-label="Contactar por WhatsApp"
        >
          <MessageSquare size={24} className="text-[#001D23]" />
        </a>
      </div>
    </>
  );
};

export default ContactPage;