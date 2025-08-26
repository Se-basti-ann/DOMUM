# Guía de Actualización de Estilos

## Paleta de Colores Nueva
- **Primario**: #001D23 (primary)
- **Secundario**: #00303F (secondary) 
- **Terciario**: #003E5E (tertiary)
- **Acento**: #6BC6C9 (accent)

## Fuentes
- **Principal**: Avenir Next (font-primary) - Para títulos
- **Secundaria**: Raleway (font-secondary) - Para texto

## Cambios Globales Realizados

### 1. CSS Principal (index.css) ✅
- Importada fuente Raleway de Google Fonts
- Configuradas fuentes Avenir Next y Raleway
- Actualizada paleta de colores completa
- Creadas clases de utilidad para botones, inputs, etc.
- Agregadas animaciones personalizadas

### 2. Tailwind Config (tailwind.config.js) ✅
- Configurada nueva paleta de colores
- Agregadas fuentes primary y secondary
- Creadas utilidades personalizadas
- Configuradas sombras y animaciones

### 3. Componentes de Layout ✅
- **Navbar.tsx**: Actualizado con nueva paleta y fuentes
- **Footer.tsx**: Actualizado con nueva paleta y fuentes

### 4. Componentes Home ✅
- **Hero.tsx**: Actualizado con nueva paleta y fuentes

## Componentes Pendientes de Actualizar

### Projects.tsx
```tsx
// Cambiar:
className="text-primary-900 mb-3"
// Por:
className="text-primary mb-3 font-primary"

// Cambiar:
className="text-primary-700 max-w-xl"
// Por:
className="text-secondary max-w-xl font-secondary leading-relaxed"

// Cambiar:
className="text-primary-600"
// Por:
className="text-secondary font-secondary"
```

### BlogPreview.tsx
```tsx
// Cambiar:
className="text-primary-900 mb-3"
// Por:
className="text-primary mb-3 font-primary"

// Cambiar:
className="text-primary-700"
// Por:
className="text-secondary font-secondary"
```

### ProjectsPage.tsx
```tsx
// Cambiar colores de fondo:
bg-[#001D23] -> bg-primary
bg-[#00303F] -> bg-secondary  
bg-[#003E5E] -> bg-tertiary
bg-[#6BC6C9] -> bg-accent

// Cambiar colores de texto:
text-[#001D23] -> text-primary
text-[#00303F] -> text-secondary
text-[#6BC6C9] -> text-accent

// Agregar fuentes:
Títulos: font-primary
Texto: font-secondary
```

## Clases CSS Disponibles

### Botones
- `.button-primary` - Botón principal (accent background)
- `.button-secondary` - Botón secundario (accent border)
- `.button-dark` - Botón oscuro (primary background)
- `.button-outline-dark` - Botón outline oscuro

### Texto
- `.text-primary` - Color primario #001D23
- `.text-secondary` - Color secundario #00303F
- `.text-tertiary` - Color terciario #003E5E
- `.text-accent` - Color acento #6BC6C9

### Fondos
- `.bg-primary` - Fondo primario
- `.bg-secondary` - Fondo secundario
- `.bg-tertiary` - Fondo terciario
- `.bg-accent` - Fondo acento

### Fuentes
- `.font-primary` - Avenir Next
- `.font-secondary` - Raleway

### Tarjetas
- `.card` - Tarjeta básica
- `.card-dark` - Tarjeta oscura

### Gradientes
- `.gradient-primary` - Gradiente primario a secundario
- `.gradient-secondary` - Gradiente secundario a terciario
- `.gradient-accent` - Gradiente acento