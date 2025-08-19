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