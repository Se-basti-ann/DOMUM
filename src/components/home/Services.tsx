import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { PenTool, Home, Building2, Briefcase, Users, ChevronDown, ChevronUp } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Diseño Arquitectónico',
    shortDescription: 'Diseños personalizados que combinan estética y funcionalidad.',
    fullDescription: 'Creamos diseños arquitectónicos personalizados que combinan estética, funcionalidad y sostenibilidad para satisfacer sus necesidades específicas. Nuestro enfoque integra las últimas tendencias con soluciones prácticas.',
    icon: <PenTool size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
    color: 'from-[#003E5E] to-[#001D23]'
  },
  {
    id: 2,
    title: 'Arquitectura Residencial',
    shortDescription: 'Hogares que reflejan su estilo de vida y necesidades.',
    fullDescription: 'Diseñamos hogares que reflejan su estilo de vida, optimizando espacios y creando ambientes cómodos y funcionales. Cada proyecto residencial se adapta perfectamente a las necesidades y preferencias de sus habitantes.',
    icon: <Home size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    color: 'from-[#00303F] to-[#001D23]'
  },
  {
    id: 3,
    title: 'Arquitectura Comercial',
    shortDescription: 'Espacios comerciales que potencian su marca.',
    fullDescription: 'Desarrollamos espacios comerciales atractivos que mejoran la experiencia del cliente y potencian su marca. Nuestros diseños comerciales equilibran la estética con la funcionalidad para maximizar el retorno de inversión.',
    icon: <Building2 size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
    color: 'from-[#003E5E] to-[#00303F]'
  },
  {
    id: 4,
    title: 'Consultoría',
    shortDescription: 'Asesoramiento experto en todas las etapas del proyecto.',
    fullDescription: 'Ofrecemos asesoramiento experto en todas las etapas de su proyecto, desde la conceptualización hasta la implementación. Nuestro equipo de consultores le guiará a través de los aspectos técnicos, normativos y creativos.',
    icon: <Briefcase size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    color: 'from-[#00303F] to-[#001D23]'
  },
  {
    id: 5,
    title: 'Diseño Participativo',
    shortDescription: 'Involucramos a los usuarios en el proceso de diseño.',
    fullDescription: 'Involucramos a los usuarios finales en el proceso de diseño para crear espacios que realmente satisfagan sus necesidades. Este enfoque colaborativo garantiza resultados que responden a las expectativas reales de quienes utilizarán el espacio.',
    icon: <Users size={28} />,
    bgImage: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
    color: 'from-[#003E5E] to-[#001D23]'
  },
];

const Services = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const expandVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: 'auto', 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section ref={ref} className="section-padding bg-[#001D23] overflow-hidden">
      <div className="container-custom">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <h2 className="text-white mb-4">Nuestros Servicios</h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            Ofrecemos una amplia gama de servicios profesionales para ayudarlo a 
            transformar sus ideas en realidad, desde el concepto inicial hasta la 
            finalización del proyecto.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col gap-4 max-w-4xl mx-auto"
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={`bg-[#00303F] rounded-xl overflow-hidden shadow-md transition-all duration-300 ${
                expandedId === service.id ? 'shadow-lg shadow-black/30' : 'shadow-sm'
              }`}
              style={{
                transformOrigin: 'center left',
                transform: expandedId === service.id ? 'scale(1)' : 'scale(0.98)',
              }}
            >
              {/* Card Header - Always visible */}
              <div 
                className="cursor-pointer"
                onClick={() => toggleExpand(service.id)}
              >
                <div className="relative">
                  {/* Background Image with Gradient Overlay */}
                  <div className="h-24 w-full relative">
                    <div 
                      className="absolute inset-0 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${service.bgImage})` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-90`}></div>
                    
                    {/* Service Icon and Title */}
                    <div className="relative z-10 h-full flex items-center px-6">
                      <div className="bg-[#6BC6C9] p-3 rounded-lg mr-4">
                        <div className="text-[#001D23]">
                          {service.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium text-white">{service.title}</h3>
                        <p className="text-white/90 text-sm line-clamp-1">
                          {service.shortDescription}
                        </p>
                      </div>
                      <div className="text-[#6BC6C9]">
                        {expandedId === service.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expandable Content */}
              <AnimatePresence>
                {expandedId === service.id && (
                  <motion.div
                    variants={expandVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="px-6 py-5 border-t border-[#003E5E]"
                  >
                    <div className="flex gap-6">
                      <div className="flex-1">
                        <p className="text-gray-300 mb-4">{service.fullDescription}</p>
                        <button className="px-4 py-2 bg-[#6BC6C9] text-[#001D23] rounded-md hover:bg-[#6BC6C9]/80 transition-colors text-sm font-medium">
                          Más información
                        </button>
                      </div>
                      
                      {/* Additional visual element */}
                      <div className="hidden md:block w-1/3 rounded-lg overflow-hidden">
                        <img 
                          src={service.bgImage} 
                          alt={service.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;