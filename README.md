# 🏠 DOMUM - Smart Home Automation System

<div align="center">


![DOMUM Logo](favicon.png)

**Sistema de domótica inteligente para control y automatización del hogar**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://domum-blue.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

[Demo: Mira el proyecto en este link](https://domum-gf2o.vercel.app/) • [Reporte de Bug](https://github.com/Se-basti-ann/DOMUM/issues) • [Solicitar Feature](https://github.com/Se-basti-ann/DOMUM/issues)

</div>

---

## 📋 Tabla de Contenidos

- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Configuración](#-configuración)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Sobre el Proyecto

**DOMUM** es una plataforma web moderna para gestión y automatización de dispositivos del hogar inteligente (IoT). Permite a los usuarios controlar, monitorear y automatizar diversos dispositivos conectados desde una interfaz unificada e intuitiva.

### ¿Por qué DOMUM?

- 🎨 **Interfaz Moderna**: Diseño limpio y responsivo construido con Tailwind CSS
- ⚡ **Alto Rendimiento**: Desarrollado con Vite para tiempos de carga ultrarrápidos
- 🔒 **Seguro**: Implementación de mejores prácticas de seguridad para IoT
- 📱 **Responsive**: Compatible con dispositivos móviles, tablets y desktop
- 🌐 **Real-time**: Control y monitoreo en tiempo real de dispositivos
- 🤖 **Automatizaciones**: Crea rutinas y automatizaciones personalizadas

---

## ✨ Características

### Control de Dispositivos

- 💡 **Iluminación**: Control de intensidad, color y programación de luces
- 🌡️ **Climatización**: Gestión de temperatura y sistemas HVAC
- 🔐 **Seguridad**: Control de cerraduras, cámaras y alarmas
- 🔌 **Energía**: Monitoreo de consumo y control de enchufes inteligentes
- 🎵 **Multimedia**: Control de sistemas de audio y video

### Dashboard Inteligente

- 📊 Dashboard personalizable con widgets
- 📈 Gráficos de consumo energético
- 🔔 Notificaciones en tiempo real
- 📅 Historial de eventos y actividades
- 🎨 Temas claro/oscuro

### Automatizaciones

- ⏰ Programación horaria de dispositivos
- 🌅 Rutinas basadas en eventos (amanecer/anochecer)
- 🎭 Escenas personalizadas (cine, lectura, fiesta, etc.)
- 🔗 Integración con sensores ambientales
- 🤖 Acciones condicionales y lógicas

---

## 🛠️ Tech Stack

### Frontend

- **Framework/Library**: React/Vue (TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API / Pinia
- **Routing**: React Router / Vue Router
- **Icons**: Heroicons / Lucide

### Herramientas de Desarrollo

- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: npm/pnpm
- **Deployment**: Vercel

### Integraciones

- 🌐 APIs RESTful para control de dispositivos
- 🔌 WebSockets para comunicación en tiempo real
- 📡 MQTT para IoT messaging
- ☁️ Cloud storage para configuraciones

---

## 📦 Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- npm o pnpm

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/Se-basti-ann/DOMUM.git
cd DOMUM
```

2. **Instalar dependencias**

```bash
npm install
# o
pnpm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=tu_api_url
VITE_MQTT_BROKER=tu_mqtt_broker
VITE_WS_URL=tu_websocket_url
```

4. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

5. **Abrir en el navegador**

Navega a `http://localhost:5173` (o el puerto que indique Vite)

---

## 🚀 Uso

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo con hot reload
npm run dev

# Construir para producción
npm run build

# Preview de la build de producción
npm run preview
```

### Configuración Inicial

1. **Agregar Dispositivos**: Desde el panel de control, agrega tus dispositivos IoT
2. **Crear Habitaciones**: Organiza dispositivos por habitaciones
3. **Configurar Automatizaciones**: Define tus rutinas y horarios
4. **Personalizar Dashboard**: Ajusta widgets según tus preferencias

### Ejemplo de Uso

```typescript
// Ejemplo de control de dispositivo
import { useDevice } from '@/composables/useDevice'

const { toggleDevice, setDeviceState } = useDevice()

// Encender/apagar dispositivo
await toggleDevice('living-room-light')

// Establecer nivel de brillo
await setDeviceState('living-room-light', { 
  brightness: 75,
  color: '#FF5733'
})
```

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Preview de la build de producción |
| `npm run lint` | Ejecuta el linter (ESLint) |
| `npm run type-check` | Verifica tipos con TypeScript |

---

## 📁 Estructura del Proyecto

```
DOMUM/
├── public/              # Archivos estáticos
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── assets/         # Imágenes, fuentes, etc.
│   ├── components/     # Componentes reutilizables
│   │   ├── devices/    # Componentes de dispositivos
│   │   ├── dashboard/  # Componentes del dashboard
│   │   └── common/     # Componentes comunes
│   ├── views/          # Vistas/Páginas
│   ├── composables/    # Lógica reutilizable (Vue)
│   ├── hooks/          # Custom hooks (React)
│   ├── services/       # Servicios API
│   ├── store/          # State management
│   ├── types/          # TypeScript types/interfaces
│   ├── utils/          # Funciones utilitarias
│   ├── router/         # Configuración de rutas
│   ├── App.vue         # Componente principal
│   └── main.ts         # Entry point
├── .env                # Variables de entorno
├── .gitignore
├── eslint.config.js    # Configuración ESLint
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js  # Configuración Tailwind
├── tsconfig.json       # Configuración TypeScript
└── vite.config.ts      # Configuración Vite
```

---

## ⚙️ Configuración

### Tailwind CSS

El proyecto utiliza Tailwind CSS para el styling. La configuración se encuentra en `tailwind.config.js`:

```javascript
// Ejemplo de personalización
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      },
    },
  },
}
```

### TypeScript

Configuración estricta de TypeScript para mejor seguridad de tipos:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    // ... más opciones
  }
}
```

