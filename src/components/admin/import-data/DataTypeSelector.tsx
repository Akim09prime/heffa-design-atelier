
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from '@/contexts/TranslationContext';

export type DataType = 'materials' | 'accessories' | 'modules' | 'clients' | 'users';

interface DataTypeSelectorProps {
  value: DataType;
  onChange: (value: DataType) => void;
}

const DataTypeSelector = ({ value, onChange }: DataTypeSelectorProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-800">{t('importExport.dataType')}</label>
      <Select value={value} onValueChange={(value) => onChange(value as DataType)}>
        <SelectTrigger className="text-gray-700">
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
  );
};

export default DataTypeSelector;
