import { EnvironmentalTrace, Entity, Position, BiomeElement, Resource } from '@/types';

export class EnvironmentalTraceSystem {
  private traces: Map<string, EnvironmentalTrace> = new Map();
  private maxTraces = 500; // Límite para rendimiento

  /**
   * Crea un rastro ambiental cuando una entidad realiza una acción
   */
  createTrace(
    type: EnvironmentalTrace['type'],
    position: Position,
    entity: Entity,
    properties: Record<string, unknown> = {}
  ): EnvironmentalTrace {
    const trace: EnvironmentalTrace = {
      id: `trace_${Date.now()}_${entity.id}`,
      type,
      position,
      radius: this.getTraceRadius(type),
      intensity: this.getInitialIntensity(type, entity),
      entityId: entity.id,
      createdAt: new Date().toISOString(),
      expiresAt: this.calculateExpirationTime(type),
      properties: {
        entityName: entity.name,
        entitySpecies: entity.species,
        ...properties
      }
    };

    this.traces.set(trace.id, trace);
    this.cleanupExpiredTraces();
    
    return trace;
  }

  /**
   * Crea huellas cuando una entidad se mueve
   */
  createMovementTrace(entity: Entity, fromPosition: Position, toPosition: Position) {
    // Crear huella en la posición anterior
    this.createTrace('footprint', fromPosition, entity, {
      direction: Math.atan2(toPosition.y - fromPosition.y, toPosition.x - fromPosition.x),
      speed: this.calculateDistance(fromPosition, toPosition)
    });

    // Si la entidad ha estado en esta área antes, crear/fortalecer un sendero
    this.strengthenPath(entity, toPosition);
  }

  /**
   * Crea territorio cuando una entidad permanece en un área
   */
  createTerritoryTrace(entity: Entity, position: Position, duration: number) {
    const existing = Array.from(this.traces.values()).find(
      trace => trace.type === 'territory' && 
               trace.entityId === entity.id &&
               this.calculateDistance(trace.position, position) < 50
    );

    if (existing) {
      // Fortalecer territorio existente
      existing.intensity = Math.min(100, existing.intensity + duration * 0.1);
      existing.radius = Math.min(80, existing.radius + 2);
    } else {
      // Crear nuevo territorio
      this.createTrace('territory', position, entity, {
        duration,
        establishedAt: new Date().toISOString()
      });
    }
  }

  /**
   * Crea nido o madriguera cuando una entidad construye
   */
  createNestTrace(entity: Entity, position: Position) {
    const nestType = this.determineNestType(entity);
    
    this.createTrace(nestType, position, entity, {
      comfort: 70 + Math.random() * 30, // 70-100 comfort
      capacity: this.calculateNestCapacity(entity),
      materials: this.generateNestMaterials(entity)
    });
  }

  /**
   * Crea rastro de olor que afecta comportamiento de otras entidades
   */
  createScentTrace(entity: Entity, position: Position, emotion: string) {
    this.createTrace('scent', position, entity, {
      emotion,
      personality: entity.personality.traits,
      pheromoneType: this.determinePheromoneType(entity, emotion)
    });
  }

  /**
   * Procesa interacción de entidad con elemento del bioma
   */
  processEnvironmentalInteraction(
    entity: Entity, 
    element: BiomeElement, 
    interactionType: 'plant' | 'harvest' | 'water' | 'rest'
  ): { 
    traces: EnvironmentalTrace[], 
    elementChanges: Partial<BiomeElement>,
    newElements?: BiomeElement[]
  } {
    const traces: EnvironmentalTrace[] = [];
    let elementChanges: Partial<BiomeElement> = {};
    let newElements: BiomeElement[] = [];

    switch (interactionType) {
      case 'plant':
        if (entity.personality.traits.includes('nurturing')) {
          // Entidad nurturing planta algo nuevo
          traces.push(this.createTrace('footprint', element.position, entity, {
            action: 'planting',
            plantType: 'flower'
          }));
          
          // Crear nueva planta cerca
          newElements.push(this.createNewPlant(element.position, entity));
        }
        break;

      case 'harvest':
        traces.push(this.createTrace('footprint', element.position, entity, {
          action: 'harvesting',
          harvestedType: element.type
        }));
        
        // Reducir salud del elemento
        elementChanges.health = Math.max(0, element.health - 20);
        elementChanges.lastModified = new Date().toISOString();
        elementChanges.modifiedBy = entity.id;
        break;

      case 'water':
        if (element.type === 'tree' || element.type === 'flower') {
          traces.push(this.createTrace('footprint', element.position, entity, {
            action: 'watering',
            care: true
          }));
          
          // Mejorar salud del elemento
          elementChanges.health = Math.min(100, element.health + 15);
          elementChanges.lastModified = new Date().toISOString();
          elementChanges.modifiedBy = entity.id;
        }
        break;

      case 'rest':
        traces.push(this.createTrace('scent', element.position, entity, {
          emotion: 'peaceful',
          restQuality: element.type === 'tree' ? 'good' : 'moderate'
        }));
        break;
    }

    return { traces, elementChanges, newElements };
  }