---

## 🗺️ Roadmap

### Versión 1.0 (Actual)

- [x] Dashboard básico
- [x] Control de dispositivos
- [x] Interfaz responsive
- [x] Temas claro/oscuro

### Versión 2.0 (Próxima)

- [ ] Automatizaciones avanzadas
- [ ] Soporte multi-usuario
- [ ] App móvil nativa
- [ ] Integración con asistentes de voz
- [ ] Análisis predictivo de consumo
- [ ] Geolocalización y automatización por ubicación

### Versión 3.0 (Futuro)

- [ ] IA para recomendaciones de ahorro energético
- [ ] Integración con más marcas IoT
- [ ] API pública para desarrolladores
- [ ] Sistema de plugins

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Aquí te explico cómo puedes contribuir:

1. **Fork el proyecto**
2. **Crea una rama para tu feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit tus cambios** (`git commit -m 'Add some AmazingFeature'`)
4. **Push a la rama** (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Guías de Contribución

- Sigue las convenciones de código existentes
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Asegúrate de que el linting pase (`npm run lint`)

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👤 Contacto

**Sebastian Rodriguez Poveda**

- GitHub: [@Se-basti-ann](https://github.com/Se-basti-ann)
- LinkedIn: [Sebastian Rodriguez Poveda](https://www.linkedin.com/in/sebastian-rodriguez-poveda-64a202157)
- Portfolio: [sebastianrodriguez.dev](#)

---

## 🙏 Agradecimientos

- [Vite](https://vitejs.dev/) - Build tool increíblemente rápido
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [TypeScript](https://www.typescriptlang.org/) - JavaScript con tipos
- [Vercel](https://vercel.com/) - Plataforma de deployment

---

<div align="center">

**⭐ Si este proyecto te fue útil, considera darle una estrella!**

Hecho con ❤️ por [Sebastian Rodriguez](https://github.com/Se-basti-ann)

</div>
