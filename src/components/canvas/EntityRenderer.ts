import { Entity, EntityAnimationState } from '@/types';

export class EntityRenderer {
  private animationStates: Map<string, EntityAnimationState> = new Map();

  drawEntity(ctx: CanvasRenderingContext2D, entity: Entity): void {
    const { position, appearance } = entity;
    const baseSize = 20 * appearance.size;
    
    // Get or create animation state
    const animState = this.getAnimationState(entity.id);
    this.updateAnimationState(animState, entity);

    ctx.save();
    ctx.translate(position.x, position.y);

    // Apply personality effects (rotation, scale, etc.)
    this.applyPersonalityEffects(ctx, entity, animState);

    // Draw base shape
    this.drawBaseShape(ctx, entity, baseSize);

    // Draw features
    appearance.features.forEach(feature => {
      this.drawFeature(ctx, feature, entity, baseSize, animState);
    });

    // Draw personality effects
    this.drawPersonalityEffects(ctx, entity, baseSize, animState);

    // Draw name label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(entity.name, 0, baseSize + 25);

    ctx.restore();
  }

  private getAnimationState(entityId: string): EntityAnimationState {
    if (!this.animationStates.has(entityId)) {
      this.animationStates.set(entityId, {
        frame: 0,
        phase: 0,
        lastUpdate: Date.now()
      });
    }
    return this.animationStates.get(entityId)!;
  }

  private updateAnimationState(animState: EntityAnimationState, entity: Entity): void {
    const now = Date.now();
    const deltaTime = now - animState.lastUpdate;
    
    // Update based on personality energy
    const speed = entity.personality.energy / 100;
    animState.frame += deltaTime * 0.001 * speed;
    animState.phase = Math.sin(animState.frame) * 0.5 + 0.5;
    animState.lastUpdate = now;
  }

  private applyPersonalityEffects(ctx: CanvasRenderingContext2D, entity: Entity, animState: EntityAnimationState): void {
    const { personality } = entity;

    // Creative entities rotate slowly
    if (personality.traits.includes('creative')) {
      ctx.rotate(animState.frame * 0.1);
    }

    // Energetic entities vibrate
    if (personality.traits.includes('energetic')) {
      const vibrationX = Math.sin(animState.frame * 10) * 2;
      const vibrationY = Math.cos(animState.frame * 12) * 1.5;
      ctx.translate(vibrationX, vibrationY);
    }

    // Social entities pulse scale
    if (personality.traits.includes('social')) {
      const pulseScale = 1 + Math.sin(animState.frame * 2) * 0.1;
      ctx.scale(pulseScale, pulseScale);
    }
  }

  private drawBaseShape(ctx: CanvasRenderingContext2D, entity: Entity, baseSize: number): void {
    const { appearance } = entity;
    
    // Create gradient based on personality
    const gradient = this.createColorGradient(ctx, entity, baseSize);
    ctx.fillStyle = gradient;
    ctx.strokeStyle = this.darkenColor(appearance.color, 0.3);
    ctx.lineWidth = 2;

    switch (appearance.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, baseSize, 0, Math.PI * 2);
        break;
      
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -baseSize);
        ctx.lineTo(-baseSize * 0.866, baseSize * 0.5);
        ctx.lineTo(baseSize * 0.866, baseSize * 0.5);
        ctx.closePath();
        break;
      
      case 'hexagon':
        this.drawPolygon(ctx, 0, 0, baseSize, 6);
        break;
      
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(0, -baseSize);
        ctx.lineTo(baseSize, 0);
        ctx.lineTo(0, baseSize);
        ctx.lineTo(-baseSize, 0);
        ctx.closePath();
        break;
      
