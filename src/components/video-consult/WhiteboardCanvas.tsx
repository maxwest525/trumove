import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Eraser, Undo2, Redo2, Trash2 } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  size: number;
  tool: 'pen' | 'eraser';
}

const COLORS = [
  { value: '#000000', label: 'Black' },
  { value: '#EF4444', label: 'Red' },
  { value: '#F97316', label: 'Orange' },
  { value: '#22C55E', label: 'Green' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#FFFFFF', label: 'White' },
];

const BRUSH_SIZES = [2, 4, 8, 16];

export function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drawing state
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // History for undo/redo
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  
  // Tool settings
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);

  // Resize canvas to fit container
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Redraw after resize
      redrawCanvas();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [strokes]);

  // Redraw all strokes
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all completed strokes
    strokes.forEach(stroke => {
      drawStroke(ctx, stroke);
    });

    // Draw current stroke in progress
    if (currentStroke.length > 0) {
      drawStroke(ctx, {
        points: currentStroke,
        color: tool === 'eraser' ? '#FFFFFF' : color,
        size: tool === 'eraser' ? brushSize * 3 : brushSize,
        tool
      });
    }
  }, [strokes, currentStroke, color, brushSize, tool]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Draw a single stroke
  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = stroke.tool === 'eraser' ? '#FFFFFF' : stroke.color;
    ctx.lineWidth = stroke.tool === 'eraser' ? stroke.size * 3 : stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
    
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    
    ctx.stroke();
  };

  // Get mouse/touch position relative to canvas
  const getPosition = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Start drawing
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPosition(e);
    setCurrentStroke([pos]);
  };

  // Continue drawing
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const pos = getPosition(e);
    setCurrentStroke(prev => [...prev, pos]);
  };

  // End drawing
  const handleEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (currentStroke.length > 1) {
      const newStroke: Stroke = {
        points: currentStroke,
        color: tool === 'eraser' ? '#FFFFFF' : color,
        size: brushSize,
        tool
      };
      
      // Save current state for undo
      setUndoStack(prev => [...prev, strokes]);
      // Clear redo stack when new action is made
      setRedoStack([]);
      // Add new stroke
      setStrokes(prev => [...prev, newStroke]);
    }
    
    setCurrentStroke([]);
  };

  // Undo last stroke
  const handleUndo = () => {
    if (undoStack.length === 0) return;
    
    const previousState = undoStack[undoStack.length - 1];
    setRedoStack(prev => [...prev, strokes]);
    setStrokes(previousState);
    setUndoStack(prev => prev.slice(0, -1));
  };

  // Redo last undone stroke
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const nextState = redoStack[redoStack.length - 1];
    setUndoStack(prev => [...prev, strokes]);
    setStrokes(nextState);
    setRedoStack(prev => prev.slice(0, -1));
  };

  // Clear canvas
  const handleClear = () => {
    if (strokes.length === 0) return;
    
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
    setStrokes([]);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
        {/* Tool Selection */}
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-2">Tools</span>
          <Button
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
            className="h-8 px-3"
          >
            <Pencil className="w-4 h-4 mr-1.5" />
            Pen
          </Button>
          <Button
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="h-8 px-3"
          >
            <Eraser className="w-4 h-4 mr-1.5" />
            Eraser
          </Button>
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">Color</span>
          {COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={cn(
                "w-6 h-6 rounded-full border-2 transition-all hover:scale-110",
                color === c.value 
                  ? "border-primary ring-2 ring-primary/30 scale-110" 
                  : "border-border hover:border-primary/50",
                c.value === '#FFFFFF' && "bg-white"
              )}
              style={{ backgroundColor: c.value }}
              title={c.label}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Brush Size */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">Size</span>
          {BRUSH_SIZES.map(size => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={cn(
                "w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all hover:border-primary/50",
                brushSize === size 
                  ? "border-primary bg-primary/10" 
                  : "border-border bg-background"
              )}
              title={`${size}px`}
            >
              <span 
                className="rounded-full bg-foreground"
                style={{ width: size + 2, height: size + 2 }}
              />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-border" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="h-8 px-3"
          >
            <Undo2 className="w-4 h-4 mr-1.5" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="h-8 px-3"
          >
            <Redo2 className="w-4 h-4 mr-1.5" />
            Redo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={strokes.length === 0}
            className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        ref={containerRef}
        className="flex-1 rounded-lg border-2 border-border bg-white overflow-hidden cursor-crosshair"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="touch-none"
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          {strokes.length} stroke{strokes.length !== 1 ? 's' : ''} • 
          Tool: {tool === 'pen' ? 'Pen' : 'Eraser'} • 
          Size: {brushSize}px
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Real-time sync enabled
        </span>
      </div>
    </div>
  );
}
