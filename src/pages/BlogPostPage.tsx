import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Blog } from '../types';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import { mockAPI } from '../data/mockData';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      const data = await mockAPI.getBlogBySlug(id);
      
      setPost(data);
      if (data) {
        document.title = `${data.title} | DOMUM Arquitectura Blog`;
      } else {
        navigate('/blog');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
      navigate('/blog');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <>
      {/* Header */}
      <section 
        className="relative py-32 md:py-40 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${post.image_url})`,
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
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-white mb-6 hover:text-primary-200 transition-colors"
            >
              <ArrowLeft size={20} />
              Volver al Blog
            </button>
            <h1 className="text-white mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-primary-100">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag size={18} />
                <span>{post.category}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-primary-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPostPage;