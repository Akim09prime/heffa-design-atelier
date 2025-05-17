
import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Save, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Processing = () => {
  // Sample processing options data
  const processingOptions = [
    { id: '1', name: 'CNC Classic', type: 'cnc_classic', pricePerUnit: 60, unit: 'm²', compatibleMaterials: ['MDF'] },
    { id: '2', name: 'CNC Rifled', type: 'cnc_rifled', pricePerUnit: 68, unit: 'm²', compatibleMaterials: ['MDF'] },
    { id: '3', name: 'Glass Cutting', type: 'glass_cut', pricePerUnit: 0, unit: 'pcs', compatibleMaterials: ['GLASS'] },
    { id: '4', name: 'Glass Sandblasting', type: 'glass_sandblast', pricePerUnit: 18, unit: 'm²', compatibleMaterials: ['GLASS'] },
    { id: '5', name: 'Glass Drilling', type: 'glass_drill', pricePerUnit: 5, unit: 'pcs', compatibleMaterials: ['GLASS'] },
    { id: '6', name: 'Edge Banding', type: 'edge_banding', pricePerUnit: 3.5, unit: 'ml', compatibleMaterials: ['PAL', 'MDF-AGT'] },
    { id: '7', name: 'Painting', type: 'painting', pricePerUnit: 40, unit: 'm²', compatibleMaterials: ['MDF'] },
  ];

  // Sample combo rules data
  const comboRules = [
    { 
      id: '1', 
      name: 'Drawer Slides', 
      description: 'Add slides to drawer units',
      condition: 'Module type is drawer_unit',
      action: 'Add slide accessory'
    },
    { 
      id: '2', 
      name: 'Push System', 
      description: 'Add push system when no handle selected',
      condition: 'No handle accessory and door width > 300mm',
      action: 'Add push system accessory'
    },
    { 
      id: '3', 
      name: 'Cabinet Feet', 
      description: 'Add feet to base cabinets',
      condition: 'Module type is base_cabinet',
      action: 'Add 4 adjustable feet'
    },
    { 
      id: '4', 
      name: 'Glass Profile', 
      description: 'Add aluminum profile for glass doors',
      condition: 'Door material is GLASS',
      action: 'Add aluminum profile'
    },
    { 
      id: '5', 
      name: 'Painting Restriction', 
      description: 'Block painting for non-MDF materials',
      condition: 'Material type is not MDF',
      action: 'Block painting processing'
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">Processing Rules</h1>
            <p className="text-gray-300">Configure material processing options and automation rules</p>
          </div>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
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
                <Button>
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
                    {processingOptions.map((option) => (
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
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4 text-gray-400" />
                          </Button>
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
                <Button>
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
                      <TableHead className="text-gray-400 text-right">Controls</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comboRules.map((rule) => (
                      <TableRow key={rule.id} className="border-gray-700 hover:bg-gray-700">
                        <TableCell className="font-medium text-gray-300">
                          {rule.name}
                          <div className="text-xs text-gray-400">{rule.description}</div>
                        </TableCell>
                        <TableCell className="text-gray-300">{rule.condition}</TableCell>
                        <TableCell className="text-gray-300">{rule.action}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4 text-gray-400" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Processing;
