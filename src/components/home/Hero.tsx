import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Project } from '../../types';

const Hero = () => {
  const supabase = useSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  // Efecto para cambiar la imagen cada 5 segundos
  useEffect(() => {
    if (projects.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === projects.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [projects]);

  const fetchFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5); // Limitamos a 5 proyectos para el carrusel

      if (error) throw error;
      setProjects(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching projects for hero:', error);
      setIsLoading(false);
    }
  };

  // Imagen por defecto en caso de que no haya proyectos o esté cargando
  const defaultImage = "https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1800";
  
  // Obtener la URL de la imagen actual
  const currentImage = !isLoading && projects.length > 0 
    ? projects[currentImageIndex].image_url 
    : defaultImage;

  return (
    <section className="relative h-screen">
      {/* Background Image with Transition */}
      <motion.div 
        key={currentImageIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: `url('${currentImage}')`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </motion.div>

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
            estéticos, ingeniosos y sostenibles que transforman la forma en que vivimos y trabajamos.
          </p>

          {/* Botones de navegación */}
          {/* <div className="flex flex-wrap gap-4">
            <NavLink to="/proyectos" className="button-primary bg-accent-600 hover:bg-accent-700">
              Ver Proyectos
            </NavLink>
            <NavLink to="/contacto" className="button-secondary border-white text-white hover:bg-white hover:text-primary-900">
              Contáctanos
            </NavLink>
          </div> */}
        </motion.div>
      </div>

      {/* Indicadores de imágenes */}
      {!isLoading && projects.length > 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

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