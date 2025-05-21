
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import ImportDataForm from '@/components/admin/ImportDataForm';

const ImportData = () => {
  const { t } = useTranslation();

  return (
    <div className="px-6 py-8 admin-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-medium text-gray-800">{t('importExport.title')}</h1>
        <p className="text-gray-600">{t('importExport.description')}</p>
      </div>

      <Tabs defaultValue="import" className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="import">{t('importExport.importData')}</TabsTrigger>
          <TabsTrigger value="templates">{t('importExport.templates')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="import" className="space-y-6">
          <ImportDataForm />
        </TabsContent>
        
        <TabsContent value="templates" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">{t('common.materials')}</CardTitle>
              <CardDescription className="text-gray-600">{t('importExport.materialsTemplateDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-md bg-blue-50">
                    <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">materials_template.xlsx</p>
                    <p className="text-xs text-gray-500">12KB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('common.download')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">{t('common.accessories')}</CardTitle>
              <CardDescription className="text-gray-600">{t('importExport.accessoriesTemplateDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-md bg-green-50">
                    <FileSpreadsheet className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">accessories_template.xlsx</p>
                    <p className="text-xs text-gray-500">10KB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('common.download')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">{t('common.users')}</CardTitle>
              <CardDescription className="text-gray-600">{t('importExport.usersTemplateDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-md bg-purple-50">
                    <FileSpreadsheet className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">users_template.xlsx</p>
                    <p className="text-xs text-gray-500">8KB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('common.download')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">{t('common.modules')}</CardTitle>
              <CardDescription className="text-gray-600">{t('importExport.modulesTemplateDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-md bg-orange-50">
                    <FileSpreadsheet className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">modules_template.xlsx</p>
                    <p className="text-xs text-gray-500">9KB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('common.download')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">{t('common.client')}</CardTitle>
              <CardDescription className="text-gray-600">{t('importExport.clientsTemplateDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-md bg-red-50">
                    <FileSpreadsheet className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">clients_template.xlsx</p>
                    <p className="text-xs text-gray-500">7KB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('common.download')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportData;
