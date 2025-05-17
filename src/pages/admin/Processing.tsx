
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
import { MaterialType, ProcessingType, ComboRule } from '@/types';
import { ComboRulesEditor } from '@/components/processing/ComboRulesEditor';
import { comboRules } from '@/services/comboRulesService';

interface ProcessingOption {
  id: string;
  name: string;
  type: ProcessingType;
  pricePerUnit: number;
  unit: string;
  compatibleMaterials: MaterialType[];
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

  const [managedComboRules, setManagedComboRules] = useState<ComboRule[]>(comboRules);

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
    setManagedComboRules(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Combo Rule Deleted",
      description: "The combo rule has been removed successfully.",
    });
  };

  const handleToggleRule = (id: string) => {
    setManagedComboRules(prev => prev.map(rule => {
      if (rule.id === id) {
        const newEnabled = !rule.enabled;
        toast({
          title: newEnabled ? "Rule Enabled" : "Rule Disabled",
          description: `"${rule.name}" has been ${newEnabled ? 'enabled' : 'disabled'}.`,
        });
        return { ...rule, enabled: newEnabled };
      }
      return rule;
    }));
  };

  const handleSaveProcessing = (processing: ProcessingOption) => {
    if (editingProcessing) {
      // Update existing processing option
      setProcessingOptions(prev => prev.map(p => 
        p.id === editingProcessing.id ? processing : p
      ));
      toast({
        title: "Processing Option Updated",
        description: `${processing.name} has been updated successfully.`,
      });
    } else {
      // Add new processing option
      setProcessingOptions(prev => [...prev, { ...processing, id: `${Date.now()}` }]);
      toast({
        title: "Processing Option Added",
        description: `${processing.name} has been added successfully.`,
      });
    }
    setIsAddProcessingOpen(false);
  };

  const handleSaveRule = (rule: ComboRule) => {
    if (editingRule) {
      // Update existing rule
      setManagedComboRules(prev => prev.map(r => 
        r.id === editingRule.id ? rule : r
      ));
    } else {
      // Add new rule
      setManagedComboRules(prev => [...prev, rule]);
    }
    setIsAddRuleOpen(false);
    toast({
      title: editingRule ? "Rule Updated" : "Rule Added",
      description: `${rule.name} has been ${editingRule ? 'updated' : 'added'} successfully.`,
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

  const filteredComboRules = managedComboRules.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
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
                      <TableHead className="text-gray-400">Description</TableHead>
                      <TableHead className="text-gray-400 text-center">Status</TableHead>
                      <TableHead className="text-gray-400 text-right">Controls</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComboRules.map((rule) => (
                      <TableRow key={rule.id} className="border-gray-700 hover:bg-gray-700">
                        <TableCell className="font-medium text-gray-300">
                          {rule.name}
                        </TableCell>
                        <TableCell className="text-gray-300">{rule.description}</TableCell>
                        <TableCell className="text-center">
                          <Switch 
                            checked={rule.enabled !== false} 
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

      {/* ComboRulesEditor Dialog */}
      <ComboRulesEditor 
        rule={editingRule || undefined}
        isOpen={isAddRuleOpen}
        onClose={() => setIsAddRuleOpen(false)}
        onSave={handleSaveRule}
      />
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
