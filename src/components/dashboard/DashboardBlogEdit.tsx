import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { Blog } from '../../types';
import { uploadImage, deleteImage, validateImageFile, DEFAULT_IMAGES } from '../../utils/imageUtils';

const emptyBlogPost: Omit<Blog, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  content: '',
  excerpt: '',
  image_url: '',
  published_at: new Date().toISOString(),
  author: '',
  category: '',
  slug: '',
};

const DashboardBlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const supabase = useSupabase();
  const [post, setPost] = useState<Omit<Blog, 'id' | 'created_at' | 'updated_at'>>(emptyBlogPost);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isEditing = !!id;
  
  useEffect(() => {
    if (isEditing) {
      fetchPost(id);
    } else {
      // Set default image for new posts
      setPost(prev => ({ ...prev, image_url: DEFAULT_IMAGES.blog }));
      setImagePreview(DEFAULT_IMAGES.blog);
    }
    
    document.title = isEditing 
      ? 'Editar Publicación | ArquiStudio Dashboard' 
      : 'Nueva Publicación | ArquiStudio Dashboard';
  }, [id, isEditing]);
  
  async function fetchPost(postId: string) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', postId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        const { id, created_at, updated_at, ...postData } = data;
        setPost(postData);
        setImagePreview(postData.image_url);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setErrorMessage('No se pudo cargar la publicación. Intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageFile(file);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(DEFAULT_IMAGES.blog);
    setPost(prev => ({ ...prev, image_url: DEFAULT_IMAGES.blog }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    
    try {
      // Generate slug if empty
      if (!post.slug && post.title) {
        post.slug = generateSlug(post.title);
      }

      // Handle image upload if there's a new image
      if (imageFile) {
        const imageUrl = await uploadImage(supabase, imageFile, 'blog-images');
        post.image_url = imageUrl;
      }
      
      if (isEditing) {
        // Update existing post
        const { error } = await supabase
          .from('blogs')
          .update({
            ...post,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
          
        if (error) throw error;
      } else {
        // Create new post
        const { error } = await supabase
          .from('blogs')
          .insert([
            {
              ...post,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
          
        if (error) throw error;
      }
      
      navigate('/dashboard/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      setErrorMessage('Error al guardar la publicación. Intente de nuevo.');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <div className="h-8 w-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/dashboard/blog')}
          className="text-primary-600 hover:text-primary-900 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-medium">
          {isEditing ? 'Editar Publicación' : 'Nueva Publicación'}
        </h1>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {errorMessage}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Imagen
            </label>
            <div className="flex items-start gap-4">
              <div className="relative w-40 h-40 bg-primary-50 rounded-lg overflow-hidden">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
                {imagePreview !== DEFAULT_IMAGES.blog && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <div className="flex-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-md cursor-pointer hover:bg-primary-200 transition-colors"
                >
                  <Upload size={16} />
                  Subir imagen
                </label>
                <p className="text-sm text-primary-600 mt-2">
                  Formatos permitidos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
                </p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={post.title}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Categoría *
              </label>
              <input
                type="text"
                name="category"
                value={post.category}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Autor *
              </label>
              <input
                type="text"
                name="author"
                value={post.author}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                Fecha de Publicación *
              </label>
              <input
                type="date"
                name="published_at"
                value={post.published_at.substring(0, 10)}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">
                URL Amigable (Slug) *
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="slug"
                  value={post.slug}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="url-amigable"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPost({ ...post, slug: generateSlug(post.title) })}
                  className="ml-2 bg-primary-100 text-primary-700 px-3 py-2 rounded hover:bg-primary-200 transition-colors"
                >
                  Generar
                </button>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Extracto (Resumen) *
            </label>
            <textarea
              name="excerpt"
              value={post.excerpt}
              onChange={handleChange}
              className="input-field"
              rows={3}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Contenido *
            </label>
            <textarea
              name="content"
              value={post.content}
              onChange={handleChange}
              className="input-field"
              rows={10}
              required
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/blog')}
              className="button-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="button-primary flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DashboardBlogEdit;