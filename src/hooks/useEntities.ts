import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client, { databases, DATABASE_ID, ENTITIES_COLLECTION_ID } from '@/lib/appwrite';
import { Entity } from '@/types';
import { Query } from 'appwrite';

// Fetch all entities
export function useEntities() {
  return useQuery({
    queryKey: ['entities'],
    queryFn: async (): Promise<Entity[]> => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          ENTITIES_COLLECTION_ID,
          [Query.orderDesc('createdAt')]
        );
        
        return response.documents.map(doc => ({
          id: doc.$id,
          name: doc.name,
          donorEmail: doc.donorEmail,
          species: doc.species,
          personality: JSON.parse(doc.personality),
          appearance: JSON.parse(doc.appearance),
          position: JSON.parse(doc.position),
          status: doc.status,
          relationships: doc.relationships || [],
          createdAt: doc.createdAt,
          lastActive: doc.lastActive
        }));
      } catch (error) {
        console.error('Error fetching entities:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Fetch single entity
export function useEntity(entityId: string) {
  return useQuery({
    queryKey: ['entity', entityId],
    queryFn: async (): Promise<Entity> => {
      try {
        const doc = await databases.getDocument(
          DATABASE_ID,
          ENTITIES_COLLECTION_ID,
          entityId
        );
        
        return {
          id: doc.$id,
          name: doc.name,
          donorEmail: doc.donorEmail,
          species: doc.species,
          personality: JSON.parse(doc.personality),
          appearance: JSON.parse(doc.appearance),
          position: JSON.parse(doc.position),
          status: doc.status,
          relationships: doc.relationships || [],
          createdAt: doc.createdAt,
          lastActive: doc.lastActive
        };
      } catch (error) {
        console.error('Error fetching entity:', error);
        throw error;
      }
    },
    enabled: !!entityId,
  });
}

// Update entity mutation
export function useUpdateEntity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ entityId, updates }: { entityId: string; updates: Partial<Entity> }) => {
      const updateData: Record<string, unknown> = {};
      
      if (updates.name) updateData.name = updates.name;
      if (updates.status) updateData.status = updates.status;
      if (updates.position) updateData.position = JSON.stringify(updates.position);
      if (updates.personality) updateData.personality = JSON.stringify(updates.personality);
      if (updates.appearance) updateData.appearance = JSON.stringify(updates.appearance);
      if (updates.relationships) updateData.relationships = updates.relationships;
      if (updates.lastActive) updateData.lastActive = updates.lastActive;
      
      return await databases.updateDocument(
        DATABASE_ID,
        ENTITIES_COLLECTION_ID,
        entityId,
        updateData
      );
    },
    onSuccess: (data, variables) => {
      // Update the entities list cache
      queryClient.setQueryData(['entities'], (oldEntities: Entity[] | undefined) => {
        if (!oldEntities) return oldEntities;
        
        return oldEntities.map(entity => 
          entity.id === variables.entityId 
            ? { ...entity, ...variables.updates }
            : entity
        );
      });
      
      // Update the individual entity cache
      queryClient.setQueryData(['entity', variables.entityId], (oldEntity: Entity | undefined) => {
        if (!oldEntity) return oldEntity;
        return { ...oldEntity, ...variables.updates };
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
    onError: (error) => {
      console.error('Error updating entity:', error);
    }
  });
}

// Create entity mutation (mainly for manual creation, automatic creation happens via webhook)
export function useCreateEntity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entity: Omit<Entity, 'id'>): Promise<Entity> => {
      const response = await databases.createDocument(
        DATABASE_ID,
        ENTITIES_COLLECTION_ID,
        'unique()',
        {
          name: entity.name,
          donorEmail: entity.donorEmail,
          species: entity.species,
          personality: JSON.stringify(entity.personality),
          appearance: JSON.stringify(entity.appearance),
          position: JSON.stringify(entity.position),
          status: entity.status,
          relationships: entity.relationships,
          createdAt: entity.createdAt,
          lastActive: entity.lastActive
        }
      );
      
      return {
        id: response.$id,
        name: response.name,
        donorEmail: response.donorEmail,
        species: response.species,
        personality: JSON.parse(response.personality),
        appearance: JSON.parse(response.appearance),
        position: JSON.parse(response.position),
        status: response.status,
        relationships: response.relationships || [],
        createdAt: response.createdAt,
        lastActive: response.lastActive
      };
    },
    onSuccess: (newEntity) => {
      // Add to entities list cache
      queryClient.setQueryData(['entities'], (oldEntities: Entity[] | undefined) => {
        if (!oldEntities) return [newEntity];
        return [newEntity, ...oldEntities];
      });
      
      // Set individual entity cache
      queryClient.setQueryData(['entity', newEntity.id], newEntity);
      
      // Invalidate entities list
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
    onError: (error) => {
      console.error('Error creating entity:', error);
    }
  });
}

// Delete entity mutation
export function useDeleteEntity() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entityId: string) => {
      return await databases.deleteDocument(
        DATABASE_ID,
        ENTITIES_COLLECTION_ID,
        entityId
      );
    },
    onSuccess: (_, entityId) => {
      // Remove from entities list cache
      queryClient.setQueryData(['entities'], (oldEntities: Entity[] | undefined) => {
        if (!oldEntities) return oldEntities;
        return oldEntities.filter(entity => entity.id !== entityId);
      });
      
      // Remove individual entity cache
      queryClient.removeQueries({ queryKey: ['entity', entityId] });
      
      // Invalidate entities list
      queryClient.invalidateQueries({ queryKey: ['entities'] });
    },
    onError: (error) => {
      console.error('Error deleting entity:', error);
    }
  });
}

// Hook for real-time subscription (disabled for MVP - polling will work)
export function useEntitiesSubscription() {
  // Temporarily disabled to avoid TypeScript issues
  // Will implement with proper types later
  console.log('Real-time subscriptions temporarily disabled for build compatibility');
}