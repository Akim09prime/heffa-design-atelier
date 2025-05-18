
import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { useUi } from '@/contexts/UiContext';
import { db } from '@/firebase-config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { t, language, changeLanguage } = useTranslation();
  const { showToast, setLoading, isLoading } = useUi();
  const [activeTab, setActiveTab] = useState<string>("profile");
  
  const handleLanguageChange = async (value: string) => {
    setLoading('languageChange', true);
    showToast(t('settings.changingLanguage'), "info");
    
    try {
      // Simulate a delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      changeLanguage(value as 'en' | 'ro');
      
      showToast(
        t('settings.languageChanged'),
        "success"
      );
      
      // Log to Firebase
      try {
        await setDoc(doc(db, "user_settings", `lang_change_${Date.now()}`), {
          setting: 'language',
          value: value,
          previousValue: language,
          timestamp: serverTimestamp(),
          userId: '1' // This would be the current user's ID
        });
      } catch (firebaseError) {
        console.error("Firebase log error:", firebaseError);
      }
    } catch (error) {
      console.error("Language change error:", error);
      showToast(t('settings.languageChangeError'), "error");
    } finally {
      setLoading('languageChange', false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading('saveSettings', true);
    showToast(t('settings.savingChanges'), "info");
    
    try {
      // Simulate a delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Log to Firebase
      try {
        await setDoc(doc(db, "user_settings", `settings_save_${Date.now()}`), {
          tab: activeTab,
          timestamp: serverTimestamp(),
          userId: '1' // This would be the current user's ID
        });
      } catch (firebaseError) {
        console.error("Firebase log error:", firebaseError);
      }
      
      showToast(t('settings.settingsSaved'), "success");
    } catch (error) {
      console.error("Settings save error:", error);
      showToast(t('settings.saveError'), "error");
    } finally {
      setLoading('saveSettings', false);
    }
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-medium">{t('settings.title')}</h1>
          <p className="text-muted-foreground">{t('settings.description')}</p>
        </div>
        
        <Tabs 
          defaultValue="profile" 
          className="space-y-4"
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            showToast(`Tab ${value} activat`, "info");
          }}
        >
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
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isLoading('saveSettings')}
                  >
                    {isLoading('saveSettings') ? (
                      <><Loader size={16} className="mr-2 animate-spin" /> {t('settings.saving')}</>
                    ) : (
                      t('settings.saveChanges')
                    )}
                  </Button>
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
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isLoading('saveSettings')}
                  >
                    {isLoading('saveSettings') ? (
                      <><Loader size={16} className="mr-2 animate-spin" /> {t('settings.saving')}</>
                    ) : (
                      t('settings.saveChanges')
                    )}
                  </Button>
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
                  <Button 
                    onClick={handleSaveSettings}
                    disabled={isLoading('saveSettings')}
                  >
                    {isLoading('saveSettings') ? (
                      <><Loader size={16} className="mr-2 animate-spin" /> {t('settings.saving')}</>
                    ) : (
                      t('settings.saveChanges')
                    )}
                  </Button>
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
                      disabled={isLoading('languageChange')}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ro">Română</SelectItem>
                      </SelectContent>
                    </Select>
                    {isLoading('languageChange') && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Loader size={14} className="animate-spin" />
                        <span>{t('settings.changing')}</span>
                      </div>
                    )}
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
