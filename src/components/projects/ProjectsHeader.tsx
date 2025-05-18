
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface ProjectsHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportDesign: () => void;
  onNewProject: () => void;
}

export const ProjectsHeader = ({
  searchQuery,
  onSearchChange,
  onImportDesign,
  onNewProject
}: ProjectsHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-medium">{t('projects.title')}</h1>
        <p className="text-muted-foreground">{t('projects.description')}</p>
      </div>
      <div className="flex w-full lg:w-auto gap-4">
        <div className="relative flex-1 lg:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('projects.searchPlaceholder')}
            className="w-full pl-9"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        <Button variant="outline" onClick={onImportDesign}>
          {t('projects.importDesign')}
        </Button>
        <Button onClick={onNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          {t('projects.newProject')}
        </Button>
      </div>
    </div>
  );
};
