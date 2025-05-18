
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportsTable } from './ExportsTable';
import { useTranslation } from '@/contexts/TranslationContext';

interface Export {
  id: string;
  projectId: string;
  projectName: string;
  format: string;
  date: string;
  size: string;
  url: string;
}

interface RecentExportsTabProps {
  exports: Export[];
}

export const RecentExportsTab: React.FC<RecentExportsTabProps> = ({ exports }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('importExport.exportData')}</CardTitle>
        <CardDescription>
          {t('importExport.exportDataDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExportsTable exports={exports} />
      </CardContent>
    </Card>
  );
};
