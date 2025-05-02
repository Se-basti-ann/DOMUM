import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Project } from '../../types';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const supabase = useSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setIsLoading(false);
    }
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
            <NavLink 
              to="/proyectos" 
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-accent-600 font-medium hover:text-accent-800 transition-colors"
            >
              Ver todos los proyectos
              <ArrowUpRight size={16} />
            </NavLink>
          </motion.div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {isLoading ? (
            <div className="col-span-3 flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <p className="text-primary-600">No hay proyectos destacados disponibles.</p>
            </div>
          ) : (
            projects.map(project => (
              <motion.div 
                key={project.id}
                variants={itemVariants}
                className="group overflow-hidden rounded-lg"
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-6">
                    <span className="inline-block px-3 py-1 bg-white text-primary-900 text-sm font-medium rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-white text-xl font-medium mb-1">{project.title}</h3>
                    <p className="text-primary-100">{project.year}</p>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/40 w-full h-full flex items-center justify-center">
                      <NavLink 
                        to={`/proyectos/${project.slug}`}
                        className="bg-white text-primary-900 px-5 py-2 rounded-full font-medium hover:bg-primary-50 transition-colors"
                      >
                        Ver Proyecto
                      </NavLink>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;