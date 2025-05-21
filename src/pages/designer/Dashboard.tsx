
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Upload, Folder, Users, Grid, BrainCircuit } from 'lucide-react';
import { NewProjectDialog } from '@/components/projects/NewProjectDialog';
import { ImportDesignDialog } from '@/components/projects/ImportDesignDialog';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpeningNewProject, setIsOpeningNewProject] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);
  const [importUrl, setImportUrl] = React.useState('');
  const [projectName, setProjectName] = React.useState('');
  const [projectType, setProjectType] = React.useState('Kitchen');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenNewProject = () => {
    if (isOpeningNewProject) return;
    setIsOpeningNewProject(true);
    setIsNewProjectDialogOpen(true);
    toast({
      title: "🆕 New Project",
      description: "New Project form opened"
    });
    setTimeout(() => {
      setIsOpeningNewProject(false);
    }, 800);
  };

  const handleImportDesign = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive"
      });
      return;
    }
    
    setIsImporting(true);
    try {
      // In a real app, process the imported file here
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed.projectName) throw new Error("Invalid format");
      
      toast({
        title: "🎉 Success",
        description: "Design imported successfully"
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Import failed",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  const handleImportFromUrl = () => {
    if (!importUrl) {
      toast({
        title: "Error", 
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsImporting(true);
    // Simulate importing process
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Design imported successfully"
      });
      setIsImporting(false);
      setIsImportDialogOpen(false);
      setImportUrl('');
    }, 1500);
  };

  const handleCreateProject = () => {
    if (!projectName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, create the project here
    toast({
      title: "Success",
      description: `Project "${projectName}" created successfully`
    });
    setProjectName('');
    setProjectType('Kitchen');
    setIsNewProjectDialogOpen(false);
  };

  const handleNav = (path: string, label: string) => {
    toast({
      title: "Navigating",
      description: `Navigating to ${label}…`
    });
    navigate(path);
  };

  return (
    <DesignerLayout>
      <div className="p-6 designer-theme">
        <h1 className="text-3xl font-semibold designer-gradient-text">Designer Dashboard</h1>
        <p className="text-designer-text-muted">Welcome to your HeffaDesign workspace</p>
        
        <div className="mt-8">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={handleOpenNewProject}
              disabled={isOpeningNewProject}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              {isOpeningNewProject
                ? <Loader className="h-5 w-5 animate-spin" />
                : <Plus className="h-5 w-5" />}
              {isOpeningNewProject ? "Opening..." : "New Project"}
            </Button>

            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImportDesign}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl shadow-lg transition transform hover:scale-105"
            >
              {isImporting
                ? <Loader className="h-5 w-5 animate-spin" />
                : <Upload className="h-5 w-5" />}
              {isImporting ? "Importing..." : "Import Design"}
            </Button>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleNav("/designer/projects", "Projects")}
                className="btn-nav"
                title="Projects"
              >
                <Folder className="h-5 w-5" /> Projects
              </button>
              <button
                onClick={() => handleNav("/designer/clients", "Clients")}
                className="btn-nav"
                title="Clients"
              >
                <Users className="h-5 w-5" /> Clients
              </button>
              <button
                onClick={() => handleNav("/designer/materials", "Materials")}
                className="btn-nav"
                title="Materials"
              >
                <Grid className="h-5 w-5" /> Materials
              </button>
              <button
                onClick={() => handleNav("/designer/ai-assistant", "AI Assistant")}
                className="btn-nav"
                title="AI Assistant"
              >
                <BrainCircuit className="h-5 w-5" /> AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* New Project Dialog */}
      <NewProjectDialog
        isOpen={isNewProjectDialogOpen}
        onOpenChange={setIsNewProjectDialogOpen}
        projectName={projectName}
        projectType={projectType}
        onProjectNameChange={(e) => setProjectName(e.target.value)}
        onProjectTypeChange={(e) => setProjectType(e.target.value)}
        onCreateProject={handleCreateProject}
      />

      {/* Import Design Dialog */}
      <ImportDesignDialog
        isOpen={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        importUrl={importUrl}
        onImportUrlChange={(e) => setImportUrl(e.target.value)}
        onImportDesign={handleImportFromUrl}
      />

      <style jsx>{`
        .btn-nav {
          @apply flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-2 rounded-lg transition hover:scale-105 shadow-sm;
        }
      `}</style>
    </DesignerLayout>
  );
};

export default Dashboard;
