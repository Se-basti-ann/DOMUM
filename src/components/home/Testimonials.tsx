import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    position: 'CEO de Inmobiliaria Moderna',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
    content: 'DOMUM Arquitectura transformó nuestra visión en realidad. Su atención al detalle y compromiso con la sostenibilidad superó todas nuestras expectativas.',
    rating: 5
  },
  {
    id: 2,
    name: 'Ana Martínez',
    position: 'Directora de Desarrollo Urbano',
    image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg',
    content: 'La creatividad y profesionalismo del equipo de DOMUM Arquitectura es excepcional. Lograron crear un espacio que refleja perfectamente nuestra identidad corporativa.',
    rating: 5
  },
  {
    id: 3,
    name: 'Miguel Sánchez',
    position: 'Propietario de Luxury Homes',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
    content: 'Trabajar con DOMUM Arquitectura fue una experiencia extraordinaria. Su capacidad para combinar funcionalidad y estética es incomparable.',
    rating: 5
  }
];

const partners = [
  {
    id: 1,
    name: 'Constructora Vanguardia',
    logo: 'https://images.pexels.com/photos/327540/pexels-photo-327540.jpeg',
  },
  {
    id: 2,
    name: 'Desarrollos Urbanos Elite',
    logo: 'https://images.pexels.com/photos/273209/pexels-photo-273209.jpeg',
  },
  {
    id: 3,
    name: 'Inmobiliaria Futura',
    logo: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
  },
  {
    id: 4,
    name: 'Grupo Constructor Innovación',
    logo: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
  },
  {
    id: 5,
    name: 'Proyectos Sustentables SA',
    logo: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg',
  }
];

// Variantes de animación para contenedores
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  }
};

// Variantes de animación para elementos individuales
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Variantes más ligeras para los partners
const partnerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1, margin: "100px 0px 0px 0px" });

  return (
    <section ref={ref} className="py-20 md:py-32 bg-gradient-to-b from-white to-primary-50">
      <div className="container-custom">
        {/* Testimonials Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary-900 mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-primary-700 max-w-2xl mx-auto">
            Descubre por qué nuestros clientes confían en nosotros para crear 
            espacios excepcionales que transforman su visión en realidad.
          </p>
        </motion.div>

        {/* Testimonials Grid - Usando animación de contenedor para coordinar */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              <div className="absolute -top-6 left-6">
                <div className="bg-accent-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                  <Quote size={24} className="text-white" />
                </div>
              </div>

              <div className="mb-6 pt-4">
                <p className="text-primary-700 italic">"{testimonial.content}"</p>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                  loading="lazy" // Añadiendo carga perezosa para las imágenes
                />
                <div>
                  <h4 className="font-medium text-primary-900">{testimonial.name}</h4>
                  <p className="text-sm text-primary-600">{testimonial.position}</p>
                </div>
                <div className="ml-auto flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Partners Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-medium mb-4">Empresas que confían en nosotros</h2>
          <p className="text-primary-700">
            Colaboramos con las principales empresas del sector para ofrecer 
            resultados excepcionales.
          </p>
        </motion.div>

        {/* Partners Grid - Usando animación más ligera */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {partners.map((partner) => (
            <motion.div
              key={partner.id}
              variants={partnerVariants}
              className="group relative h-24 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                loading="lazy" // Añadiendo carga perezosa para las imágenes
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                <span className="text-white text-sm font-medium text-center">
                  {partner.name}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;