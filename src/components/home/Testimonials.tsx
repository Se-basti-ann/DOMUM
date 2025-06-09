import { useRef, useState, useEffect, memo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, Award, Users, Home, Lightbulb } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Definición de tipos para mejorar la seguridad de tipos
interface Testimonial {
  id: number;
  name: string;
  position: string;
  image: string;
  content: string;
  rating: number;
}

interface Partner {
  id: number;
  name: string;
  logo: string;
}

// Datos de testimonios
const testimonials: Testimonial[] = [
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

// Datos de socios
const partners: Partner[] = [
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

// Variantes de animación para el carrusel 3D
const carouselVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? -30 : 30,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -1000 : 1000,
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 30 : -30,
    transition: {
      duration: 0.5
    }
  })
};

// Variantes para los partners con efecto de desplazamiento
const marqueeVariants = {
  animate: {
    x: [0, -1920],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 30,
        ease: "linear",
      },
    },
  },
};

// Variantes para el contador de confianza
const counterVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5,
      delay: 0.3
    }
  }
};

// Props tipadas para el componente TestimonialCard
interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

// Componente testimonial mejorado con efectos 3D
const TestimonialCard = memo(({ testimonial, isActive }: TestimonialCardProps) => (
  <motion.div
    className={`bg-[#00303F] rounded-xl p-8 shadow-xl relative overflow-hidden transform transition-all duration-500 ${
      isActive ? 'scale-100 z-10' : 'scale-95 opacity-70'
    }`}
    whileHover={{ scale: isActive ? 1.02 : 0.98 }}
    style={{ 
      perspective: "1000px",
      transformStyle: "preserve-3d"
    }}
  >
    {/* Elemento decorativo */}
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#003E5E] rounded-full opacity-20"></div>
    
    <div className="absolute -top-6 left-6 z-10">
      <div className="bg-[#6BC6C9] w-12 h-12 rounded-full flex items-center justify-center shadow-lg mt-7">
        <Quote size={28} className="text-[#001D23]" aria-hidden="true" />
      </div>
    </div>

    <div className="mb-8 pt-6 relative z-10">
      <p className="text-gray-200 italic text-lg leading-relaxed">"{testimonial.content}"</p>
    </div>

    <div className="flex items-center gap-4 relative z-10">
      <div className="relative">
        <img
          src={testimonial.image}
          alt={`Foto de ${testimonial.name}`}
          className="w-16 h-16 rounded-full object-cover border-2 border-[#6BC6C9]/30"
          loading="lazy"
          width="64"
          height="64"
        />
        <motion.div 
          className="absolute -inset-1 rounded-full bg-[#6BC6C9]/20 -z-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
      <div>
        <h4 className="font-medium text-white text-lg">{testimonial.name}</h4>
        <p className="text-sm text-gray-300">{testimonial.position}</p>
      </div>
      <div className="ml-auto flex" aria-label={`Calificación: ${testimonial.rating} de 5 estrellas`}>
        {[...Array(testimonial.rating)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Star
              size={18}
              className="text-[#6BC6C9] fill-current"
              aria-hidden="true"
            />
          </motion.div>
        ))}
      </div>
    </div>
    
    {/* Elemento decorativo inferior */}
    <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6BC6C9] to-transparent"></div>
  </motion.div>
));

// Asignamos un nombre para mejorar la depuración
TestimonialCard.displayName = 'TestimonialCard';

// Props tipadas para el componente PartnerCard
interface PartnerCardProps {
  partner: Partner;
  index: number;
}

