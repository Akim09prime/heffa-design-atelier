
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Loader, UploadCloud, Download, Info, Plus, Settings, Save, Trash } from 'lucide-react';
import { ComboRulesService } from '@/services/comboRulesService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Componenta principală Settings
const Settings = () => {
  const { toast } = useToast();
  const { t, language, changeLanguage } = useTranslation();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [comboRules, setComboRules] = useState(ComboRulesService.comboRules);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  
  const setLoading = (key: string, loading: boolean) => {
    setIsLoading(prev => ({ ...prev, [key]: loading }));
  };
  
  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const handleLanguageChange = (value: string) => {
    changeLanguage(value as 'en' | 'ro');
    showSuccessToast(
      t('settings.languageChanged'),
      value === 'en' ? t('settings.languageSetTo.en') : t('settings.languageSetTo.ro')
    );
  };

  const handleSaveSettings = async () => {
    try {
      setLoading('save-settings', true);
      // Simulăm un apel API
      await new Promise(resolve => setTimeout(resolve, 800));
      showSuccessToast(t('settings.settingsSaved'), t('settings.changesSavedSuccess'));
    } finally {
      setLoading('save-settings', false);
    }
  };

  const handleRuleToggle = (id: string, enabled: boolean) => {
    const updatedRules = comboRules.map(rule => 
      rule.id === id ? { ...rule, enabled } : rule
    );
    setComboRules(updatedRules);
    ComboRulesService.updateComboRules(updatedRules);
    
    toast({
      title: enabled ? t('settings.ruleEnabled') : t('settings.ruleDisabled'),
      description: t('settings.ruleStatusChanged')
    });
  };

  const handleAddRule = () => {
    setEditingRule(null);
    setIsRuleDialogOpen(true);
  };

  const handleEditRule = (rule: any) => {
    setEditingRule(rule);
    setIsRuleDialogOpen(true);
  };

  const handleDeleteRule = (id: string) => {
    const updatedRules = comboRules.filter(rule => rule.id !== id);
    setComboRules(updatedRules);
    ComboRulesService.updateComboRules(updatedRules);
    
    toast({
      title: t('settings.ruleDeleted'),
      description: t('settings.ruleDeletedSuccess')
    });
  };

  const handleSaveRule = (formData: FormData) => {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const moduleType = formData.get('moduleType') as string;
    
    if (editingRule) {
      // Actualizam regula existentă
      const updatedRules = comboRules.map(rule => 
        rule.id === editingRule.id 
          ? { ...rule, name, description, if: { ...rule.if, moduleType } } 
          : rule
      );
      setComboRules(updatedRules);
      ComboRulesService.updateComboRules(updatedRules);
      toast({
        title: t('settings.ruleUpdated'),
        description: t('settings.ruleUpdatedSuccess')
      });
    } else {
      // Adăugăm regulă nouă
      const newRule = {
        id: `rule-${Date.now()}`,
        name,
        description,
        if: {
          moduleType
        },
        then: {
          suggest: {
            accessory: {
              type: 'default'
            }
          }
        },
        enabled: true
      };
      
      setComboRules([...comboRules, newRule]);
      ComboRulesService.updateComboRules([...comboRules, newRule]);
      toast({
        title: t('settings.ruleAdded'),
        description: t('settings.ruleAddedSuccess')
      });
    }
    
    setIsRuleDialogOpen(false);
  };

  const handleImportRules = () => {
    // Implementare reală ar utiliza un input de fișier și parser CSV
    toast({
      title: t('settings.importStarted'),
      description: t('settings.importInProgress')
    });
    
    setTimeout(() => {
      toast({
        title: t('settings.importComplete'),
        description: t('settings.rulesImportedSuccess')
      });
    }, 1500);
  };

  const handleExportRules = () => {
    toast({
      title: t('settings.exportStarted'),
      description: t('settings.exportInProgress')
    });
    
    setTimeout(() => {
      toast({
        title: t('settings.exportComplete'),
        description: t('settings.rulesExportedSuccess')
      });
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-medium text-white">{t('settings.title')}</h1>
          <p className="text-gray-300">{t('settings.description')}</p>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="general" className="text-white data-[state=active]:bg-gray-700">{t('settings.general')}</TabsTrigger>
            <TabsTrigger value="modules" className="text-white data-[state=active]:bg-gray-700">{t('settings.moduleRules')}</TabsTrigger>
            <TabsTrigger value="accessories" className="text-white data-[state=active]:bg-gray-700">{t('settings.accessoryRules')}</TabsTrigger>
            <TabsTrigger value="templates" className="text-white data-[state=active]:bg-gray-700">{t('settings.moduleTemplates')}</TabsTrigger>
            <TabsTrigger value="pricing" className="text-white data-[state=active]:bg-gray-700">{t('settings.operationPricing')}</TabsTrigger>
            <TabsTrigger value="languages" className="text-white data-[state=active]:bg-gray-700">{t('settings.languages')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t('settings.general')}
                </CardTitle>
                <CardDescription className="text-gray-400">{t('settings.generalDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">{t('settings.companyName')}</Label>
                    <Input defaultValue="Furniture Design Company" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">{t('settings.email')}</Label>
                    <Input defaultValue="contact@furniture-design.com" type="email" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">{t('settings.phone')}</Label>
                    <Input defaultValue="+40 722 123 456" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">{t('settings.enableNotifications')}</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">{t('settings.darkMode')}</Label>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isLoading['save-settings']}
                    className="bg-green-600 hover:bg-green-500"
                  >
                    {isLoading['save-settings'] ? 
                      <><Loader className="h-4 w-4 mr-2 animate-spin" /> {t('settings.saving')}</> : 
                      <><Save className="h-4 w-4 mr-2" /> {t('settings.saveChanges')}</>
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="modules">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">{t('settings.moduleRules')}</CardTitle>
                  <CardDescription className="text-gray-400">{t('settings.moduleRulesDesc')}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleImportRules}>
                          <UploadCloud className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('settings.importRules')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" onClick={handleExportRules}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t('settings.exportRules')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button onClick={handleAddRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('settings.addRule')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700 hover:bg-gray-800">
                      <TableHead className="text-gray-400">{t('settings.ruleName')}</TableHead>
                      <TableHead className="text-gray-400">{t('settings.description')}</TableHead>
                      <TableHead className="text-gray-400">{t('settings.moduleType')}</TableHead>
                      <TableHead className="text-gray-400">{t('settings.status')}</TableHead>
                      <TableHead className="text-gray-400 text-right">{t('settings.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comboRules.map((rule) => (
                      <TableRow key={rule.id} className="border-gray-700 hover:bg-gray-700">
                        <TableCell className="font-medium text-gray-300">
                          <div className="flex items-center gap-2">
                            {rule.name}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{rule.description}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{rule.description}</TableCell>
                        <TableCell className="text-gray-300">{rule.if.moduleType || 'Any'}</TableCell>
                        <TableCell>
                          <Switch 
                            checked={rule.enabled !== false} 
                            onCheckedChange={(checked) => handleRuleToggle(rule.id, checked)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditRule(rule)}
                            >
                              <Settings className="h-4 w-4 text-gray-400" />
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="accessories">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{t('settings.accessoryRules')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.accessoryRulesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Conținutul pentru reguli de accesorii */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>{t('settings.saveChanges')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{t('settings.moduleTemplates')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.moduleTemplatesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Conținutul pentru șabloane de module */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>{t('settings.saveChanges')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pricing">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{t('settings.operationPricing')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.operationPricingDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Conținutul pentru prețuri operațiuni */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>{t('settings.saveChanges')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="languages">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">{t('settings.languages')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.languagesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-white">{t('settings.changeLanguage')}</Label>
                    <Select
                      value={language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger id="language" className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ro">Română</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog pentru adăugare/editare reguli */}
      <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? t('settings.editRule') : t('settings.addRule')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveRule(new FormData(e.currentTarget));
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">{t('settings.ruleName')}</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingRule?.name || ''}
                  className="col-span-3 bg-gray-700 border-gray-600"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">{t('settings.description')}</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingRule?.description || ''}
                  className="col-span-3 bg-gray-700 border-gray-600"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="moduleType" className="text-right">{t('settings.moduleType')}</Label>
                <Select name="moduleType" defaultValue={editingRule?.if?.moduleType || ''}>
                  <SelectTrigger id="moduleType" className="col-span-3 bg-gray-700 border-gray-600">
                    <SelectValue placeholder={t('settings.selectModuleType')} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="base_cabinet">Base Cabinet</SelectItem>
                    <SelectItem value="wall_cabinet">Wall Cabinet</SelectItem>
                    <SelectItem value="drawer_unit">Drawer Unit</SelectItem>
                    <SelectItem value="wardrobe">Wardrobe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {editingRule ? t('common.save') : t('settings.addRule')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Settings;
