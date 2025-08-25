import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { Calendar, MapPin, Tag, ArrowLeft, Home, Ruler, User } from 'lucide-react';

const ProjectDetailPage = () => {
  const { id } = useParams(); // Este es el slug del proyecto
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

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

      // Primero intentar buscar por slug, si no funciona buscar por ID
      let projectData: Project | null = null;
      
      try {
        // Obtener todos los proyectos y buscar por slug
        const allProjects = await projectService.getAllProjects();
        projectData = allProjects.find(p => p.slug === id) || null;
        
        // Si no se encuentra por slug, intentar por ID
        if (!projectData) {
          try {
            projectData = await projectService.getProject(id);
          } catch (idError) {
            // Si tampoco se encuentra por ID, el proyecto no existe
            console.error('Project not found by slug or ID:', idError);
          }
        }
      } catch (fetchError) {
        console.error('Error fetching projects:', fetchError);
        throw fetchError;
      }

      if (!projectData) {
        throw new Error('Proyecto no encontrado');
      }
      
      setProject(projectData);
      
      // Actualizar el título de la página
      if (projectData.title) {
        document.title = `${projectData.title} | DOMUM Arquitectura`;
      }
      
      // Buscar proyectos relacionados
      if (projectData.category && projectData.id) {
        await fetchRelatedProjects(projectData.category, projectData.id);
      }
      
    } catch (error) {
      console.error('Error fetching project:', error);
      setError(error instanceof Error ? error.message : 'Error cargando proyecto');
      
      // Redirigir después de un breve delay para mostrar el error
      setTimeout(() => {
        navigate('/proyectos');
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProjects = async (category: string, currentProjectId: string) => {
    try {
      // Obtener todos los proyectos de la misma categoría
      const allProjects = await projectService.getAllProjects();
      
      // Filtrar proyectos de la misma categoría excluyendo el actual
      const related = allProjects
        .filter(p => 
          p.category === category && 
          p.id !== currentProjectId &&
          p.slug && p.slug !== id // También excluir por slug para mayor seguridad
        )
        .slice(0, 3); // Limitar a 3 proyectos
      
      setRelatedProjects(related);
    } catch (error) {
      console.error('Error fetching related projects:', error);
      // No es crítico si falla la carga de proyectos relacionados
      setRelatedProjects([]);
    }
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

  return (
    <>
      {/* Header */}
      <section 
        className="relative py-32 md:py-40 bg-cover bg-center"
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
            className="max-w-3xl"
          >
            <button
              onClick={() => navigate('/proyectos')}
              className="flex items-center gap-2 text-white mb-6 hover:text-primary-200 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver a Proyectos
            </button>
            <h1 className="text-white mb-6">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-primary-100">
              {project.year && (
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{project.year}</span>
                </div>
              )}
              {project.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{project.location}</span>
                </div>
              )}
              {project.category && (
                <div className="flex items-center gap-2">
                  <Tag size={18} />
                  <span>{project.category}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Info */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Project Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <h2 className="text-2xl font-semibold mb-6">Descripción del Proyecto</h2>
              <div className="prose prose-lg max-w-none">
                {project.description ? (
                  project.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-primary-700">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-primary-600 italic">No hay descripción disponible.</p>
                )}
              </div>
              
              {/* Content adicional si existe */}
              {project.content && project.content !== project.description && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Detalles Adicionales</h3>
                  <div className="prose prose-lg max-w-none">
                    {project.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-primary-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-primary-50 p-8 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-6">Detalles</h3>
              
              <div className="space-y-6">
                {project.category && (
                  <div className="flex items-start gap-4">
                    <Home className="text-primary-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-primary-900">Tipo de Proyecto</h4>
                      <p className="text-primary-700">{project.category}</p>
                    </div>
                  </div>
                )}
                
                {project.location && (
                  <div className="flex items-start gap-4">
                    <MapPin className="text-primary-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-primary-900">Ubicación</h4>
                      <p className="text-primary-700">{project.location}</p>
                    </div>
                  </div>
                )}
                
                {project.year && (
                  <div className="flex items-start gap-4">
                    <Calendar className="text-primary-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-primary-900">Año</h4>
                      <p className="text-primary-700">{project.year}</p>
                    </div>
                  </div>
                )}
                
                {project.meters && (
                  <div className="flex items-start gap-4">
                    <Ruler className="text-primary-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-primary-900">Área</h4>
                      <p className="text-primary-700">{project.meters}</p>
                    </div>
                  </div>
                )}
                
                {project.client && (
                  <div className="flex items-start gap-4">
                    <User className="text-primary-600 mt-1" size={20} />
                    <div>
                      <h4 className="font-medium text-primary-900">Cliente</h4>
                      <p className="text-primary-700">{project.client}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Gallery */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold mb-12 text-center"
          >
            Galería del Proyecto
          </motion.h2>
          
          {project.gallery && Array.isArray(project.gallery) && project.gallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="overflow-hidden rounded-lg shadow-sm cursor-pointer"
                  onClick={() => {
                    // Opcional: abrir imagen en modal o nueva ventana
                    window.open(image, '_blank');
                  }}
                >
                  <img 
                    src={image} 
                    alt={`${project.title} - Imagen ${index + 1}`}
                    className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Manejar error de carga de imagen
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg'; // Imagen de respaldo
                      target.alt = 'Imagen no disponible';
                    }}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg p-8 max-w-md mx-auto">
                <svg className="w-16 h-16 text-primary-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-primary-600">No hay imágenes disponibles en la galería.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-semibold mb-12 text-center"
            >
              Proyectos Relacionados
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relatedProject, index) => (
                <motion.div
                  key={relatedProject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group overflow-hidden rounded-lg shadow-sm cursor-pointer"
                  onClick={() => {
                    if (relatedProject.slug) {
                      navigate(`/proyectos/${relatedProject.slug}`);
                    }
                  }}
                >
                  <div className="relative h-64 overflow-hidden">
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
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      {relatedProject.category && (
                        <span className="inline-block px-3 py-1 bg-white text-primary-900 text-sm font-medium rounded-full mb-3">
                          {relatedProject.category}
                        </span>
                      )}
                      <h3 className="text-white text-xl font-medium mb-1">{relatedProject.title}</h3>
                      {relatedProject.year && (
                        <p className="text-primary-100">{relatedProject.year}</p>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/40 w-full h-full flex items-center justify-center">
                        <div className="bg-white text-primary-900 px-5 py-2 rounded-full font-medium hover:bg-primary-50 transition-colors">
                          Ver Proyecto
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary-900 text-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-semibold mb-6"
            >
              ¿Tienes un proyecto en mente?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-primary-100 mb-8"
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