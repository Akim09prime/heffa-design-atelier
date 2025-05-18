
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectsTable } from './ProjectsTable';
import { useTranslation } from '@/contexts/TranslationContext';

interface Project {
  id: string;
  name: string;
  status: string;
  lastExport: string;
  exportCount: number;
}

interface ProjectsTabProps {
  projects: Project[];
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects }) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('common.projects')}</CardTitle>
        <CardDescription>
          {t('importExport.templates')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectsTable projects={projects} />
      </CardContent>
    </Card>
  );
};
