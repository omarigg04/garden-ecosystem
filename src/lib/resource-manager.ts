import { Resource, Entity, Position, EnvironmentalTrace } from '@/types';

export interface ResourceInteractionResult {
  success: boolean;
  amountObtained: number;
  resourceUpdated: Resource;
  trace?: EnvironmentalTrace;
  entityEffects?: {
    energyGain?: number;
    healthGain?: number;
    moodChange?: string;
  };
}

export class ResourceManager {
  private resources: Map<string, Resource> = new Map();

  constructor(initialResources: Resource[] = []) {
    initialResources.forEach(resource => {
      this.resources.set(resource.id, resource);
    });
  }

  /**
   * Entidad intenta usar un recurso
   */
  harvestResource(
    entity: Entity, 
    resourceId: string, 
    desiredAmount: number = 10
  ): ResourceInteractionResult {
    const resource = this.resources.get(resourceId);
    
    if (!resource) {
      return {
        success: false,
        amountObtained: 0,
        resourceUpdated: {} as Resource
      };
    }

    // Verificar distancia
    const distance = this.calculateDistance(entity.position, resource.position);
    if (distance > 30) { // Debe estar cerca del recurso
      return {
        success: false,
        amountObtained: 0,
        resourceUpdated: resource
      };
    }

    // Verificar si el recurso está disponible
    if (resource.amount <= 0) {
      return {
        success: false,
        amountObtained: 0,
        resourceUpdated: resource
      };
    }

    // Calcular cantidad que puede obtener
    const maxHarvestable = this.calculateMaxHarvest(entity, resource);
    const actualAmount = Math.min(desiredAmount, maxHarvestable, resource.amount);
    
    // Actualizar recurso
    const updatedResource: Resource = {
      ...resource,
      amount: resource.amount - actualAmount,
      lastHarvested: new Date().toISOString(),
      harvestedBy: [...(resource.harvestedBy || []), entity.id]
    };

    this.resources.set(resourceId, updatedResource);

    // Calcular efectos en la entidad
    const entityEffects = this.calculateEntityEffects(entity, resource.type, actualAmount);

    return {
      success: true,
      amountObtained: actualAmount,
      resourceUpdated: updatedResource,
      entityEffects
    };
  }

  /**
   * Entidad intenta contribuir a un recurso (plantar, purificar agua, etc.)
   */
  contributeToResource(
    entity: Entity,
    resourceId: string,
    contributionType: 'restore' | 'purify' | 'fertilize' | 'protect'
  ): ResourceInteractionResult {
    const resource = this.resources.get(resourceId);
    
    if (!resource) {
      return {
        success: false,
        amountObtained: 0,
        resourceUpdated: {} as Resource
      };
    }

    const distance = this.calculateDistance(entity.position, resource.position);
    if (distance > 25) {
      return {
        success: false,
        amountObtained: 0,
        resourceUpdated: resource
      };
    }

    // Verificar si la entidad puede contribuir
    if (!this.canEntityContribute(entity, resource, contributionType)) {
      return {
        success: false,
        amountObtained: 0,
        resourceUpdated: resource
      };
    }

    // Aplicar contribución
    const contribution = this.calculateContribution(entity, resource, contributionType);
    const updatedResource = this.applyContribution(resource, contribution, contributionType);
    
    this.resources.set(resourceId, updatedResource);

    // Efectos positivos en la entidad por ayudar
    const entityEffects = {
      energyGain: -5, // Gasta energía
      moodChange: 'satisfied'
    };

    return {
      success: true,
      amountObtained: 0, // No obtiene recursos, solo contribuye
      resourceUpdated: updatedResource,
      entityEffects
    };
  }

  /**
   * Procesa regeneración natural de recursos
   */
  regenerateResources(): Resource[] {
    const updatedResources: Resource[] = [];
    
    this.resources.forEach((resource, id) => {
      if (resource.amount < resource.maxAmount) {
        const timeSinceLastHarvest = resource.lastHarvested 
          ? (Date.now() - new Date(resource.lastHarvested).getTime()) / 60000 // minutos
          : 60; // Si nunca se ha cosechado, asumir 60 min
        
        // Regeneración más rápida si no se ha usado recientemente
        const regenerationMultiplier = timeSinceLastHarvest > 30 ? 1.5 : 1;
        const regenerationAmount = resource.regenerationRate * regenerationMultiplier;
        
        const newAmount = Math.min(
          resource.maxAmount,
          resource.amount + regenerationAmount
        );
        
        const updatedResource = { ...resource, amount: newAmount };
        this.resources.set(id, updatedResource);
        updatedResources.push(updatedResource);
      }
    });
    
    return updatedResources;
  }

