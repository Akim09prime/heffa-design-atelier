
import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

interface DataPreviewProps {
  data: Record<string, any>[];
}

const DataPreview = ({ data }: DataPreviewProps) => {
  const { t } = useTranslation();

  if (!data.length) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-800 mb-2">{t('importExport.dataPreview')}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-2 text-left text-gray-700">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {Object.values(row).map((value, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 text-gray-700">{value as string}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataPreview;
