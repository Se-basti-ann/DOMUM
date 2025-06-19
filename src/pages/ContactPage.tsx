import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight, Copy, Check } from 'lucide-react';

const ContactPage = () => {
  useEffect(() => {
    document.title = 'Contacto | DOMUM Arquitectura';
  }, []);

  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Información de los arquitectos
  const architects = [
    {
      name: 'Mt.Arq Hernando Jiménez',
      phone: '3134678695',
      email: 'hjimenez@domumarquitectura.com',
      whatsappMessage: 'Hola, me gustaría obtener información sobre sus servicios de arquitectura.'
    },
    {
      name: 'Mt.Arq Julián Vanegas',
      phone: '3214749187',
      email: 'jvanegas@domumarquitectura.com',
      whatsappMessage: 'Hola, me gustaría obtener información sobre sus servicios de arquitectura.'
    }
  ];

  // Direcciones de oficinas actualizadas - Solo dos direcciones
  const addresses = [
    {
      title: 'Oficina Bogotá - Sede Norte',
      address: 'Carrera 50a #65-59',
      city: 'Bogotá, Colombia',
      zone: 'Zona Norte',
      zipCode: '110231'
    },
    {
      title: 'Oficina Regional Tolima',
      address: 'Calle 4 #12-13',
      city: 'Líbano, Tolima',
      zone: 'Centro',
      zipCode: '732001'
    }
  ];

  const copyToClipboard = (text: string, type: 'email' | 'phone', id: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(id);
      setTimeout(() => setCopiedEmail(null), 2000);
    } else {
      setCopiedPhone(id);
      setTimeout(() => setCopiedPhone(null), 2000);
    }
  };

  const handleWhatsAppClick = (phone: string, message: string) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/57${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  };

  return (
    <>
      {/* Header with gradient background */}
      <section className="bg-gradient-to-r from-[#001D23] to-[#003E5E] py-12 sm:py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-white mb-4 sm:mb-6 font-['Avenir Next']">Contáctanos por WhatsApp</h1>
            <p className="text-gray-300 text-base sm:text-lg font-['Raleway']">
              Comunícate directamente con nuestros arquitectos para discutir tu proyecto. 
              Estamos disponibles para ayudarte a hacer realidad tus ideas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gray-50">
        <div className="container-custom px-4 sm:px-6">
          
          {/* Architects Contact Cards */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4 text-[#001D23] font-['Avenir Next']">
                Nuestros Arquitectos
              </h2>
              <p className="text-[#003E5E] text-lg max-w-2xl mx-auto">
                Contacta directamente con nuestros profesionales especializados
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {architects.map((architect, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100 hover:shadow-xl transition-all duration-300"
                >
                  {/* Header del arquitecto */}
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#6BC6C9] to-[#003E5E] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-bold">
                        {architect.name.split(' ')[1]?.[0] || architect.name[0]}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#001D23] mb-2 font-['Avenir Next']">
                      {architect.name}
                    </h3>
                    <div className="w-16 h-[2px] bg-[#6BC6C9] mx-auto"></div>
                  </div>

                  {/* Información de contacto */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-[#6BC6C9]/10 p-2 rounded-lg text-[#6BC6C9]">
                        <Phone size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                        <div className="flex items-center justify-between">
                          <a 
                            href={`tel:${architect.phone}`}
                            className="text-[#003E5E] hover:text-[#001D23] font-medium transition-colors"
                          >
                            {formatPhoneNumber(architect.phone)}
                          </a>
                          <button 
                            onClick={() => copyToClipboard(architect.phone, 'phone', `phone-${index}`)}
                            className="p-1 text-gray-400 hover:text-[#6BC6C9] transition-colors"
                            aria-label="Copiar teléfono"
                          >
                            <AnimatePresence mode="wait">
                              {copiedPhone === `phone-${index}` ? (
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
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-[#6BC6C9]/10 p-2 rounded-lg text-[#6BC6C9]">
                        <Mail size={18} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-1">Correo</p>
                        <div className="flex items-center justify-between">
                          <a 
                            href={`mailto:${architect.email}`}
                            className="text-[#003E5E] hover:text-[#001D23] font-medium transition-colors break-all"
                          >
                            {architect.email}
                          </a>
                          <button 
                            onClick={() => copyToClipboard(architect.email, 'email', `email-${index}`)}
                            className="p-1 text-gray-400 hover:text-[#6BC6C9] transition-colors ml-2"
                            aria-label="Copiar correo"
                          >
                            <AnimatePresence mode="wait">
                              {copiedEmail === `email-${index}` ? (
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
                    </div>
                  </div>

                  {/* Botón de WhatsApp */}
                  <button
                    onClick={() => handleWhatsAppClick(architect.phone, architect.whatsappMessage)}
                    className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 group shadow-lg hover:shadow-xl"
                  >
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Contactar por WhatsApp
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Office Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-[#001D23] mb-4 font-['Avenir Next']">
                Nuestras Oficinas
              </h3>
              <div className="w-16 h-[2px] bg-[#6BC6C9] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Información de ubicaciones */}
              {addresses.map((address, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#6BC6C9]/10 p-3 rounded-lg text-[#6BC6C9] flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#001D23] mb-2 font-['Avenir Next']">
                        {address.title}
                      </h4>
                      <div className="text-[#003E5E] space-y-1">
                        <p>{address.address}</p>
                        <p>{address.zone}</p>
                        <p>{address.city}</p>
                        <p>Código Postal: {address.zipCode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Horarios */}
            <div className="border-t border-gray-100 pt-8">
              <div className="flex items-start gap-4 justify-center">
                <div className="bg-[#6BC6C9]/10 p-3 rounded-lg text-[#6BC6C9] flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-[#001D23] mb-2 font-['Avenir Next']">
                    Horario de Atención
                  </h4>
                  <div className="text-[#003E5E] space-y-1">
                    <p>Lunes - Viernes: 08:00 - 18:00</p>
                    <p>Sábados: 08:00 - 12:00</p>
                    <p>Domingos: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Map Section with Multiple Locations */}
      <section className="h-[300px] sm:h-[400px] md:h-[500px] relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full h-full"
        >
          {/* Mapa con las dos ubicaciones */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d254508.39280650293!2d-74.24789682453324!3d4.648625942145595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2sBogot%C3%A1%2C%20Colombia!5e0!3m2!1ses!2sco!4v1652458995415!5m2!1ses!2sco" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicaciones DOMUM Arquitectura"
            className="filter grayscale-[0.3] contrast-[1.1]"
          ></iframe>
        </motion.div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-[#001D23]/10 to-transparent"></div>
        
        {/* Información de ubicaciones en el mapa */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute top-4 right-4 md:top-8 md:right-8 bg-white p-4 rounded-lg shadow-lg z-10 border-l-4 border-[#6BC6C9] max-w-[280px]"
        >
          <h3 className="font-medium text-[#001D23] flex items-center gap-2 text-base font-['Avenir Next'] mb-3">
            <MapPin size={18} className="text-[#6BC6C9]" />
            DOMUM Arquitectura
          </h3>
          <div className="space-y-2 text-sm text-[#003E5E] font-['Raleway']">
            <div className="border-b border-gray-200 pb-2">
              <p className="font-medium">Sede Norte</p>
              <p>Carrera 50a #65-59</p>
              <p>Bogotá, Colombia</p>
            </div>
            <div>
              <p className="font-medium">Líbano, Tolima</p>
              <p>Calle 4 #12-13</p>
              <p>Líbano, Tolima</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Floating WhatsApp Buttons for Mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-30 flex flex-col gap-2">
        {architects.map((architect, index) => (
          <motion.button
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleWhatsAppClick(architect.phone, architect.whatsappMessage)}
            className="flex items-center justify-center w-12 h-12 bg-[#25D366] rounded-full shadow-lg hover:bg-[#25D366]/90 transition-colors"
            aria-label={`Contactar a ${architect.name} por WhatsApp`}
            title={architect.name}
          >
            <MessageSquare size={20} className="text-white" />
          </motion.button>
        ))}
      </div>
    </>
  );
};

export default ContactPage;