import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative h-screen">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1800')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative container-custom h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-white mb-6">
            Diseñando espacios que
            <span className="block text-accent-400"> inspiran el futuro</span>
          </h1>

          <p className="text-lg text-white opacity-90 mb-8 max-w-xl">
            Somos un estudio de arquitectura dedicado a crear espacios funcionales, 
            estéticos y sostenibles que transforman la forma en que vivimos y trabajamos.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="/proyectos" className="button-primary bg-accent-600 hover:bg-accent-700">
              Ver Proyectos
            </a>
            <a href="/contacto" className="button-secondary border-white text-white hover:bg-white hover:text-primary-900">
              Contáctanos
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;