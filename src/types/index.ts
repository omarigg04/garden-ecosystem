export interface EntityPersonality {
  traits: string[];
  energy: number; // 0-100
}

export interface EntityAppearance {
  color: string;
  size: number; // 0.5-2.0
  shape: 'circle' | 'triangle' | 'hexagon' | 'diamond' | 'star';
  features: string[];
}

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  name: string;
  donorEmail: string;
  species: string;
  personality: EntityPersonality;
  appearance: EntityAppearance;
  position: Position;
  status: 'exploring' | 'building' | 'socializing' | 'resting';
  relationships: string[];
  createdAt: string;
  lastActive: string;
}

export interface Structure {
  id: string;
  name: string;
  type: 'home' | 'gathering' | 'monument';
  position: Position;
  builders: string[]; // entity IDs
  progress: number; // 0-100
  createdAt: string;
}

export interface Donation {
  id: string;
  email: string;
  amount: number;
  entityId: string;
  stripeSessionId: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface EntityAnimationState {
  frame: number;
  phase: number;
  lastUpdate: number;
}

export interface ViewportState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

// ===== NUEVOS TIPOS PARA BIOMAS Y AMBIENTE =====

export interface BiomeElement {
  id: string;
  type: 'tree' | 'rock' | 'water' | 'flower' | 'grass';
  position: Position;
  size: number; // 0.5-2.0
  health: number; // 0-100 (para crecimiento/deterioro)
  variant: number; // 0-2 (diferentes variantes del mismo tipo)
  createdAt: string;
  lastModified: string;
  modifiedBy?: string; // entity ID que lo modificó
}

export interface EnvironmentalTrace {
  id: string;
  type: 'footprint' | 'path' | 'nest' | 'burrow' | 'territory' | 'scent';
  position: Position;
  radius: number; // área de influencia
  intensity: number; // 0-100 (se desvanece con el tiempo)
  entityId: string; // quién lo creó
  createdAt: string;
  expiresAt: string; // cuándo desaparece
  properties: Record<string, unknown>; // datos específicos del rastro
}

export interface Resource {
  id: string;
  type: 'mineral' | 'food' | 'water' | 'energy';
  position: Position;
  amount: number; // cantidad disponible
  maxAmount: number; // cantidad máxima
  regenerationRate: number; // velocidad de regeneración
  lastHarvested?: string;
  harvestedBy?: string[]; // entidades que lo han usado
}

export interface BiomeZone {
  id: string;
  type: 'forest' | 'meadow' | 'rocky' | 'wetland' | 'desert';
  center: Position;
  radius: number;
  density: number; // 0-1 densidad de elementos
  fertility: number; // 0-100 qué tan fértil es
  elements: string[]; // IDs de BiomeElement en esta zona
  influences: EntityInfluence[]; // cómo las entidades han afectado esta zona
}

export interface EntityInfluence {
  entityId: string;
  type: 'positive' | 'negative' | 'neutral';
  strength: number; // 0-100
  effect: 'growth' | 'decay' | 'transformation' | 'protection';
  appliedAt: string;
}

// Extensión de Entity para incluir capacidades ambientales
export interface EntityEnvironmentalCapabilities {
  canPlant: boolean;
  canMine: boolean;
  canBuild: boolean;
  canMarkTerritory: boolean;
  environmentalImpact: 'positive' | 'negative' | 'neutral';
  preferredBiome: BiomeZone['type'];
}