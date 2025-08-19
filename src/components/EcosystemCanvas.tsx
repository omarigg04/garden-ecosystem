'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Entity, ViewportState } from '@/types';
import { EntityRenderer } from './canvas/EntityRenderer';

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
  const [viewport, setViewport] = useState<ViewportState>({
    scale: 1,
    offsetX: 0,
    offsetY: 0
  });

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

    // Draw background grid (optional)
    drawGrid(ctx, width, height);

    // Draw entities using EntityRenderer
    entities.forEach(entity => {
      entityRendererRef.current.drawEntity(ctx, entity);
    });

    // Restore context state
    ctx.restore();

    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  }, [entities, viewport, width, height]);

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const gridSize = 50;
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    
    for (let y = 0; y <= h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };


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