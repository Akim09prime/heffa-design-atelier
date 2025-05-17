
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Materials = () => {
  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium">Materials</h1>
            <p className="text-muted-foreground">Browse and select materials for your projects</p>
          </div>
          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search materials..."
                className="w-full pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>Add Material</Button>
          </div>
        </div>

        <Tabs defaultValue="pal">
          <TabsList className="mb-6">
            <TabsTrigger value="pal">PAL</TabsTrigger>
            <TabsTrigger value="mdf">MDF</TabsTrigger>
            <TabsTrigger value="mdf-agt">MDF-AGT</TabsTrigger>
            <TabsTrigger value="pfl">PFL</TabsTrigger>
            <TabsTrigger value="glass">Glass</TabsTrigger>
            <TabsTrigger value="countertops">Countertops</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pal">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100"></div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">PAL-{i+1000}</h3>
                    <p className="text-sm text-muted-foreground">Egger White {i+1}</p>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm font-medium">€32.50/m²</p>
                      <p className="text-xs text-muted-foreground">18mm</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="mdf">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>MDF materials will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mdf-agt">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>MDF-AGT materials will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pfl">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>PFL materials will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="glass">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>Glass materials will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="countertops">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>Countertop materials will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesignerLayout>
  );
};

export default Materials;
