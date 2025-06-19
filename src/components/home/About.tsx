import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Award, Users, Home, Lightbulb } from 'lucide-react';

// Componente para el contador animado
const AnimatedCounter = ({ value, duration = 2000 }: { value: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true });
  
  // Extraer el número de la cadena (por ejemplo, '120+' -> 120)
  const numericValue = parseInt(value.replace(/\D/g, ''));
  const hasSuffix = value.includes('+');
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const increment = end / (duration / 16); // 16ms es aproximadamente 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start > end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, numericValue, duration]);
  
  return (
    <div ref={countRef} className="inline-flex items-baseline">
      <span className="text-3xl font-bold text-white">
        {count}
        {hasSuffix && '+'}
      </span>
    </div>
  );
};

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Datos para las estadísticas
  const stats = [
    { value: '120+', label: 'Proyectos Completados', icon: <Home className="w-6 h-6" /> },
    { value: '15+', label: 'Años de Experiencia', icon: <Award className="w-6 h-6" /> },
    { value: '40+', label: 'Profesionales', icon: <Users className="w-6 h-6" /> },
    { value: '8', label: 'Premios de Diseño', icon: <Lightbulb className="w-6 h-6" /> }
  ];

  return (
    <section ref={ref} className="section-padding bg-[#001D23] overflow-hidden">
      <div className="container-custom">
        {/* Título principal con línea decorativa */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex items-center gap-4 mb-12"
        >
          <div className="h-[2px] w-12 bg-[#6BC6C9]"></div>
          <h2 className="text-white text-3xl md:text-4xl font-medium">Sobre DOMUM Arquitectura</h2>
        </motion.div>

        <div className="flex flex-col items-center max-w-4xl mx-auto">
          {/* Imagen con estadísticas superpuestas */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative z-10 rounded-lg overflow-hidden shadow-xl w-full"
          >
            <img 
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" 
              alt="DOMUM Arquitectura Studio" 
              className="w-full h-[500px] object-cover"
            />
            
            {/* Overlay con estadísticas */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#001D23]/95 to-transparent p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="p-3 bg-[#6BC6C9] rounded-full mb-3">
                      {stat.icon}
                    </div>
                    <div className="mb-1">
                      <AnimatedCounter value={stat.value} duration={2000 + index * 300} />
                    </div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Botón de navegación */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="mt-8"
          >              
            <NavLink to="/nosotros" className="px-8 py-4 bg-[#6BC6C9] text-[#001D23] rounded-md hover:bg-[#6BC6C9]/80 transition-colors inline-flex items-center gap-2 font-medium text-lg">
              Conoce más sobre nosotros
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </NavLink>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;