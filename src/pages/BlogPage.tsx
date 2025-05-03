import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../contexts/SupabaseContext';
import { Blog } from '../types';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const BlogPage = () => {
  const supabase = useSupabase();
  const [posts, setPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    document.title = 'Blog | DOMUM Arquitectura';
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['all', ...new Set(posts.map(post => post.category))];
  
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Header */}
      <section className="bg-primary-900 py-20 md:py-32">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-white mb-6">Blog</h1>
            <p className="text-primary-100 text-lg">
              Explora nuestras últimas publicaciones sobre arquitectura, diseño, 
              tendencias y más.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          {/* Categories Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-900 text-white'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No hay publicaciones disponibles</h3>
              <p className="text-primary-600">
                No se encontraron publicaciones en esta categoría.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
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
                    <NavLink
                      to={`/blog/${post.slug}`}
                      className={({ isActive }) => `button-primary 
                        inline-flex items-center gap-2 font-medium transition-colors
                        ${isActive ? 'text-accent-800' : 'text-accent-600 hover:text-accent-800'}
                      `}
                    >
                      Leer más
                      <ArrowUpRight size={16} />
                    </NavLink>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPage;