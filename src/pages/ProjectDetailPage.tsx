import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSupabase } from '../contexts/SupabaseContext';
import { Project } from '../types';
import { Calendar, MapPin, Tag, ArrowLeft, Home, Ruler, User } from 'lucide-react';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const supabase = useSupabase();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', id)
        .single();

      if (error) throw error;
      
      setProject(data);
      if (data) {
        document.title = `${data.title} | DOMUM Arquitectura`;
        fetchRelatedProjects(data.category, data.id);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      navigate('/proyectos');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedProjects = async (category: string, currentProjectId: number) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('category', category)
        .neq('id', currentProjectId)
        .limit(3);

      if (error) throw error;
      setRelatedProjects(data || []);
    } catch (error) {
      console.error('Error fetching related projects:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
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
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{project.year}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={18} />
                <span>{project.category}</span>
              </div>
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
                {project.description?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-primary-700">
                    {paragraph}
                  </p>
                ))}
              </div>
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
                <div className="flex items-start gap-4">
                  <Home className="text-primary-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-primary-900">Tipo de Proyecto</h4>
                    <p className="text-primary-700">{project.category}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <MapPin className="text-primary-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-primary-900">Ubicación</h4>
                    <p className="text-primary-700">{project.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Calendar className="text-primary-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-primary-900">Año</h4>
                    <p className="text-primary-700">{project.year}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Ruler className="text-primary-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-medium text-primary-900">Área</h4>
                    <p className="text-primary-700">{project.meters || project.area || "No especificada"} m²</p>
                  </div>
                </div>
                
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
          
          {project.gallery && project.gallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.gallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="overflow-hidden rounded-lg shadow-sm"
                >
                  <img 
                    src={image} 
                    alt={`${project.title} - Imagen ${index + 1}`}
                    className="w-full h-64 md:h-80 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-primary-600">No hay imágenes disponibles en la galería.</p>
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
                  className="group overflow-hidden rounded-lg shadow-sm"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={relatedProject.image_url}
                      alt={relatedProject.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6">
                      <span className="inline-block px-3 py-1 bg-white text-primary-900 text-sm font-medium rounded-full mb-3">
                        {relatedProject.category}
                      </span>
                      <h3 className="text-white text-xl font-medium mb-1">{relatedProject.title}</h3>
                      <p className="text-primary-100">{relatedProject.year}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/40 w-full h-full flex items-center justify-center">
                        <a
                          href={`/proyectos/${relatedProject.slug}`}
                          className="bg-white text-primary-900 px-5 py-2 rounded-full font-medium hover:bg-primary-50 transition-colors"
                        >
                          Ver Proyecto
                        </a>
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
              <a
                href="/contacto"
                className="inline-block bg-white text-primary-900 px-6 py-3 rounded-full font-medium hover:bg-primary-50 transition-colors"
              >
                Contactar Ahora
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProjectDetailPage;