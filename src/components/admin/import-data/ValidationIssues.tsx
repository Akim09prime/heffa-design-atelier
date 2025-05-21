
import React from 'react';
import { AlertCircle } from "lucide-react";
import { useTranslation } from '@/contexts/TranslationContext';

interface ValidationIssuesProps {
  issues: string[];
}

const ValidationIssues = ({ issues }: ValidationIssuesProps) => {
  const { t } = useTranslation();
  
  if (issues.length === 0) return null;
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
      <div className="flex items-center space-x-2 mb-2">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <h4 className="text-sm font-medium text-yellow-800">
          {t('importExport.validationIssues')}
        </h4>
      </div>
      <ul className="text-sm text-yellow-700 space-y-1 pl-6 list-disc">
        {issues.map((issue, index) => (
          <li key={index}>{issue}</li>
        ))}
      </ul>
    </div>
  );
};

export default ValidationIssues;
