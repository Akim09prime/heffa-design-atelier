
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

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
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-medium">Projects</h1>
        <p className="text-muted-foreground">Manage and monitor your design projects</p>
      </div>
      <div className="flex w-full lg:w-auto gap-4">
        <div className="relative flex-1 lg:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full pl-9"
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        <Button variant="outline" onClick={onImportDesign}>
          Import Design
        </Button>
        <Button onClick={onNewProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
    </div>
  );
};
