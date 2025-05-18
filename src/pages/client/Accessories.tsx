
import React, { useState, useEffect } from 'react';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Filter, Heart, ShoppingCart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccessoryType, AccessoryItem } from '@/types';
import { AccessoryService } from '@/services/accessoryService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";

const Accessories = () => {
  const { toast } = useToast();
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AccessoryType>('hinge');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterManufacturer, setFilterManufacturer] = useState<string>('all');
  const [selectedAccessory, setSelectedAccessory] = useState<AccessoryItem | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [favoriteAccessories, setFavoriteAccessories] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        setLoading(true);
        const data = await AccessoryService.getAllAccessories();
        setAccessories(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching accessories:', err);
        setError('Failed to fetch accessories. Please try again later.');
        toast({
          title: "Error",
          description: "Failed to load accessories data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccessories();
  }, [toast]);

  // Filter accessories based on active tab, search query, and manufacturer filter
  const filteredAccessories = accessories.filter(accessory => {
    const matchesTab = accessory.type === activeTab;
    const matchesSearch = searchQuery === '' || 
      accessory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accessory.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesManufacturer = filterManufacturer === 'all' || 
      accessory.manufacturer === filterManufacturer;
    
    return matchesTab && matchesSearch && matchesManufacturer;
  });

  const manufacturers = Array.from(new Set(accessories.map(a => a.manufacturer)));

  const accessoryTypeLabels: Record<AccessoryType, string> = {
    hinge: 'Hinges',
    slide: 'Slides',
    handle: 'Handles',
    foot: 'Feet',
    profile: 'Profiles',
    push_system: 'Push Systems',
    shelf_support: 'Shelf Supports',
    other: 'Other'
  };

  const handleShowDetails = (accessory: AccessoryItem) => {
    setSelectedAccessory(accessory);
    setIsDetailsDialogOpen(true);
  };

  const toggleFavorite = (accessoryId: string) => {
    if (favoriteAccessories.includes(accessoryId)) {
      setFavoriteAccessories(favoriteAccessories.filter(id => id !== accessoryId));
      toast({
        title: "Removed from favorites",
        description: "The accessory has been removed from your favorites",
      });
    } else {
      setFavoriteAccessories([...favoriteAccessories, accessoryId]);
      toast({
        title: "Added to favorites",
        description: "The accessory has been added to your favorites",
      });
    }
  };

  const addToCart = (accessoryId: string) => {
    if (!cartItems.includes(accessoryId)) {
      setCartItems([...cartItems, accessoryId]);
      toast({
        title: "Added to cart",
        description: "The accessory has been added to your cart",
      });
    } else {
      toast({
        title: "Already in cart",
        description: "This accessory is already in your cart",
      });
    }
  };

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium mb-2">Accessories Catalog</h1>
            <p className="text-gray-500">Browse and select accessories for your furniture projects</p>
          </div>
          <div className="flex flex-wrap w-full lg:w-auto gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search accessories..."
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterManufacturer} onValueChange={setFilterManufacturer}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <span>{filterManufacturer === 'all' ? 'All Manufacturers' : filterManufacturer}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Manufacturers</SelectItem>
                {manufacturers.map(manufacturer => (
                  <SelectItem key={manufacturer} value={manufacturer}>{manufacturer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => toast({ title: "Cart", description: `${cartItems.length} items in your cart` })}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({cartItems.length})
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AccessoryType)}>
          <TabsList className="mb-6">
            {Object.entries(accessoryTypeLabels).map(([value, label]) => (
              <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
            ))}
          </TabsList>
          
          {Object.keys(accessoryTypeLabels).map(tabValue => {
            const accessoryType = tabValue as AccessoryType;
            const label = accessoryTypeLabels[accessoryType];
            
            return (
              <TabsContent key={accessoryType} value={accessoryType}>
                <Card>
                  <CardHeader>
                    <CardTitle>{label}</CardTitle>
                    <CardDescription>
                      {accessoryType === 'hinge' && 'Cabinet and door hinges from Blum, Hafele and GTV'}
                      {accessoryType === 'slide' && 'Drawer slides and systems from premium manufacturers'}
                      {accessoryType === 'handle' && 'Cabinet and drawer handles in various styles'}
                      {accessoryType === 'foot' && 'Adjustable cabinet feet and supports'}
                      {accessoryType === 'profile' && 'Aluminum profiles for glass doors and panels'}
                      {accessoryType === 'push_system' && 'Push-to-open systems for handleless designs'}
                      {accessoryType === 'shelf_support' && 'Shelf pins and support systems'}
                      {accessoryType === 'other' && 'Other cabinet accessories and hardware'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex justify-center py-8">
                        <p>Loading accessories...</p>
                      </div>
                    ) : error ? (
                      <div className="flex justify-center py-8">
                        <p className="text-red-500">{error}</p>
                      </div>
                    ) : filteredAccessories.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-gray-500 mb-4">No {label.toLowerCase()} found matching your criteria</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredAccessories.map((accessory) => (
                          <Card key={accessory.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div 
                              className="aspect-square bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
                              onClick={() => handleShowDetails(accessory)}
                            >
                              {accessory.imageUrl ? (
                                <img 
                                  src={accessory.imageUrl} 
                                  alt={accessory.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).onerror = null;
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                                  {accessory.type} Image
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-medium">{accessory.code}</h3>
                              <p className="text-sm text-gray-500 mb-2">{accessory.name}</p>
                              <div className="flex justify-between">
                                <span className="text-gray-600">{accessory.manufacturer}</span>
                                <span className="font-medium">€{accessory.price.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {accessoryType}
                                </Badge>
                              </div>
                            </CardContent>
                            <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={favoriteAccessories.includes(accessory.id) ? "text-red-500" : ""}
                                onClick={() => toggleFavorite(accessory.id)}
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => addToCart(accessory.id)}
                                disabled={cartItems.includes(accessory.id)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                {cartItems.includes(accessory.id) ? 'Added' : 'Add to Cart'}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>

      {/* Accessory Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedAccessory && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAccessory.name}</DialogTitle>
                <DialogDescription>
                  Product details and specifications
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-500">
                  {selectedAccessory.imageUrl ? (
                    <img 
                      src={selectedAccessory.imageUrl} 
                      alt={selectedAccessory.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=No+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                      {selectedAccessory.type} Image
                    </div>
                  )}
                </div>
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="col-span-1 text-gray-500">Code</div>
                    <div className="col-span-2 font-medium">{selectedAccessory.code}</div>
                    
                    <div className="col-span-1 text-gray-500">Type</div>
                    <div className="col-span-2">{selectedAccessory.type}</div>
                    
                    <div className="col-span-1 text-gray-500">Manufacturer</div>
                    <div className="col-span-2">{selectedAccessory.manufacturer}</div>
                    
                    <div className="col-span-1 text-gray-500">Price</div>
                    <div className="col-span-2 font-medium">€{selectedAccessory.price.toFixed(2)}</div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Compatible With</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedAccessory.compatibility.map(moduleType => (
                        <Badge key={moduleType} variant="outline">
                          {moduleType.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {Object.keys(selectedAccessory.properties || {}).length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Properties</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedAccessory.properties || {}).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end gap-2">
                    {selectedAccessory.pdfUrl && (
                      <Button variant="outline" onClick={() => window.open(selectedAccessory.pdfUrl)}>
                        Download Specification
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        addToCart(selectedAccessory.id);
                        setIsDetailsDialogOpen(false);
                      }}
                      disabled={cartItems.includes(selectedAccessory.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {cartItems.includes(selectedAccessory.id) ? 'Already in Cart' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
};

export default Accessories;
