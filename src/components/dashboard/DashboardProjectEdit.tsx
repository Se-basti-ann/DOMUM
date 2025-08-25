import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, ArrowLeft, Save } from 'lucide-react';
import { projectService } from '../../services/projectService';
import { DEFAULT_IMAGES } from '../../utils/imagesUtils'
import { Project, CreateProjectData, UpdateProjectData } from '../../types';

const DashboardProjectEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [project, setProject] = useState<CreateProjectData>({
    title: '',
    description: '',
    content: '',
    category: '',
    year: '',
    location: '',
    client: '',
    image_url: DEFAULT_IMAGES.project,
    gallery: [], // Always initialize as an 
    slug: '',
    meters: ''
  });

  // Estados para manejo de imágenes
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      fetchProject();
    } else {
      setMainImagePreview(DEFAULT_IMAGES.project);
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      
      const data = await projectService.getProject(id!);
      
      console.log('Datos recibidos de proyecto:', data);
      console.log('Tipo de gallery:', typeof data.gallery);
      console.log('Contenido de gallery:', data.gallery);
      
      // Asegurar que gallery sea siempre un array
      const galleryData = Array.isArray(data.gallery) ? data.gallery : [];
      
      // Crear un objeto limpio con valores por defecto
      const processedData: CreateProjectData = {
        title: data.title || '',
        description: data.description || '',
        content: data.content || '',
        category: data.category || '',
        year: data.year || '',
        location: data.location || '',
        client: data.client || '',
        image_url: data.image_url || DEFAULT_IMAGES.project,
        gallery: galleryData,
        slug: data.slug || '',
        meters: data.meters || ''
      };
      
      console.log('Datos procesados del proyecto:', processedData);
      
      setProject(processedData);
      setMainImagePreview(processedData.image_url);
      
      // Establecer galerías existentes como previews
      if (galleryData.length > 0) {
        setGalleryPreviews(galleryData);
      } else {
        setGalleryPreviews([]);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error cargando proyecto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  // Función para subir imagen principal
  const handleImageUpload = async (file: File, isGallery: boolean = false): Promise<string> => {
    try {
      projectService.validateImageFile(file);
      
      if (isGallery) {
        const result = await projectService.uploadGalleryImage(file);
        return result.url;
      } else {
        const result = await projectService.uploadMainImage(file);
        return result.url;
      }
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
      throw error;
    }
  };

  // Manejadores para imagen principal
  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      projectService.validateImageFile(file);
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
      setErrorMessage(null);
    } catch (error) {
      if (error instanceof Error) setErrorMessage(error.message);
      console.error('Error con la imagen:', error);
    }
  };

  const handleRemoveMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview(DEFAULT_IMAGES.project);
    setProject(prev => ({ ...prev, image_url: DEFAULT_IMAGES.project }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Manejadores para galería
  const handleAddGalleryImage = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  const handleGalleryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    try {
      for (const file of files) {
        try {
          projectService.validateImageFile(file);
          const preview = URL.createObjectURL(file);
          
          setGalleryFiles(prev => [...prev, file]);
          setGalleryPreviews(prev => [...prev, preview]);
        } catch (fileError) {
          console.error(`Error procesando archivo ${file.name}:`, fileError);
          if (fileError instanceof Error) setErrorMessage(fileError.message);
        }
      }
      
      // Reset input value to allow selecting the same file again
      if (galleryInputRef.current) {
        galleryInputRef.current.value = '';
      }
      
      setErrorMessage(null);
    } catch (error) {
      console.error('Error en el manejo de imágenes de galería:', error);
      if (error instanceof Error) setErrorMessage(error.message);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    console.log('Eliminando imagen de galería en índice:', index);
    console.log('Estado actual de project.gallery:', project.gallery);
    console.log('Estado actual de galleryPreviews:', galleryPreviews);
    
    // Determinar si es una imagen existente o nueva
    const existingGalleryLength = project.gallery?.length || 0;
    const isExistingImage = index < existingGalleryLength;
    
    if (isExistingImage) {
      // Es una imagen existente en project.gallery
      setProject(prev => ({
        ...prev,
        gallery: prev.gallery?.filter((_, i) => i !== index) || []
      }));
    } else {
      // Es una imagen nueva en galleryFiles
      const adjustedIndex = index - existingGalleryLength;
      setGalleryFiles(prev => {
        const newFiles = [...prev];
        newFiles.splice(adjustedIndex, 1);
        return newFiles;
      });
    }
    
    // Actualizar las previsualizaciones
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
  
    try {
      // Generar slug si está vacío
      let finalSlug = project.slug;
      if (!finalSlug && project.title) {
        finalSlug = projectService.generateSlug(project.title);
        setProject(prev => ({ ...prev, slug: finalSlug }));
      }
  
      // Subir imagen principal
      let imageUrl = project.image_url;
      if (mainImageFile) {
        try {
          imageUrl = await handleImageUpload(mainImageFile, false);
        } catch (imgError) {
          console.error('Error uploading main image:', imgError);
          // Si hay error subiendo, mantener la imagen existente
          imageUrl = project.image_url;
        }
      }
  
      // Asegurarse de que gallery siempre sea un array
      const currentGallery = Array.isArray(project.gallery) ? project.gallery : [];
      
      // Subir imágenes de la galería (una por una para mejor manejo de errores)
      let newGalleryUrls: string[] = [];
      
      for (const file of galleryFiles) {
        if (file) {
          try {
            const galleryUrl = await handleImageUpload(file, true);
            if (galleryUrl) {
              newGalleryUrls.push(galleryUrl);
            }
          } catch (galleryError) {
            console.error('Error al subir una imagen de galería:', galleryError);
            // Continuar con las siguientes imágenes
          }
        }
      }
      
      // Combinar galerías existentes y nuevas
      const combinedGallery = [...currentGallery, ...newGalleryUrls];
      
      // Preparar el objeto para la API usando el tipo correcto
      const updatedProject: CreateProjectData = {
        title: project.title || '',
        description: project.description || '',
        content: project.content || '',
        category: project.category || '',
        year: project.year || '',
        location: project.location || '',
        client: project.client || '',
        image_url: imageUrl || DEFAULT_IMAGES.project,
        gallery: combinedGallery,
        slug: finalSlug || '',
        meters: project.meters || ''
      };
  
      console.log('Proyecto a guardar:', updatedProject);
      console.log('Tipo de gallery:', typeof updatedProject.gallery);
      console.log('Contenido de gallery:', updatedProject.gallery);
  
      // Guardar usando el servicio
      if (id) {
        await projectService.updateProject(id, updatedProject);
      } else {
        await projectService.createProject(updatedProject);
      }
  
      navigate('/dashboard/proyectos');
    } catch (error: any) {
      console.error('Error completo al guardar proyecto:', error);
      setErrorMessage(`Error guardando proyecto: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate('/dashboard/proyectos')}
          className="text-blue-600 hover:text-blue-900"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-medium">
          {id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h1>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        {/* Sección de Imagen Principal */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen Principal
          </label>
          <div className="flex items-start gap-4">
            <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={mainImagePreview || DEFAULT_IMAGES.project}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {mainImagePreview && mainImagePreview !== DEFAULT_IMAGES.project && (
                <button
                  type="button"
                  onClick={handleRemoveMainImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
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
                onChange={handleMainImageChange}
                className="hidden"
                id="main-image-upload"
              />
              <label
                htmlFor="main-image-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
              >
                <Upload size={16} />
                {mainImageFile ? 'Cambiar imagen' : 'Subir imagen'}
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Formatos: JPG, PNG, WEBP. Máx. 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Campos del formulario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={project.title || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={project.slug || ''}
              onChange={handleChange}
              placeholder="proyecto-ejemplo"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={project.category || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Año
            </label>
            <input
              type="text"
              id="year"
              name="year"
              value={project.year || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Ubicación
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={project.location || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <input
              type="text"
              id="client"
              name="client"
              value={project.client || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="meters" className="block text-sm font-medium text-gray-700">
              Metros Cuadrados (m²)
            </label>
            <input
              type="text"
              id="meters"
              name="meters"
              value={project.meters || ''}
              onChange={handleChange}
              placeholder="100 m²"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>
          
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción Corta
            </label>
            <textarea
              id="description"
              name="description"
              value={project.description || ''}
              onChange={handleChange}
              rows={2}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <textarea
              id="content"
              name="content"
              value={project.content || ''}
              onChange={handleChange}
              rows={6}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Galería de Imágenes */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Galería de Imágenes
          </label>
          
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleGalleryImageChange}
            className="hidden"
            id="gallery-upload"
            multiple
          />
          
          <button
            type="button"
            onClick={handleAddGalleryImage}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 mb-4"
          >
            <Upload size={16} />
            Añadir imagen a la galería
          </button>
          
          <p className="text-sm text-gray-500 mb-4">
            Formatos: JPG, PNG, WEBP. Máx. 10MB por imagen
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryPreviews.map((url, index) => (
              <div key={`gallery-${index}`} className="relative group">
                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Gallery ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/dashboard/proyectos')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="animate-spin">↻</span>
                Guardando...
              </>
            ) : (
              <>
                <Save size={16} />
                Guardar Proyecto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardProjectEdit;