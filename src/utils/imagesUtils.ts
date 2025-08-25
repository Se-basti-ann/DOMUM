const API_BASE_URL = 'https://domumarquitectura.com/assets';

export const DEFAULT_IMAGES = {
  blog: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
  project: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg',
  team: 'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg'
};

export const uploadImage = async (
  file: File,
  bucket: string,
  existingPath?: string
): Promise<string> => {
  try {
    // Si hay una imagen existente, eliminarla primero
    if (existingPath && existingPath !== DEFAULT_IMAGES.blog) {
      try {
        await deleteImage(existingPath, bucket);
      } catch (deleteErr) {
        console.log('Error al eliminar imagen existente:', deleteErr);
        // Continuamos aunque haya un error al eliminar
      }
    }

    // Crear FormData para la subida
    const formData = new FormData();
    formData.append('image', file);
    formData.append('bucket', bucket);

    // Subir nueva imagen
    const response = await fetch(`${API_BASE_URL}/API_Updateblog.php`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al subir imagen');
    }

    return result.url;
  } catch (error: any) {
    console.error('Error detallado al subir imagen:', error);
    throw new Error(`Error al subir imagen: ${error.message || 'Error desconocido'}`);
  }
};

export const deleteImage = async (
  url: string,
  bucket: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/API_Updateblog.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, bucket }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al eliminar imagen');
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