
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ComboRule, ModuleType, AccessoryType, MaterialType, ProcessingType } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ComboRulesEditorProps {
  rule?: ComboRule;
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: ComboRule) => void;
}

export const ComboRulesEditor: React.FC<ComboRulesEditorProps> = ({
  rule,
  isOpen,
  onClose,
  onSave,
}) => {
  const { toast } = useToast();
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [conditionType, setConditionType] = useState<'moduleType' | 'dimension' | 'materialType' | 'accessoryType'>(
    rule?.if.moduleType ? 'moduleType' : 
    rule?.if.dimension ? 'dimension' : 
    rule?.if.materialType ? 'materialType' : 'moduleType'
  );
  const [moduleType, setModuleType] = useState<ModuleType | ''>(rule?.if.moduleType || '');
  const [suggestionType, setSuggestionType] = useState<'accessory' | 'material' | 'processing'>(
    rule?.then.suggest.accessory ? 'accessory' : 
    rule?.then.suggest.material ? 'material' : 'accessory'
  );
  const [accessoryType, setAccessoryType] = useState<AccessoryType | ''>(
    rule?.then.suggest.accessory?.type || ''
  );
  const [materialType, setMaterialType] = useState<MaterialType | ''>(
    rule?.then.suggest.material?.type || ''
  );
  const [processingType, setProcessingType] = useState<ProcessingType | ''>(
    rule?.then.suggest.processing?.type || ''
  );
  const [warning, setWarning] = useState(rule?.then.warning || '');
  const [isEnabled, setIsEnabled] = useState(rule?.enabled !== false);
  
  const moduleTypes: ModuleType[] = [
    'base_cabinet',
    'wall_cabinet',
    'tall_cabinet',
    'drawer_unit',
    'corner_cabinet',
    'shelf_unit',
    'island',
    'other'
  ];
  
  const accessoryTypes: AccessoryType[] = [
    'hinge',
    'slide',
    'handle',
    'foot',
    'profile',
    'push_system',
    'shelf_support',
    'other'
  ];
  
  const materialTypes: MaterialType[] = [
    'PAL',
    'MDF',
    'MDF-AGT',
    'PFL',
    'GLASS',
    'COUNTERTOP'
  ];
  
  const processingTypes: ProcessingType[] = [
    'cnc_classic',
    'cnc_rifled',
    'glass_cut',
    'glass_sandblast',
    'glass_drill',
    'glass_cnc',
    'edge_banding',
    'painting',
    'other'
  ];
  
  const handleSave = () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Rule name is required",
        variant: "destructive",
      });
      return;
    }
    
    // Build condition (if) part of the rule
    const ifCondition: any = {};
    if (conditionType === 'moduleType' && moduleType) {
      ifCondition.moduleType = moduleType;
    } else if (conditionType === 'materialType' && materialType) {
      ifCondition.materialType = materialType;
    } else if (conditionType === 'accessoryType' && accessoryType) {
      ifCondition.accessoryType = accessoryType;
    }
    
    // Build suggestion (then) part of the rule
    const suggest: any = {};
    if (suggestionType === 'accessory' && accessoryType) {
      suggest.accessory = { type: accessoryType };
    } else if (suggestionType === 'material' && materialType) {
      suggest.material = { type: materialType };
    } else if (suggestionType === 'processing' && processingType) {
      suggest.processing = { type: processingType };
    }
    
    // Create the rule object
    const newRule: ComboRule = {
      id: rule?.id || `rule-${Date.now()}`,
      name,
      description,
      if: ifCondition,
      then: {
        suggest,
        ...(warning ? { warning } : {})
      },
      enabled: isEnabled
    };
    
    onSave(newRule);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">
            {rule ? 'Edit Combo Rule' : 'Add New Combo Rule'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-700 border-gray-600"
              placeholder="e.g. Drawer Slides Rule"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="rule-description">Description</Label>
            <Input
              id="rule-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-700 border-gray-600"
              placeholder="e.g. Automatically add slides to drawer units"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Condition Type</Label>
            <Select 
              value={conditionType} 
              onValueChange={(value: any) => setConditionType(value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select condition type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="moduleType">Module Type</SelectItem>
                <SelectItem value="dimension">Dimension</SelectItem>
                <SelectItem value="materialType">Material Type</SelectItem>
                <SelectItem value="accessoryType">Accessory Type</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {conditionType === 'moduleType' && (
            <div className="grid gap-2">
              <Label>Module Type</Label>
              <Select 
                value={moduleType} 
                onValueChange={(value: ModuleType) => setModuleType(value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select module type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {moduleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label>Suggestion Type</Label>
            <Select 
              value={suggestionType} 
              onValueChange={(value: any) => setSuggestionType(value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select suggestion type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="accessory">Add Accessory</SelectItem>
                <SelectItem value="material">Suggest Material</SelectItem>
                <SelectItem value="processing">Add Processing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {suggestionType === 'accessory' && (
            <div className="grid gap-2">
              <Label>Accessory Type</Label>
              <Select 
                value={accessoryType} 
                onValueChange={(value: AccessoryType) => setAccessoryType(value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select accessory type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {accessoryTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {suggestionType === 'material' && (
            <div className="grid gap-2">
              <Label>Material Type</Label>
              <Select 
                value={materialType} 
                onValueChange={(value: MaterialType) => setMaterialType(value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {suggestionType === 'processing' && (
            <div className="grid gap-2">
              <Label>Processing Type</Label>
              <Select 
                value={processingType} 
                onValueChange={(value: ProcessingType) => setProcessingType(value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select processing type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {processingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="rule-warning">Warning (Optional)</Label>
            <Input
              id="rule-warning"
              value={warning}
              onChange={(e) => setWarning(e.target.value)}
              className="bg-gray-700 border-gray-600"
              placeholder="e.g. This material can only be used with certain processes"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Rule Enabled</Label>
            <Switch 
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {rule ? 'Update Rule' : 'Create Rule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
