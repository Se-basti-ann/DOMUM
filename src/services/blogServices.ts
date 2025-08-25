import { Blog } from '../types';

const API_BASE_URL = 'https://domumarquitectura.com/assets';

// Mapeo de columnas genéricas a nombres reales
const COLUMN_MAP: Record<string, keyof Blog> = {
  'COL 1': 'id',
  'COL 2': 'title',
  'COL 3': 'content',
  'COL 4': 'excerpt',
  'COL 5': 'image_url',
  'COL 6': 'published_at',
  'COL 7': 'created_at',
  'COL 8': 'updated_at',
  'COL 9': 'author',
  'COL 10': 'category',
  'COL 11': 'slug'
};

// Función para mapear columnas genéricas a nombres reales
function mapGenericColumns(data: any): any {
  if (!data) return data;
  
  // Si es un array, mapear cada elemento
  if (Array.isArray(data)) {
    return data.map(item => mapGenericColumns(item));
  }
  
  // Si es un objeto, verificar si tiene columnas genéricas
  if (typeof data === 'object' && data !== null) {
    const hasGenericColumns = Object.keys(data).some(key => key.startsWith('COL '));
    
    if (hasGenericColumns) {
      const mappedData: any = {};
      
      for (const [genericKey, value] of Object.entries(data)) {
        const realKey = COLUMN_MAP[genericKey] || genericKey;
        mappedData[realKey] = value;
      }
      
      return mappedData;
    }
  }
  
  return data;
}

// Función para limpiar datos de respuesta
function cleanResponseData(data: any): any {
  // Mapear columnas genéricas
  const mappedData = mapGenericColumns(data);
  
  // Si es un array, filtrar la primera fila si contiene los nombres de columnas
  if (Array.isArray(mappedData) && mappedData.length > 0) {
    const firstRow = mappedData[0];
    
    // Si la primera fila contiene los nombres de las columnas como valores, eliminarla
    if (firstRow && 
        firstRow.id === 'id' && 
        firstRow.title === 'title' && 
        firstRow.content === 'content') {
      return mappedData.slice(1);
    }
  }
  
  return mappedData;
}

export const blogService = {
  // Obtener todos los blogs
  async getAllBlogs(): Promise<Blog[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/API_blogs.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData = await response.json();
      
      if (rawData.error) {
        throw new Error(rawData.error);
      }
      
      // Limpiar y mapear los datos
      const cleanedData = cleanResponseData(rawData);
      
      // Asegurar que devolvemos un array
      return Array.isArray(cleanedData) ? cleanedData : [cleanedData].filter(Boolean);
      
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  // Obtener un blog específico
  async getBlog(id: string): Promise<Blog> {
    try {
      // Usar path parameter en lugar de query parameter
      const response = await fetch(`${API_BASE_URL}/API_blogs.php/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const rawData = await response.json();
      
      if (rawData.error) {
        throw new Error(rawData.error);
      }
      
      // Limpiar y mapear los datos
      const cleanedData = cleanResponseData(rawData);
      
      return cleanedData;
      
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  },

  // Crear nuevo blog
  async createBlog(blogData: Omit<Blog, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; id: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/API_blogs.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  // Actualizar blog existente
  async updateBlog(id: string, blogData: Omit<Blog, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean }> {
    try {
      // Usar path parameter en lugar de query parameter
      const response = await fetch(`${API_BASE_URL}/API_blogs.php/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // Eliminar blog
  async deleteBlog(id: string): Promise<{ success: boolean }> {
    try {
      // Usar path parameter en lugar de query parameter
      const response = await fetch(`${API_BASE_URL}/API_blogs.php/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // Subir imagen para blog
  async uploadImage(imageFile: File, bucket: string = 'blog-images'): Promise<{ success: boolean; url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('bucket', bucket);
      
      const response = await fetch(`${API_BASE_URL}/API_Updateblog.php`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return {
        success: data.success,
        url: data.url
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Eliminar imagen
  async deleteImage(imageUrl: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/API_Updateblog.php`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: imageUrl }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};