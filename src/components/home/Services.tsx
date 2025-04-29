import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PenTool, Home, Building2, Briefcase, Users } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Diseño Arquitectónico',
    description: 'Creamos diseños arquitectónicos personalizados que combinan estética, funcionalidad y sostenibilidad para satisfacer sus necesidades específicas.',
    icon: <PenTool size={28} />,
  },
  {
    id: 2,
    title: 'Arquitectura Residencial',
    description: 'Diseñamos hogares que reflejan su estilo de vida, optimizando espacios y creando ambientes cómodos y funcionales.',
    icon: <Home size={28} />,
  },
  {
    id: 3,
    title: 'Arquitectura Comercial',
    description: 'Desarrollamos espacios comerciales atractivos que mejoran la experiencia del cliente y potencian su marca.',
    icon: <Building2 size={28} />,
  },
  {
    id: 4,
    title: 'Consultoría',
    description: 'Ofrecemos asesoramiento experto en todas las etapas de su proyecto, desde la conceptualización hasta la implementación.',
    icon: <Briefcase size={28} />,
  },
  {
    id: 5,
    title: 'Diseño Participativo',
    description: 'Involucramos a los usuarios finales en el proceso de diseño para crear espacios que realmente satisfagan sus necesidades.',
    icon: <Users size={28} />,
  },
];

const Services = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

  return (
    <section ref={ref} className="section-padding bg-primary-50">
      <div className="container-custom">
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-12"
        >
          <h2 className="text-primary-900 mb-4">Nuestros Servicios</h2>
          <p className="max-w-2xl mx-auto text-primary-700">
            Ofrecemos una amplia gama de servicios profesionales para ayudarlo a 
            transformar sus ideas en realidad, desde el concepto inicial hasta la 
            finalización del proyecto.
          </p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map(service => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`bg-white p-6 rounded-lg border border-primary-100 shadow-sm transition-all duration-300 ${
                hoveredId === service.id ? 'shadow-md transform -translate-y-1' : ''
              }`}
            >
              <div className={`w-14 h-14 rounded-lg mb-5 flex items-center justify-center text-white ${
                hoveredId === service.id ? 'bg-accent-600' : 'bg-primary-700'
              } transition-colors duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-medium mb-3">{service.title}</h3>
              <p className="text-primary-700">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;