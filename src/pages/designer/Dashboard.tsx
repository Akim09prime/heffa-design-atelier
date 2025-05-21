
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Folder, Users, Grid, BrainCircuit } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpeningNewProject, setIsOpeningNewProject] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenNewProject = () => {
    if (isOpeningNewProject) return;
    setIsOpeningNewProject(true);
    toast({
      title: "🆕 New Project",
      description: "New Project form opened"
    });
    setTimeout(() => {
      setIsOpeningNewProject(false);
      // In a real app, you would open the project creation dialog here
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
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing
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
              className="bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
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
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              {isImporting ? "Importing..." : "Import Design"}
            </Button>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="flex items-center h-auto py-4 gap-3 justify-start"
                onClick={() => handleNav("/designer/projects", "Projects")}
              >
                <Folder className="h-5 w-5" /> Projects
              </Button>
              <Button
                variant="outline"
                className="flex items-center h-auto py-4 gap-3 justify-start"
                onClick={() => handleNav("/designer/clients", "Clients")}
              >
                <Users className="h-5 w-5" /> Clients
              </Button>
              <Button
                variant="outline"
                className="flex items-center h-auto py-4 gap-3 justify-start" 
                onClick={() => handleNav("/designer/materials", "Materials")}
              >
                <Grid className="h-5 w-5" /> Materials
              </Button>
              <Button
                variant="outline"
                className="flex items-center h-auto py-4 gap-3 justify-start"
                onClick={() => handleNav("/designer/ai-assistant", "AI Assistant")}
              >
                <BrainCircuit className="h-5 w-5" /> AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DesignerLayout>
  );
};

export default Dashboard;
