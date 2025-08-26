import { Project, Blog } from '../types';

const API_BASE_URL = 'https://domumarquitectura.com/assets';

// Función para manejar errores de la API
const handleApiError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  throw new Error(`Error en ${context}: ${error.message || 'Error desconocido'}`);
};

// Función para hacer peticiones HTTP
const apiRequest = async (url: string, options: RequestInit = {}) => {
  try {
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      mode: 'cors', // Explicitly set CORS mode
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error response:`, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`API response from ${url}:`, data);
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    
    // Check if it's a CORS error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Possible CORS error or network issue');
      throw new Error('Error de conexión: Verifique que la API esté disponible y configurada correctamente para CORS');
    }
    
    throw error;
  }
};

export const apiService = {
  // ========== PROYECTOS ==========
  
  // Obtener todos los proyectos
  async getProjects(): Promise<Project[]> {
    try {
      const data = await apiRequest(`${API_BASE_URL}/API_Projects.php`);
      
      // Asegurar que devolvemos un array
      const projects = Array.isArray(data) ? data : [data].filter(Boolean);
      
      console.log(`Processing ${projects.length} projects`);
      
      // Procesar y limpiar los datos según la estructura real de la API
      return projects.map(project => ({
        ...project,
        id: project.id || '',
        title: project.title || 'Sin título',
        description: project.description || '',
        category: project.category || 'Sin categoría',
        year: project.year || '',
        location: project.location || '',
        client: project.client || '',
        image_url: project.image_url || '',
        gallery: Array.isArray(project.gallery) ? project.gallery : [],
        slug: project.slug || project.id || '',
        area: project.meters || project.area || '',
        status: project.status || 'Completado',
        content: project.content || project.description || '',
        created_at: project.created_at || new Date().toISOString(),
        updated_at: project.updated_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      // En caso de error, devolver array vacío en lugar de lanzar error
      return [];
    }
  },

  // Obtener un proyecto por ID
  async getProjectById(id: string): Promise<Project | null> {
    try {
      const data = await apiRequest(`${API_BASE_URL}/API_Projects.php/${id}`);
      
      if (!data || data.error) return null;

      return {
        ...data,
        id: data.id || '',
        title: data.title || 'Sin título',
        description: data.description || '',
        category: data.category || 'Sin categoría',
        year: data.year || '',
        location: data.location || '',
        client: data.client || '',
        image_url: data.image_url || '',
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        slug: data.slug || data.id || '',
        area: data.meters || data.area || '',
        status: data.status || 'Completado',
        content: data.content || data.description || '',
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching project by ID:', error);
      return null;
    }
  },

  // Obtener un proyecto por slug
  async getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      // Primero intentamos obtener todos los proyectos y buscar por slug
      const projects = await this.getProjects();
      const project = projects.find(p => p.slug === slug);
      
      if (project) {
        return project;
      }

      // Si no se encuentra por slug, intentar por ID
      return await this.getProjectById(slug);
    } catch (error) {
      console.error('Error fetching project by slug:', error);
      return null;
    }
  },

  // ========== BLOGS ==========
  
  // Obtener todos los blogs
  async getBlogs(): Promise<Blog[]> {
    try {
      const data = await apiRequest(`${API_BASE_URL}/API_Blogs.php`);
      
      // Asegurar que devolvemos un array
      const blogs = Array.isArray(data) ? data : [data].filter(Boolean);
      
      console.log(`Processing ${blogs.length} blogs`);
      
      // Procesar y limpiar los datos
      return blogs.map(blog => ({
        ...blog,
        id: blog.id || '',
        title: blog.title || 'Sin título',
        content: blog.content || '',
        excerpt: blog.excerpt || (blog.content ? blog.content.substring(0, 200) + '...' : ''),
        image_url: blog.image_url || '',
        published_at: blog.published_at || new Date().toISOString(),
        created_at: blog.created_at || new Date().toISOString(),
        updated_at: blog.updated_at || new Date().toISOString(),
        author: blog.author || 'DOMUM Arquitectura',
        category: blog.category || 'General',
        slug: blog.slug || blog.id || ''
      }));
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // En caso de error, devolver array vacío en lugar de lanzar error
      return [];
    }
  },

  // Obtener un blog por ID
  async getBlogById(id: string): Promise<Blog | null> {
    try {
      const data = await apiRequest(`${API_BASE_URL}/API_Blogs.php/${id}`);
      
      if (!data || data.error) return null;

      return {
        ...data,
        id: data.id || '',
        title: data.title || 'Sin título',
        content: data.content || '',
        excerpt: data.excerpt || (data.content ? data.content.substring(0, 200) + '...' : ''),
        image_url: data.image_url || '',
        published_at: data.published_at || new Date().toISOString(),
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        author: data.author || 'DOMUM Arquitectura',
        category: data.category || 'General',
        slug: data.slug || data.id || ''
      };
    } catch (error) {
      console.error('Error fetching blog by ID:', error);
      return null;
    }
  },

  // Obtener un blog por slug
  async getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
      // Primero intentamos obtener todos los blogs y buscar por slug
      const blogs = await this.getBlogs();
      const blog = blogs.find(b => b.slug === slug);
      
      if (blog) {
        return blog;
      }

      // Si no se encuentra por slug, intentar por ID
      return await this.getBlogById(slug);
    } catch (error) {
      console.error('Error fetching blog by slug:', error);
      return null;
    }
  },

  // ========== FUNCIONES DE UTILIDAD ==========
  
  // Función para simular delay (opcional, para mantener consistencia con mockAPI)
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Obtener proyectos con límite
  async getProjectsWithLimit(limit?: number): Promise<Project[]> {
    const projects = await this.getProjects();
    return limit ? projects.slice(0, limit) : projects;
  },

  // Obtener blogs con límite
  async getBlogsWithLimit(limit?: number): Promise<Blog[]> {
    const blogs = await this.getBlogs();
    return limit ? blogs.slice(0, limit) : blogs;
  },

  // Obtener proyectos relacionados por categoría
  async getRelatedProjects(category: string, currentProjectId: string, limit: number = 3): Promise<Project[]> {
    try {
      const projects = await this.getProjects();
      return projects
        .filter(p => 
          p.category === category && 
          p.id !== currentProjectId
        )
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting related projects:', error);
      return [];
    }
  }
};

// Exportar también como mockAPI para mantener compatibilidad
export const mockAPI = {
  getProjects: (limit?: number) => limit ? apiService.getProjectsWithLimit(limit) : apiService.getProjects(),
  getProjectBySlug: (slug: string) => apiService.getProjectBySlug(slug),
  getBlogs: (limit?: number) => limit ? apiService.getBlogsWithLimit(limit) : apiService.getBlogs(),
  getBlogBySlug: (slug: string) => apiService.getBlogBySlug(slug),
  delay: apiService.delay
};