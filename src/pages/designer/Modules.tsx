
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Box } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Modules = () => {
  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium">Furniture Modules</h1>
            <p className="text-muted-foreground">Browse and select pre-configured furniture modules</p>
          </div>
          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search modules..."
                className="w-full pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Box className="h-4 w-4 mr-2" />
              New Module
            </Button>
          </div>
        </div>

        <Tabs defaultValue="base">
          <TabsList className="mb-6">
            <TabsTrigger value="base">Base Cabinets</TabsTrigger>
            <TabsTrigger value="wall">Wall Cabinets</TabsTrigger>
            <TabsTrigger value="tall">Tall Cabinets</TabsTrigger>
            <TabsTrigger value="drawer">Drawer Units</TabsTrigger>
            <TabsTrigger value="corner">Corner Cabinets</TabsTrigger>
            <TabsTrigger value="island">Islands</TabsTrigger>
          </TabsList>
          
          <TabsContent value="base">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-gray-100"></div>
                  <CardContent className="p-4">
                    <h3 className="font-medium">Base-{i+100}</h3>
                    <p className="text-sm text-muted-foreground">Standard base cabinet</p>
                    <div className="flex justify-between mt-2">
                      <p className="text-sm font-medium">€275.00</p>
                      <p className="text-xs text-muted-foreground">600×800×560mm</p>
                    </div>
                    <Button variant="outline" className="w-full mt-3">Configure</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="wall">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>Wall cabinets will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tall">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>Tall cabinets will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drawer">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>Drawer units will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="corner">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>Corner cabinets will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="island">
            <Card>
              <CardContent className="flex items-center justify-center p-12 text-center">
                <p>Island modules will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesignerLayout>
  );
};

export default Modules;
