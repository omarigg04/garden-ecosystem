'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Entity, ViewportState, BiomeElement, EnvironmentalTrace, Resource, BiomeZone } from '@/types';
import { EntityRenderer } from './canvas/EntityRenderer';
import { EnvironmentalRenderer } from './canvas/EnvironmentalRenderer';
import { BiomeGenerator } from '@/lib/biome-generator';
import { EnvironmentalTraceSystem } from '@/lib/environmental-traces';
import { ResourceManager } from '@/lib/resource-manager';

interface EcosystemCanvasProps {
  entities: Entity[];
  width?: number;
  height?: number;
}

export default function EcosystemCanvas({ 
  entities, 
  width = 1200, 
  height = 800 
}: EcosystemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const entityRendererRef = useRef<EntityRenderer>(new EntityRenderer());
  const environmentalRendererRef = useRef<EnvironmentalRenderer>(new EnvironmentalRenderer());
  const biomeGeneratorRef = useRef<BiomeGenerator>(new BiomeGenerator(width, height));
  const traceSystemRef = useRef<EnvironmentalTraceSystem>(new EnvironmentalTraceSystem());
  const resourceManagerRef = useRef<ResourceManager>(new ResourceManager());
  
  const [viewport, setViewport] = useState<ViewportState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0
  });

  // Environmental state
  const [biomeZones, setBiomeZones] = useState<BiomeZone[]>([]);
  const [biomeElements, setBiomeElements] = useState<BiomeElement[]>([]);
  const [environmentalTraces, setEnvironmentalTraces] = useState<EnvironmentalTrace[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [ecosystemInitialized, setEcosystemInitialized] = useState(false);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Save context state
    ctx.save();

    // Apply viewport transformations
    ctx.translate(viewport.offsetX, viewport.offsetY);
    ctx.scale(viewport.scale, viewport.scale);

    // Draw background gradient
    drawBackground(ctx, width, height);

    // Render environmental layers if ecosystem is initialized
    if (ecosystemInitialized) {
      environmentalRendererRef.current.renderEnvironment(
        ctx,
        biomeZones,
        biomeElements,
        environmentalTraces,
        resources
      );
    }

    // Draw entities using EntityRenderer
    entities.forEach(entity => {
      entityRendererRef.current.drawEntity(ctx, entity);
    });

    // Draw UI overlays
    drawUIOverlays(ctx);

    // Restore context state
    ctx.restore();

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  }, [entities, viewport, width, height, ecosystemInitialized, biomeZones, biomeElements, environmentalTraces, resources, drawUIOverlays]);

  const drawBackground = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    // Create a natural sky-to-ground gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#87CEEB'); // Sky blue
    gradient.addColorStop(0.3, '#E0F6FF'); // Light blue
    gradient.addColorStop(0.7, '#F0F8F0'); // Light green
    gradient.addColorStop(1, '#E8F5E8'); // Ground green
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  };

  const drawUIOverlays = useCallback((ctx: CanvasRenderingContext2D) => {
    // Draw ecosystem stats
    if (ecosystemInitialized) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 200, 100);
      
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(`🌳 Biome Elements: ${biomeElements.length}`, 20, 30);
      ctx.fillText(`👣 Active Traces: ${environmentalTraces.length}`, 20, 50);
      ctx.fillText(`💎 Resources: ${resources.filter(r => r.amount > 0).length}`, 20, 70);
      ctx.fillText(`🦋 Entities: ${entities.length}`, 20, 90);
    }
  }, [ecosystemInitialized, biomeElements.length, environmentalTraces.length, resources, entities.length]);


  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewport(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(3, prev.scale * delta))
    }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const startX = e.clientX - viewport.offsetX;
    const startY = e.clientY - viewport.offsetY;

    const handleMouseMove = (e: MouseEvent) => {
      setViewport(prev => ({
        ...prev,
        offsetX: e.clientX - startX,
        offsetY: e.clientY - startY
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [viewport]);

  // Initialize ecosystem on first load
  useEffect(() => {
    if (!ecosystemInitialized) {
      const initialEcosystem = biomeGeneratorRef.current.generateInitialEcosystem();
      
      setBiomeZones(initialEcosystem.biomeZones);
      setBiomeElements(initialEcosystem.biomeElements);
      setResources(initialEcosystem.resources);
      
      // Initialize resource manager with resources
      resourceManagerRef.current = new ResourceManager(initialEcosystem.resources);
      
      setEcosystemInitialized(true);
      
      console.log('🌍 Ecosystem initialized:', {
        biomeZones: initialEcosystem.biomeZones.length,
        biomeElements: initialEcosystem.biomeElements.length,
        resources: initialEcosystem.resources.length
      });
    }
  }, [ecosystemInitialized]);

  // Simulate entity interactions and environmental changes
  useEffect(() => {
    if (!ecosystemInitialized || entities.length === 0) return;

    const interval = setInterval(() => {
      // Simulate random entity movements creating traces
      if (entities.length > 0 && Math.random() < 0.3) {
        const randomEntity = entities[Math.floor(Math.random() * entities.length)];
        const trace = traceSystemRef.current.createTrace(
          'footprint',
          randomEntity.position,
          randomEntity
        );
        
        setEnvironmentalTraces(prev => [...prev, trace]);
      }

      // Update traces (fade them over time)
      const updatedTraces = traceSystemRef.current.updateTraces();
      setEnvironmentalTraces(updatedTraces);

      // Regenerate resources
      const regeneratedResources = resourceManagerRef.current.regenerateResources();
      if (regeneratedResources.length > 0) {
        setResources(resourceManagerRef.current.getAllResources());
      }

      // Grow biome elements
      setBiomeElements(prev => 
        biomeGeneratorRef.current.growBiomeElements(prev, biomeZones)
      );
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [ecosystemInitialized, entities, biomeZones]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
    }

    // Start animation loop
    renderFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [renderFrame, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-300 cursor-move"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      style={{ width, height }}
    />
  );
}