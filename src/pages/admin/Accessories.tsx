
import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Upload, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Accessories = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">Accessories Database</h1>
            <p className="text-gray-300">Manage all furniture accessories</p>
          </div>
          <div className="flex flex-wrap w-full lg:w-auto gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search accessories..."
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
              Add Accessory
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hinges">
          <TabsList className="mb-6 bg-gray-800">
            <TabsTrigger value="hinges">Hinges</TabsTrigger>
            <TabsTrigger value="slides">Slides</TabsTrigger>
            <TabsTrigger value="handles">Handles</TabsTrigger>
            <TabsTrigger value="feet">Feet</TabsTrigger>
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="push">Push Systems</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hinges">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">Hinges</CardTitle>
                <CardDescription className="text-gray-400">
                  Cabinet and door hinges from Blum, Hafele and GTV
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="bg-gray-700 border-gray-600 overflow-hidden">
                      <div className="aspect-square bg-gray-600 flex items-center justify-center text-gray-500">
                        [Hinge Image]
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-white">BL-HG-CLIPTOP-{110 + (i * 5)}</h3>
                        <p className="text-sm text-gray-300 mb-2">Blum ClipTop</p>
                        <div className="flex justify-between">
                          <span className="text-gray-300">{110 + (i * 5)}°</span>
                          <span className="font-medium text-white">€{(13 + i).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            i % 3 === 0 ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'
                          }`}>
                            {i % 3 === 0 ? 'Low Stock' : 'In Stock'}
                          </span>
                          <Button variant="ghost" size="sm" className="h-6">Edit</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {['slides', 'handles', 'feet', 'profiles', 'push'].map((type) => (
            <TabsContent key={type} value={type}>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="flex items-center justify-center p-12 text-center">
                  <p className="text-gray-400">{type.charAt(0).toUpperCase() + type.slice(1)} will be displayed here</p>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Accessories;