      case 'star':
        this.drawStar(ctx, 0, 0, baseSize, baseSize * 0.5, 5);
        break;
    }

    ctx.fill();
    ctx.stroke();
  }

  private createColorGradient(ctx: CanvasRenderingContext2D, entity: Entity, radius: number): CanvasGradient {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    const baseColor = entity.appearance.color;
    const lightColor = this.lightenColor(baseColor, 0.3);
    
    gradient.addColorStop(0, lightColor);
    gradient.addColorStop(1, baseColor);
    
    return gradient;
  }

  private drawFeature(ctx: CanvasRenderingContext2D, feature: string, entity: Entity, baseSize: number, animState: EntityAnimationState): void {
    const { appearance } = entity;
    
    switch (feature) {
      case 'glowing_eyes':
        this.drawGlowingEyes(ctx, baseSize, appearance.color, animState);
        break;
      
      case 'crystal_spikes':
        this.drawCrystalSpikes(ctx, baseSize, appearance.color);
        break;
      
      case 'energy_aura':
        this.drawEnergyAura(ctx, baseSize, appearance.color, animState);
        break;
      
      case 'particle_trail':
        this.drawParticleTrail(ctx, baseSize, appearance.color, animState);
        break;
      
      case 'geometric_pattern':
        this.drawGeometricPattern(ctx, baseSize, appearance.color, appearance.shape);
        break;
      
      case 'flowing_tendrils':
        this.drawFlowingTendrils(ctx, baseSize, appearance.color, animState);
        break;
      
      case 'rotating_symbols':
        this.drawRotatingSymbols(ctx, baseSize, appearance.color, animState);
        break;
    }
  }

  private drawGlowingEyes(ctx: CanvasRenderingContext2D, baseSize: number, color: string, animState: EntityAnimationState): void {
    const eyeSize = baseSize * 0.15;
    const eyeY = -baseSize * 0.3;
    const glowIntensity = 0.7 + animState.phase * 0.3;
    
    // Create glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10 * glowIntensity;
    
    ctx.fillStyle = this.lightenColor(color, 0.8);
    
    // Left eye
    ctx.beginPath();
    ctx.arc(-baseSize * 0.3, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Right eye
    ctx.beginPath();
    ctx.arc(baseSize * 0.3, eyeY, eyeSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Reset shadow
    ctx.shadowBlur = 0;
  }

  private drawCrystalSpikes(ctx: CanvasRenderingContext2D, baseSize: number, color: string): void {
    const spikeCount = 6;
    const spikeLength = baseSize * 0.8;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < spikeCount; i++) {
      const angle = (Math.PI * 2 * i) / spikeCount;
      const startX = Math.cos(angle) * baseSize;
      const startY = Math.sin(angle) * baseSize;
      const endX = Math.cos(angle) * (baseSize + spikeLength);
      const endY = Math.sin(angle) * (baseSize + spikeLength);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }

  private drawEnergyAura(ctx: CanvasRenderingContext2D, baseSize: number, color: string, animState: EntityAnimationState): void {
    const auraRadius = baseSize * (1.5 + animState.phase * 0.3);
    const gradient = ctx.createRadialGradient(0, 0, baseSize, 0, 0, auraRadius);
    
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.7, this.hexToRgba(color, 0.1));
    gradient.addColorStop(1, this.hexToRgba(color, 0.3));
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawParticleTrail(ctx: CanvasRenderingContext2D, baseSize: number, color: string, animState: EntityAnimationState): void {
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (animState.frame + i) * 0.5;
      const distance = baseSize * (1.2 + i * 0.1);
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = (baseSize * 0.1) * (1 - i / particleCount);
      const alpha = 1 - (i / particleCount);
      
      ctx.fillStyle = this.hexToRgba(color, alpha);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawGeometricPattern(ctx: CanvasRenderingContext2D, baseSize: number, color: string, shape: string): void {
    ctx.strokeStyle = this.lightenColor(color, 0.5);
    ctx.lineWidth = 1;
    
    const patternSize = baseSize * 0.6;
    
    switch (shape) {
      case 'circle':
        // Concentric circles
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, patternSize * (i / 3), 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
      
      case 'triangle':
      case 'hexagon':
        // Internal polygon pattern
        this.drawPolygon(ctx, 0, 0, patternSize, 6);
        ctx.stroke();
        this.drawPolygon(ctx, 0, 0, patternSize * 0.5, 3);
        ctx.stroke();
        break;
      
      default:
        // Grid pattern
        ctx.beginPath();
        ctx.moveTo(-patternSize, -patternSize);
        ctx.lineTo(patternSize, patternSize);
        ctx.moveTo(patternSize, -patternSize);
        ctx.lineTo(-patternSize, patternSize);
        ctx.stroke();
        break;
    }
  }

  private drawFlowingTendrils(ctx: CanvasRenderingContext2D, baseSize: number, color: string, animState: EntityAnimationState): void {
    const tendrilCount = 4;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    for (let i = 0; i < tendrilCount; i++) {
      const baseAngle = (Math.PI * 2 * i) / tendrilCount;
      const waveOffset = animState.frame + i;
      
      ctx.beginPath();
      ctx.moveTo(
        Math.cos(baseAngle) * baseSize,
        Math.sin(baseAngle) * baseSize
      );
      
      // Create flowing curve
      for (let j = 1; j <= 10; j++) {
        const progress = j / 10;
        const distance = baseSize * (1 + progress * 0.8);
        const wave = Math.sin(waveOffset + progress * 3) * baseSize * 0.3;
        const angle = baseAngle + wave * 0.01;
        
        ctx.lineTo(
          Math.cos(angle) * distance,
          Math.sin(angle) * distance
        );
      }
      ctx.stroke();
    }
  }

  private drawRotatingSymbols(ctx: CanvasRenderingContext2D, baseSize: number, color: string, animState: EntityAnimationState): void {
    const symbolCount = 3;
    const orbitRadius = baseSize * 1.3;
    
    ctx.fillStyle = color;
    ctx.font = `${baseSize * 0.3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const symbols = ['★', '♦', '●'];
    
    for (let i = 0; i < symbolCount; i++) {
      const angle = animState.frame * 0.5 + (Math.PI * 2 * i) / symbolCount;
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * orbitRadius;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(animState.frame);
      ctx.fillText(symbols[i], 0, 0);
      ctx.restore();
    }
  }

  private drawPersonalityEffects(ctx: CanvasRenderingContext2D, entity: Entity, baseSize: number, animState: EntityAnimationState): void {
    const { personality } = entity;

    // Curious entities have pulsing glow
    if (personality.traits.includes('curious')) {
      const glowSize = baseSize * (1.2 + animState.phase * 0.2);
      ctx.shadowColor = entity.appearance.color;
      ctx.shadowBlur = 15 * animState.phase;
      
      ctx.globalAlpha = 0.3 * animState.phase;
      ctx.strokeStyle = entity.appearance.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    // Social entities have connection waves
    if (personality.traits.includes('social')) {
      const waveCount = 3;
      for (let i = 0; i < waveCount; i++) {
        const waveRadius = baseSize * (1.3 + i * 0.3 + animState.phase * 0.2);
        const alpha = 0.3 * (1 - i / waveCount) * animState.phase;
        
        ctx.strokeStyle = this.hexToRgba(entity.appearance.color, alpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  // Utility methods
  private drawPolygon(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, sides: number): void {
    ctx.beginPath();
    const angle = (Math.PI * 2) / sides;
    ctx.moveTo(x + radius * Math.cos(0), y + radius * Math.sin(0));
    
    for (let i = 1; i < sides; i++) {
      ctx.lineTo(
        x + radius * Math.cos(angle * i),
        y + radius * Math.sin(angle * i)
      );
    }
    ctx.closePath();
  }

  private drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, outerRadius: number, innerRadius: number, points: number): void {
    ctx.beginPath();
    const angle = Math.PI / points;
    
    for (let i = 0; i < 2 * points; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const currentAngle = i * angle;
      const pointX = x + radius * Math.cos(currentAngle - Math.PI / 2);
      const pointY = y + radius * Math.sin(currentAngle - Math.PI / 2);
      
      if (i === 0) {
        ctx.moveTo(pointX, pointY);
      } else {
        ctx.lineTo(pointX, pointY);
      }
    }
    ctx.closePath();
  }

  private lightenColor(color: string, factor: number): string {
    const hex = color.replace('#', '');
    const r = Math.min(255, Math.floor(parseInt(hex.substr(0, 2), 16) * (1 + factor)));
    const g = Math.min(255, Math.floor(parseInt(hex.substr(2, 2), 16) * (1 + factor)));
    const b = Math.min(255, Math.floor(parseInt(hex.substr(4, 2), 16) * (1 + factor)));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private darkenColor(color: string, factor: number): string {
    const hex = color.replace('#', '');
    const r = Math.floor(parseInt(hex.substr(0, 2), 16) * (1 - factor));
    const g = Math.floor(parseInt(hex.substr(2, 2), 16) * (1 - factor));
    const b = Math.floor(parseInt(hex.substr(4, 2), 16) * (1 - factor));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}