import { BiomeElement, BiomeZone, Resource, Position } from '@/types';

export class BiomeGenerator {
  private ecosystemWidth: number;
  private ecosystemHeight: number;
  
  constructor(width: number = 1200, height: number = 800) {
    this.ecosystemWidth = width;
    this.ecosystemHeight = height;
  }

  /**
   * Genera un ecosistema inicial con biomas, elementos y recursos
   */
  generateInitialEcosystem(): {
    biomeZones: BiomeZone[];
    biomeElements: BiomeElement[];
    resources: Resource[];
  } {
    const biomeZones = this.generateBiomeZones();
    const biomeElements = this.generateBiomeElements(biomeZones);
    const resources = this.generateResources(biomeZones);

    return { biomeZones, biomeElements, resources };
  }

  /**
   * Genera zonas de biomas distribuidas por el mapa
   */
  private generateBiomeZones(): BiomeZone[] {
    const zones: BiomeZone[] = [];
    const biomeTypes: BiomeZone['type'][] = ['forest', 'meadow', 'rocky', 'wetland'];
    
    // Crear 4-6 zonas de bioma
    const numZones = 4 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numZones; i++) {
      const biomeType = biomeTypes[Math.floor(Math.random() * biomeTypes.length)];
      const center: Position = {
        x: 100 + Math.random() * (this.ecosystemWidth - 200),
        y: 100 + Math.random() * (this.ecosystemHeight - 200)
      };
      
      const zone: BiomeZone = {
        id: `biome_${Date.now()}_${i}`,
        type: biomeType,
        center,
        radius: 80 + Math.random() * 120, // 80-200 radio
        density: 0.3 + Math.random() * 0.5, // 30-80% densidad
        fertility: this.getBiomeFertility(biomeType),
        elements: [],
        influences: []
      };
      
      zones.push(zone);
    }
    