  /**
   * Crea un nuevo recurso en el ecosistema
   */
  createResource(
    type: Resource['type'],
    position: Position,
    createdBy?: Entity
  ): Resource {
    const resource: Resource = {
      id: `resource_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      position,
      amount: this.getInitialAmount(type),
      maxAmount: this.getMaxAmount(type),
      regenerationRate: this.getRegenerationRate(type),
      harvestedBy: []
    };

    if (createdBy) {
      resource.harvestedBy = [createdBy.id];
    }

    this.resources.set(resource.id, resource);
    return resource;
  }

  /**
   * Encuentra recursos cerca de una posición
   */
  findResourcesNear(position: Position, radius: number, type?: Resource['type']): Resource[] {
    return Array.from(this.resources.values()).filter(resource => {
      const distance = this.calculateDistance(position, resource.position);
      const withinRadius = distance <= radius;
      const matchesType = !type || resource.type === type;
      return withinRadius && matchesType && resource.amount > 0;
    });
  }

  /**
   * Obtiene información sobre escasez de recursos
   */
  getResourceScarcity(): { [key in Resource['type']]: number } {
    const scarcity = {
      mineral: 0,
      food: 0,
      water: 0,
      energy: 0
    };

    this.resources.forEach(resource => {
      const scarcityLevel = 1 - (resource.amount / resource.maxAmount);
      scarcity[resource.type] = Math.max(scarcity[resource.type], scarcityLevel);
    });

    return scarcity;
  }

  /**
   * Obtiene todos los recursos
   */
  getAllResources(): Resource[] {
    return Array.from(this.resources.values());
  }

  /**
   * Elimina recursos agotados permanentemente
   */
  cleanupDepletedResources(): string[] {
    const removedIds: string[] = [];
    
    this.resources.forEach((resource, id) => {
      // Si un recurso ha estado en 0 por más de 1 hora, eliminarlo
      if (resource.amount === 0 && resource.lastHarvested) {
        const hoursSinceDepletion = (Date.now() - new Date(resource.lastHarvested).getTime()) / 3600000;
        if (hoursSinceDepletion > 1) {
          this.resources.delete(id);
          removedIds.push(id);
        }
      }
    });
    
    return removedIds;
  }

  // === MÉTODOS PRIVADOS ===

  private calculateMaxHarvest(entity: Entity, resource: Resource): number {
    let baseAmount = 15; // Cantidad base que puede cosechar

    // Modificadores basados en personalidad
    if (entity.personality.traits.includes('efficient')) {
      baseAmount *= 1.3;
    }
    if (entity.personality.traits.includes('gentle')) {
      baseAmount *= 0.8; // Cosecha menos para conservar
    }
    if (entity.personality.traits.includes('greedy')) {
      baseAmount *= 1.5;
    }

    // Modificadores basados en tipo de recurso
    if (resource.type === 'mineral' && entity.personality.traits.includes('strong')) {
      baseAmount *= 1.4;
    }
    if (resource.type === 'food' && entity.personality.traits.includes('forager')) {
      baseAmount *= 1.6;
    }

    return Math.floor(baseAmount);
  }

  private calculateEntityEffects(
    entity: Entity, 
    resourceType: Resource['type'], 
    amount: number
  ): ResourceInteractionResult['entityEffects'] {
    const effects: ResourceInteractionResult['entityEffects'] = {};

    switch (resourceType) {
      case 'food':
        effects.energyGain = amount * 0.5;
        effects.healthGain = amount * 0.3;
        effects.moodChange = 'satisfied';
        break;
      
      case 'water':
        effects.energyGain = amount * 0.3;
        effects.healthGain = amount * 0.4;
        effects.moodChange = 'refreshed';
        break;
      
      case 'energy':
        effects.energyGain = amount * 0.8;
        effects.moodChange = 'energized';
        break;
      
      case 'mineral':
        effects.moodChange = 'accomplished';
        // Los minerales se usan para construcción, no dan energía directa
        break;
    }

    return effects;
  }

  private canEntityContribute(
    entity: Entity, 
    resource: Resource, 
    contributionType: string
  ): boolean {
    // Verificar si la entidad tiene las habilidades necesarias
    const canDoActions = {
      restore: entity.personality.traits.includes('nurturing') || 
               entity.personality.traits.includes('caretaker'),
      purify: entity.personality.traits.includes('pure') || 
              entity.personality.traits.includes('clean'),
      fertilize: entity.personality.traits.includes('growth') || 
                 entity.personality.traits.includes('fertile'),
      protect: entity.personality.traits.includes('guardian') || 
               entity.personality.traits.includes('protective')
    };

    return canDoActions[contributionType as keyof typeof canDoActions] || false;
  }

  private calculateContribution(
    entity: Entity,
    resource: Resource,
    contributionType: string
  ): number {
    let baseContribution = 10;

    // Multiplicadores por personalidad
    if (entity.personality.traits.includes('dedicated')) {
      baseContribution *= 1.5;
    }
    if (entity.personality.traits.includes('lazy')) {
      baseContribution *= 0.7;
    }

    return baseContribution;
  }

  private applyContribution(
    resource: Resource,
    contribution: number,
    contributionType: string
  ): Resource {
    const updatedResource = { ...resource };

    switch (contributionType) {
      case 'restore':
        // Restaurar cantidad del recurso
        updatedResource.amount = Math.min(
          resource.maxAmount,
          resource.amount + contribution
        );
        break;
      
      case 'purify':
        // Aumentar tasa de regeneración temporalmente
        updatedResource.regenerationRate = Math.min(
          1.0,
          resource.regenerationRate + (contribution * 0.01)
        );
        break;
      
      case 'fertilize':
        // Aumentar capacidad máxima
        updatedResource.maxAmount = Math.min(
          resource.maxAmount * 1.5,
          resource.maxAmount + contribution
        );
        break;
      
      case 'protect':
        // Reducir pérdida por sobreexplotación (implementar más tarde)
        break;
    }

    return updatedResource;
  }

  private getInitialAmount(type: Resource['type']): number {
    const amounts = {
      mineral: 80,
      food: 60,
      water: 100,
      energy: 40
    };
    return amounts[type] + Math.random() * 20 - 10; // ±10 variación
  }

  private getMaxAmount(type: Resource['type']): number {
    const maxAmounts = {
      mineral: 150,
      food: 120,
      water: 200,
      energy: 100
    };
    return maxAmounts[type];
  }

  private getRegenerationRate(type: Resource['type']): number {
    return {
      mineral: 0.05,  // Muy lento
      food: 0.3,      // Moderado
      water: 0.4,     // Rápido
      energy: 0.1     // Lento
    }[type];
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
  }
}