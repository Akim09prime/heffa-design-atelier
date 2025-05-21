
import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import FileUploader from './FileUploader';
import FilePreview from './FilePreview';
import DataPreview from './DataPreview';
import ColumnMapping from './ColumnMapping';
import ValidationIssues from './ValidationIssues';
import DataTypeSelector from './DataTypeSelector';
import { useImportData } from './useImportData';

const ImportDataForm = () => {
  const { t } = useTranslation();
  const {
    file,
    dataType,
    isUploading,
    previewData,
    columnMappings,
    validationIssues,
    setDataType,
    handleFileSelect,
    handleRemoveFile,
    updateColumnMapping,
    handleImport,
    getTargetColumns
  } = useImportData();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-gray-800">{t('importExport.importData')}</CardTitle>
          <CardDescription className="text-gray-600">{t('importExport.uploadCsvOrExcel')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DataTypeSelector value={dataType} onChange={setDataType} />
            
            {!file ? (
              <FileUploader onFileSelect={handleFileSelect} />
            ) : (
              <div className="space-y-4">
                <FilePreview file={file} onRemove={handleRemoveFile} />
                
                {previewData.length > 0 && (
                  <DataPreview data={previewData} />
                )}
                
                <ColumnMapping 
                  mappings={columnMappings} 
                  onUpdateMapping={updateColumnMapping} 
                  availableColumns={getTargetColumns()}
                />
                
                <ValidationIssues issues={validationIssues} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end space-x-2">
            {file && (
              <Button 
                onClick={handleImport} 
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full" />
                    {t('importExport.importing')}
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {t('importExport.importData')}
                  </>
                )}
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImportDataForm;
