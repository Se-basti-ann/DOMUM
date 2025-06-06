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
      <section className="bg-gradient-to-r from-[#001D23] to-[#003E5E] py-20 md:py-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#6BC6C9]/5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6BC6C9]/5 rounded-full -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-12 bg-[#6BC6C9]"></div>
              <span className="text-[#6BC6C9] font-medium font-['Raleway']">NOSOTROS</span>
            </div>
            <h1 className="text-white mb-6 font-['Avenir Next']">Sobre Nosotros</h1>
            <p className="text-gray-300 text-lg font-['Raleway']">
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
              <h2 className="text-3xl font-medium mb-6 text-[#001D23] font-['Avenir Next']">Nuestra Historia</h2>
              <p className="text-[#00303F] mb-6 font-['Raleway']">
                DOMUM Arquitectura nació de la pasión por crear espacios 
                excepcionales que combinan funcionalidad, estética y sostenibilidad. 
                A lo largo de los años, hemos crecido hasta convertirnos en un referente 
                en el sector de la arquitectura.
              </p>
              <p className="text-[#00303F] mb-8 font-['Raleway']">
                Nuestro equipo multidisciplinario de arquitectos, diseñadores e ingenieros 
                trabaja en estrecha colaboración con nuestros clientes para transformar 
                sus visiones en realidades tangibles.
              </p>
              
              <Link 
                to="/proyectos" 
                className="inline-flex items-center gap-2 text-[#003E5E] font-medium hover:text-[#6BC6C9] transition-colors font-['Raleway']"
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
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#6BC6C9]/10 rounded-full z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#6BC6C9]/10 rounded-full z-0"></div>
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Equipo de DOMUM Arquitectura"
                className="rounded-lg shadow-lg relative z-10 border-4 border-white"
              />
              <div className="absolute -bottom-6 left-6 bg-[#6BC6C9] text-[#001D23] py-2 px-4 rounded-lg shadow-lg z-20 font-medium font-['Avenir Next']">
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
              <h2 className="text-2xl md:text-3xl font-medium mb-4 text-[#001D23] font-['Avenir Next']">Nuestros Valores</h2>
              <p className="text-[#00303F] max-w-2xl mx-auto font-['Raleway']">
                Estos principios fundamentales guían cada decisión que tomamos y cada proyecto que emprendemos.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-[#001D23] to-[#00303F] p-6 rounded-xl shadow-md text-white group hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="bg-[#6BC6C9] w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb size={24} className="text-[#001D23]" />
                </div>
                <h3 className="text-xl font-medium mb-4 font-['Avenir Next']">Innovación</h3>
                <p className="text-gray-300 font-['Raleway']">
                  Buscamos constantemente nuevas formas de resolver desafíos arquitectónicos, 
                  incorporando las últimas tecnologías y métodos sostenibles.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-[#001D23] to-[#00303F] p-6 rounded-xl shadow-md text-white group hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="bg-[#6BC6C9] w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Leaf size={24} className="text-[#001D23]" />
                </div>
                <h3 className="text-xl font-medium mb-4 font-['Avenir Next']">Sostenibilidad</h3>
                <p className="text-gray-300 font-['Raleway']">
                  Nos comprometemos a crear espacios que no solo sean hermosos y funcionales, 
                  sino también respetuosos con el medio ambiente.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-[#001D23] to-[#00303F] p-6 rounded-xl shadow-md text-white group hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
              >
                <div className="bg-[#6BC6C9] w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award size={24} className="text-[#001D23]" />
                </div>
                <h3 className="text-xl font-medium mb-4 font-['Avenir Next']">Excelencia</h3>
                <p className="text-gray-300 font-['Raleway']">
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
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-[#6BC6C9]"></div>
              <div className="mb-6 flex items-center gap-4">
                <div className="bg-[#6BC6C9]/10 p-3 rounded-lg">
                  <Target size={24} className="text-[#6BC6C9]" />
                </div>
                <h3 className="text-2xl font-medium text-[#001D23] font-['Avenir Next']">Nuestra Misión</h3>
              </div>
              <p className="text-[#00303F] font-['Raleway']">
                Crear espacios excepcionales que mejoren la vida de las personas y 
                respeten el entorno natural, combinando funcionalidad, estética y 
                sostenibilidad en cada proyecto.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-[#6BC6C9]"></div>
              <div className="mb-6 flex items-center gap-4">
                <div className="bg-[#6BC6C9]/10 p-3 rounded-lg">
                  <Users size={24} className="text-[#6BC6C9]" />
                </div>
                <h3 className="text-2xl font-medium text-[#001D23] font-['Avenir Next']">Nuestra Visión</h3>
              </div>
              <p className="text-[#00303F] font-['Raleway']">
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
            className="mt-20 bg-gradient-to-r from-[#001D23] to-[#003E5E] p-8 md:p-12 rounded-xl text-white text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6BC6C9]/10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6BC6C9]/10 rounded-full -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-medium mb-4 font-['Avenir Next']">¿Listo para trabajar juntos?</h2>
              <p className="text-gray-300 mb-8 font-['Raleway']">
                Contáctanos hoy para discutir cómo podemos ayudarte a hacer realidad tu próximo proyecto arquitectónico.
              </p>
              <Link 
                to="/contacto" 
                className="inline-flex items-center gap-2 bg-[#6BC6C9] text-[#001D23] px-6 py-3 rounded-md font-medium hover:bg-[#6BC6C9]/90 transition-colors font-['Avenir Next']"
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