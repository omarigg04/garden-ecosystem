# 🎨 Sprites Documentation - Digital Ecosystem Garden

Esta documentación define la estructura de archivos de sprites y especificaciones para reemplazar las figuras geométricas procedurales con sprites diseñados.

## 📁 Estructura de Directorios

```
/public/sprites/
├── entities/              # Sprites de entidades (criaturas)
│   ├── bodies/            # Formas corporales base
│   ├── features/          # Características especiales
│   └── animations/        # Animaciones (futuro)
├── biome/                 # Elementos del bioma
│   ├── vegetation/        # Plantas, árboles, flores
│   ├── terrain/           # Rocas, tierra, agua
│   └── atmospheric/       # Efectos atmosféricos
├── traces/                # Rastros ambientales
│   ├── footprints/        # Huellas de diferentes tipos
│   ├── paths/             # Senderos y caminos
│   ├── structures/        # Nidos, madrigueras
│   └── territories/       # Marcas territoriales
├── resources/             # Recursos recolectables
│   ├── minerals/          # Minerales y metales
│   ├── organics/          # Comida, materiales orgánicos
│   ├── energy/            # Fuentes de energía
│   └── water/             # Fuentes de agua
├── effects/               # Efectos visuales
│   ├── particles/         # Partículas y destellos
│   ├── auras/             # Auras y campos de energía
│   └── interactions/      # Efectos de interacción
└── ui/                    # Elementos de interfaz
    ├── cursors/           # Cursores especiales
    ├── indicators/        # Indicadores de estado
    └── overlays/          # Superposiciones
```

## 🐾 Sprites de Entidades

### Cuerpos Base (`/entities/bodies/`)
- **circle-body-small.png** (16x16px) - Cuerpo circular pequeño
- **circle-body-medium.png** (24x24px) - Cuerpo circular mediano  
- **circle-body-large.png** (32x32px) - Cuerpo circular grande
- **triangle-body-small.png** (16x16px) - Cuerpo triangular pequeño
- **triangle-body-medium.png** (24x24px) - Cuerpo triangular mediano
- **triangle-body-large.png** (32x32px) - Cuerpo triangular grande
- **hexagon-body-small.png** (16x16px) - Cuerpo hexagonal pequeño
- **hexagon-body-medium.png** (24x24px) - Cuerpo hexagonal mediano
- **hexagon-body-large.png** (32x32px) - Cuerpo hexagonal grande
- **diamond-body-small.png** (16x16px) - Cuerpo diamante pequeño
- **diamond-body-medium.png** (24x24px) - Cuerpo diamante mediano
- **diamond-body-large.png** (32x32px) - Cuerpo diamante grande
- **star-body-small.png** (16x16px) - Cuerpo estrella pequeño
- **star-body-medium.png** (24x24px) - Cuerpo estrella mediano
- **star-body-large.png** (32x32px) - Cuerpo estrella grande

### Características Especiales (`/entities/features/`)
- **glowing-eyes.png** (8x8px) - Ojos brillantes
- **crystal-spikes-01.png** (12x12px) - Picos de cristal variante 1
- **crystal-spikes-02.png** (12x12px) - Picos de cristal variante 2
- **energy-aura.png** (40x40px) - Aura de energía (transparente)
- **shadow-trail.png** (20x8px) - Rastro de sombra
- **floating-particles.png** (16x16px) - Partículas flotantes
- **metallic-sheen.png** (24x24px) - Brillo metálico (overlay)
- **bio-patterns.png** (32x32px) - Patrones biológicos

## 🌿 Elementos del Bioma

### Vegetación (`/biome/vegetation/`)
- **tree-small-01.png** (32x48px) - Árbol pequeño variante 1
- **tree-small-02.png** (32x48px) - Árbol pequeño variante 2
- **tree-small-03.png** (32x48px) - Árbol pequeño variante 3
- **tree-medium-01.png** (48x72px) - Árbol mediano variante 1
- **tree-medium-02.png** (48x72px) - Árbol mediano variante 2
- **tree-medium-03.png** (48x72px) - Árbol mediano variante 3
- **tree-large-01.png** (64x96px) - Árbol grande variante 1
- **tree-large-02.png** (64x96px) - Árbol grande variante 2
- **tree-large-03.png** (64x96px) - Árbol grande variante 3
- **flower-01.png** (12x12px) - Flor variante 1
- **flower-02.png** (12x12px) - Flor variante 2
- **flower-03.png** (12x12px) - Flor variante 3
- **grass-patch-01.png** (16x8px) - Parche de hierba 1
- **grass-patch-02.png** (16x8px) - Parche de hierba 2
- **grass-patch-03.png** (16x8px) - Parche de hierba 3

