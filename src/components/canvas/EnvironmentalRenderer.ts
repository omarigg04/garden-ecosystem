import { BiomeElement, EnvironmentalTrace, Resource, BiomeZone } from '@/types';

export class EnvironmentalRenderer {
  private animationFrame = 0;

  constructor() {
    // Initialize animation frame counter
    this.startAnimation();
  }

  private startAnimation(): void {
    const updateFrame = () => {
      this.animationFrame += 0.016; // ~60 FPS
      requestAnimationFrame(updateFrame);
    };
    updateFrame();
  }

  /**
   * Render all environmental elements in the correct order
   */
  renderEnvironment(
    ctx: CanvasRenderingContext2D,
    biomeZones: BiomeZone[],
    biomeElements: BiomeElement[],
    traces: EnvironmentalTrace[],
    resources: Resource[]
  ): void {
    // Layer 1: Biome zones (background)
    this.renderBiomeZones(ctx, biomeZones);
    
    // Layer 2: Biome elements (trees, rocks, etc.)
    this.renderBiomeElements(ctx, biomeElements);
    
    // Layer 3: Environmental traces (footprints, paths, etc.)
    this.renderEnvironmentalTraces(ctx, traces);
    
    // Layer 4: Resources (collectibles)
    this.renderResources(ctx, resources);
  }

