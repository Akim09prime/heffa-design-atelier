
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ChevronLeft, Save, Download, Undo, Redo, 
  Grid3X3, Layers, ZoomIn, ZoomOut, RotateRight, Move, 
  ArrowsOut, ArrowsIn, PanelLeft, PanelRight, Share
} from 'lucide-react';

interface EditorToolbarProps {
  editorMode: 'move' | 'rotate' | 'scale';
  setEditorMode: (mode: 'move' | 'rotate' | 'scale') => void;
  viewMode: 'perspective' | 'top' | 'front' | 'side';
  setViewMode: (mode: 'perspective' | 'top' | 'front' | 'side') => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  onExport: (type: 'json' | 'excel' | 'pdf' | 'dxf') => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onBack: () => void;
  projectName: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editorMode,
  setEditorMode,
  viewMode,
  setViewMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onSave,
  onExport,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onBack,
  projectName
}) => {
  return (
    <div className="bg-white border-b px-4 py-2 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="font-medium text-lg truncate max-w-[200px]">{projectName}</h1>
      </div>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          {/* Sidebar toggles */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleLeftSidebar} className="h-8 w-8">
                <PanelLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Module Library</TooltipContent>
          </Tooltip>

          {/* Editor Mode Controls */}
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={editorMode === 'move' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => setEditorMode('move')} 
                className="h-8 w-8"
              >
                <Move className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move Tool</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={editorMode === 'rotate' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => setEditorMode('rotate')} 
                className="h-8 w-8"
              >
                <RotateRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate Tool</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={editorMode === 'scale' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => setEditorMode('scale')} 
                className="h-8 w-8"
              >
                <ArrowsOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Scale Tool</TooltipContent>
          </Tooltip>

          {/* View Controls */}
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={viewMode === 'perspective' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => setViewMode('perspective')} 
                className="h-8 w-8"
              >
                <Layers className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Perspective View</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={viewMode === 'top' ? 'default' : 'ghost'} 
                size="icon" 
                onClick={() => setViewMode('top')} 
                className="h-8 w-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Top View</TooltipContent>
          </Tooltip>

          {/* History Controls */}
          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onUndo} 
                disabled={!canUndo}
                className="h-8 w-8"
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onRedo} 
                disabled={!canRedo}
                className="h-8 w-8"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-6 mx-1" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleRightSidebar} className="h-8 w-8">
                <PanelRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Properties Panel</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onExport('excel')}>
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={() => onExport('json')}>
          <Share className="h-4 w-4 mr-1" />
          Share
        </Button>
        <Button size="sm" onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
};
