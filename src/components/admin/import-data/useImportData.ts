
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { DataType } from './DataTypeSelector';

export interface ColumnMapping {
  sourceColumn: string;
  targetColumn: string;
}

export const useImportData = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataType>('materials');
  const [isUploading, setIsUploading] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [columnMappings, setColumnMappings] = useState<ColumnMapping[]>([]);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  
  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && 
        !selectedFile.name.endsWith('.xlsx') && 
        !selectedFile.name.endsWith('.xls')) {
      toast({
        title: t('importExport.invalidFileType'),
        description: t('importExport.pleaseSelectCsvOrExcel'),
        variant: "destructive"
      });
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
  
  const updateColumnMapping = (index: number, targetColumn: string) => {
    const updatedMappings = [...columnMappings];
    updatedMappings[index].targetColumn = targetColumn;
    setColumnMappings(updatedMappings);
  };
  
  const handleImport = async () => {
    setIsUploading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (validationIssues.length > 0) {
        toast({
          title: t('importExport.importCompletedWithWarnings'),
          description: t('importExport.checkValidationIssues'),
          variant: "default"
        });
      } else {
        toast({
          title: t('importExport.importSuccessful'),
          description: t('importExport.dataImportedSuccessfully'),
          variant: "default"
        });
      }
      
      // Reset form after successful import
      setFile(null);
      setPreviewData([]);
      setColumnMappings([]);
      setValidationIssues([]);
      
      return true;
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: t('importExport.importFailed'),
        description: t('importExport.errorOccurredDuringImport'),
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUploading(false);
    }
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
  
  return {
    file,
    setFile,
    dataType,
    setDataType,
    isUploading,
    previewData,
    columnMappings,
    setColumnMappings,
    updateColumnMapping,
    validationIssues,
    handleFileSelect,
    handleImport,
    getTargetColumns
  };
};