  /**
   * Actualiza rastros existentes (desvanecimiento, etc.)
   */
  updateTraces(): EnvironmentalTrace[] {
    const now = new Date();
    const updatedTraces: EnvironmentalTrace[] = [];

    this.traces.forEach((trace, id) => {
      // Verificar si ha expirado
      if (new Date(trace.expiresAt) <= now) {
        this.traces.delete(id);
        return;
      }

      // Desvanecer intensidad con el tiempo
      const ageMinutes = (now.getTime() - new Date(trace.createdAt).getTime()) / 60000;
      const fadeRate = this.getFadeRate(trace.type);
      const newIntensity = Math.max(0, trace.intensity - (ageMinutes * fadeRate));

      if (newIntensity <= 5) {
        // Eliminar rastros muy débiles
        this.traces.delete(id);
        return;
      }

      const updatedTrace = { ...trace, intensity: newIntensity };
      this.traces.set(id, updatedTrace);
      updatedTraces.push(updatedTrace);
    });

    return updatedTraces;
  }

  /**
   * Obtiene todos los rastros activos
   */
  getAllTraces(): EnvironmentalTrace[] {
    return Array.from(this.traces.values());
  }

  /**
   * Obtiene rastros en un área específica
   */
  getTracesInArea(center: Position, radius: number): EnvironmentalTrace[] {
    return Array.from(this.traces.values()).filter(trace => 
      this.calculateDistance(trace.position, center) <= radius
    );
  }

  /**
   * Obtiene rastros de una entidad específica
   */
  getTracesFromEntity(entityId: string): EnvironmentalTrace[] {
    return Array.from(this.traces.values()).filter(trace => 
      trace.entityId === entityId
    );
  }

  // === MÉTODOS PRIVADOS ===

  private getTraceRadius(type: EnvironmentalTrace['type']): number {
    const radii = {
      footprint: 8,
      path: 12,
      nest: 25,
      burrow: 20,
      territory: 40,
      scent: 30
    };
    return radii[type];
  }

  private getInitialIntensity(type: EnvironmentalTrace['type'], entity: Entity): number {
    const baseIntensity = {
      footprint: 30,
      path: 50,
      nest: 80,
      burrow: 85,
      territory: 60,
      scent: 40
    };
    
    // Modificar basado en personalidad
    let multiplier = 1;
    if (entity.personality.traits.includes('energetic')) multiplier += 0.3;
    if (entity.personality.traits.includes('calm')) multiplier -= 0.2;
    
    return Math.min(100, baseIntensity[type] * multiplier);
  }

  private calculateExpirationTime(type: EnvironmentalTrace['type']): string {
    const lifespanMinutes = {
      footprint: 30,     // 30 minutos
      path: 120,         // 2 horas
      nest: 1440,        // 24 horas
      burrow: 2880,      // 48 horas
      territory: 720,    // 12 horas
      scent: 60          // 1 hora
    };
    
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + lifespanMinutes[type]);
    return expiration.toISOString();
  }

  private getFadeRate(type: EnvironmentalTrace['type']): number {
    return {
      footprint: 1.0,    // Se desvanece rápido
      path: 0.3,         // Se desvanece lento
      nest: 0.1,         // Muy persistente
      burrow: 0.1,       // Muy persistente
      territory: 0.5,    // Moderado
      scent: 0.8         // Rápido
    }[type];
  }

  private strengthenPath(entity: Entity, position: Position) {
    const nearbyPaths = Array.from(this.traces.values()).filter(
      trace => trace.type === 'path' && 
               trace.entityId === entity.id &&
               this.calculateDistance(trace.position, position) < 20
    );

    if (nearbyPaths.length > 0) {
      // Fortalecer sendero existente
      nearbyPaths[0].intensity = Math.min(100, nearbyPaths[0].intensity + 5);
    } else {
      // Crear nuevo segmento de sendero
      this.createTrace('path', position, entity, {
        pathSegment: true,
        usage: 1
      });
    }
  }

  private determineNestType(entity: Entity): 'nest' | 'burrow' {
    return entity.personality.traits.includes('underground') ? 'burrow' : 'nest';
  }

  private calculateNestCapacity(entity: Entity): number {
    const baseCapacity = 1;
    const bonus = entity.personality.traits.includes('social') ? 2 : 0;
    return baseCapacity + bonus;
  }

  private generateNestMaterials(entity: Entity): string[] {
    const materials = ['twigs', 'leaves', 'moss'];
    if (entity.personality.traits.includes('creative')) {
      materials.push('flowers', 'shiny objects');
    }
    return materials;
  }

  private determinePheromoneType(entity: Entity, emotion: string): string {
    return `${emotion}_${entity.species.toLowerCase()}`;
  }

  private createNewPlant(nearPosition: Position, entity: Entity): BiomeElement {
    const offset = 15 + Math.random() * 20; // 15-35 pixels away
    const angle = Math.random() * Math.PI * 2;
    
    return {
      id: `planted_${Date.now()}_${entity.id}`,
      type: 'flower',
      position: {
        x: nearPosition.x + Math.cos(angle) * offset,
        y: nearPosition.y + Math.sin(angle) * offset
      },
      size: 0.3 + Math.random() * 0.4, // Small new plant
      health: 80 + Math.random() * 20,
      variant: Math.floor(Math.random() * 3),
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      modifiedBy: entity.id
    };
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
  }

  private cleanupExpiredTraces() {
    if (this.traces.size > this.maxTraces) {
      // Eliminar rastros más antiguos
      const sortedTraces = Array.from(this.traces.entries())
        .sort(([,a], [,b]) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      const toRemove = sortedTraces.slice(0, this.traces.size - this.maxTraces);
      toRemove.forEach(([id]) => this.traces.delete(id));
    }
  }
}