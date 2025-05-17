
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Upload, Download, Edit, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Materials = () => {
  const [materialType, setMaterialType] = useState('PAL');

  // Sample materials data
  const materials = [
    { id: '1', code: 'PAL-W980-ST2-18', name: 'Alb W980 ST2', manufacturer: 'Egger', type: 'PAL', thickness: 18, pricePerSqm: 38.50, availability: true },
    { id: '2', code: 'PAL-H1334-ST9-18', name: 'Light Oak', manufacturer: 'Egger', type: 'PAL', thickness: 18, pricePerSqm: 42.30, availability: true },
    { id: '3', code: 'PAL-U702-ST9-18', name: 'Cashmere Grey', manufacturer: 'Egger', type: 'PAL', thickness: 18, pricePerSqm: 39.80, availability: true },
    { id: '4', code: 'PAL-H3170-ST12-18', name: 'Natural Kendal Oak', manufacturer: 'Egger', type: 'PAL', thickness: 18, pricePerSqm: 45.20, availability: false },
    { id: '5', code: 'PAL-F812-ST9-18', name: 'White Levanto Marble', manufacturer: 'Egger', type: 'PAL', thickness: 18, pricePerSqm: 48.90, availability: true },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">Materials Database</h1>
            <p className="text-gray-300">Manage all materials in the system</p>
          </div>
          <div className="flex flex-wrap w-full lg:w-auto gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search materials..."
                className="w-full pl-9 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Material
            </Button>
          </div>
        </div>

        <Tabs defaultValue="pal" onValueChange={(value) => setMaterialType(value.toUpperCase())}>
          <TabsList className="mb-6 bg-gray-800">
            <TabsTrigger value="pal">PAL</TabsTrigger>
            <TabsTrigger value="mdf">MDF</TabsTrigger>
            <TabsTrigger value="mdf-agt">MDF-AGT</TabsTrigger>
            <TabsTrigger value="pfl">PFL</TabsTrigger>
            <TabsTrigger value="glass">Glass</TabsTrigger>
            <TabsTrigger value="countertop">Countertops</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pal">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">PAL Materials</CardTitle>
                <CardDescription className="text-gray-400">
                  PAL materials from Egger and other suppliers. Total: {materials.length} entries
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 hover:bg-gray-800">
                        <TableHead className="text-gray-400">Code</TableHead>
                        <TableHead className="text-gray-400">Name</TableHead>
                        <TableHead className="text-gray-400">Manufacturer</TableHead>
                        <TableHead className="text-gray-400">Thickness (mm)</TableHead>
                        <TableHead className="text-gray-400">Price/m²</TableHead>
                        <TableHead className="text-gray-400">Availability</TableHead>
                        <TableHead className="text-gray-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materials.map((material) => (
                        <TableRow key={material.id} className="border-gray-700 hover:bg-gray-700">
                          <TableCell className="font-medium text-gray-300">{material.code}</TableCell>
                          <TableCell className="text-white">{material.name}</TableCell>
                          <TableCell className="text-gray-300">{material.manufacturer}</TableCell>
                          <TableCell className="text-gray-300">{material.thickness}</TableCell>
                          <TableCell className="text-gray-300">€{material.pricePerSqm.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              material.availability ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                            }`}>
                              {material.availability ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4 text-gray-400" />
                              </Button>
                              <Button variant="ghost" size="icon">
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
          </TabsContent>
          
          {['mdf', 'mdf-agt', 'pfl', 'glass', 'countertop'].map((type) => (
            <TabsContent key={type} value={type}>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="flex items-center justify-center p-12 text-center">
                  <p className="text-gray-400">{type.toUpperCase()} materials will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Materials;
