import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { apiService } from '../services/apiService';
import { Calendar, MapPin, Tag, ArrowLeft, Home, Ruler, User, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    if (!id) {
      navigate('/proyectos');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      let projectData: Project | null = null;
      
      try {
        projectData = await apiService.getProjectBySlug(id);
      } catch (fetchError) {
        console.error('Error fetching project:', fetchError);
        throw fetchError;
      }

      if (!projectData) {
        throw new Error('Proyecto no encontrado');
      }
      
      setProject(projectData);
      
      if (projectData.title) {
        document.title = `${projectData.title} | DOMUM Arquitectura`;
      }
      
      if (projectData.category && projectData.id) {
        await fetchRelatedProjects(projectData.category, projectData.id);
      }
      
    } catch (error) {
      console.error('Error fetching project:', error);
      setError(error instanceof Error ? error.message : 'Error cargando proyecto');
      
      setTimeout(() => {
        navigate('/proyectos');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProjects = async (category: string, currentProjectId: string) => {
    try {
      const related = await apiService.getRelatedProjects(category, currentProjectId, 3);
      setRelatedProjects(related);
    } catch (error) {
      console.error('Error fetching related projects:', error);
      setRelatedProjects([]);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (project?.gallery && Array.isArray(project.gallery)) {
      setCurrentImageIndex((prev) => 
        prev === project.gallery.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (project?.gallery && Array.isArray(project.gallery)) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.gallery.length - 1 : prev - 1
      );
    }
  };

  // Función para determinar el grid de la galería basado en el número de imágenes
  const getGalleryGridClass = (imageCount: number) => {
    if (imageCount === 1) return 'grid-cols-1';
    if (imageCount === 2) return 'grid-cols-1 md:grid-cols-2';
    if (imageCount === 3) return 'grid-cols-1 md:grid-cols-3';
    if (imageCount === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
    if (imageCount <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-primary-600">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error cargando proyecto</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-sm text-red-600">Serás redirigido a la página de proyectos...</p>
          </div>
          <button
            onClick={() => navigate('/proyectos')}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Volver a Proyectos
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const hasGallery = project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0;
  const galleryCount = hasGallery ? project.gallery.length : 0;

  return (
    <>
      {/* Header más compacto */}
      <section 
        className="relative py-20 md:py-28 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${project.image_url})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <button
              onClick={() => navigate('/proyectos')}
              className="flex items-center gap-2 text-white mb-4 hover:text-primary-200 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver a Proyectos
            </button>
            <h1 className="text-white mb-4 text-3xl md:text-4xl lg:text-5xl font-bold">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-primary-100">
              {project.year && (
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                  <Calendar size={16} />
                  <span className="text-sm">{project.year}</span>
                </div>
              )}
              {project.location && (
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                  <MapPin size={16} />
                  <span className="text-sm">{project.location}</span>
                </div>
              )}
              {project.category && (
                <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full">
                  <Tag size={16} />
                  <span className="text-sm">{project.category}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Layout optimizado */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Descripción - más compacta */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="xl:col-span-3"
            >
              <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4">Descripción del Proyecto</h2>
                <div className="prose prose-lg max-w-none">
                  {project.description ? (
                    project.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 text-primary-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))
                  ) : (
                    <p className="text-primary-600 italic">No hay descripción disponible.</p>
                  )}
                </div>
                
                {project.content && project.content !== project.description && (
                  <div className="mt-6 pt-6 border-t border-primary-100">
                    <h3 className="text-lg font-semibold mb-3">Detalles Adicionales</h3>
                    <div className="prose max-w-none">
                      {project.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-3 text-primary-700 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Detalles del proyecto - sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="xl:col-span-1"
            >
              <div className="bg-primary-50 rounded-xl p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4">Detalles</h3>
                
                <div className="space-y-4">
                  {project.category && (
                    <div className="flex items-start gap-3">
                      <Home className="text-primary-600 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="font-medium text-primary-900 text-sm">Tipo</h4>
                        <p className="text-primary-700 text-sm">{project.category}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary-600 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="font-medium text-primary-900 text-sm">Ubicación</h4>
                        <p className="text-primary-700 text-sm">{project.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.year && (
                    <div className="flex items-start gap-3">
                      <Calendar className="text-primary-600 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="font-medium text-primary-900 text-sm">Año</h4>
                        <p className="text-primary-700 text-sm">{project.year}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.area && (
                    <div className="flex items-start gap-3">
                      <Ruler className="text-primary-600 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="font-medium text-primary-900 text-sm">Área</h4>
                        <p className="text-primary-700 text-sm">{project.area}</p>
                      </div>
                    </div>
                  )}
                  
                  {project.client && (
                    <div className="flex items-start gap-3">
                      <User className="text-primary-600 mt-0.5 flex-shrink-0" size={18} />
                      <div>
                        <h4 className="font-medium text-primary-900 text-sm">Cliente</h4>
                        <p className="text-primary-700 text-sm">{project.client}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Galería mejorada */}
      {hasGallery && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-semibold mb-2">Galería del Proyecto</h2>
              <p className="text-primary-600">{galleryCount} {galleryCount === 1 ? 'imagen' : 'imágenes'}</p>
            </motion.div>
            
            <div className={`grid ${getGalleryGridClass(galleryCount)} gap-4`}>
              {project.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className={`
                    relative overflow-hidden rounded-lg shadow-sm cursor-pointer group
                    ${index === 0 && galleryCount > 4 ? 'md:col-span-2 md:row-span-2' : ''}
                    ${galleryCount === 4 && (index === 0 || index === 1) ? 'md:row-span-2' : ''}
                  `}
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={image} 
                    alt={`${project.title} - Imagen ${index + 1}`}
                    className={`
                      w-full object-cover transition-all duration-500 group-hover:scale-110
                      ${index === 0 && galleryCount > 4 ? 'h-64 md:h-full' : 'h-48 md:h-56'}
                      ${galleryCount === 4 && (index === 0 || index === 1) ? 'h-48 md:h-full' : ''}
                    `}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                      target.alt = 'Imagen no disponible';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                        <Maximize2 size={20} className="text-primary-900" />
                      </div>
                    </div>
                  </div>
                  {index === 0 && galleryCount > 6 && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        Imagen principal
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && project?.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-primary-300 transition-colors z-10"
              >
                <X size={32} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 text-white hover:text-primary-300 transition-colors z-10"
              >
                <ChevronLeft size={48} />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 text-white hover:text-primary-300 transition-colors z-10"
              >
                <ChevronRight size={48} />
              </button>
              
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                src={project.gallery[currentImageIndex]}
                alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {currentImageIndex + 1} / {project.gallery.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Proyectos relacionados - más compactos */}
      {relatedProjects.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold mb-8"
            >
              Proyectos Relacionados
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((relatedProject, index) => (
                <motion.div
                  key={relatedProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group overflow-hidden rounded-lg shadow-sm cursor-pointer bg-white"
                  onClick={() => {
                    if (relatedProject.slug) {
                      navigate(`/proyectos/${relatedProject.slug}`);
                    }
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedProject.image_url}
                      alt={relatedProject.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-image.jpg';
                        target.alt = 'Imagen no disponible';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4">
                      {relatedProject.category && (
                        <span className="inline-block px-2 py-1 bg-white text-primary-900 text-xs font-medium rounded-full mb-2">
                          {relatedProject.category}
                        </span>
                      )}
                      <h3 className="text-white text-lg font-medium mb-1">{relatedProject.title}</h3>
                      {relatedProject.year && (
                        <p className="text-primary-100 text-sm">{relatedProject.year}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - más compacto */}
      <section className="py-12 bg-primary-900 text-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-semibold mb-4"
            >
              ¿Tienes un proyecto en mente?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-primary-100 mb-6"
            >
              Estamos listos para transformar tus ideas en realidad. Contáctanos para discutir cómo podemos ayudarte.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button
                onClick={() => navigate('/contacto')}
                className="inline-block bg-white text-primary-900 px-6 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors"
              >
                Contactar Ahora
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetailPage;