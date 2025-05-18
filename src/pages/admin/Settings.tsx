import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslation, TranslationProvider } from '@/contexts/TranslationContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthProvider } from '@/contexts/AuthContext';
import { UiProvider, useUi } from '@/contexts/UiContext';
import { Loader } from 'lucide-react';

// Create a wrapper component that uses the context
const SettingsContent = () => {
  const { toast } = useToast();
  const { t, language, changeLanguage } = useTranslation();
  const { showSuccessToast, isLoading, setLoading } = useUi();
  
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      showSuccessToast(t('settings.settingsSaved'), t('settings.changesSavedSuccess'));
    } finally {
      setLoading('save-settings', false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-medium">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.description')}</p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t('settings.general')}</TabsTrigger>
          <TabsTrigger value="pricing">{t('settings.pricing')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('settings.appearance')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
          <TabsTrigger value="backups">{t('settings.backups')}</TabsTrigger>
          <TabsTrigger value="languages">{t('settings.languages')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.general')}</CardTitle>
              <CardDescription>{t('settings.generalDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* General settings form fields would go here */}
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  disabled={isLoading('save-settings')}
                >
                  {isLoading('save-settings') ? 
                    <><Loader className="h-4 w-4 mr-2 animate-spin" /> {t('settings.saving')}</> : 
                    t('settings.saveChanges')
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.pricing')}</CardTitle>
              <CardDescription>{t('settings.pricingDesc')}</CardDescription>
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
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.appearance')}</CardTitle>
              <CardDescription>{t('settings.appearanceDesc')}</CardDescription>
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
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notifications')}</CardTitle>
              <CardDescription>{t('settings.notificationsDesc')}</CardDescription>
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
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.backups')}</CardTitle>
              <CardDescription>{t('settings.backupsDesc')}</CardDescription>
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
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.languages')}</CardTitle>
              <CardDescription>{t('settings.languagesDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">{t('settings.changeLanguage')}</Label>
                  <Select
                    value={language}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
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
  );
};

// Main Settings component that wraps the content with the required providers
const Settings = () => {
  return (
    <TranslationProvider>
      <AuthProvider>
        <UiProvider>
          <AdminLayout>
            <SettingsContent />
          </AdminLayout>
        </UiProvider>
      </AuthProvider>
    </TranslationProvider>
  );
};

export default Settings;