### Terreno (`/biome/terrain/`)
- **rock-small-01.png** (24x24px) - Roca pequeña variante 1
- **rock-small-02.png** (24x24px) - Roca pequeña variante 2
- **rock-small-03.png** (24x24px) - Roca pequeña variante 3
- **rock-medium-01.png** (36x36px) - Roca mediana variante 1
- **rock-medium-02.png** (36x36px) - Roca mediana variante 2
- **rock-medium-03.png** (36x36px) - Roca mediana variante 3
- **rock-large-01.png** (48x48px) - Roca grande variante 1
- **rock-large-02.png** (48x48px) - Roca grande variante 2
- **rock-large-03.png** (48x48px) - Roca grande variante 3
- **water-tile.png** (32x32px) - Baldosa de agua
- **water-flow-horizontal.png** (32x16px) - Flujo de agua horizontal
- **water-flow-vertical.png** (16x32px) - Flujo de agua vertical

## 🐾 Rastros Ambientales

### Huellas (`/traces/footprints/`)
- **footprint-small.png** (8x8px) - Huella pequeña
- **footprint-medium.png** (10x10px) - Huella mediana
- **footprint-large.png** (12x12px) - Huella grande
- **paw-print.png** (8x8px) - Huella de pata
- **claw-mark.png** (12x6px) - Marca de garra

### Senderos (`/traces/paths/`)
- **path-tile-light.png** (16x16px) - Baldosa de sendero clara
- **path-tile-medium.png** (16x16px) - Baldosa de sendero mediana
- **path-tile-heavy.png** (16x16px) - Baldosa de sendero muy transitada
- **path-edge-horizontal.png** (16x4px) - Borde de sendero horizontal
- **path-edge-vertical.png** (4x16px) - Borde de sendero vertical

### Estructuras (`/traces/structures/`)
- **nest-basic.png** (32x32px) - Nido básico
- **nest-elaborate.png** (40x40px) - Nido elaborado
- **burrow-entrance.png** (24x24px) - Entrada de madriguera
- **burrow-mound.png** (28x20px) - Montículo de madriguera
- **territorial-marker.png** (16x16px) - Marcador territorial
- **scent-marker.png** (12x12px) - Marcador de olor (translúcido)

## 💎 Recursos

### Minerales (`/resources/minerals/`)
- **mineral-crystal-01.png** (20x20px) - Cristal mineral variante 1
- **mineral-crystal-02.png** (20x20px) - Cristal mineral variante 2
- **mineral-crystal-03.png** (20x20px) - Cristal mineral variante 3
- **mineral-ore-iron.png** (16x16px) - Mineral de hierro
- **mineral-ore-gold.png** (16x16px) - Mineral de oro
- **mineral-ore-rare.png** (16x16px) - Mineral raro

### Orgánicos (`/resources/organics/`)
- **food-berries.png** (12x12px) - Bayas
- **food-seeds.png** (8x8px) - Semillas
- **food-nectar.png** (14x14px) - Néctar
- **organic-fiber.png** (10x10px) - Fibra orgánica
- **organic-resin.png** (12x12px) - Resina

### Energía (`/resources/energy/`)
- **energy-crystal.png** (18x18px) - Cristal de energía
- **energy-orb.png** (16x16px) - Orbe de energía (brillante)
- **energy-vent.png** (24x24px) - Ventilación de energía
- **solar-spot.png** (20x20px) - Punto solar

### Agua (`/resources/water/`)
- **water-spring.png** (24x24px) - Manantial
- **water-pond.png** (40x40px) - Estanque pequeño
- **water-dewdrop.png** (8x8px) - Gota de rocío
- **water-stream.png** (48x16px) - Arroyo

## ✨ Efectos Visuales

