import { v4 as uuidv4 } from 'uuid';

// Default images for different content types
export const DEFAULT_IMAGES = {
  blog: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
  project: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
  team: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg'
};

export const uploadImage = async (
  supabase: any,
  file: File,
  bucket: string,
  existingPath?: string
): Promise<string> => {
  try {
    // Verificar que el usuario esté autenticado
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('Usuario no autenticado. Debes iniciar sesión para subir imágenes.');
    }

    // Si hay una ruta existente, intentar eliminar el archivo primero
    if (existingPath) {
      try {
        const pathParts = existingPath.split('/');
        const existingFileName = pathParts[pathParts.length - 1];
        
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove([existingFileName]);
        
        if (deleteError) {
          console.log('Error al eliminar imagen existente:', deleteError);
          // Continuamos aunque haya un error al eliminar
        }
      } catch (deleteErr) {
        console.log('Error al intentar eliminar la imagen existente:', deleteErr);
        // Continuamos aunque haya un error al eliminar
      }
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir el nuevo archivo
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error específico al subir:', uploadError);
      throw new Error(`Error al subir imagen: ${uploadError.message}`);
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (!urlData || !urlData.publicUrl) {
      throw new Error('No se pudo obtener la URL pública de la imagen');
    }

    return urlData.publicUrl;
  } catch (error: any) {
    console.error('Error detallado al subir imagen:', error);
    throw new Error(`Error al subir imagen: ${error.message || 'Error desconocido'}`);
  }
};

export const deleteImage = async (
  supabase: any,
  url: string,
  bucket: string
): Promise<void> => {
  try {
    // Extract the filename from the URL
    const fileName = url.split('/').pop();
    
    if (!fileName) return;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

export const validateImageFile = (file: File): boolean => {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no válido. Por favor, sube una imagen (JPG, PNG, GIF, WEBP).');
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('La imagen es demasiado grande. El tamaño máximo es 5MB.');
  }

  return true;
};