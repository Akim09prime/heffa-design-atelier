
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';

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

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-medium">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.description')}</p>
        </div>
        
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">{t('settings.designer.profile')}</TabsTrigger>
            <TabsTrigger value="preferences">{t('settings.designer.preferences')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
            <TabsTrigger value="languages">{t('settings.languages')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.designer.profile')}</CardTitle>
                <CardDescription>{t('settings.designer.profileDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Profile settings would go here */}
                <div className="flex justify-end">
                  <Button>{t('settings.saveChanges')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.designer.preferences')}</CardTitle>
                <CardDescription>{t('settings.designer.preferencesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {/* Preferences settings would go here */}
                <div className="flex justify-end">
                  <Button>{t('settings.saveChanges')}</Button>
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
                  <Button>{t('settings.saveChanges')}</Button>
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
    </DesignerLayout>
  );
};

export default Settings;
