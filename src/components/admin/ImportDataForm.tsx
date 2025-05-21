
import React, { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, X, Check, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUi } from '@/contexts/UiContext';

type DataType = 'materials' | 'accessories' | 'modules' | 'clients' | 'users';

interface ColumnMapping {
  sourceColumn: string;
  targetColumn: string;
}

const ImportDataForm = () => {
  const { t } = useTranslation();
  const { showSuccessToast, showErrorToast, showWarningToast } = useUi();
  
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataType>('materials');
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    if (selectedFile.type !== 'text/csv' && 
        !selectedFile.name.endsWith('.xlsx') && 
        !selectedFile.name.endsWith('.xls')) {
      showErrorToast(t('importExport.invalidFileType'), 
        t('importExport.pleaseSelectCsvOrExcel'));
      return;
    }
    
    setFile(selectedFile);
    
    // Here we would parse the file and generate preview data
    // For now, we'll simulate this with dummy data
    const dummyColumns = ['id', 'name', 'code', 'manufacturer', 'price'];
    const dummyData = [
      { id: '1', name: 'Sample Item 1', code: 'ABC123', manufacturer: 'Egger', price: '25.50' },
      { id: '2', name: 'Sample Item 2', code: 'DEF456', manufacturer: 'Kronospan', price: '34.20' },
    ];
    
    setPreviewData(dummyData);
    
    // Generate initial column mappings
    const initialMappings = dummyColumns.map(column => ({
      sourceColumn: column,
      targetColumn: column,
    }));
    
    setColumnMappings(initialMappings);
    
    // Simulate validation issues
    setValidationIssues([
      'Row 5: Missing required field "code"',
      'Row 12: Duplicate entry with ID "ABC123"'
    ]);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      
      if (droppedFile.type !== 'text/csv' && 
          !droppedFile.name.endsWith('.xlsx') && 
          !droppedFile.name.endsWith('.xls')) {
        showErrorToast(t('importExport.invalidFileType'), 
          t('importExport.pleaseSelectCsvOrExcel'));
        return;
      }
      
      setFile(droppedFile);
      
      // Similar logic as handleFileChange would go here
      // For the demo, we'll just reuse the same dummy data
      const dummyColumns = ['id', 'name', 'code', 'manufacturer', 'price'];
      const dummyData = [
        { id: '1', name: 'Sample Item 1', code: 'ABC123', manufacturer: 'Egger', price: '25.50' },
        { id: '2', name: 'Sample Item 2', code: 'DEF456', manufacturer: 'Kronospan', price: '34.20' },
      ];
      
      setPreviewData(dummyData);
      
      const initialMappings = dummyColumns.map(column => ({
        sourceColumn: column,
        targetColumn: column,
      }));
      
      setColumnMappings(initialMappings);
      
      setValidationIssues([
        'Row 5: Missing required field "code"',
        'Row 12: Duplicate entry with ID "ABC123"'
      ]);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  
  const handleImport = async () => {
    setIsUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (validationIssues.length > 0) {
        showWarningToast(
          t('importExport.importCompletedWithWarnings'),
          t('importExport.checkValidationIssues')
        );
      } else {
        showSuccessToast(
          t('importExport.importSuccessful'),
          t('importExport.dataImportedSuccessfully')
        );
      }
      
      // Reset form after successful import
      setFile(null);
      setPreviewData([]);
      setColumnMappings([]);
      setValidationIssues([]);
    } catch (error) {
      console.error('Import error:', error);
      showErrorToast(
        t('importExport.importFailed'),
        t('importExport.errorOccurredDuringImport')
      );
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData([]);
    setColumnMappings([]);
    setValidationIssues([]);
  };
  
  const updateColumnMapping = (index: number, targetColumn: string) => {
    const updatedMappings = [...columnMappings];
    updatedMappings[index].targetColumn = targetColumn;
    setColumnMappings(updatedMappings);
  };
  
  const getTargetColumns = () => {
    switch (dataType) {
      case 'materials':
        return ['id', 'code', 'name', 'type', 'thickness', 'manufacturer', 'supplier', 'pricePerSqm', 'paintable', 'cantable', 'inStock'];
      case 'accessories':
        return ['id', 'code', 'name', 'type', 'manufacturer', 'price', 'stockQty', 'compatibility'];
      case 'modules':
        return ['id', 'name', 'type', 'width', 'height', 'depth', 'defaultMaterial'];
      case 'clients':
        return ['id', 'name', 'email', 'phone', 'address', 'company'];
      case 'users':
        return ['id', 'name', 'email', 'role', 'active'];
      default:
        return [];
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>{t('importExport.importData')}</CardTitle>
          <CardDescription>{t('importExport.uploadCsvOrExcel')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-900">{t('importExport.dataType')}</label>
              <Select value={dataType} onValueChange={(value) => setDataType(value as DataType)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('importExport.selectDataType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materials">{t('common.materials')}</SelectItem>
                  <SelectItem value="accessories">{t('common.accessories')}</SelectItem>
                  <SelectItem value="modules">{t('common.modules')}</SelectItem>
                  <SelectItem value="clients">{t('common.client')}</SelectItem>
                  <SelectItem value="users">{t('common.users')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {!file ? (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-700">{t('importExport.dragAndDrop')}</p>
                <p className="text-xs text-gray-700">{t('importExport.csvOrExcel')}</p>
                <Button variant="outline" className="mt-4">
                  {t('importExport.selectFile')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-md bg-blue-50">
                      <File className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-700">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {previewData.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{t('importExport.dataPreview')}</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm admin-table">
                        <thead>
                          <tr>
                            {Object.keys(previewData[0]).map((key) => (
                              <th key={key} className="px-4 py-2">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.values(row).map((value, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-2 border text-gray-800">{value as string}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">{t('importExport.columnMapping')}</h4>
                  <div className="space-y-2">
                    {columnMappings.map((mapping, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="flex-1">
                          <p className="text-sm text-gray-800">{mapping.sourceColumn}</p>
                        </div>
                        <div className="text-gray-600">→</div>
                        <div className="flex-1">
                          <Select 
                            value={mapping.targetColumn} 
                            onValueChange={(value) => updateColumnMapping(index, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('importExport.selectTargetColumn')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ignore">{t('importExport.ignoreColumn')}</SelectItem>
                              {getTargetColumns().map((column) => (
                                <SelectItem key={column} value={column}>
                                  {column}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {validationIssues.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <h4 className="text-sm font-medium text-yellow-800">
                        {t('importExport.validationIssues')}
                      </h4>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1 pl-6 list-disc">
                      {validationIssues.map((issue, index) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
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
