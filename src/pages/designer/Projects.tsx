
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectsHeader } from '@/components/projects/ProjectsHeader';
import { ProjectTable } from '@/components/projects/ProjectTable';
import { NewProjectDialog } from '@/components/projects/NewProjectDialog';
import { ImportDesignDialog } from '@/components/projects/ImportDesignDialog';
import { useProjectsList } from '@/hooks/useProjectsList';
import { useUi } from '@/contexts/UiContext';

const Projects = () => {
  const {
    projects,
    loading,
    searchQuery,
    setSearchQuery,
    isNewProjectDialogOpen,
    setIsNewProjectDialogOpen,
    isImportDialogOpen,
    setIsImportDialogOpen,
    projectName,
    setProjectName,
    projectType,
    setProjectType,
    importUrl,
    setImportUrl,
    handleCreateProject,
    handleViewProject,
    handleImportDesign,
    processImportedDesign
  } = useProjectsList();
  
  const { showToast } = useUi();

  const handleClearSearch = () => {
    if (searchQuery) {
      setSearchQuery("");
      showToast("Căutare resetată", "info");
    }
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <ProjectsHeader 
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onImportDesign={() => {
            handleImportDesign();
            showToast("Formular import design deschis", "info");
          }}
          onNewProject={() => {
            setIsNewProjectDialogOpen(true);
            showToast("Formular proiect nou deschis", "info");
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>View and manage your design projects</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ProjectTable 
              projects={projects}
              loading={loading}
              searchQuery={searchQuery}
              onViewProject={(projectId, projectName) => {
                if (!projectId) {
                  showToast("ID proiect invalid", "error");
                  return;
                }
                showToast(`Navigare către proiectul "${projectName}"`, "info");
                handleViewProject(projectId, projectName);
              }}
              onCreateProject={() => {
                setIsNewProjectDialogOpen(true);
                showToast("Formular proiect nou deschis", "info");
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t">
            <div className="text-sm text-muted-foreground">
              Showing {projects.filter(project => {
                if (!searchQuery) return true;
                return (
                  project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  project.client.toLowerCase().includes(searchQuery.toLowerCase())
                );
              }).length} of {projects.length} projects
            </div>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={!searchQuery} 
                onClick={handleClearSearch}
              >
                Clear filters
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Dialogs */}
      <NewProjectDialog 
        isOpen={isNewProjectDialogOpen}
        onOpenChange={setIsNewProjectDialogOpen}
        projectName={projectName}
        projectType={projectType}
        onProjectNameChange={(e) => setProjectName(e.target.value)}
        onProjectTypeChange={(e) => setProjectType(e.target.value)}
        onCreateProject={() => {
          if (!projectName.trim()) {
            showToast("Numele proiectului este obligatoriu", "error");
            return;
          }
          handleCreateProject();
          showToast(`Proiect "${projectName}" creat cu succes`, "success");
        }}
      />

      <ImportDesignDialog 
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        importUrl={importUrl}
        onImportUrlChange={(e) => setImportUrl(e.target.value)}
        onImportDesign={() => {
          if (!importUrl.trim()) {
            showToast("URL-ul de import este obligatoriu", "error");
            return;
          }
          showToast("Import design în curs...", "info");
          processImportedDesign();
        }}
      />
    </DesignerLayout>
  );
};

export default Projects;
