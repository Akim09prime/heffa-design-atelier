
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/contexts/TranslationContext';
import { useToast } from "@/components/ui/use-toast";
import FileUploader from './FileUploader';
import DataTypeSelector from './DataTypeSelector';
import ColumnMapping from './ColumnMapping';
import DataPreview from './DataPreview';
import ValidationIssues from './ValidationIssues';
import { useImportData } from './useImportData';

const ImportDataForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const {
    file,
    setFile,
    dataType,
    setDataType,
    columnMappings,
    updateColumnMapping,
    previewData,
    validationIssues,
    handleImport,
    isUploading,
    getTargetColumns
  } = useImportData();

  const handleFileUpload = (uploadedFile: File | null) => {
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleImportClick = async () => {
    const success = await handleImport();
    if (success) {
      toast({
        title: t('importExport.importSuccess'),
        description: t('importExport.dataImportedSuccessfully'),
      });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1F2937]">{t('importExport.importData')}</h1>
        <p className="text-gray-600 mt-2">{t('importExport.importDescription')}</p>
      </div>

      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-[#1F2937]">{t('importExport.uploadFile')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <DataTypeSelector 
                  value={dataType} 
                  onChange={setDataType}
                />
              </div>
              <div>
                <FileUploader 
                  file={file} 
                  onFileSelect={handleFileUpload}
                />
              </div>
            </div>

            {validationIssues.length > 0 && (
              <ValidationIssues issues={validationIssues} />
            )}

            {previewData.length > 0 && (
              <div className="space-y-6">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-[#1F2937] mb-4">{t('importExport.columnMapping')}</h3>
                  <ColumnMapping 
                    mappings={columnMappings}
                    onUpdateMapping={updateColumnMapping}
                    availableColumns={getTargetColumns()}
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-[#1F2937] mb-4">{t('importExport.dataPreview')}</h3>
                  <DataPreview 
                    data={previewData}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4 border-t border-gray-200 p-4">
          <Button 
            variant="outline"
            disabled={isUploading}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleImportClick}
            disabled={!file || validationIssues.length > 0 || isUploading}
            className="bg-[#10B981] hover:bg-[#34D399] text-white"
          >
            {isUploading ? t('importExport.importing') : t('importExport.import')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImportDataForm;
