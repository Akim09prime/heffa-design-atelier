
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, Globe, Upload, Shield, Database, Bell, CreditCard, Zap, ToggleLeft, Settings as SettingsIcon, Languages } from 'lucide-react';

interface SystemSettingsGroup {
  id: string;
  name: string;
  description: string;
  settings: SystemSetting[];
}

interface SystemSetting {
  id: string;
  key: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  label: string;
  description?: string;
  value: string | number | boolean;
  options?: { label: string; value: string }[];
}

const Settings = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState('en');
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  
  const [settingsGroups, setSettingsGroups] = useState<SystemSettingsGroup[]>([
    {
      id: 'general',
      name: 'General Settings',
      description: 'Basic system configuration',
      settings: [
        {
          id: 'company_name',
          key: 'company.name',
          type: 'text',
          label: 'Company Name',
          description: 'Your business name as it appears on documents',
          value: 'HeffaDesign Furniture'
        },
        {
          id: 'default_currency',
          key: 'system.currency',
          type: 'select',
          label: 'Default Currency',
          description: 'Primary currency for all transactions',
          value: 'EUR',
          options: [
            { label: 'Euro (€)', value: 'EUR' },
            { label: 'US Dollar ($)', value: 'USD' },
            { label: 'Romanian Leu (RON)', value: 'RON' },
            { label: 'British Pound (£)', value: 'GBP' },
          ]
        },
        {
          id: 'date_format',
          key: 'system.dateFormat',
          type: 'select',
          label: 'Date Format',
          description: 'Format for displaying dates across the system',
          value: 'DD/MM/YYYY',
          options: [
            { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
            { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
            { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
          ]
        },
        {
          id: 'measurement_system',
          key: 'system.measurement',
          type: 'select',
          label: 'Measurement System',
          description: 'Units of measurement for dimensions',
          value: 'metric',
          options: [
            { label: 'Metric (cm, m)', value: 'metric' },
            { label: 'Imperial (in, ft)', value: 'imperial' },
          ]
        },
      ]
    },
    {
      id: 'pricing',
      name: 'Pricing Settings',
      description: 'Configure pricing rules and calculations',
      settings: [
        {
          id: 'vat_rate',
          key: 'pricing.vatRate',
          type: 'number',
          label: 'Default VAT Rate (%)',
          description: 'Standard VAT percentage applied to products',
          value: 19
        },
        {
          id: 'default_margin',
          key: 'pricing.margin',
          type: 'number',
          label: 'Default Profit Margin (%)',
          description: 'Default margin percentage applied to product costs',
          value: 35
        },
        {
          id: 'round_prices',
          key: 'pricing.roundPrices',
          type: 'boolean',
          label: 'Round Prices',
          description: 'Round final prices to the nearest whole number',
          value: true
        },
        {
          id: 'include_labor',
          key: 'pricing.includeLabor',
          type: 'boolean',
          label: 'Auto-include Labor Costs',
          description: 'Automatically add labor costs to furniture items',
          value: true
        }
      ]
    },
    {
      id: 'appearance',
      name: 'Appearance',
      description: 'Configure the appearance and branding of the application',
      settings: [
        {
          id: 'dark_mode',
          key: 'appearance.darkMode',
          type: 'boolean',
          label: 'Dark Mode by Default',
          description: 'Use dark mode as the default theme',
          value: true
        },
        {
          id: 'show_logo',
          key: 'appearance.showLogo',
          type: 'boolean',
          label: 'Show Company Logo',
          description: 'Display company logo in the application header',
          value: true
        },
        {
          id: 'accent_color',
          key: 'appearance.accentColor',
          type: 'select',
          label: 'Accent Color',
          description: 'Primary accent color for the interface',
          value: 'blue',
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Purple', value: 'purple' },
            { label: 'Orange', value: 'orange' },
            { label: 'Red', value: 'red' },
          ]
        },
      ]
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Configure system notifications and alerts',
      settings: [
        {
          id: 'email_notifications',
          key: 'notifications.email',
          type: 'boolean',
          label: 'Email Notifications',
          description: 'Send email notifications for important events',
          value: true
        },
        {
          id: 'low_stock_alerts',
          key: 'notifications.lowStock',
          type: 'boolean',
          label: 'Low Stock Alerts',
          description: 'Notify when materials or accessories are running low',
          value: true
        },
        {
          id: 'low_stock_threshold',
          key: 'notifications.lowStockThreshold',
          type: 'number',
          label: 'Low Stock Threshold',
          description: 'Minimum quantity before triggering low stock alerts',
          value: 10
        },
        {
          id: 'project_reminders',
          key: 'notifications.projectReminders',
          type: 'boolean',
          label: 'Project Deadline Reminders',
          description: 'Send reminders for approaching project deadlines',
          value: true
        },
      ]
    },
  ]);
  
  const handleSettingChange = (groupId: string, settingId: string, value: string | number | boolean) => {
    setSettingsGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? {
            ...group,
            settings: group.settings.map(setting =>
              setting.id === settingId
                ? { ...setting, value }
                : setting
            )
          }
          : group
      )
    );
  };
  
  const handleSaveSettings = () => {
    // Here we would typically save settings to an API
    toast({
      title: "Settings Saved",
      description: "Your changes have been saved successfully."
    });
  };
  
  const handleChangeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    setIsLanguageDialogOpen(false);
    toast({
      title: "Language Changed",
      description: newLanguage === 'en' ? "Language set to English" : "Limba a fost setată la Română"
    });
  };
  
  const renderSettingInput = (group: SystemSettingsGroup, setting: SystemSetting) => {
    switch(setting.type) {
      case 'text':
        return (
          <Input
            id={setting.id}
            value={setting.value as string}
            onChange={(e) => handleSettingChange(group.id, setting.id, e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
        );
      case 'number':
        return (
          <Input
            id={setting.id}
            type="number"
            value={setting.value as number}
            onChange={(e) => handleSettingChange(group.id, setting.id, parseFloat(e.target.value))}
            className="bg-gray-700 border-gray-600"
          />
        );
      case 'boolean':
        return (
          <Switch
            id={setting.id}
            checked={setting.value as boolean}
            onCheckedChange={(checked) => handleSettingChange(group.id, setting.id, checked)}
          />
        );
      case 'select':
        return (
          <Select 
            value={String(setting.value)} 
            onValueChange={(value) => handleSettingChange(group.id, setting.id, value)}
          >
            <SelectTrigger className="bg-gray-700 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {setting.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };
  
  const getSettingIcon = (groupId: string) => {
    switch(groupId) {
      case 'general':
        return <SettingsIcon className="h-5 w-5 text-gray-400" />;
      case 'pricing':
        return <CreditCard className="h-5 w-5 text-gray-400" />;
      case 'appearance':
        return <ToggleLeft className="h-5 w-5 text-gray-400" />;
      case 'notifications':
        return <Bell className="h-5 w-5 text-gray-400" />;
      case 'security':
        return <Shield className="h-5 w-5 text-gray-400" />;
      case 'integration':
        return <Zap className="h-5 w-5 text-gray-400" />;
      case 'database':
        return <Database className="h-5 w-5 text-gray-400" />;
      default:
        return <SettingsIcon className="h-5 w-5 text-gray-400" />;
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">System Settings</h1>
            <p className="text-gray-300">Configure application settings and preferences</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setIsLanguageDialogOpen(true)}>
              <Globe className="h-4 w-4 mr-2" />
              {language === 'en' ? 'English' : 'Română'}
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64">
              <TabsList className="flex flex-col w-full bg-gray-800 p-1 rounded-md">
                {settingsGroups.map(group => (
                  <TabsTrigger
                    key={group.id}
                    value={group.id}
                    className="justify-start w-full px-4 py-3"
                  >
                    <div className="flex items-center">
                      {getSettingIcon(group.id)}
                      <span className="ml-2">{group.name}</span>
                    </div>
                  </TabsTrigger>
                ))}
                <TabsTrigger value="backups" className="justify-start w-full px-4 py-3">
                  <div className="flex items-center">
                    <Database className="h-5 w-5 text-gray-400" />
                    <span className="ml-2">Backups & Restore</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="languages" className="justify-start w-full px-4 py-3">
                  <div className="flex items-center">
                    <Languages className="h-5 w-5 text-gray-400" />
                    <span className="ml-2">Languages</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1">
              {settingsGroups.map(group => (
                <TabsContent key={group.id} value={group.id} className="mt-0 lg:mt-0">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">{group.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {group.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {group.settings.map(setting => (
                        <div key={setting.id} className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <Label htmlFor={setting.id} className="text-white">
                                {setting.label}
                              </Label>
                              {setting.description && (
                                <p className="text-sm text-gray-400">{setting.description}</p>
                              )}
                            </div>
                            <div className="w-full sm:w-64">
                              {renderSettingInput(group, setting)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
              
              {/* Backups & Restore Tab */}
              <TabsContent value="backups" className="mt-0 lg:mt-0">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Backups & Restore</CardTitle>
                    <CardDescription className="text-gray-400">
                      Backup your system data and restore from previous backups
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Create Backup</h3>
                      <p className="text-gray-400 mb-4">
                        Create a complete backup of the system including all data and settings
                      </p>
                      <Button>Create System Backup</Button>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-2">Restore from Backup</h3>
                      <p className="text-gray-400 mb-4">
                        Restore the system from a previous backup file
                      </p>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" className="relative">
                          <input
                            type="file"
                            accept=".zip,.bak"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <Upload className="h-4 w-4 mr-2" />
                          Select Backup File
                        </Button>
                        <Button variant="destructive" disabled>
                          Restore System
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-2">Scheduled Backups</h3>
                      <p className="text-gray-400 mb-4">
                        Configure automatic backups on a regular schedule
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <Switch id="auto-backup" defaultChecked={true} />
                        <Label htmlFor="auto-backup">Enable scheduled backups</Label>
                      </div>
                      <Select defaultValue="daily">
                        <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="daily">Daily (at midnight)</SelectItem>
                          <SelectItem value="weekly">Weekly (Sunday)</SelectItem>
                          <SelectItem value="monthly">Monthly (1st day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Languages Tab */}
              <TabsContent value="languages" className="mt-0 lg:mt-0">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Languages</CardTitle>
                    <CardDescription className="text-gray-400">
                      Configure language settings and translations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">Default Language</h3>
                      <p className="text-gray-400 mb-4">
                        Choose the default language for new users
                      </p>
                      <Select defaultValue={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ro">Romanian (Română)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-2">Date and Number Formats</h3>
                      <p className="text-gray-400 mb-4">
                        Configure localization settings for dates and numbers
                      </p>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date-format">Date Format</Label>
                            <Select defaultValue="DD/MM/YYYY">
                              <SelectTrigger id="date-format" className="mt-1.5 w-full bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</SelectItem>
                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</SelectItem>
                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="number-format">Number Format</Label>
                            <Select defaultValue="eu">
                              <SelectTrigger id="number-format" className="mt-1.5 w-full bg-gray-700 border-gray-600">
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-700 border-gray-600">
                                <SelectItem value="eu">European (1.234,56)</SelectItem>
                                <SelectItem value="us">US (1,234.56)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-white mb-2">Translation Management</h3>
                      <p className="text-gray-400 mb-4">
                        Manage and update application translations
                      </p>
                      <Button variant="outline">
                        Manage Translations
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Language Switch Dialog */}
      <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Change Language</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Button
              variant={language === 'en' ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => handleChangeLanguage('en')}
            >
              <Globe className="h-5 w-5 mr-2" />
              English
            </Button>
            <Button
              variant={language === 'ro' ? 'default' : 'outline'}
              className="w-full justify-start"
              onClick={() => handleChangeLanguage('ro')}
            >
              <Globe className="h-5 w-5 mr-2" />
              Română (Romanian)
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLanguageDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Settings;
