
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from '@/contexts/TranslationContext';
import { type ColumnMapping as ColumnMappingType } from './useImportData';

interface ColumnMappingProps {
  mappings: ColumnMappingType[];
  onUpdateMapping: (index: number, targetColumn: string) => void;
  availableColumns: string[];
}

const ColumnMapping = ({ mappings, onUpdateMapping, availableColumns }: ColumnMappingProps) => {
  const { t } = useTranslation();

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-800 mb-2">{t('importExport.columnMapping')}</h4>
      <div className="space-y-2">
        {mappings.map((mapping, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-1">
              <p className="text-sm text-gray-700">{mapping.sourceColumn}</p>
            </div>
            <div className="text-gray-600">→</div>
            <div className="flex-1">
              <Select 
                value={mapping.targetColumn} 
                onValueChange={(value) => onUpdateMapping(index, value)}
              >
                <SelectTrigger className="text-gray-700">
                  <SelectValue placeholder={t('importExport.selectTargetColumn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ignore">{t('importExport.ignoreColumn')}</SelectItem>
                  {availableColumns.map((column) => (
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
  );
};

export default ColumnMapping;