  /**
   * Render biome zones as subtle background areas
   */
  private renderBiomeZones(ctx: CanvasRenderingContext2D, zones: BiomeZone[]): void {
    zones.forEach(zone => {
      const gradient = ctx.createRadialGradient(
        zone.center.x, zone.center.y, 0,
        zone.center.x, zone.center.y, zone.radius
      );
      
      const colors = this.getBiomeColors(zone.type);
      gradient.addColorStop(0, colors.center);
      gradient.addColorStop(0.7, colors.middle);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(zone.center.x, zone.center.y, zone.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * Render biome elements (trees, rocks, water, etc.)
   */
  private renderBiomeElements(ctx: CanvasRenderingContext2D, elements: BiomeElement[]): void {
    elements.forEach(element => {
      ctx.save();
      ctx.translate(element.position.x, element.position.y);
      
      switch (element.type) {
        case 'tree':
          this.drawTree(ctx, element);
          break;
        case 'rock':
          this.drawRock(ctx, element);
          break;
        case 'water':
          this.drawWater(ctx, element);
          break;
        case 'flower':
          this.drawFlower(ctx, element);
          break;
        case 'grass':
          this.drawGrass(ctx, element);
          break;
      }
      
      ctx.restore();
    });
  }

  /**
   * Render environmental traces left by entities
   */
  private renderEnvironmentalTraces(ctx: CanvasRenderingContext2D, traces: EnvironmentalTrace[]): void {
    // Sort by intensity to render stronger traces on top
    const sortedTraces = [...traces].sort((a, b) => a.intensity - b.intensity);
    
    sortedTraces.forEach(trace => {
      ctx.save();
      ctx.translate(trace.position.x, trace.position.y);
      
      const alpha = trace.intensity / 100;
      ctx.globalAlpha = alpha;
      
      switch (trace.type) {
        case 'footprint':
          this.drawFootprint(ctx, trace);
          break;
        case 'path':
          this.drawPath(ctx, trace);
          break;
        case 'nest':
          this.drawNest(ctx, trace);
          break;
        case 'burrow':
          this.drawBurrow(ctx, trace);
          break;
        case 'territory':
          this.drawTerritoryMarker(ctx, trace);
          break;
        case 'scent':
          this.drawScentMarker(ctx, trace);
          break;
      }
      
      ctx.restore();
    });
  }

  /**
   * Render collectible resources
   */
  private renderResources(ctx: CanvasRenderingContext2D, resources: Resource[]): void {
    resources.forEach(resource => {
      if (resource.amount <= 0) return; // Don't render depleted resources
      
      ctx.save();
      ctx.translate(resource.position.x, resource.position.y);
      
      // Pulse effect based on amount
      const pulseScale = 1 + Math.sin(this.animationFrame * 2) * 0.1 * (resource.amount / resource.maxAmount);
      ctx.scale(pulseScale, pulseScale);
      
      switch (resource.type) {
        case 'mineral':
          this.drawMineral(ctx, resource);
          break;
        case 'food':
          this.drawFood(ctx, resource);
          break;
        case 'water':
          this.drawWaterSource(ctx, resource);
          break;
        case 'energy':
          this.drawEnergySource(ctx, resource);
          break;
      }
      
      // Draw amount indicator
      this.drawResourceAmountIndicator(ctx, resource);
      
      ctx.restore();
    });
  }

  // === BIOME ELEMENT DRAWING METHODS ===

  private drawTree(ctx: CanvasRenderingContext2D, element: BiomeElement): void {
    const size = 15 * element.size;
    const health = element.health / 100;
    
    // Trunk
    ctx.fillStyle = `rgb(${101 * health}, ${67 * health}, ${33 * health})`;
    ctx.fillRect(-size * 0.1, size * 0.3, size * 0.2, size * 0.7);
    
    // Foliage - color changes based on health
    const green = Math.floor(100 + 55 * health);
    const red = Math.floor(34 + 20 * (1 - health));
    ctx.fillStyle = `rgb(${red}, ${green}, 34)`;
    
    // Different tree shapes based on variant
    switch (element.variant) {
      case 0: // Round tree
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 1: // Triangular tree
        ctx.beginPath();
        ctx.moveTo(0, -size * 1.2);
        ctx.lineTo(-size, size * 0.5);
        ctx.lineTo(size, size * 0.5);
        ctx.closePath();
        ctx.fill();
        break;
      case 2: // Oval tree
        ctx.save();
        ctx.scale(1, 1.5);
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        break;
    }
    
    // Add small animation for healthy trees
    if (health > 0.5) {
      const sway = Math.sin(this.animationFrame + element.position.x * 0.01) * 2;
      ctx.translate(sway, 0);
    }
  }

  private drawRock(ctx: CanvasRenderingContext2D, element: BiomeElement): void {
    const size = 12 * element.size;
    
    // Rock color variations
    const grayValue = 80 + element.variant * 30;
    ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
    ctx.strokeStyle = `rgb(${grayValue - 20}, ${grayValue - 20}, ${grayValue - 20})`;
    ctx.lineWidth = 2;
    
    // Different rock shapes
    switch (element.variant) {
      case 0: // Round boulder
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      case 1: // Angular rock
        ctx.beginPath();
        ctx.moveTo(-size, -size * 0.5);
        ctx.lineTo(size * 0.3, -size);
        ctx.lineTo(size, size * 0.2);
        ctx.lineTo(size * 0.2, size);
        ctx.lineTo(-size * 0.7, size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 2: // Flat rock
        ctx.save();
        ctx.scale(1.5, 0.7);
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
        break;
    }
  }

  private drawWater(ctx: CanvasRenderingContext2D, element: BiomeElement): void {
    const size = 20 * element.size;
    
    // Animated water effect
    const wave1 = Math.sin(this.animationFrame * 2 + element.position.x * 0.01) * 0.1;
    const wave2 = Math.cos(this.animationFrame * 1.5 + element.position.y * 0.01) * 0.1;
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, `rgba(64, 164, 223, ${0.8 + wave1})`);
    gradient.addColorStop(1, `rgba(32, 132, 191, ${0.6 + wave2})`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Water ripples
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, size * (0.3 + i * 0.2 + wave1), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private drawFlower(ctx: CanvasRenderingContext2D, element: BiomeElement): void {
    const size = 6 * element.size;
    const health = element.health / 100;
    
    // Stem
    ctx.strokeStyle = `rgb(34, ${Math.floor(139 * health)}, 34)`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(0, -size * 0.5);
    ctx.stroke();
    
    // Flower colors based on variant
    const colors = [
      `rgb(255, ${Math.floor(100 * health)}, ${Math.floor(100 * health)})`, // Red
      `rgb(255, 255, ${Math.floor(100 * health)})`, // Yellow
      `rgb(${Math.floor(200 * health)}, ${Math.floor(100 * health)}, 255)` // Purple
    ];
    
    ctx.fillStyle = colors[element.variant];
    
    // Flower petals
    const petalCount = 5;
    for (let i = 0; i < petalCount; i++) {
      const angle = (Math.PI * 2 * i) / petalCount;
      const petalX = Math.cos(angle) * size * 0.5;
      const petalY = Math.sin(angle) * size * 0.5 - size * 0.5;
      
      ctx.beginPath();
      ctx.arc(petalX, petalY, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Center
    ctx.fillStyle = 'rgb(255, 255, 0)';
    ctx.beginPath();
    ctx.arc(0, -size * 0.5, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawGrass(ctx: CanvasRenderingContext2D, element: BiomeElement): void {
    const size = 8 * element.size;
    const health = element.health / 100;
    
    ctx.strokeStyle = `rgb(34, ${Math.floor(139 * health)}, 34)`;
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    
    // Multiple grass blades
    const bladeCount = 3 + element.variant;
    for (let i = 0; i < bladeCount; i++) {
      const x = (i - bladeCount / 2) * size * 0.3;
      const sway = Math.sin(this.animationFrame + x * 0.1) * 2;
      
      ctx.beginPath();
      ctx.moveTo(x, size);
      ctx.lineTo(x + sway, -size);
      ctx.stroke();
    }
  }

  // === TRACE DRAWING METHODS ===

  private drawFootprint(ctx: CanvasRenderingContext2D, trace: EnvironmentalTrace): void {
    const size = trace.radius * 0.8;
    
    ctx.fillStyle = 'rgba(101, 67, 33, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Add toe marks if it's a detailed footprint
    if (trace.properties.detailed) {
      ctx.fillStyle = 'rgba(101, 67, 33, 0.4)';
      for (let i = 0; i < 3; i++) {
        const x = (i - 1) * size * 0.3;
        const y = -size * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawPath(ctx: CanvasRenderingContext2D, trace: EnvironmentalTrace): void {
    const width = trace.radius;
    const length = width * 2;
    
    ctx.fillStyle = 'rgba(139, 115, 85, 0.4)';
    ctx.fillRect(-length / 2, -width / 2, length, width);
    
    // Add worn edges
    ctx.strokeStyle = 'rgba(160, 140, 120, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-length / 2, -width / 2);
    ctx.lineTo(length / 2, -width / 2);
    ctx.moveTo(-length / 2, width / 2);
    ctx.lineTo(length / 2, width / 2);
    ctx.stroke();
  }

  private drawNest(ctx: CanvasRenderingContext2D, trace: EnvironmentalTrace): void {
    const size = trace.radius;
    
    // Nest base
    ctx.fillStyle = 'rgb(101, 67, 33)';
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Nest interior
    ctx.fillStyle = 'rgb(139, 115, 85)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
    
    // Add materials based on properties
    if (trace.properties.materials) {
      const materials = trace.properties.materials as string[];
      if (materials.includes('flowers')) {
        // Add small colored dots for flowers
        ctx.fillStyle = 'rgba(255, 100, 150, 0.7)';
        for (let i = 0; i < 3; i++) {
          const angle = (Math.PI * 2 * i) / 3;
          const x = Math.cos(angle) * size * 0.5;
          const y = Math.sin(angle) * size * 0.5;
          ctx.beginPath();
          ctx.arc(x, y, size * 0.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  private drawBurrow(ctx: CanvasRenderingContext2D, trace: EnvironmentalTrace): void {
    const size = trace.radius;
    
    // Mound of dirt
    ctx.fillStyle = 'rgb(101, 67, 33)';
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Entrance hole
    ctx.fillStyle = 'rgb(20, 20, 20)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Tunnel indication
    ctx.strokeStyle = 'rgba(40, 40, 40, 0.5)';
    ctx.lineWidth = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.8, size * 0.3);
    ctx.stroke();
  }

  private drawTerritoryMarker(ctx: CanvasRenderingContext2D, trace: EnvironmentalTrace): void {
    const size = trace.radius;
    
    // Territory boundary
    ctx.strokeStyle = 'rgba(255, 200, 100, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Central marker
    ctx.fillStyle = 'rgba(255, 200, 100, 0.6)';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawScentMarker(ctx: CanvasRenderingContext2D, trace: EnvironmentalTrace): void {
    const size = trace.radius;
    const pulsePhase = Math.sin(this.animationFrame * 3) * 0.5 + 0.5;
    
    // Scent cloud effect
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, `rgba(200, 255, 200, ${0.3 * pulsePhase})`);
    gradient.addColorStop(1, 'rgba(200, 255, 200, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size * (0.8 + pulsePhase * 0.2), 0, Math.PI * 2);
    ctx.fill();
  }

  // === RESOURCE DRAWING METHODS ===

  private drawMineral(ctx: CanvasRenderingContext2D, resource: Resource): void {
    const size = 8 + (resource.amount / resource.maxAmount) * 12;
    
    // Crystal-like mineral
    ctx.fillStyle = 'rgb(150, 150, 200)';
    ctx.strokeStyle = 'rgb(100, 100, 150)';
    ctx.lineWidth = 2;
    
    // Draw crystal faces
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size * 0.6, -size * 0.3);
    ctx.lineTo(size * 0.8, size * 0.5);
    ctx.lineTo(0, size);
    ctx.lineTo(-size * 0.8, size * 0.5);
    ctx.lineTo(-size * 0.6, -size * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Add sparkle effect
    if (resource.amount > resource.maxAmount * 0.5) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 3; i++) {
        const sparkleX = (Math.random() - 0.5) * size;
        const sparkleY = (Math.random() - 0.5) * size;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawFood(ctx: CanvasRenderingContext2D, resource: Resource): void {
    const size = 6 + (resource.amount / resource.maxAmount) * 8;
    
    // Berry cluster
    ctx.fillStyle = 'rgb(180, 50, 80)';
    const berryCount = Math.ceil((resource.amount / resource.maxAmount) * 5);
    
    for (let i = 0; i < berryCount; i++) {
      const angle = (Math.PI * 2 * i) / berryCount;
      const radius = size * 0.4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      ctx.beginPath();
      ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Stem
    ctx.strokeStyle = 'rgb(34, 139, 34)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size);
    ctx.stroke();
  }

  private drawWaterSource(ctx: CanvasRenderingContext2D, resource: Resource): void {
    const size = 10 + (resource.amount / resource.maxAmount) * 10;
    
    // Animated water spring
    const pulse = Math.sin(this.animationFrame * 4) * 0.2 + 0.8;
    
    ctx.fillStyle = `rgba(64, 164, 223, ${pulse})`;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Bubbles
    if (resource.amount > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 3; i++) {
        const bubbleY = -size + (this.animationFrame * 20 + i * 10) % (size * 2);
        ctx.beginPath();
        ctx.arc(0, bubbleY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawEnergySource(ctx: CanvasRenderingContext2D, resource: Resource): void {
    const size = 8 + (resource.amount / resource.maxAmount) * 12;
    
    // Glowing energy orb
    const intensity = resource.amount / resource.maxAmount;
    const glow = Math.sin(this.animationFrame * 5) * 0.3 + 0.7;
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    gradient.addColorStop(0, `rgba(255, 255, 100, ${intensity * glow})`);
    gradient.addColorStop(0.5, `rgba(255, 200, 50, ${intensity * 0.8})`);
    gradient.addColorStop(1, `rgba(255, 150, 0, ${intensity * 0.3})`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Energy particles
    ctx.fillStyle = `rgba(255, 255, 150, ${intensity * 0.8})`;
    for (let i = 0; i < 4; i++) {
      const angle = this.animationFrame + (Math.PI * 2 * i) / 4;
      const distance = size * 1.5;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawResourceAmountIndicator(ctx: CanvasRenderingContext2D, resource: Resource): void {
    const percentage = resource.amount / resource.maxAmount;
    if (percentage < 0.3) { // Only show when getting low
      ctx.fillStyle = percentage < 0.1 ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 165, 0, 0.8)';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.ceil(percentage * 100)}%`, 0, 25);
    }
  }

  // === UTILITY METHODS ===

  private getBiomeColors(biomeType: BiomeZone['type']): { center: string; middle: string } {
    const colors = {
      forest: {
        center: 'rgba(34, 139, 34, 0.1)',
        middle: 'rgba(34, 139, 34, 0.05)'
      },
      meadow: {
        center: 'rgba(144, 238, 144, 0.1)',
        middle: 'rgba(144, 238, 144, 0.05)'
      },
      rocky: {
        center: 'rgba(128, 128, 128, 0.1)',
        middle: 'rgba(128, 128, 128, 0.05)'
      },
      wetland: {
        center: 'rgba(64, 164, 223, 0.1)',
        middle: 'rgba(64, 164, 223, 0.05)'
      },
      desert: {
        center: 'rgba(255, 218, 185, 0.1)',
        middle: 'rgba(255, 218, 185, 0.05)'
      }
    };
    
    return colors[biomeType];
  }
}