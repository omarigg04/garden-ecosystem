import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Entity, Structure, ViewportState } from '@/types';

interface EcosystemState {
  // Entities state
  entities: Entity[];
  selectedEntity: Entity | null;
  
  // Structures state
  structures: Structure[];
  
  // Viewport state
  viewport: ViewportState;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  showDonationModal: boolean;
  showEntityDetails: boolean;
  
  // Actions
  setEntities: (entities: Entity[]) => void;
  addEntity: (entity: Entity) => void;
  updateEntity: (entityId: string, updates: Partial<Entity>) => void;
  removeEntity: (entityId: string) => void;
  selectEntity: (entity: Entity | null) => void;
  
  setStructures: (structures: Structure[]) => void;
  addStructure: (structure: Structure) => void;
  updateStructure: (structureId: string, updates: Partial<Structure>) => void;
  
  setViewport: (viewport: ViewportState) => void;
  updateViewport: (updates: Partial<ViewportState>) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setShowDonationModal: (show: boolean) => void;
  setShowEntityDetails: (show: boolean) => void;
  
  // Computed getters
  getEntityById: (id: string) => Entity | undefined;
  getEntitiesByStatus: (status: Entity['status']) => Entity[];
  getNearbyEntities: (entity: Entity, radius: number) => Entity[];
}

export const useEcosystemStore = create<EcosystemState>()(
  devtools(
    (set, get) => ({
      // Initial state
      entities: [],
      selectedEntity: null,
      structures: [],
      viewport: {
        scale: 1,
        offsetX: 0,
        offsetY: 0
      },
      isLoading: false,
      error: null,
      showDonationModal: false,
      showEntityDetails: false,

      // Entity actions
      setEntities: (entities) => set({ entities }, false, 'setEntities'),
      
      addEntity: (entity) => 
        set(
          (state) => ({ entities: [...state.entities, entity] }),
          false,
          'addEntity'
        ),
      
      updateEntity: (entityId, updates) =>
        set(
          (state) => ({
            entities: state.entities.map(entity =>
              entity.id === entityId ? { ...entity, ...updates } : entity
            )
          }),
          false,
          'updateEntity'
        ),
      
      removeEntity: (entityId) =>
        set(
          (state) => ({
            entities: state.entities.filter(entity => entity.id !== entityId),
            selectedEntity: state.selectedEntity?.id === entityId ? null : state.selectedEntity
          }),
          false,
          'removeEntity'
        ),
      
      selectEntity: (entity) => set({ selectedEntity: entity }, false, 'selectEntity'),

      // Structure actions
      setStructures: (structures) => set({ structures }, false, 'setStructures'),
      
      addStructure: (structure) =>
        set(
          (state) => ({ structures: [...state.structures, structure] }),
          false,
          'addStructure'
        ),
      
      updateStructure: (structureId, updates) =>
        set(
          (state) => ({
            structures: state.structures.map(structure =>
              structure.id === structureId ? { ...structure, ...updates } : structure
            )
          }),
          false,
          'updateStructure'
        ),

      // Viewport actions
      setViewport: (viewport) => set({ viewport }, false, 'setViewport'),
      
      updateViewport: (updates) =>
        set(
          (state) => ({ viewport: { ...state.viewport, ...updates } }),
          false,
          'updateViewport'
        ),

      // UI actions
      setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
      setError: (error) => set({ error }, false, 'setError'),
      setShowDonationModal: (showDonationModal) => set({ showDonationModal }, false, 'setShowDonationModal'),
      setShowEntityDetails: (showEntityDetails) => set({ showEntityDetails }, false, 'setShowEntityDetails'),

      // Computed getters
      getEntityById: (id) => get().entities.find(entity => entity.id === id),
      
      getEntitiesByStatus: (status) => get().entities.filter(entity => entity.status === status),
      
      getNearbyEntities: (entity, radius) => {
        const entities = get().entities;
        return entities
          .filter(other => other.id !== entity.id)
          .filter(other => {
            const dx = other.position.x - entity.position.x;
            const dy = other.position.y - entity.position.y;
            return Math.sqrt(dx * dx + dy * dy) <= radius;
          });
      }
    }),
    {
      name: 'ecosystem-store',
    }
  )
);