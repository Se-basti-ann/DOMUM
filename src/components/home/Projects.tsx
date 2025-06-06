import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Project } from '../../types';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const supabase = useSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6); // Increased limit for more carousel items

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === projects.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? projects.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-advance carousel every 5 seconds
  useEffect(() => {
    if (projects.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, projects.length]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary-900 mb-3">Proyectos Destacados</h2>
            <p className="text-primary-700 max-w-xl">
              Una muestra de nuestros proyectos más recientes y destacados en 
              diferentes categorías arquitectónicas.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
             <NavLink to="/proyectos" className="button-primary mt-4 md:mt-0 inline-flex items-center gap-2 text-accent-600 font-medium hover:text-accent-800 transition-colors">
              Ver todos los proyectos
              <ArrowUpRight size={16} />
            </NavLink>
          </motion.div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {isLoading ? (
            <div className="flex justify-center py-24">
              <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-primary-600">No hay proyectos destacados disponibles.</p>
            </div>
          ) : (
            <>
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-xl h-[500px] md:h-[600px]">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                    className="absolute w-full h-full"
                  >
                    <div className="relative h-full w-full overflow-hidden">
                      <img 
                        src={projects[currentIndex]?.image_url} 
                        alt={projects[currentIndex]?.title}
                        className="w-full h-full object-cover"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      
                      <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                        <div className="max-w-3xl">
                          <span className="inline-block px-3 py-1 bg-white text-primary-900 text-sm font-medium rounded-full mb-4">
                            {projects[currentIndex]?.category}
                          </span>
                          <h3 className="text-white text-2xl md:text-3xl font-medium mb-3">{projects[currentIndex]?.title}</h3>
                          <p className="text-primary-100 mb-6">{projects[currentIndex]?.year}</p>
                          
                          <NavLink 
                            to={`/proyectos/${projects[currentIndex]?.slug}`}
                            className="px-6 py-3 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors inline-flex items-center gap-2"
                          >
                            Ver Proyecto
                            <ArrowUpRight size={16} />
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* Navigation Arrows */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-10"
                  aria-label="Proyecto anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-colors z-10"
                  aria-label="Proyecto siguiente"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center mt-6 gap-2">
                {projects.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-accent-600 w-8' 
                        : 'bg-primary-200 hover:bg-primary-300'
                    }`}
                    aria-label={`Ir al proyecto ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Thumbnail Preview (optional for larger screens) */}
              <div className="hidden lg:flex justify-center mt-6 gap-4">
                {projects.map((project, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative overflow-hidden rounded-md transition-all duration-300 ${
                      index === currentIndex 
                        ? 'ring-2 ring-accent-600 ring-offset-2' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ width: '100px', height: '60px' }}
                  >
                    <img 
                      src={project.image_url} 
                      alt={`Miniatura de ${project.title}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;