// Componente partner mejorado con efectos de hover
const PartnerCard = memo(({ partner, index }: PartnerCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group relative h-28 bg-[#00303F] rounded-lg shadow-md overflow-hidden"
    whileHover={{ 
      y: -5, 
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)" 
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#003E5E] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    <img
      src={partner.logo}
      alt={`Logo de ${partner.name}`}
      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
      loading="lazy"
      width="200"
      height="112"
    />
    
    <div className="absolute inset-0 bg-gradient-to-t from-[#001D23]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
      <motion.span 
        className="text-white text-sm font-medium text-center"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {partner.name}
      </motion.span>
    </div>
  </motion.div>
));

// Asignamos un nombre para mejorar la depuración
PartnerCard.displayName = 'PartnerCard';

// Componente para mostrar estadísticas con contador animado
const AnimatedCounter = ({ value, label, icon }: { value: string, label: string, icon: JSX.Element }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/\D/g, ''));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const duration = 2000;
      const increment = end / (duration / 16);
      
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
  }, [isInView, numericValue]);

  return (
    <motion.div
      ref={ref}
      variants={counterVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="bg-[#00303F] rounded-xl p-6 shadow-md text-center border border-[#003E5E]/30"
    >
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-[#003E5E] text-[#6BC6C9] rounded-full">
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-white mb-1">
        {count}{value.includes('+') ? '+' : ''}
      </div>
      <div className="text-gray-300 text-sm">{label}</div>
    </motion.div>
  );
};

const Testimonials = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: 0.1,
    margin: "0px 0px -100px 0px"
  });

  // Estado para el carrusel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Funciones para el carrusel
  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Avance automático del carrusel
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Datos para las estadísticas
  const stats = [
    { value: '120+', label: 'Proyectos Completados', icon: <Home size={24} /> },
    { value: '15+', label: 'Años de Experiencia', icon: <Award size={24} /> },
    { value: '40+', label: 'Profesionales', icon: <Users size={24} /> },
    { value: '8', label: 'Premios de Diseño', icon: <Lightbulb size={24} /> }
  ];

  return (
    <section ref={ref} className="py-20 md:py-32 bg-[#001D23] overflow-hidden">
      <div className="container-custom">
        {/* Testimonials Header con animación mejorada */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-white mb-4 relative inline-block">
              Lo que dicen nuestros clientes
              <motion.div 
                className="absolute -bottom-2 left-1/2 h-1 bg-[#6BC6C9] transform -translate-x-1/2"
                initial={{ width: 0 }}
                animate={isInView ? { width: '50%' } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Descubre por qué nuestros clientes confían en nosotros para crear 
            espacios excepcionales que transforman su visión en realidad.
          </motion.p>
        </motion.div>

        {/* Carrusel 3D de testimonios */}
        <div className="relative mb-24 ">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={carouselVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="testimonial-carousel"
              >
                <TestimonialCard 
                  testimonial={testimonials[currentIndex]} 
                  isActive={true}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Controles del carrusel */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:px-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="bg-[#003E5E] p-3 rounded-full shadow-md text-[#6BC6C9] hover:bg-[#00303F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6BC6C9]"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="bg-[#003E5E] p-3 rounded-full shadow-md text-[#6BC6C9] hover:bg-[#00303F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#6BC6C9]"
              aria-label="Testimonio siguiente"
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
          
          {/* Indicadores del carrusel */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#6BC6C9] w-8' 
                    : 'bg-[#003E5E] hover:bg-[#003E5E]/80'
                }`}
                aria-label={`Ver testimonio ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Estadísticas con contadores animados */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-medium mb-4 text-white">Nuestra Trayectoria</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Números que respaldan nuestra experiencia y compromiso con la excelencia.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <AnimatedCounter 
                key={index}
                value={stat.value} 
                label={stat.label} 
                icon={stat.icon} 
              />
            ))}
          </div>
        </motion.div> */}

        {/* Partners Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-medium mb-4 text-white">Empresas que confían en nosotros</h2>
          <p className="text-gray-300">
            Colaboramos con las principales empresas del sector para ofrecer 
            resultados excepcionales.
          </p>
        </motion.div>

        {/* Partners con efecto de desplazamiento continuo */}
        <div className="overflow-hidden mb-8">
          <motion.div
            className="flex gap-8 items-center"
            variants={marqueeVariants}
            animate="animate"
            style={{ width: "fit-content" }}
          >
            {/* Primera copia de partners */}
            {partners.map((partner, index) => (
              <div key={`partner-1-${partner.id}`} className="w-48">
                <PartnerCard partner={partner} index={index} />
              </div>
            ))}
            
            {/* Segunda copia para crear efecto infinito */}
            {partners.map((partner, index) => (
              <div key={`partner-2-${partner.id}`} className="w-48">
                <PartnerCard partner={partner} index={index} />
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16 bg-[#00303F] p-8 rounded-xl shadow-lg max-w-2xl mx-auto border border-[#003E5E]/30"
        >
          <h3 className="text-xl font-medium mb-4 text-white">¿Listo para transformar tus ideas en realidad?</h3>
          <p className="text-gray-300 mb-6">
            Únete a nuestros clientes satisfechos y descubre cómo podemos ayudarte a crear espacios excepcionales.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-[#6BC6C9] text-[#001D23] rounded-md hover:bg-[#6BC6C9]/90 transition-colors font-medium"
          >
            <NavLink to="/contacto">
              Solicita una consulta gratuita
            </NavLink>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Testimonials);