import { Entity, Position } from '@/types';

export class BehaviorEngine {
  private entityUpdateIntervals: Map<string, NodeJS.Timeout> = new Map();

  startBehaviorSystem(entities: Entity[], updateCallback: (entity: Entity) => void): void {
    entities.forEach(entity => {
      this.startEntityBehavior(entity, entities, updateCallback);
    });
  }

  stopBehaviorSystem(): void {
    this.entityUpdateIntervals.forEach(interval => clearInterval(interval));
    this.entityUpdateIntervals.clear();
  }

  private startEntityBehavior(entity: Entity, allEntities: Entity[], updateCallback: (entity: Entity) => void): void {
    // Clear existing interval if any
    if (this.entityUpdateIntervals.has(entity.id)) {
      clearInterval(this.entityUpdateIntervals.get(entity.id)!);
    }

    // Update interval based on personality energy (more energetic = more frequent updates)
    const baseInterval = 3000; // 3 seconds
    const energyMultiplier = (100 - entity.personality.energy) / 100;
    const interval = baseInterval + (baseInterval * energyMultiplier);

    const behaviorLoop = setInterval(() => {
      const updatedEntity = this.updateEntityBehavior(entity, allEntities);
      if (updatedEntity) {
        updateCallback(updatedEntity);
      }
    }, interval);

    this.entityUpdateIntervals.set(entity.id, behaviorLoop);
  }

  private updateEntityBehavior(entity: Entity, allEntities: Entity[]): Entity | null {
    const nearbyEntities = this.findNearbyEntities(entity, allEntities, 150);
    const newBehavior = this.determineBehavior(entity, nearbyEntities);
    
    const updatedEntity = { ...entity };
    let hasChanged = false;

    // Update status if changed
    if (newBehavior.status !== entity.status) {
      updatedEntity.status = newBehavior.status;
      hasChanged = true;
    }

    // Update position based on behavior
    const newPosition = this.calculateMovement(updatedEntity, nearbyEntities);
    if (newPosition.x !== entity.position.x || newPosition.y !== entity.position.y) {
      updatedEntity.position = newPosition;
      hasChanged = true;
    }

    // Update relationships
    if (newBehavior.newRelationships && newBehavior.newRelationships.length > 0) {
      const uniqueRelationships = Array.from(new Set([
        ...entity.relationships,
        ...newBehavior.newRelationships
      ]));
      
      if (uniqueRelationships.length !== entity.relationships.length) {
        updatedEntity.relationships = uniqueRelationships;
        hasChanged = true;
      }
    }

    // Update last active time
    if (hasChanged) {
      updatedEntity.lastActive = new Date().toISOString();
      return updatedEntity;
    }

    return null;
  }

  private determineBehavior(entity: Entity, nearbyEntities: Entity[]): {
    status: Entity['status'];
    newRelationships?: string[];
  } {
    const { personality } = entity;
    const random = Math.random();

    // Weight behaviors based on personality traits
    const weights = this.calculateBehaviorWeights(personality.traits, nearbyEntities.length);
    
    // Select behavior based on weighted random selection
    let cumulativeWeight = 0;
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const randomValue = random * totalWeight;

    for (const [behavior, weight] of Object.entries(weights)) {
      cumulativeWeight += weight;
      if (randomValue <= cumulativeWeight) {
        const result: { status: Entity['status']; newRelationships?: string[] } = {
          status: behavior as Entity['status']
        };

        // If socializing, add nearby entities as relationships
        if (behavior === 'socializing' && nearbyEntities.length > 0) {
          result.newRelationships = nearbyEntities
            .slice(0, Math.min(2, nearbyEntities.length))
            .map(e => e.id);
        }

        return result;
      }
    }

    return { status: 'exploring' };
  }

  private calculateBehaviorWeights(traits: string[], nearbyCount: number): Record<string, number> {
    const weights = {
      exploring: 25,
      building: 15,
      socializing: 10,
      resting: 10
    };

    // Adjust weights based on personality traits
    traits.forEach(trait => {
      switch (trait) {
        case 'curious':
          weights.exploring += 20;
          break;
        case 'social':
          weights.socializing += 25;
          break;
        case 'creative':
          weights.building += 20;
          break;
        case 'energetic':
          weights.exploring += 15;
          weights.socializing += 10;
          weights.resting -= 5;
          break;
        case 'calm':
          weights.resting += 15;
          weights.building += 10;
          break;
        case 'mysterious':
          weights.exploring += 10;
          weights.resting += 10;
          break;
        case 'protective':
          weights.building += 15;
          weights.socializing += 5;
          break;
        case 'playful':
          weights.socializing += 15;
          weights.exploring += 10;
          break;
      }
    });

    // Adjust socializing weight based on nearby entities
    if (nearbyCount > 0) {
      weights.socializing += nearbyCount * 5;
    } else {
      weights.socializing = Math.max(0, weights.socializing - 15);
    }

    // Ensure all weights are non-negative
    Object.keys(weights).forEach(key => {
      weights[key as keyof typeof weights] = Math.max(0, weights[key as keyof typeof weights]);
    });

    return weights;
  }

