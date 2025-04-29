import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'Nosotros | DOMUM Arquitectura';
  }, []);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

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
            <h1 className="text-white mb-6">Sobre Nosotros</h1>
            <p className="text-primary-100 text-lg">
            DOMUM Arquitectura es una firma especializada en diseño arquitectónico, diseño retail, 
            mantenimientos generales y locativos, 
            gestión de proyectos, obras civiles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section ref={ref} className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-medium mb-6">Nuestra Historia</h2>
              <p className="text-primary-700 mb-4">
                DOMUM Arquitectura nació de la pasión por crear espacios 
                excepcionales que combinan funcionalidad, estética y sostenibilidad. 
                A lo largo de los años, hemos crecido hasta convertirnos en un referente 
                en el sector de la arquitectura.
              </p>
              <p className="text-primary-700">
                Nuestro equipo multidisciplinario de arquitectos, diseñadores e ingenieros 
                trabaja en estrecha colaboración con nuestros clientes para transformar 
                sus visiones en realidades tangibles.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Equipo de DOMUM Arquitectura"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="bg-primary-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-medium mb-4">Innovación</h3>
              <p className="text-primary-700">
                Buscamos constantemente nuevas formas de resolver desafíos arquitectónicos, 
                incorporando las últimas tecnologías y métodos sostenibles.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-primary-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-medium mb-4">Sostenibilidad</h3>
              <p className="text-primary-700">
                Nos comprometemos a crear espacios que no solo sean hermosos y funcionales, 
                sino también respetuosos con el medio ambiente.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-primary-50 p-6 rounded-lg"
            >
              <h3 className="text-xl font-medium mb-4">Excelencia</h3>
              <p className="text-primary-700">
                Cada proyecto es una oportunidad para superar expectativas y 
                demostrar nuestro compromiso con la calidad y el detalle.
              </p>
            </motion.div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="text-2xl font-medium mb-4">Nuestra Misión</h3>
              <p className="text-primary-700">
                Crear espacios excepcionales que mejoren la vida de las personas y 
                respeten el entorno natural, combinando funcionalidad, estética y 
                sostenibilidad en cada proyecto.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <h3 className="text-2xl font-medium mb-4">Nuestra Visión</h3>
              <p className="text-primary-700">
                Ser reconocidos como líderes en arquitectura innovadora y sostenible, 
                estableciendo nuevos estándares de excelencia en el diseño y construcción 
                de espacios que inspiren a las generaciones futuras.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;