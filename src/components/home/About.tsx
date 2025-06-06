import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Award, Users, Home, Lightbulb, Target, Compass } from 'lucide-react';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content - Ahora con imagen y texto superpuesto */}
          <div className="relative">
            <motion.div 
              variants={itemVariants}
              className="relative z-10 rounded-lg overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" 
                alt="DOMUM Arquitectura Studio" 
                className="w-full h-[400px] object-cover"
              />
              
              {/* Overlay con estadísticas */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#001D23]/90 to-transparent p-6">
                <div className="grid grid-cols-2 gap-4 text-white">
                  {stats.slice(0, 2).map((stat, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="p-2 bg-[#6BC6C9] rounded-full">
                        {stat.icon}
                      </div>
                      <div>
                        <AnimatedCounter value={stat.value} />
                        <div className="text-sm opacity-80">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Elemento decorativo de fondo */}
            <motion.div 
              variants={itemVariants}
              className="absolute -bottom-6 -right-6 w-64 h-64 bg-[#00303F] rounded-lg -z-10"
            ></motion.div>
          </div>

          {/* Right Content - Misión y Visión con iconos */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="mb-6">
              <p className="text-lg leading-relaxed text-gray-300">
                DOMUM Arquitectura es un estudio comprometido con la excelencia 
                y la innovación. Nuestra firma ha dejado huella en proyectos 
                residenciales, comerciales e institucionales, siempre con un enfoque en 
                la sostenibilidad y el diseño centrado en las personas.
              </p>
            </motion.div>
            
            {/* Misión y Visión con iconos */}
            <div className="space-y-6">
              <motion.div
                variants={itemVariants}
                className="flex gap-4 p-6 bg-gradient-to-r from-[#00303F] to-[#001D23] rounded-lg border-l-4 border-[#6BC6C9] shadow-sm"
              >
                <div className="shrink-0">
                  <div className="p-3 bg-[#003E5E] text-[#6BC6C9] rounded-full">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Nuestra Misión</h3>
                  <p className="text-gray-300">
                    Crear espacios excepcionales que mejoren la vida de las personas y 
                    respeten el entorno natural, combinando funcionalidad, estética y 
                    sostenibilidad en cada proyecto.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex gap-4 p-6 bg-gradient-to-r from-[#00303F] to-[#001D23] rounded-lg border-l-4 border-[#003E5E] shadow-sm"
              >
                <div className="shrink-0">
                  <div className="p-3 bg-[#003E5E] text-[#6BC6C9] rounded-full">
                    <Compass className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">Nuestra Visión</h3>
                  <p className="text-gray-300">
                    Ser reconocidos como líderes en arquitectura innovadora y sostenible, 
                    estableciendo nuevos estándares de excelencia en el diseño y construcción 
                    de espacios que inspiren a las generaciones futuras.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants} className="pt-4">              
              <NavLink to="/nosotros" className="px-6 py-3 bg-[#6BC6C9] text-[#001D23] rounded-md hover:bg-[#6BC6C9]/80 transition-colors inline-flex items-center gap-2 font-medium">
                Conoce más sobre nosotros
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </NavLink>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Nueva sección de estadísticas con animación */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-[#00303F] p-6 rounded-lg shadow-md border border-[#003E5E] text-center hover:shadow-lg transition-shadow relative overflow-hidden group"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              {/* Círculo decorativo animado */}
              <motion.div 
                className="absolute -right-10 -top-10 w-40 h-40 bg-[#003E5E] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <div className="flex justify-center mb-4 relative z-10">
                <motion.div 
                  className="p-3 bg-[#003E5E] text-[#6BC6C9] rounded-full"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  {stat.icon}
                </motion.div>
              </div>
              
              <div className="relative z-10 mb-1">
                <AnimatedCounter value={stat.value} duration={2500 + index * 500} />
              </div>
              
              <div className="text-gray-300 relative z-10">{stat.label}</div>
              
              {/* Línea decorativa animada */}
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-[#6BC6C9]"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default About;