  private calculateMovement(entity: Entity, nearbyEntities: Entity[]): Position {
    const { position, personality, status } = entity;
    const speed = (personality.energy / 100) * 2; // Max 2 pixels per update
    
    let targetX = position.x;
    let targetY = position.y;

    switch (status) {
      case 'exploring':
        // Random movement with slight bias toward center or unexplored areas
        const randomAngle = Math.random() * Math.PI * 2;
        targetX += Math.cos(randomAngle) * speed * 20;
        targetY += Math.sin(randomAngle) * speed * 20;
        break;

      case 'socializing':
        // Move toward nearby entities
        if (nearbyEntities.length > 0) {
          const target = nearbyEntities[0];
          const dx = target.position.x - position.x;
          const dy = target.position.y - position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 50) { // Don't get too close
            targetX += (dx / distance) * speed * 10;
            targetY += (dy / distance) * speed * 10;
          }
        }
        break;

      case 'building':
        // Move to potential building sites (open areas)
        const buildingTarget = this.findBuildingSpot(position);
        if (buildingTarget) {
          const dx = buildingTarget.x - position.x;
          const dy = buildingTarget.y - position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 30) {
            targetX += (dx / distance) * speed * 15;
            targetY += (dy / distance) * speed * 15;
          }
        }
        break;

      case 'resting':
        // Minimal movement, slight drift
        targetX += (Math.random() - 0.5) * speed * 5;
        targetY += (Math.random() - 0.5) * speed * 5;
        break;
    }

    // Keep entities within canvas bounds (assuming 1200x800 canvas)
    targetX = Math.max(50, Math.min(1150, targetX));
    targetY = Math.max(50, Math.min(750, targetY));

    return { x: targetX, y: targetY };
  }

  private findNearbyEntities(entity: Entity, allEntities: Entity[], radius: number): Entity[] {
    return allEntities
      .filter(other => other.id !== entity.id)
      .filter(other => {
        const dx = other.position.x - entity.position.x;
        const dy = other.position.y - entity.position.y;
        return Math.sqrt(dx * dx + dy * dy) <= radius;
      });
  }

  private findBuildingSpot(position: Position): Position | null {
    // Simple algorithm to find nearby open spots
    // In a real implementation, this would check for existing structures
    const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const distances = [100, 150, 200];

    for (const distance of distances) {
      for (const angle of angles) {
        const spotX = position.x + Math.cos(angle) * distance;
        const spotY = position.y + Math.sin(angle) * distance;
        
        // Check if spot is within bounds
        if (spotX >= 50 && spotX <= 1150 && spotY >= 50 && spotY <= 750) {
          return { x: spotX, y: spotY };
        }
      }
    }

    return null;
  }

  // Collision detection for movement
  private checkCollisions(entity: Entity, newPosition: Position, allEntities: Entity[]): Position {
    const minDistance = 40; // Minimum distance between entities
    
    for (const other of allEntities) {
      if (other.id === entity.id) continue;
      
      const dx = other.position.x - newPosition.x;
      const dy = other.position.y - newPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < minDistance) {
        // Push away from collision
        const pushAngle = Math.atan2(dy, dx) + Math.PI; // Opposite direction
        return {
          x: newPosition.x + Math.cos(pushAngle) * (minDistance - distance),
          y: newPosition.y + Math.sin(pushAngle) * (minDistance - distance)
        };
      }
    }
    
    return newPosition;
  }

  // Method to update a single entity's behavior system when it changes
  updateEntityBehaviorSystem(entity: Entity, allEntities: Entity[], updateCallback: (entity: Entity) => void): void {
    this.startEntityBehavior(entity, allEntities, updateCallback);
  }

  // Method to remove an entity from the behavior system
  removeEntityFromSystem(entityId: string): void {
    if (this.entityUpdateIntervals.has(entityId)) {
      clearInterval(this.entityUpdateIntervals.get(entityId)!);
      this.entityUpdateIntervals.delete(entityId);
    }
  }
}