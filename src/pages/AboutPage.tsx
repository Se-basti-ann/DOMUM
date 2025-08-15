import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Award, Leaf, Lightbulb, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  useEffect(() => {
    document.title = 'Nosotros | DOMUM Arquitectura';
  }, []);

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <>
      {/* Header with gradient background */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-800 py-20 md:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-600/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-600/5 rounded-full -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-12 bg-accent-600"></div>
              <span className="text-accent-600 font-medium">NOSOTROS</span>
            </div>
            <h1 className="text-white mb-6">Sobre Nosotros</h1>
            <p className="text-primary-100 text-lg">
              DOMUM Arquitectura es una firma especializada en diseño arquitectónico, diseño retail, 
              mantenimientos generales y locativos, gestión de proyectos y obras civiles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section ref={ref} className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-medium mb-6 text-primary-900">Nuestra Historia</h2>
              <p className="text-primary-700 mb-6">
                DOMUM Arquitectura nació de la pasión por crear espacios 
                excepcionales que combinan funcionalidad, estética y sostenibilidad. 
                A lo largo de los años, hemos crecido hasta convertirnos en un referente 
                en el sector de la arquitectura.
              </p>
              <p className="text-primary-700 mb-8">
                Nuestro equipo multidisciplinario de arquitectos, diseñadores e ingenieros 
                trabaja en estrecha colaboración con nuestros clientes para transformar 
                sus visiones en realidades tangibles.
              </p>
              
              <Link 
                to="/proyectos" 
                className="inline-flex items-center gap-2 text-primary-800 font-medium hover:text-accent-600 transition-colors"
              >
                Ver nuestros proyectos
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={16} />
                </motion.div>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-600/10 rounded-full z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent-600/10 rounded-full z-0"></div>
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Equipo de DOMUM Arquitectura"
                className="rounded-lg shadow-lg relative z-10 border-4 border-white"
              />
              <div className="absolute -bottom-6 left-6 bg-accent-600 text-primary-900 py-2 px-4 rounded-lg shadow-lg z-20 font-medium">
                Desde 2010
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-medium mb-4 text-primary-900">Nuestros Valores</h2>
              <p className="text-primary-700 max-w-2xl mx-auto">
                Estos principios fundamentales guían cada decisión que tomamos y cada proyecto que emprendemos.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-primary-900 to-primary-700 p-6 rounded-xl shadow-md text-white group hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="bg-accent-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb size={24} className="text-primary-900" />
                </div>
                <h3 className="text-xl font-medium mb-4">Innovación</h3>
                <p className="text-primary-100">
                  Buscamos constantemente nuevas formas de resolver desafíos arquitectónicos, 
                  incorporando las últimas tecnologías y métodos sostenibles.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-primary-900 to-primary-700 p-6 rounded-xl shadow-md text-white group hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="bg-accent-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Leaf size={24} className="text-primary-900" />
                </div>
                <h3 className="text-xl font-medium mb-4">Sostenibilidad</h3>
                <p className="text-primary-100">
                  Nos comprometemos a crear espacios que no solo sean hermosos y funcionales, 
                  sino también respetuosos con el medio ambiente.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-primary-900 to-primary-700 p-6 rounded-xl shadow-md text-white group hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="bg-accent-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award size={24} className="text-primary-900" />
                </div>
                <h3 className="text-xl font-medium mb-4">Excelencia</h3>
                <p className="text-primary-100">
                  Cada proyecto es una oportunidad para superar expectativas y 
                  demostrar nuestro compromiso con la calidad y el detalle.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Vision & Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-md border border-primary-200 hover:shadow-lg transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-accent-600"></div>
              <div className="mb-6 flex items-center gap-4">
                <div className="bg-accent-600/10 p-3 rounded-lg">
                  <Target size={24} className="text-accent-600" />
                </div>
                <h3 className="text-2xl font-medium text-primary-900">Nuestra Misión</h3>
              </div>
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
              className="bg-white p-8 rounded-xl shadow-md border border-primary-200 hover:shadow-lg transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-accent-600"></div>
              <div className="mb-6 flex items-center gap-4">
                <div className="bg-accent-600/10 p-3 rounded-lg">
                  <Users size={24} className="text-accent-600" />
                </div>
                <h3 className="text-2xl font-medium text-primary-900">Nuestra Visión</h3>
              </div>
              <p className="text-primary-700">
                Ser reconocidos como líderes en arquitectura innovadora y sostenible, 
                estableciendo nuevos estándares de excelencia en el diseño y construcción 
                de espacios que inspiren a las generaciones futuras.
              </p>
            </motion.div>
          </div>
          
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 bg-gradient-to-r from-primary-900 to-primary-800 p-8 md:p-12 rounded-xl text-white text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-600/10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-600/10 rounded-full -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-medium mb-4">¿Listo para trabajar juntos?</h2>
              <p className="text-primary-100 mb-8">
                Contáctanos hoy para discutir cómo podemos ayudarte a hacer realidad tu próximo proyecto arquitectónico.
              </p>
              <Link 
                to="/contacto" 
                className="inline-flex items-center gap-2 bg-accent-600 text-primary-900 px-6 py-3 rounded-md font-medium hover:bg-accent-700 transition-colors"
              >
                Contactar Ahora
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={18} />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;