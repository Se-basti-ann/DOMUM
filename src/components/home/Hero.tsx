import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Project } from '../../types';

const Hero = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // URL base de tu API
  const API_BASE_URL = 'https://domumarquitectura.com/assets';

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
      setIsLoading(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/API_Projects.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // La API devuelve directamente un array de proyectos
      if (Array.isArray(data)) {
        // Filtrar proyectos que tengan imagen y limitamos a 5 para el carrusel
        const projectsWithImages = data
          .filter(project => project.image_url && project.image_url.trim() !== '')
          .slice(0, 5);
        
        setProjects(projectsWithImages);
      } else {
        console.error('Unexpected API response format:', data);
        setError('Formato de respuesta inesperado de la API');
      }
    } catch (err) {
      console.error('Error fetching projects for hero:', err);
      setError('Error al cargar los proyectos');
    } finally {
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
        <div className="absolute inset-0 gradient-overlay-dark"></div>
      </motion.div>

      {/* Content */}
      <div className="relative container-custom h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-white mb-6 font-primary">
            Diseñando espacios que
            <span className="block text-accent"> inspiran el futuro</span>
          </h1>

          <p className="text-lg text-white opacity-90 mb-8 max-w-xl font-secondary leading-relaxed">
            Somos un estudio de arquitectura dedicado a crear espacios funcionales, 
            estéticos, ingeniosos y sostenibles que transforman la forma en que vivimos y trabajamos.
          </p>

          {/* Botones de navegación */}
          <div className="flex flex-wrap gap-4">
            <NavLink to="/proyectos" className="button-primary">
              Ver Proyectos
            </NavLink>
            <NavLink to="/contacto" className="button-secondary">
              Contáctanos
            </NavLink>
          </div>

          {/* Mostrar información del proyecto actual */}
          {!isLoading && projects.length > 0 && (
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 p-4 bg-primary/30 rounded-xl backdrop-blur-sm border border-accent/20"
            >
              <h3 className="text-white font-primary font-semibold text-lg mb-2">
                {projects[currentImageIndex].title}
              </h3>
              {projects[currentImageIndex].location && (
                <p className="text-accent opacity-90 text-sm font-secondary mb-1">
                  📍 {projects[currentImageIndex].location}
                </p>
              )}
              {projects[currentImageIndex].year && (
                <p className="text-accent opacity-90 text-sm font-secondary">
                  📅 {projects[currentImageIndex].year}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Indicadores de imágenes */}
      {!isLoading && projects.length > 0 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-accent w-8 h-2' 
                  : 'bg-white/50 hover:bg-white/70 w-2 h-2'
              }`}
              aria-label={`Ver imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Debug info - comentado para producción */}
      {/* <div className="absolute top-4 right-4 bg-primary/80 text-white p-4 rounded-xl text-sm max-w-xs backdrop-blur-sm">
        <div className="font-secondary">Proyectos cargados: {projects.length}</div>
        <div className="font-secondary">Estado: {isLoading ? 'Cargando...' : 'Completado'}</div>
        {error && <div className="text-red-300 font-secondary">Error: {error}</div>}
        <button 
          onClick={fetchFeaturedProjects}
          className="mt-2 px-3 py-1 bg-accent text-primary rounded-lg text-xs font-secondary hover:bg-accent/90 transition-colors"
        >
          Recargar
        </button>
      </div> */}

      {/* Error message */}
      {error && (
        <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-xl font-secondary">
          {error}
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-primary/80 text-white px-4 py-2 rounded-xl backdrop-blur-sm font-secondary">
          Cargando proyectos...
        </div>
      )}

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-8 h-12 border-2 border-accent rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-accent rounded-full"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;