import { Project } from '../types';

const API_BASE_URL = 'https://domumarquitectura.com/assets';

// Mapeo de columnas genéricas a nombres reales para proyectos
const COLUMN_MAP: Record<string, keyof Project> = {
  'COL 1': 'id',
  'COL 2': 'title',
  'COL 3': 'description',
  'COL 4': 'content',
  'COL 5': 'category',
  'COL 6': 'year',
  'COL 7': 'location',
  'COL 8': 'client',
  'COL 9': 'image_url',
  'COL 10': 'gallery',
  'COL 11': 'created_at',
  'COL 12': 'updated_at',
  'COL 13': 'slug',
  'COL 14': 'meters'
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
        
        // Procesar gallery especialmente
        if (realKey === 'gallery') {
          mappedData[realKey] = processGalleryOutput(value);
        } else {
          mappedData[realKey] = value;
        }
      }
      
      return mappedData;
    }
  }
  
  return data;
}

// Función para procesar gallery en la salida (de JSON string a array)
function processGalleryOutput(gallery: any): string[] {
  if (!gallery) return [];
  
  // Si ya es un array, devolverlo
  if (Array.isArray(gallery)) {
    return gallery;
  }
  
  // Si es un string, intentar parsearlo como JSON
  if (typeof gallery === 'string') {
    try {
      const parsed = JSON.parse(gallery);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // Si no es JSON válido, intentar como string separado por comas
      if (gallery.includes(',')) {
        return gallery.split(',').map(url => url.trim()).filter(Boolean);
      }
      // Si es un solo string, devolverlo como array
      return gallery ? [gallery] : [];
    }
  }
  
  return [];
}

// Función para procesar gallery en la entrada (de array a JSON string)
function processGalleryInput(gallery: string[] | any): string[] {
  if (!gallery) return [];
  
  // Si ya es un array, devolverlo
  if (Array.isArray(gallery)) {
    return gallery;
  }
  
  // Si es un string JSON, parsearlo
  if (typeof gallery === 'string') {
    try {
      const parsed = JSON.parse(gallery);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // Si no es JSON válido, tratarlo como string único
      return gallery ? [gallery] : [];
    }
  }
  
  return [];
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
        firstRow.description === 'description') {
      return mappedData.slice(1);
    }
  }
  
  return mappedData;
}

export const projectService = {
  // Obtener todos los proyectos
  async getAllProjects(): Promise<Project[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/API_Projects.php`);
      
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
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Obtener un proyecto específico
  async getProject(id: string): Promise<Project> {
    try {
      const response = await fetch(`${API_BASE_URL}/API_Projects.php/${id}`);
      
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
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  // Crear nuevo proyecto
  async createProject(projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; id: string }> {
    try {
      // Procesar gallery antes de enviar
      const processedData = {
        ...projectData,
        gallery: processGalleryInput(projectData.gallery)
      };

      const response = await fetch(`${API_BASE_URL}/API_Projects.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
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
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Actualizar proyecto existente
  async updateProject(id: string, projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean }> {
    try {
      // Procesar gallery antes de enviar
      const processedData = {
        ...projectData,
        gallery: processGalleryInput(projectData.gallery)
      };

      const response = await fetch(`${API_BASE_URL}/API_Projects.php/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
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
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Eliminar proyecto
  async deleteProject(id: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/API_Projects.php/${id}`, {
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
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Subir imagen principal para proyecto
  async uploadMainImage(imageFile: File, bucket: string = 'project-images'): Promise<{ success: boolean; url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('bucket', bucket);
      formData.append('isGallery', 'false');
      
      const response = await fetch(`${API_BASE_URL}/API_UpdateProject.php`, {
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
      console.error('Error uploading main image:', error);
      throw error;
    }
  },

  // Subir imagen de galería
  async uploadGalleryImage(imageFile: File): Promise<{ success: boolean; url: string }> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('bucket', 'project-gallery');
      formData.append('isGallery', 'true');
      
      const response = await fetch(`${API_BASE_URL}/API_UpdateProject.php`, {
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
      console.error('Error uploading gallery image:', error);
      throw error;
    }
  },

  // Eliminar imagen
  async deleteImage(imageUrl: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/API_UpdateProject.php`, {
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
  },

  // Eliminar múltiples imágenes de galería
  async deleteGalleryImages(imageUrls: string[]): Promise<{ success: boolean; results: any[] }> {
    try {
      const results = [];
      const errors = [];

      // Eliminar imágenes una por una para mejor control de errores
      for (const imageUrl of imageUrls) {
        try {
          const result = await this.deleteImage(imageUrl);
          results.push({ url: imageUrl, success: result.success });
        } catch (error) {
          errors.push({ url: imageUrl, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }

      return {
        success: true,
        results: results,
        
      };
    } catch (error) {
      console.error('Error deleting gallery images:', error);
      throw error;
    }
  },

  // Validar archivo de imagen
  validateImageFile(file: File): boolean {
    // Verificar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Por favor, sube una imagen (JPG, PNG, GIF, WEBP).');
    }

    // Verificar tamaño de archivo (máx. 10MB para proyectos)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      throw new Error('La imagen es demasiado grande. El tamaño máximo es 10MB.');
    }

    return true;
  },

  // Generar slug desde título
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Remover guiones múltiples
      .trim();
  },

  // Debug: obtener información de la tabla
  async debugTable(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/API_Projects.php/debug`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.error('Error debugging table:', error);
      throw error;
    }
  }
};