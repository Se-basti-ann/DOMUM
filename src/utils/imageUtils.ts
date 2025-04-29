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
    // If there's an existing file, delete it first
    if (existingPath) {
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([existingPath]);
      
      if (deleteError) {
        console.error('Error deleting existing image:', deleteError);
      }
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the new file
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
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