    return zones;
  }

  /**
   * Genera elementos del bioma (árboles, rocas, etc.) dentro de las zonas
   */
  private generateBiomeElements(zones: BiomeZone[]): BiomeElement[] {
    const elements: BiomeElement[] = [];
    
    zones.forEach(zone => {
      const elementsInZone = this.generateElementsForZone(zone);
      elements.push(...elementsInZone);
      
      // Actualizar la zona con los IDs de los elementos
      zone.elements = elementsInZone.map(el => el.id);
    });
    
    // Agregar algunos elementos aleatorios fuera de las zonas
    const randomElements = this.generateRandomElements(20);
    elements.push(...randomElements);
    
    return elements;
  }

  /**
   * Genera elementos específicos para un tipo de bioma
   */
  private generateElementsForZone(zone: BiomeZone): BiomeElement[] {
    const elements: BiomeElement[] = [];
    const numElements = Math.floor(zone.density * 15); // 0-12 elementos aprox
    
    for (let i = 0; i < numElements; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * zone.radius * 0.8; // Dentro del 80% del radio
      
      const position: Position = {
        x: zone.center.x + Math.cos(angle) * distance,
        y: zone.center.y + Math.sin(angle) * distance
      };
      
      // Asegurar que está dentro de los límites
      position.x = Math.max(20, Math.min(this.ecosystemWidth - 20, position.x));
      position.y = Math.max(20, Math.min(this.ecosystemHeight - 20, position.y));
      
      const elementType = this.getElementTypeForBiome(zone.type);
      
      const element: BiomeElement = {
        id: `element_${Date.now()}_${i}_${zone.id}`,
        type: elementType,
        position,
        size: 0.5 + Math.random() * 1.5, // 0.5-2.0
        health: 60 + Math.random() * 40, // 60-100
        variant: Math.floor(Math.random() * 3), // 0-2
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      
      elements.push(element);
    }
    
    return elements;
  }

  /**
   * Genera elementos aleatorios por todo el mapa
   */
  private generateRandomElements(count: number): BiomeElement[] {
    const elements: BiomeElement[] = [];
    const types: BiomeElement['type'][] = ['tree', 'rock', 'flower', 'grass'];
    
    for (let i = 0; i < count; i++) {
      const element: BiomeElement = {
        id: `random_element_${Date.now()}_${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        position: {
          x: 20 + Math.random() * (this.ecosystemWidth - 40),
          y: 20 + Math.random() * (this.ecosystemHeight - 40)
        },
        size: 0.3 + Math.random() * 1.0, // Elementos aleatorios más pequeños
        health: 40 + Math.random() * 60,
        variant: Math.floor(Math.random() * 3),
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      
      elements.push(element);
    }
    
    return elements;
  }

  /**
   * Genera recursos distribuidos por el mapa
   */
  private generateResources(zones: BiomeZone[]): Resource[] {
    const resources: Resource[] = [];
    
    zones.forEach(zone => {
      // 1-2 recursos por zona
      const numResources = 1 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < numResources; i++) {
        const resourceType = this.getResourceTypeForBiome(zone.type);
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * zone.radius * 0.6;
        
        const position: Position = {
          x: zone.center.x + Math.cos(angle) * distance,
          y: zone.center.y + Math.sin(angle) * distance
        };
        
        const maxAmount = 50 + Math.random() * 100; // 50-150
        
        const resource: Resource = {
          id: `resource_${Date.now()}_${i}_${zone.id}`,
          type: resourceType,
          position,
          amount: maxAmount * (0.7 + Math.random() * 0.3), // 70-100% de capacidad inicial
          maxAmount,
          regenerationRate: 0.1 + Math.random() * 0.2, // 0.1-0.3 por minuto
          harvestedBy: []
        };
        
        resources.push(resource);
      }
    });
    
    return resources;
  }

  /**
   * Determina fertilidad base según tipo de bioma
   */
  private getBiomeFertility(biomeType: BiomeZone['type']): number {
    const baseValues = {
      forest: 80,
      meadow: 90,
      wetland: 70,
      rocky: 30,
      desert: 20
    };
    
    const base = baseValues[biomeType];
    return base + Math.random() * 20 - 10; // ±10 variación
  }

  /**
   * Selecciona tipo de elemento apropiado para el bioma
   */
  private getElementTypeForBiome(biomeType: BiomeZone['type']): BiomeElement['type'] {
    const probabilities = {
      forest: { tree: 0.6, rock: 0.2, flower: 0.1, grass: 0.1, water: 0.0 },
      meadow: { tree: 0.1, rock: 0.1, flower: 0.4, grass: 0.4, water: 0.0 },
      rocky: { tree: 0.1, rock: 0.7, flower: 0.1, grass: 0.1, water: 0.0 },
      wetland: { tree: 0.2, rock: 0.1, flower: 0.2, grass: 0.3, water: 0.2 },
      desert: { tree: 0.05, rock: 0.5, flower: 0.1, grass: 0.05, water: 0.3 }
    };
    
    const probs = probabilities[biomeType];
    const rand = Math.random();
    let cumulative = 0;
    
    for (const [type, probability] of Object.entries(probs)) {
      cumulative += probability;
      if (rand <= cumulative) {
        return type as BiomeElement['type'];
      }
    }
    
    return 'grass'; // fallback
  }

  /**
   * Selecciona tipo de recurso apropiado para el bioma
   */
  private getResourceTypeForBiome(biomeType: BiomeZone['type']): Resource['type'] {
    const preferences = {
      forest: ['food', 'water'],
      meadow: ['food', 'energy'],
      rocky: ['mineral', 'energy'],
      wetland: ['water', 'food'],
      desert: ['mineral', 'energy']
    };
    
    const options = preferences[biomeType] || ['food'];
    return options[Math.floor(Math.random() * options.length)] as Resource['type'];
  }

  /**
   * Regenera recursos con el tiempo
   */
  regenerateResources(resources: Resource[]): Resource[] {
    return resources.map(resource => {
      if (resource.amount < resource.maxAmount) {
        const newAmount = Math.min(
          resource.maxAmount,
          resource.amount + resource.regenerationRate
        );
        
        return { ...resource, amount: newAmount };
      }
      return resource;
    });
  }

  /**
   * Hace crecer elementos del bioma basado en fertilidad de la zona
   */
  growBiomeElements(elements: BiomeElement[], zones: BiomeZone[]): BiomeElement[] {
    return elements.map(element => {
      // Encontrar zona que contiene este elemento
      const zone = zones.find(z => {
        const distance = Math.sqrt(
          Math.pow(element.position.x - z.center.x, 2) + 
          Math.pow(element.position.y - z.center.y, 2)
        );
        return distance <= z.radius;
      });
      
      if (zone && element.type === 'tree' && element.health < 100) {
        const growthRate = (zone.fertility / 100) * 0.5; // Crecimiento basado en fertilidad
        const newHealth = Math.min(100, element.health + growthRate);
        
        return {
          ...element,
          health: newHealth,
          lastModified: new Date().toISOString()
        };
      }
      
      return element;
    });
  }
}