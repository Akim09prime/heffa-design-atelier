
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectService } from '@/services/projectService';
import { Project } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';
import { RecentExportsTab } from './RecentExportsTab';
import { ProjectsTab } from './ProjectsTab';
import { projectMockData, recentExportsMockData } from './mockData';

export const ExportsPageContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const { t } = useTranslation();
  
  // Initialize with mock data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await ProjectService.getAllProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    
    fetchProjects();
  }, []);

  const filteredProjects = projectMockData.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExports = recentExportsMockData.filter(exp =>
    exp.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-medium">{t('common.export')}</h1>
        <Input
          placeholder={t('common.search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="recent">{t('importExport.exportData')}</TabsTrigger>
          <TabsTrigger value="projects">{t('importExport.exportDataDesc')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="mt-6">
          <RecentExportsTab exports={filteredExports} />
        </TabsContent>
        
        <TabsContent value="projects" className="mt-6">
          <ProjectsTab projects={filteredProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
