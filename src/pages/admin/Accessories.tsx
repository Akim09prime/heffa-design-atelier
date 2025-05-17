
import React, { useState, useRef } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Upload, Download, Edit, Trash, X, Check, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AccessoryType, ModuleType } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';

interface Accessory {
  id: string;
  code: string;
  name: string;
  type: AccessoryType;
  manufacturer: string;
  price: number;
  stockQty: number;
  imageUrl?: string;
  compatibility: ModuleType[];
}

const Accessories = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AccessoryType>('hinge');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  
  // Sample data for accessories
  const [accessories, setAccessories] = useState<Accessory[]>([
    {
      id: '1',
      code: 'BL-HG-110',
      name: 'Blum ClipTop 110°',
      type: 'hinge',
      manufacturer: 'Blum',
      price: 13.50,
      stockQty: 125,
      compatibility: ['base_cabinet', 'wall_cabinet', 'tall_cabinet']
    },
    {
      id: '2',
      code: 'BL-HG-170',
      name: 'Blum ClipTop 170°',
      type: 'hinge',
      manufacturer: 'Blum',
      price: 17.90,
      stockQty: 54,
      compatibility: ['base_cabinet', 'wall_cabinet', 'tall_cabinet']
    },
    {
      id: '3',
      code: 'HF-SL-450',
      name: 'Hafele Drawer Slide 450mm',
      type: 'slide',
      manufacturer: 'Hafele',
      price: 24.50,
      stockQty: 78,
      compatibility: ['drawer_unit', 'base_cabinet']
    },
    {
      id: '4',
      code: 'BL-TDM-500',
      name: 'Blum Tandembox 500mm',
      type: 'slide',
      manufacturer: 'Blum',
      price: 35.90,
      stockQty: 42,
      compatibility: ['drawer_unit', 'base_cabinet']
    },
    {
      id: '5',
      code: 'HF-HDL-128',
      name: 'Hafele Handle 128mm',
      type: 'handle',
      manufacturer: 'Hafele',
      price: 8.25,
      stockQty: 210,
      compatibility: ['base_cabinet', 'wall_cabinet', 'drawer_unit']
    },
    {
      id: '6',
      code: 'BL-PS-TIP',
      name: 'Blum Tip-On Push System',
      type: 'push_system',
      manufacturer: 'Blum',
      price: 12.75,
      stockQty: 95,
      compatibility: ['base_cabinet', 'wall_cabinet', 'drawer_unit']
    },
    {
      id: '7',
      code: 'HF-FT-ADJ',
      name: 'Hafele Adjustable Cabinet Foot',
      type: 'foot',
      manufacturer: 'Hafele',
      price: 3.50,
      stockQty: 320,
      compatibility: ['base_cabinet', 'tall_cabinet']
    },
  ]);
  
  // Filter accessories based on active tab and search query
  const filteredAccessories = accessories.filter(accessory =>
    accessory.type === activeTab && 
    (searchQuery === '' || 
     accessory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     accessory.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
     accessory.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleAddAccessory = () => {
    setEditingAccessory(null);
    setIsAddDialogOpen(true);
  };
  
  const handleEditAccessory = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteAccessory = (id: string) => {
    setAccessories(prev => prev.filter(acc => acc.id !== id));
    toast({
      title: t("accessories.accessoryDeleted"),
      description: t("accessories.accessoryDeletedSuccess")
    });
  };
  
  const handleSaveAccessory = (accessory: Accessory) => {
    if (editingAccessory) {
      // Update existing accessory
      setAccessories(prev => 
        prev.map(acc => acc.id === editingAccessory.id ? accessory : acc)
      );
      toast({
        title: t("accessories.accessoryUpdated"),
        description: `${accessory.name} ${t("accessories.hasBeenUpdated")}`
      });
      setIsEditDialogOpen(false);
    } else {
      // Add new accessory
      setAccessories(prev => [...prev, { ...accessory, id: `${Date.now()}`, type: activeTab }]);
      toast({
        title: t("accessories.accessoryAdded"),
        description: `${accessory.name} ${t("accessories.hasBeenAdded")}`
      });
      setIsAddDialogOpen(false);
    }
  };
  
  const handleImport = () => {
    toast({
      title: t("accessories.importStarted"),
      description: t("accessories.importFunctionality")
    });
  };
  
  const handleExport = () => {
    toast({
      title: t("accessories.exportStarted"),
      description: t("accessories.exportFunctionality")
    });
  };
  
  const accessoryTabs: { value: AccessoryType; label: string }[] = [
    { value: 'hinge', label: t('accessories.hinges') },
    { value: 'slide', label: t('accessories.slides') },
    { value: 'handle', label: t('accessories.handles') },
    { value: 'foot', label: t('accessories.feet') },
    { value: 'profile', label: t('accessories.profiles') },
    { value: 'push_system', label: t('accessories.pushSystems') },
    { value: 'shelf_support', label: t('accessories.shelfSupports') },
    { value: 'other', label: t('accessories.other') },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">{t('accessories.title')}</h1>
            <p className="text-gray-300">{t('accessories.description')}</p>
          </div>
          <div className="flex flex-wrap w-full lg:w-auto gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('accessories.searchPlaceholder')}
                className="w-full pl-9 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              {t('common.import')}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              {t('common.export')}
            </Button>
            <Button onClick={handleAddAccessory}>
              <Plus className="h-4 w-4 mr-2" />
              {t('accessories.addAccessory')}
            </Button>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as AccessoryType)}
        >
          <TabsList className="mb-6 bg-gray-800">
            {accessoryTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {accessoryTabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-white">{tab.label}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {tab.value === 'hinge' && t('accessories.hingesDesc')}
                    {tab.value === 'slide' && t('accessories.slidesDesc')}
                    {tab.value === 'handle' && t('accessories.handlesDesc')}
                    {tab.value === 'foot' && t('accessories.feetDesc')}
                    {tab.value === 'profile' && t('accessories.profilesDesc')}
                    {tab.value === 'push_system' && t('accessories.pushSystemsDesc')}
                    {tab.value === 'shelf_support' && t('accessories.shelfSupportsDesc')}
                    {tab.value === 'other' && t('accessories.otherDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {filteredAccessories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <p className="text-gray-400 mb-4">{t('accessories.noAccessoriesFound')}</p>
                      <Button onClick={handleAddAccessory}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t('common.add')} {tab.label}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredAccessories.map((accessory) => (
                        <Card key={accessory.id} className="bg-gray-700 border-gray-600 overflow-hidden">
                          <div className="aspect-square bg-gray-600 flex items-center justify-center text-gray-500 relative">
                            {accessory.imageUrl ? (
                              <img 
                                src={accessory.imageUrl} 
                                alt={accessory.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full w-full">
                                <Image className="h-12 w-12 text-gray-400 opacity-50" />
                                <span className="mt-2 text-xs text-gray-400">
                                  {t('accessories.noImage')}
                                </span>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium text-white">{accessory.code}</h3>
                            <p className="text-sm text-gray-300 mb-2">{accessory.name}</p>
                            <div className="flex justify-between">
                              <span className="text-gray-300">{accessory.manufacturer}</span>
                              <span className="font-medium text-white">€{accessory.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mt-2">
                              <Badge className={
                                accessory.stockQty < 50 
                                  ? "bg-red-900/30 text-red-400 hover:bg-red-900/40" 
                                  : "bg-green-900/30 text-green-400 hover:bg-green-900/40"
                              }>
                                {accessory.stockQty < 50 ? t('common.lowStock') : t('common.inStock')} ({accessory.stockQty})
                              </Badge>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2"
                                  onClick={() => handleEditAccessory(accessory)}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2"
                                  onClick={() => handleDeleteAccessory(accessory.id)}
                                >
                                  <Trash className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Add Accessory Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('accessories.addNewAccessory')}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {t('accessories.fillDetails')}
            </DialogDescription>
          </DialogHeader>
          
          <AccessoryForm 
            accessoryType={activeTab}
            onSave={handleSaveAccessory}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Accessory Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('accessories.editAccessory')}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {t('accessories.updateDetails')}
            </DialogDescription>
          </DialogHeader>
          
          {editingAccessory && (
            <AccessoryForm 
              accessory={editingAccessory}
              accessoryType={editingAccessory.type}
              onSave={handleSaveAccessory}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

interface AccessoryFormProps {
  accessory?: Accessory;
  accessoryType: AccessoryType;
  onSave: (accessory: Accessory) => void;
  onCancel: () => void;
}

const AccessoryForm: React.FC<AccessoryFormProps> = ({
  accessory,
  accessoryType,
  onSave,
  onCancel
}) => {
  const { t } = useTranslation();
  const [code, setCode] = useState(accessory?.code || '');
  const [name, setName] = useState(accessory?.name || '');
  const [manufacturer, setManufacturer] = useState(accessory?.manufacturer || '');
  const [price, setPrice] = useState(accessory?.price?.toString() || '');
  const [stockQty, setStockQty] = useState(accessory?.stockQty?.toString() || '');
  const [selectedCompatibility, setSelectedCompatibility] = useState<ModuleType[]>(
    accessory?.compatibility || []
  );
  const [imageUrl, setImageUrl] = useState<string>(accessory?.imageUrl || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleCompatibilityToggle = (type: ModuleType) => {
    if (selectedCompatibility.includes(type)) {
      setSelectedCompatibility(prev => prev.filter(t => t !== type));
    } else {
      setSelectedCompatibility(prev => [...prev, type]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = () => {
    if (!code || !name || !manufacturer || !price || !stockQty) {
      return; // Form validation would go here
    }
    
    const newAccessory: Accessory = {
      id: accessory?.id || `${Date.now()}`,
      code,
      name,
      type: accessoryType,
      manufacturer,
      price: parseFloat(price),
      stockQty: parseInt(stockQty),
      imageUrl: imageUrl,
      compatibility: selectedCompatibility.length ? selectedCompatibility : ['base_cabinet'],
    };
    
    onSave(newAccessory);
  };
  
  const getModuleTypeName = (type: ModuleType): string => {
    switch(type) {
      case 'base_cabinet': return t('accessories.moduleTypes.baseUnit');
      case 'wall_cabinet': return t('accessories.moduleTypes.wallUnit');
      case 'tall_cabinet': return t('accessories.moduleTypes.tallUnit');
      case 'drawer_unit': return t('accessories.moduleTypes.drawerUnit');
      case 'corner_cabinet': return t('accessories.moduleTypes.cornerUnit');
      case 'shelf_unit': return t('accessories.moduleTypes.shelfUnit');
      case 'island': return t('accessories.moduleTypes.island');
      case 'other': return t('accessories.moduleTypes.other');
      default: return type.replace('_', ' ');
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="code" className="text-right text-white">{t('accessories.form.code')}</Label>
        <Input
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="col-span-3 bg-gray-700 border-gray-600 text-white"
          placeholder="ex: BL-HG-110"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right text-white">{t('accessories.form.name')}</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3 bg-gray-700 border-gray-600 text-white"
          placeholder="ex: Blum ClipTop 110°"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="manufacturer" className="text-right text-white">{t('accessories.form.manufacturer')}</Label>
        <Select 
          value={manufacturer} 
          onValueChange={setManufacturer}
        >
          <SelectTrigger id="manufacturer" className="col-span-3 bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder={t('accessories.form.selectManufacturer')} />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600 text-white">
            <SelectItem value="Blum">Blum</SelectItem>
            <SelectItem value="Hafele">Hafele</SelectItem>
            <SelectItem value="GTV">GTV</SelectItem>
            <SelectItem value="Hettich">Hettich</SelectItem>
            <SelectItem value="Grass">Grass</SelectItem>
            <SelectItem value="Other">{t('accessories.form.other')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right text-white">{t('accessories.form.price')}</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="col-span-3 bg-gray-700 border-gray-600 text-white"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="stockQty" className="text-right text-white">{t('accessories.form.stockQty')}</Label>
        <Input
          id="stockQty"
          type="number"
          value={stockQty}
          onChange={(e) => setStockQty(e.target.value)}
          className="col-span-3 bg-gray-700 border-gray-600 text-white"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label className="text-right pt-2 text-white">{t('accessories.form.compatibility')}</Label>
        <div className="col-span-3 grid grid-cols-2 gap-2">
          {moduleTypes.map(type => (
            <div key={type} className="flex items-center">
              <button
                type="button"
                className={`flex items-center p-2 rounded-md text-sm ${
                  selectedCompatibility.includes(type)
                    ? 'bg-blue-900/40 text-blue-300'
                    : 'bg-gray-700 text-gray-400'
                }`}
                onClick={() => handleCompatibilityToggle(type)}
              >
                {selectedCompatibility.includes(type) ? (
                  <Check className="w-4 h-4 mr-2" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                {getModuleTypeName(type)}
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4 mt-2">
        <Label htmlFor="image" className="text-right text-white">{t('accessories.form.image')}</Label>
        <div className="col-span-3">
          <input
            ref={fileInputRef}
            id="image"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          {imageUrl ? (
            <div className="relative w-full h-40 mb-2">
              <img 
                src={imageUrl} 
                alt={t('accessories.form.preview')} 
                className="h-full w-full object-cover rounded-md"
              />
              <Button 
                variant="destructive" 
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
                onClick={() => {
                  setImageUrl('');
                  setImageFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              type="button" 
              variant="outline"
              className="w-full h-20 flex flex-col items-center justify-center bg-gray-700 border-gray-600 hover:bg-gray-600"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-6 w-6 mb-1" />
              <span className="text-sm">{t('accessories.form.uploadImage')}</span>
            </Button>
          )}
          
          <p className="text-xs text-gray-400 mt-1">{t('accessories.form.imageNote')}</p>
        </div>
      </div>
      
      <DialogFooter className="mt-4">
        <Button variant="outline" onClick={onCancel} className="bg-gray-700 text-white border-gray-600">
          {t('common.cancel')}
        </Button>
        <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
          {accessory ? t('accessories.form.update') : t('accessories.form.add')}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default Accessories;
