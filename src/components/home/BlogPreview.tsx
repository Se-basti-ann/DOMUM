import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowUpRight, User, Clock, Tag } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Blog } from '../../types';
import { mockAPI } from '../../data/mockData';

const BlogPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [posts, setPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Cambiado el tipo para que coincida con el tipo de post.id (string)
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const data = await mockAPI.getBlogs(3); // Limit to 3 posts for preview
      setPosts(data);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Estimar tiempo de lectura (5 minutos por cada 1000 caracteres)
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };
  
  return (
    <section ref={ref} className="section-padding bg-gradient-to-b from-white to-primary-50">
      <div className="container-custom">
        {/* Header con línea decorativa */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary-900 mb-3 relative inline-block">
            Últimas Publicaciones
            <motion.div 
              className="absolute -bottom-2 left-1/2 h-1 bg-accent-500 transform -translate-x-1/2"
              initial={{ width: 0 }}
              animate={isInView ? { width: '50%' } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </h2>
          <p className="text-primary-700 max-w-2xl mx-auto">
            Manténgase al día con nuestras últimas ideas, investigaciones y 
            reflexiones sobre el mundo de la arquitectura.
          </p>
        </motion.div>
        
        {/* Blog Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {isLoading ? (
            <div className="flex justify-center py-24">
              <div className="h-12 w-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-primary-600">No hay publicaciones disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <motion.div
                  key={post.id}
                  variants={itemVariants}
                  className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
                  style={{ 
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                  onMouseEnter={() => setHoveredPost(post.id)}
                  onMouseLeave={() => setHoveredPost(null)}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Imagen con overlay */}
                  <div className="relative h-56 overflow-hidden">
                    <motion.img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      animate={{ 
                        scale: hoveredPost === post.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.7 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                    
                    {/* Categoría flotante */}
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 text-sm font-medium bg-white text-primary-900 px-3 py-1 rounded-full shadow-md">
                        <Tag size={14} />
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Contenido */}
                  <div className="p-6 relative">
                    {/* Fecha y tiempo de lectura */}
                    <div className="flex items-center justify-between text-sm text-primary-600 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.published_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {getReadingTime(post.excerpt)} min de lectura
                      </span>
                    </div>
                    
                    {/* Título con animación */}
                    <h3 className="text-xl font-medium mb-3 text-primary-900 group-hover:text-accent-700 transition-colors duration-300">
                      {post.title}
                    </h3>
                    
                    {/* Extracto */}
                    <p className="text-primary-700 mb-5 line-clamp-3">{post.excerpt}</p>
                    
                    {/* Autor (simulado) */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center">
                        <User size={16} className="text-primary-700" />
                      </div>
                      <span className="text-sm text-primary-800">Por {post.author || 'DOMUM Arquitectura'}</span>
                    </div>
                    
                    {/* Botón de leer más */}
                    <NavLink 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-accent-600 font-medium hover:text-accent-800 transition-colors"
                    >
                      Leer más
                      <motion.div
                        animate={{ 
                          x: hoveredPost === post.id ? 5 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowUpRight size={16} />
                      </motion.div>
                    </NavLink>
                    
                    {/* Elemento decorativo */}
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1 bg-accent-500"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: hoveredPost === post.id ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Ver todas las publicaciones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex justify-center mt-12"
          >
            <NavLink 
              to="/blog" 
              className="px-6 py-3 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors inline-flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              Ver todas las publicaciones
              <ArrowUpRight size={16} />
            </NavLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;