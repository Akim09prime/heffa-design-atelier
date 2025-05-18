
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { 
  Save, Move, RotateCw, Maximize, 
  LayoutGrid, Eye, EyeOff, Settings, 
  Download, Share2, Undo, Redo 
} from 'lucide-react';

interface EditorToolbarProps {
  onModeChange?: (mode: 'move' | 'rotate' | 'scale') => void;
  onViewChange?: (view: 'perspective' | 'top' | 'front' | 'side') => void;
  currentMode?: 'move' | 'rotate' | 'scale';
  currentView?: 'perspective' | 'top' | 'front' | 'side';
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onModeChange,
  onViewChange,
  currentMode = 'move',
  currentView = 'perspective',
  onSave,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [showHelpers, setShowHelpers] = useState(true);
  
  return (
    <div className="border-b p-2 flex justify-between items-center bg-white">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Undo className="h-3.5 w-3.5 mr-1" /> Undo
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={onRedo}
          disabled={!canRedo}
        >
          <Redo className="h-3.5 w-3.5 mr-1" /> Redo
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button 
            variant={currentMode === 'move' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => onModeChange && onModeChange('move')}
            className="rounded-none border-0 h-8"
          >
            <Move className="h-4 w-4" />
          </Button>
          <Button 
            variant={currentMode === 'rotate' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => onModeChange && onModeChange('rotate')}
            className="rounded-none border-0 border-l border-r h-8"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button 
            variant={currentMode === 'scale' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => onModeChange && onModeChange('scale')}
            className="rounded-none border-0 h-8"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Tabs 
          value={currentView} 
          onValueChange={(value) => onViewChange && onViewChange(value as any)}
          className="h-8"
        >
          <TabsList className="h-8">
            <TabsTrigger value="perspective" className="px-2 py-0 h-7 text-xs">3D</TabsTrigger>
            <TabsTrigger value="top" className="px-2 py-0 h-7 text-xs">Top</TabsTrigger>
            <TabsTrigger value="front" className="px-2 py-0 h-7 text-xs">Front</TabsTrigger>
            <TabsTrigger value="side" className="px-2 py-0 h-7 text-xs">Side</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowGrid(!showGrid)}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Grid</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowHelpers(!showHelpers)}
              >
                {showHelpers ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Helpers</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator orientation="vertical" className="h-6" />
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
        >
          <Settings className="h-4 w-4 mr-1" /> Settings
        </Button>
        <Button 
          variant="outline" 
          size="sm"
        >
          <Share2 className="h-4 w-4 mr-1" /> Share
        </Button>
        <Button 
          variant="outline" 
          size="sm"
        >
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={onSave}
        >
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>
    </div>
  );
};
