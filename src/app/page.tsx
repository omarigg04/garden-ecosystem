'use client';

import React, { useEffect, useState } from 'react';
import EcosystemCanvas from '@/components/EcosystemCanvas';
import DonationModal from '@/components/DonationModal';
import { useEntities, useEntitiesSubscription } from '@/hooks/useEntities';
import { useEcosystemStore } from '@/store/useEcosystemStore';
import { BehaviorEngine } from '@/lib/behavior-engine';
import { Entity } from '@/types';

const behaviorEngine = new BehaviorEngine();

export default function Home() {
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const { data: entities = [], isLoading, error } = useEntities();
  const typedEntities = entities as Entity[];
  const { 
    setEntities, 
    updateEntity, 
    entities: storeEntities 
  } = useEcosystemStore();

  // Subscribe to real-time updates
  useEntitiesSubscription();

  // Update store when data changes
  useEffect(() => {
    if (typedEntities.length > 0) {
      setEntities(typedEntities);
    }
  }, [typedEntities, setEntities]);

  // Start behavior system when entities are loaded
  useEffect(() => {
    if (storeEntities.length > 0) {
      behaviorEngine.startBehaviorSystem(storeEntities, (updatedEntity) => {
        updateEntity(updatedEntity.id, updatedEntity);
      });
    }

    return () => {
      behaviorEngine.stopBehaviorSystem();
    };
  }, [storeEntities.length, updateEntity, storeEntities]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Digital Ecosystem...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load ecosystem</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Digital Ecosystem Garden</h1>
              <p className="text-gray-600">A living world of AI-generated digital beings</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{storeEntities.length}</span> beings alive
              </div>
              <button
                onClick={() => setIsDonationModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create a Being
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">The Living Ecosystem</h2>
            <p className="text-gray-600 mb-4">
              Watch unique AI-generated beings interact, build, and evolve in real-time. 
              Each creature has its own personality, appearance, and behaviors.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Exploring: {useEcosystemStore.getState().getEntitiesByStatus('exploring').length}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Building: {useEcosystemStore.getState().getEntitiesByStatus('building').length}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span>Socializing: {useEcosystemStore.getState().getEntitiesByStatus('socializing').length}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                <span>Resting: {useEcosystemStore.getState().getEntitiesByStatus('resting').length}</span>
              </div>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="flex justify-center">
            <div className="relative">
              <EcosystemCanvas 
                entities={storeEntities}
                width={1200}
                height={800}
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                Use mouse wheel to zoom • Drag to pan
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Make a donation ($1 minimum)</li>
              <li>AI generates your unique digital being</li>
              <li>Watch it explore and interact with others</li>
              <li>Influence the ecosystem with larger donations</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Unique Features</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• AI-generated personalities</li>
              <li>• Procedural sprite graphics</li>
              <li>• Real-time behavior simulation</li>
              <li>• Social interactions & relationships</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Coming Soon</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Building construction system</li>
              <li>• Premium sprite graphics</li>
              <li>• Ecosystem events & evolution</li>
              <li>• Mobile companion app</li>
            </ul>
          </div>
        </div>
      </main>

      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </div>
  );
}
