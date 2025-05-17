
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Settings = () => {
  const { toast } = useToast();
  const { t, language, changeLanguage } = useTranslation();
  
  const handleLanguageChange = (value: string) => {
    changeLanguage(value as 'en' | 'ro');
    toast({
      title: t('settings.languageChanged'),
      description: value === 'en' ? t('settings.languageSetTo.en') : t('settings.languageSetTo.ro'),
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: t('settings.settingsSaved'),
      description: t('settings.changesSavedSuccess'),
    });
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
            <TabsTrigger value="general">{t('settings.general')}</TabsTrigger>
            <TabsTrigger value="pricing">{t('settings.pricing')}</TabsTrigger>
            <TabsTrigger value="appearance">{t('settings.appearance')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
            <TabsTrigger value="backups">{t('settings.backups')}</TabsTrigger>
            <TabsTrigger value="languages">{t('settings.languages')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">{t('settings.general')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.generalDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* General settings form fields would go here */}
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>{t('settings.saveChanges')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pricing">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">{t('settings.pricing')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.pricingDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Pricing settings would go here */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>{t('settings.saveChanges')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">{t('settings.appearance')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.appearanceDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Appearance settings would go here */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>{t('settings.saveChanges')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">{t('settings.notifications')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.notificationsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Notification settings would go here */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>{t('settings.saveChanges')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="backups">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">{t('settings.backups')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.backupsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Backup & restore settings would go here */}
                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>{t('settings.saveChanges')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="languages">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">{t('settings.languages')}</CardTitle>
                <CardDescription className="text-gray-400">{t('settings.languagesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('settings.changeLanguage')}</Label>
                    <Select
                      value={language}
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger id="language" className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600 text-white">
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
    </AdminLayout>
  );
};

export default Settings;
