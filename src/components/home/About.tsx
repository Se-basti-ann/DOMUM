import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { NavLink } from 'react-router-dom';

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

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <div>
            <motion.h2 variants={itemVariants} className="text-primary-900 mb-6">
              Sobre DOMUM Arquitectura
            </motion.h2>
            
            <motion.p variants={itemVariants} className="mb-6">
              DOMUM Arquitectura es un estudio de arquitectura comprometido con la excelencia 
              y la innovación. Nuestra firma ha dejado huella en proyectos 
              residenciales, comerciales e institucionales, siempre con un enfoque en 
              la sostenibilidad y el diseño centrado en las personas.
            </motion.p>
            
            <motion.p variants={itemVariants} className="mb-8">
              Nuestro equipo multidisciplinario de arquitectos, diseñadores e ingenieros 
              trabaja en estrecha colaboración con nuestros clientes para transformar 
              sus visiones en espacios inspiradores y funcionales.
            </motion.p>
            
            <motion.div variants={itemVariants}>              
              <NavLink to="/nosotros" className="button-primary bg-accent-600 hover:bg-accent-700">
              Conoce más sobre nosotros
            </NavLink>
            </motion.div>
          </div>

          {/* Right Content - Vision and Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              variants={itemVariants}
              className="bg-primary-50 p-6 rounded-lg border-l-4 border-accent-500"
            >
              <h3 className="text-xl font-medium mb-4">Nuestra Misión</h3>
              <p>
                Crear espacios excepcionales que mejoren la vida de las personas y 
                respeten el entorno natural, combinando funcionalidad, estética y 
                sostenibilidad en cada proyecto.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-primary-50 p-6 rounded-lg border-l-4 border-primary-500"
            >
              <h3 className="text-xl font-medium mb-4">Nuestra Visión</h3>
              <p>
                Ser reconocidos como líderes en arquitectura innovadora y sostenible, 
                estableciendo nuevos estándares de excelencia en el diseño y construcción 
                de espacios que inspiren a las generaciones futuras.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;