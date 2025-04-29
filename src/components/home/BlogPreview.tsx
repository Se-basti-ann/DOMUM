import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Blog } from '../../types';

const BlogPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const supabase = useSupabase();
  const [posts, setPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(2);

      if (error) throw error;
      setPosts(data || []);
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
  
  return (
    <section ref={ref} className="section-padding bg-primary-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary-900 mb-3">Últimas Publicaciones</h2>
            <p className="text-primary-700 max-w-xl">
              Manténgase al día con nuestras últimas ideas, investigaciones y 
              reflexiones sobre el mundo de la arquitectura.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a 
              href="/blog" 
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-accent-600 font-medium hover:text-accent-800 transition-colors"
            >
              Ver todas las publicaciones
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {isLoading ? (
            <div className="col-span-2 flex justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <p className="text-primary-600">No hay publicaciones disponibles.</p>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image_url} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm font-medium bg-primary-100 text-primary-800 px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-primary-600 flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDate(post.published_at)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-medium mb-3">{post.title}</h3>
                  <p className="text-primary-700 mb-4">{post.excerpt}</p>
                  
                  <a 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-accent-600 font-medium hover:text-accent-800 transition-colors"
                  >
                    Leer más
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogPreview;