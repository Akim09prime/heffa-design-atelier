
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Save, Edit, Trash, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { MaterialType, ProcessingType } from '@/types';

interface ProcessingOption {
  id: string;
  name: string;
  type: ProcessingType;
  pricePerUnit: number;
  unit: string;
  compatibleMaterials: MaterialType[];
}

interface ComboRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  enabled: boolean;
}

const Processing = () => {
  const { toast } = useToast();
  const [processingOptions, setProcessingOptions] = useState<ProcessingOption[]>([
    { id: '1', name: 'CNC Classic', type: 'cnc_classic', pricePerUnit: 60, unit: 'm²', compatibleMaterials: ['MDF'] },
    { id: '2', name: 'CNC Rifled', type: 'cnc_rifled', pricePerUnit: 68, unit: 'm²', compatibleMaterials: ['MDF'] },
    { id: '3', name: 'Glass Cutting', type: 'glass_cut', pricePerUnit: 0, unit: 'pcs', compatibleMaterials: ['GLASS'] },
    { id: '4', name: 'Glass Sandblasting', type: 'glass_sandblast', pricePerUnit: 18, unit: 'm²', compatibleMaterials: ['GLASS'] },
    { id: '5', name: 'Glass Drilling', type: 'glass_drill', pricePerUnit: 5, unit: 'pcs', compatibleMaterials: ['GLASS'] },
    { id: '6', name: 'Edge Banding', type: 'edge_banding', pricePerUnit: 3.5, unit: 'ml', compatibleMaterials: ['PAL', 'MDF-AGT'] },
    { id: '7', name: 'Painting', type: 'painting', pricePerUnit: 40, unit: 'm²', compatibleMaterials: ['MDF'] },
  ]);

  const [comboRules, setComboRules] = useState<ComboRule[]>([
    { 
      id: '1', 
      name: 'Drawer Slides', 
      description: 'Add slides to drawer units',
      condition: 'Module type is drawer_unit',
      action: 'Add slide accessory',
      enabled: true
    },
    { 
      id: '2', 
      name: 'Push System', 
      description: 'Add push system when no handle selected',
      condition: 'No handle accessory and door width > 300mm',
      action: 'Add push system accessory',
      enabled: true
    },
    { 
      id: '3', 
      name: 'Cabinet Feet', 
      description: 'Add feet to base cabinets',
      condition: 'Module type is base_cabinet',
      action: 'Add 4 adjustable feet',
      enabled: true
    },
    { 
      id: '4', 
      name: 'Glass Profile', 
      description: 'Add aluminum profile for glass doors',
      condition: 'Door material is GLASS',
      action: 'Add aluminum profile',
      enabled: true
    },
    { 
      id: '5', 
      name: 'Painting Restriction', 
      description: 'Block painting for non-MDF materials',
      condition: 'Material type is not MDF',
      action: 'Block painting processing',
      enabled: true
    },
  ]);

  const [isAddProcessingOpen, setIsAddProcessingOpen] = useState(false);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [editingProcessing, setEditingProcessing] = useState<ProcessingOption | null>(null);
  const [editingRule, setEditingRule] = useState<ComboRule | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddProcessing = () => {
    setEditingProcessing(null);
    setIsAddProcessingOpen(true);
  };

  const handleEditProcessing = (processing: ProcessingOption) => {
    setEditingProcessing(processing);
    setIsAddProcessingOpen(true);
  };

  const handleDeleteProcessing = (id: string) => {
    setProcessingOptions(prev => prev.filter(p => p.id !== id));
    toast({
      title: "Processing Option Deleted",
      description: "The processing option has been removed successfully.",
    });
  };

  const handleAddRule = () => {
    setEditingRule(null);
    setIsAddRuleOpen(true);
  };

  const handleEditRule = (rule: ComboRule) => {
    setEditingRule(rule);
    setIsAddRuleOpen(true);
  };

  const handleDeleteRule = (id: string) => {
    setComboRules(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Combo Rule Deleted",
      description: "The combo rule has been removed successfully.",
    });
  };

  const handleToggleRule = (id: string) => {
    setComboRules(prev => prev.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
    
    const rule = comboRules.find(r => r.id === id);
    toast({
      title: rule?.enabled ? "Rule Disabled" : "Rule Enabled",
      description: `"${rule?.name}" has been ${rule?.enabled ? 'disabled' : 'enabled'}.`,
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Your processing options and rules have been updated.",
    });
  };

  const filteredProcessingOptions = processingOptions.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredComboRules = comboRules.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">Processing Rules</h1>
            <p className="text-gray-300">Configure material processing options and automation rules</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search rules..."
                className="w-full pl-9 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Processing Options */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Processing Options</CardTitle>
                  <CardDescription className="text-gray-400">
                    Material processing types and pricing
                  </CardDescription>
                </div>
                <Button onClick={handleAddProcessing}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Option
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800">
                      <TableHead className="text-gray-400">Name</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Price</TableHead>
                      <TableHead className="text-gray-400">Compatible Materials</TableHead>
                      <TableHead className="text-gray-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProcessingOptions.map((option) => (
                      <TableRow key={option.id} className="border-gray-700 hover:bg-gray-700">
                        <TableCell className="font-medium text-gray-300">{option.name}</TableCell>
                        <TableCell className="text-gray-300">{option.type}</TableCell>
                        <TableCell className="text-gray-300">€{option.pricePerUnit.toFixed(2)}/{option.unit}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {option.compatibleMaterials.map((material) => (
                              <span 
                                key={material} 
                                className="px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded-full text-xs"
                              >
                                {material}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditProcessing(option)}
                            >
                              <Edit className="h-4 w-4 text-gray-400" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteProcessing(option.id)}
                            >
                              <Trash className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Combo Rules */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Combo Rules</CardTitle>
                  <CardDescription className="text-gray-400">
                    Automatic rules for materials and accessories
                  </CardDescription>
                </div>
                <Button onClick={handleAddRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800">
                      <TableHead className="text-gray-400">Rule Name</TableHead>
                      <TableHead className="text-gray-400">Condition</TableHead>
                      <TableHead className="text-gray-400">Action</TableHead>
                      <TableHead className="text-gray-400 text-center">Status</TableHead>
                      <TableHead className="text-gray-400 text-right">Controls</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComboRules.map((rule) => (
                      <TableRow key={rule.id} className="border-gray-700 hover:bg-gray-700">
                        <TableCell className="font-medium text-gray-300">
                          {rule.name}
                          <div className="text-xs text-gray-400">{rule.description}</div>
                        </TableCell>
                        <TableCell className="text-gray-300">{rule.condition}</TableCell>
                        <TableCell className="text-gray-300">{rule.action}</TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={rule.enabled} 
                            onCheckedChange={() => handleToggleRule(rule.id)} 
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditRule(rule)}
                            >
                              <Edit className="h-4 w-4 text-gray-400" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteRule(rule.id)}
                            >
                              <Trash className="h-4 w-4 text-gray-400" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rule Conflicts Card */}
        <Card className="mt-6 bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
              Rule Conflicts
            </CardTitle>
            <CardDescription className="text-gray-400">
              Potential issues with current rule configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-900/30 rounded-md">
                <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-400" />
                <div>
                  <h3 className="font-medium text-yellow-400">Push System vs Handles</h3>
                  <p className="text-sm text-gray-300">
                    "Push System" rule may conflict with handle selections. Consider adding a condition to check if handles are already present.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-900/20 border border-yellow-900/30 rounded-md">
                <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-400" />
                <div>
                  <h3 className="font-medium text-yellow-400">Glass Processing Constraints</h3>
                  <p className="text-sm text-gray-300">
                    Glass materials are only compatible with glass-specific processing operations. Ensure validation is in place.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Processing Dialog */}
      <Dialog open={isAddProcessingOpen} onOpenChange={setIsAddProcessingOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProcessing ? 'Edit Processing Option' : 'Add Processing Option'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="processing-name" className="text-right">Name</Label>
              <Input
                id="processing-name"
                defaultValue={editingProcessing?.name}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="processing-type" className="text-right">Type</Label>
              <Input
                id="processing-type"
                defaultValue={editingProcessing?.type}
                className="col-span-3 bg-gray-700 border-gray-600"
                placeholder="e.g. cnc_classic, glass_cut"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="processing-price" className="text-right">Price</Label>
              <Input
                id="processing-price"
                type="number"
                defaultValue={editingProcessing?.pricePerUnit}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="processing-unit" className="text-right">Unit</Label>
              <Input
                id="processing-unit"
                defaultValue={editingProcessing?.unit}
                className="col-span-3 bg-gray-700 border-gray-600"
                placeholder="e.g. m², pcs, ml"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Compatible Materials</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {(['PAL', 'MDF', 'MDF-AGT', 'PFL', 'GLASS', 'COUNTERTOP'] as MaterialType[]).map(material => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`material-${material}`}
                      defaultChecked={editingProcessing?.compatibleMaterials.includes(material)}
                    />
                    <Label htmlFor={`material-${material}`}>{material}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setIsAddProcessingOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => {
              setIsAddProcessingOpen(false);
              toast({
                title: editingProcessing ? 'Processing Updated' : 'Processing Added',
                description: editingProcessing 
                  ? `${editingProcessing.name} has been updated` 
                  : 'New processing option has been added',
              });
            }}>
              {editingProcessing ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Rule Dialog */}
      <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingRule ? 'Edit Combo Rule' : 'Add Combo Rule'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rule-name" className="text-right">Name</Label>
              <Input
                id="rule-name"
                defaultValue={editingRule?.name}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rule-description" className="text-right">Description</Label>
              <Input
                id="rule-description"
                defaultValue={editingRule?.description}
                className="col-span-3 bg-gray-700 border-gray-600"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rule-condition" className="text-right">Condition</Label>
              <Input
                id="rule-condition"
                defaultValue={editingRule?.condition}
                className="col-span-3 bg-gray-700 border-gray-600"
                placeholder="e.g. Module type is drawer_unit"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rule-action" className="text-right">Action</Label>
              <Input
                id="rule-action"
                defaultValue={editingRule?.action}
                className="col-span-3 bg-gray-700 border-gray-600"
                placeholder="e.g. Add slide accessory"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Enabled</Label>
              <div className="flex items-center space-x-2">
                <Switch defaultChecked={editingRule?.enabled ?? true} />
                <Label>Rule is {editingRule?.enabled ?? true ? 'enabled' : 'disabled'}</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setIsAddRuleOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => {
              setIsAddRuleOpen(false);
              toast({
                title: editingRule ? 'Rule Updated' : 'Rule Added',
                description: editingRule 
                  ? `${editingRule.name} has been updated` 
                  : 'New combo rule has been added',
              });
            }}>
              {editingRule ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Processing;

const Checkbox = ({ id, defaultChecked }: { id: string; defaultChecked?: boolean }) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        defaultChecked={defaultChecked}
        className="h-4 w-4 text-blue-600 rounded bg-gray-700 border-gray-600"
      />
    </div>
  );
};
