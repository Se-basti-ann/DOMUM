import { Project, Blog } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Casa Moderna Minimalista',
    description: 'Una casa moderna con diseño minimalista que combina funcionalidad y estética.',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
    category: 'Residencial',
    year: '2023',
    slug: 'casa-moderna-minimalista',
    location: 'Madrid, España',
    area: '250 m²',
    status: 'Completado',
    client: 'Cliente Privado',
    created_at: '2023-01-15',
    updated_at: '2023-01-15'
  },
  {
    id: '2',
    title: 'Edificio Corporativo Sostenible',
    description: 'Edificio de oficinas con certificación LEED y tecnologías verdes.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Comercial',
    year: '2023',
    slug: 'edificio-corporativo-sostenible',
    location: 'Barcelona, España',
    area: '5000 m²',
    status: 'En construcción',
    client: 'Empresa Tech',
    created_at: '2023-02-20',
    updated_at: '2023-02-20'
  },
  {
    id: '3',
    title: 'Centro Cultural Contemporáneo',
    description: 'Espacio cultural que fusiona tradición y modernidad en su diseño.',
    image_url: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    category: 'Cultural',
    year: '2022',
    slug: 'centro-cultural-contemporaneo',
    location: 'Valencia, España',
    area: '3200 m²',
    status: 'Completado',
    client: 'Ayuntamiento de Valencia',
    created_at: '2022-11-10',
    updated_at: '2022-11-10'
  },
  {
    id: '4',
    title: 'Complejo Residencial Urbano',
    description: 'Desarrollo residencial que integra espacios verdes y vida comunitaria.',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Residencial',
    year: '2023',
    slug: 'complejo-residencial-urbano',
    location: 'Sevilla, España',
    area: '8500 m²',
    status: 'En desarrollo',
    client: 'Promotora Inmobiliaria',
    created_at: '2023-03-05',
    updated_at: '2023-03-05'
  },
  {
    id: '5',
    title: 'Restaurante de Autor',
    description: 'Diseño interior que refleja la filosofía culinaria del chef.',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Comercial',
    year: '2023',
    slug: 'restaurante-de-autor',
    location: 'Bilbao, España',
    area: '180 m²',
    status: 'Completado',
    client: 'Chef Michelin',
    created_at: '2023-04-12',
    updated_at: '2023-04-12'
  },
  {
    id: '6',
    title: 'Biblioteca Municipal',
    description: 'Espacio de conocimiento que combina tradición y tecnología.',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    category: 'Cultural',
    year: '2022',
    slug: 'biblioteca-municipal',
    location: 'Zaragoza, España',
    area: '2800 m²',
    status: 'Completado',
    client: 'Ayuntamiento de Zaragoza',
    created_at: '2022-09-18',
    updated_at: '2022-09-18'
  }
];

export const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'Tendencias en Arquitectura Sostenible 2024',
    content: 'La arquitectura sostenible continúa evolucionando con nuevas tecnologías y materiales que reducen el impacto ambiental. En este artículo exploramos las principales tendencias que marcarán el 2024.',
    excerpt: 'Descubre las últimas tendencias en arquitectura sostenible que están transformando la industria.',
    image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80',
    slug: 'tendencias-arquitectura-sostenible-2024',
    published_at: '2024-01-15',
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    author: 'María González',
    category: 'Sostenibilidad'
  },
  {
    id: '2',
    title: 'El Futuro del Diseño de Interiores',
    content: 'Los espacios interiores están experimentando una revolución con la integración de tecnología smart y materiales innovadores. Analizamos cómo estos cambios afectan la forma en que vivimos y trabajamos.',
    excerpt: 'Exploramos cómo la tecnología y los nuevos materiales están redefiniendo los espacios interiores.',
    image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80',
    slug: 'futuro-diseno-interiores',
    published_at: '2024-01-10',
    created_at: '2024-01-10',
    updated_at: '2024-01-10',
    author: 'Carlos Ruiz',
    category: 'Diseño Interior'
  },
  {
    id: '3',
    title: 'Materiales Innovadores en la Construcción',
    content: 'La industria de la construcción está adoptando materiales revolucionarios que prometen cambiar la forma en que construimos. Desde hormigón auto-reparable hasta maderas modificadas genéticamente.',
    excerpt: 'Conoce los materiales del futuro que están transformando la construcción moderna.',
    image_url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    slug: 'materiales-innovadores-construccion',
    published_at: '2024-01-05',
    created_at: '2024-01-05',
    updated_at: '2024-01-05',
    author: 'Ana Martínez',
    category: 'Construcción'
  },
  {
    id: '4',
    title: 'Arquitectura Bioclimática: Diseñando con el Clima',
    content: 'La arquitectura bioclimática aprovecha las condiciones climáticas locales para crear edificios más eficientes energéticamente. Descubre los principios fundamentales y casos de éxito.',
    excerpt: 'Aprende cómo diseñar edificios que trabajen en armonía con el clima local.',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2006&q=80',
    slug: 'arquitectura-bioclimatica',
    published_at: '2023-12-28',
    created_at: '2023-12-28',
    updated_at: '2023-12-28',
    author: 'Luis Fernández',
    category: 'Sostenibilidad'
  }
];

// Función para simular delay de API
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Funciones mock para simular operaciones de base de datos
export const mockAPI = {
  // Proyectos
  getProjects: async (limit?: number): Promise<Project[]> => {
    await delay(500); // Simular latencia de red
    return limit ? mockProjects.slice(0, limit) : mockProjects;
  },

  getProjectBySlug: async (slug: string): Promise<Project | null> => {
    await delay(300);
    return mockProjects.find(project => project.slug === slug) || null;
  },

  // Blogs
  getBlogs: async (limit?: number): Promise<Blog[]> => {
    await delay(500);
    return limit ? mockBlogs.slice(0, limit) : mockBlogs;
  },

  getBlogBySlug: async (slug: string): Promise<Blog | null> => {
    await delay(300);
    return mockBlogs.find(blog => blog.slug === slug) || null;
  }
};