### Partículas (`/effects/particles/`)
- **sparkle-01.png** (6x6px) - Destello pequeño
- **sparkle-02.png** (8x8px) - Destello mediano
- **sparkle-03.png** (10x10px) - Destello grande
- **dust-particle.png** (4x4px) - Partícula de polvo
- **pollen-particle.png** (6x6px) - Partícula de polen
- **magic-particle.png** (8x8px) - Partícula mágica

### Auras (`/effects/auras/`)
- **growth-aura.png** (48x48px) - Aura de crecimiento (verde, transparente)
- **healing-aura.png** (48x48px) - Aura de curación (azul, transparente)
- **energy-aura.png** (48x48px) - Aura de energía (amarilla, transparente)
- **protective-aura.png** (48x48px) - Aura protectora (púrpura, transparente)

### Interacciones (`/effects/interactions/`)
- **dig-particles.png** (16x16px) - Partículas de excavación
- **splash-small.png** (12x12px) - Salpicadura pequeña
- **splash-medium.png** (16x16px) - Salpicadura mediana
- **growth-burst.png** (20x20px) - Explosión de crecimiento
- **interaction-heart.png** (10x10px) - Corazón de interacción social

## 🎯 Especificaciones Técnicas

### Formato de Archivos
- **Formato**: PNG con transparencia (PNG-32)
- **Fondo**: Transparente
- **Compresión**: Optimizada para web

### Paleta de Colores
- **Naturales**: Verdes #2D5D31, #4A7C59, #68B684
- **Tierra**: Marrones #8B4513, #A0522D, #CD853F
- **Agua**: Azules #1E90FF, #4682B4, #87CEEB
- **Energía**: Amarillos/Dorados #FFD700, #FFA500, #FFFF00
- **Místico**: Púrpuras #8A2BE2, #9370DB, #BA55D3

### Animaciones (Futuro)
- **Framerate**: 8-12 FPS para efectos sutiles
- **Loops**: Perfectos para efectos continuos
- **Naming**: `sprite-name-frame01.png`, `sprite-name-frame02.png`, etc.

## 🔄 Sistema de Renderizado

### Capas de Renderizado (Z-Index)
1. **Fondo** (z: 0): Terreno base
2. **Bioma** (z: 10): Elementos del bioma
3. **Rastros** (z: 20): Huellas y senderos
4. **Recursos** (z: 30): Recursos recolectables
5. **Entidades** (z: 40): Criaturas
6. **Efectos** (z: 50): Partículas y auras
7. **UI** (z: 100): Indicadores de interfaz

### Escalado
- **Sprites base**: Diseñados para zoom 1.0x
- **Escalado automático**: Se adaptan al nivel de zoom del canvas
- **Pixel perfect**: Mantener nitidez en zooms enteros (1x, 2x, 3x)

## 📝 Notas de Implementación

### Prioridades de Implementación
1. **Fase 1**: Entidades básicas (cuerpos y características principales)
2. **Fase 2**: Bioma esencial (árboles, rocas, agua)
3. **Fase 3**: Rastros ambientales básicos (huellas, nidos)
4. **Fase 4**: Recursos y efectos
5. **Fase 5**: Animaciones y efectos avanzados

### Fallback System
- El sistema actual de renderizado procedural se mantiene como fallback
- Los sprites se cargan de forma progresiva
- Si un sprite no está disponible, se usa la figura geométrica correspondiente

### Performance
- **Sprite Atlases**: Considerar combinar sprites pequeños en atlas para mejor rendimiento
- **Lazy Loading**: Cargar sprites según la visibilidad en el viewport
- **Caching**: Cache agresivo de sprites para evitar recargas

## 🚀 Migración desde Figuras Geométricas

### EntityRenderer.ts
```typescript
// Antes: ctx.arc(x, y, radius, 0, Math.PI * 2)
// Después: ctx.drawImage(spriteImage, x - width/2, y - height/2, width, height)
```

### Mapping de Formas a Sprites
- `circle` → `circle-body-{size}.png`
- `triangle` → `triangle-body-{size}.png`
- `hexagon` → `hexagon-body-{size}.png`
- `diamond` → `diamond-body-{size}.png`
- `star` → `star-body-{size}.png`

Esta documentación se actualizará conforme se implementen nuevas características y sprites.