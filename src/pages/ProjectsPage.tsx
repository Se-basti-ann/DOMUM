import { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { MapPin, Calendar, Search, Filter, X, ArrowRight } from 'lucide-react';
import { apiService } from '../services/apiService';

// Definir tipos para las props del componente ProjectCard
interface ProjectCardProps {
  project: Project;
  hoveredProject: string | null;
  setHoveredProject: (id: string | null) => void;
}

// Componentes memoizados para mejorar el rendimiento
const ProjectCard = memo(({ project, hoveredProject, setHoveredProject }: ProjectCardProps) => {
  return (
    <motion.div
      key={project.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
      }}
      className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white"
      onMouseEnter={() => setHoveredProject(project.id)}
      onMouseLeave={() => setHoveredProject(null)}
      whileHover={{ y: -5 }}
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={project.image_url}
          alt={project.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            hoveredProject === project.id ? 'scale-105' : 'scale-100'
          }`}
          loading="lazy" // Carga diferida de imágenes
          onError={(e) => {
            // Manejar error de carga de imagen
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg'; // Imagen de respaldo
            target.alt = 'Imagen no disponible';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001D23]/90 via-[#001D23]/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6">
          {project.category && (
            <span className="inline-block px-3 py-1 bg-[#6BC6C9] text-[#001D23] text-sm font-medium rounded-full mb-3">
              {project.category}
            </span>
          )}
          <h3 className="text-white text-xl font-medium mb-2">{project.title}</h3>
          <div className="flex flex-wrap gap-4 text-gray-300">
            {project.location && (
              <div className="flex items-center gap-1">
                <MapPin size={16} />
                <span>{project.location}</span>
              </div>
            )}
            {project.year && (
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{project.year}</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#001D23]/70 w-full h-full flex items-center justify-center">
            <Link 
              to={`/proyectos/${project.slug || project.id}`}
              className="bg-[#6BC6C9] text-[#001D23] px-6 py-3 rounded-lg font-medium hover:bg-[#6BC6C9]/90 transition-colors inline-flex items-center gap-2"
            >
              Ver Proyecto
              <span className={`transform transition-transform duration-300 ${
                hoveredProject === project.id ? 'translate-x-1' : ''
              }`}>
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Componente principal optimizado
const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [displayedProjectsCount, setDisplayedProjectsCount] = useState(12);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Memoizar la función de filtrado para evitar recálculos innecesarios
  const filterProjects = useCallback(() => {
    if (!projects.length) return;
    
    let filtered = [...projects];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => 
        project.category && project.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project =>
          (project.title && project.title.toLowerCase().includes(query)) ||
          (project.description && project.description.toLowerCase().includes(query)) ||
          (project.location && project.location.toLowerCase().includes(query)) ||
          (project.client && project.client.toLowerCase().includes(query)) ||
          (project.year && project.year.toLowerCase().includes(query))
      );
    }
    
    setFilteredProjects(filtered);
    // Reset displayed count when filters change
    setDisplayedProjectsCount(12);
  }, [projects, selectedCategory, searchQuery]);

  useEffect(() => {
    document.title = 'Proyectos | DOMUM Arquitectura';
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [filterProjects]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching all projects...');
      const data = await apiService.getProjects();
      console.log('All projects data:', data);
      
      // Validar y limpiar los datos
      const validProjects = data.filter(project => 
        project && 
        project.id && 
        project.title
      ).map(project => ({
        ...project,
        // Asegurar que los campos requeridos existan
        title: project.title || 'Sin título',
        description: project.description || '',
        category: project.category || 'Sin categoría',
        year: project.year || '',
        location: project.location || '',
        client: project.client || '',
        image_url: project.image_url || '/placeholder-image.jpg',
        gallery: Array.isArray(project.gallery) ? project.gallery : [],
        slug: project.slug || project.id,
        area: project.meters || project.area || ''
      }));

      console.log(`Processed ${validProjects.length} valid projects`);
      setProjects(validProjects);
      setFilteredProjects(validProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error instanceof Error ? error.message : 'Error cargando proyectos');
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para reintentar la carga
  const retryFetch = () => {
    fetchProjects();
  };

  // Función para mostrar más proyectos
  const showMoreProjects = () => {
    setDisplayedProjectsCount(prev => Math.min(prev + 12, filteredProjects.length));
  };

  // Memoizar las categorías para evitar recálculos
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        projects
          .map(project => project.category)
          .filter(category => category && category.trim() !== '')
      )
    ).sort();
    
    return ['all', ...uniqueCategories];
  }, [projects]);

  // Variantes de animación simplificadas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  return (
    <>
      {/* Header with gradient background - Simplificado */}
      <section className="bg-gradient-to-r from-[#001D23] to-[#003E5E] py-20 md:py-32 relative overflow-hidden">
        {/* Elementos decorativos estáticos en lugar de animados */}
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
              <span className="text-[#6BC6C9] font-medium">PORTAFOLIO</span>
            </div>
            <h1 className="text-white mb-6">Nuestros Proyectos</h1>
            <p className="text-gray-300 text-lg">
              Descubre nuestra colección de proyectos arquitectónicos, donde cada diseño 
              cuenta una historia única de innovación y excelencia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid - Optimizado */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50" ref={ref}>
        <div className="container-custom">
          {/* Search and Filter Bar */}
          <motion.div 
            className="mb-12 p-6 bg-white rounded-xl shadow-md border border-gray-100"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              {/* Search Input */}
              <div className="relative w-full md:max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-[#003E5E]" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-200 focus:border-[#6BC6C9] focus:ring-2 focus:ring-[#6BC6C9]/20 outline-none transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#003E5E]"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
              
              {/* Filter Button (Mobile) */}
              <div className="md:hidden w-full">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#00303F] text-white rounded-lg hover:bg-[#003E5E] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Filter size={18} />
                    Filtrar por categoría
                  </span>
                  <span>{selectedCategory === 'all' ? 'Todos' : selectedCategory}</span>
                </button>
              </div>
              
              {/* Categories Filter (Desktop) */}
              <div className="hidden md:flex flex-wrap gap-3">
                {categories.map((category: string) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#003E5E] text-white'
                        : 'bg-gray-100 text-[#00303F] hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Mobile Categories (Expandable) */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div 
                  className="mt-4 md:hidden grid grid-cols-2 gap-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {categories.map((category: string) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#003E5E] text-white'
                          : 'bg-gray-100 text-[#00303F] hover:bg-gray-200'
                      }`}
                    >
                      {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Estado de carga, error y resultados */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="h-12 w-12 border-4 border-[#6BC6C9]/30 border-t-[#6BC6C9] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-[#003E5E] font-medium">Cargando proyectos...</p>
              </div>
            </div>
          ) : error ? (
            <motion.div 
              className="text-center py-16 bg-white rounded-xl shadow-md border border-red-200"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 text-red-800">Error cargando proyectos</h3>
              <p className="text-red-600 max-w-md mx-auto mb-6">
                {error}
              </p>
              <button 
                onClick={retryFetch}
                className="px-6 py-3 bg-[#003E5E] text-white rounded-lg hover:bg-[#00303F] transition-colors inline-flex items-center gap-2"
              >
                Reintentar
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ) : filteredProjects.length === 0 ? (
            <motion.div 
              className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#6BC6C9]/10 flex items-center justify-center">
                <Search size={24} className="text-[#6BC6C9]" />
              </div>
              <h3 className="text-xl font-medium mb-2 text-[#001D23]">No hay proyectos disponibles</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {projects.length === 0 
                  ? 'No se encontraron proyectos en la base de datos.'
                  : 'No se encontraron proyectos que coincidan con tu búsqueda. Intenta con otros términos o categorías.'
                }
              </p>
              {projects.length > 0 && (
                <button 
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-[#003E5E] text-white rounded-lg hover:bg-[#00303F] transition-colors inline-flex items-center gap-2"
                >
                  Restablecer filtros
                  <X size={16} />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {/* Renderizado con paginación */}
              {filteredProjects.slice(0, displayedProjectsCount).map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  hoveredProject={hoveredProject}
                  setHoveredProject={setHoveredProject}
                />
              ))}
            </motion.div>
          )}
          
          {/* Mostrar más botón para listas largas */}
          {filteredProjects.length > displayedProjectsCount && (
            <div className="flex justify-center mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <button 
                  onClick={showMoreProjects}
                  className="px-6 py-3 bg-[#003E5E] text-white rounded-lg hover:bg-[#00303F] transition-colors inline-flex items-center gap-2"
                >
                  Ver más proyectos ({filteredProjects.length - displayedProjectsCount} restantes)
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>
          )}

          {/* Estadísticas de proyectos */}
          {!isLoading && !error && projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-600">
                Mostrando {Math.min(filteredProjects.length, displayedProjectsCount)} de {filteredProjects.length} proyectos
                {selectedCategory !== 'all' && ` en la categoría "${selectedCategory}"`}
                {searchQuery && ` que coinciden con "${searchQuery}"`}
              </p>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* Enhanced CTA Section - Simplificado */}
      <section className="py-20 bg-gradient-to-b from-[#001D23] to-[#00303F] relative overflow-hidden">
        {/* Elementos decorativos estáticos */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#003E5E]/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#003E5E]/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#00303F] rounded-2xl p-8 md:p-12 shadow-xl border border-[#003E5E]/30 max-w-4xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-[2px] w-12 bg-[#6BC6C9]"></div>
                  <span className="text-[#6BC6C9] font-medium">DOMUM Arquitectura</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-white">
                  ¿Tienes un proyecto en mente?
                </h2>
                
                <p className="text-gray-300 mb-8">
                  En DOMUM Arquitectura transformamos tus ideas en espacios extraordinarios.
                  Contáctanos para comenzar a crear juntos y dar vida a tus sueños arquitectónicos.
                </p>
                
                <Link
                  to="/contacto"
                  className="inline-flex items-center gap-2 bg-[#6BC6C9] text-[#001D23] px-6 py-3 rounded-md font-medium hover:bg-[#6BC6C9]/90 transition-colors"
                >
                  Contactar Ahora
                  <ArrowRight size={18} />
                </Link>
              </div>
              
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-[#003E5E] rounded-full flex items-center justify-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#6BC6C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 8V16" stroke="#6BC6C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12H16" stroke="#6BC6C9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ProjectsPage;