
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Folder, Users, Palette, Bot, Plus, Upload, Loader
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock function to simulate saving to Firebase
const saveToFirebase = async (collection: string, data: any) => {
  console.log(`Saving to ${collection}:`, data);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: Math.random().toString(36).substring(2, 9) };
};

// Mock function for project state
const setProject = (data: any) => {
  console.log("Setting project:", data);
};

const Dashboard = () => {
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isOpeningNewProject, setIsOpeningNewProject] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('Kitchen');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const showToast = (message: string, type: 'error' | 'success' | 'info') => {
    toast({
      title: message,
      variant: type === 'error' ? 'destructive' : 'default'
    });
  };

  const handleOpenNewProject = () => {
    if (isOpeningNewProject) return;
    setIsOpeningNewProject(true);
    setIsNewProjectDialogOpen(true);
    showToast("🆕 New Project form opened", "success");
    setTimeout(() => setIsOpeningNewProject(false), 800);
  };

  const handleCreateProject = () => {
    if (!projectName) {
      showToast("Project name is required", "error");
      return;
    }

    const newProject = {
      projectName,
      projectType,
      createdAt: new Date().toISOString(),
      modules: []
    };

    saveToFirebase("projects", newProject)
      .then(() => {
        showToast(`Project ${projectName} created successfully`, "success");
        setIsNewProjectDialogOpen(false);
        navigate('/designer/projects/new');
      })
      .catch(err => {
        showToast(`Error creating project: ${err.message}`, "error");
      });
  };

  const handleImportDesign = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return showToast("No file selected", "error");
    setIsImporting(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed.projectName) throw new Error("Invalid format");
      setProject(parsed);
      showToast("🎉 Design imported successfully", "success");
      await saveToFirebase("projects", parsed);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Import failed", "error");
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  const handleNav = (path: string, label: string) => {
    showToast(`Navigating to ${label}…`, "info");
    navigate(path);
  };

  return (
    <DesignerLayout>
      <div className="p-6 designer-theme">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-semibold designer-gradient-text">Designer Dashboard</h1>
            <p className="text-designer-text-muted">Create, manage and share your furniture designs</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleOpenNewProject}
              disabled={isOpeningNewProject}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl shadow-lg transition transform hover:scale-105"
              title="Start a new project"
            >
              {isOpeningNewProject
                ? <Loader className="h-5 w-5 animate-spin" />
                : <Plus className="h-5 w-5" />}
              {isOpeningNewProject ? "Opening..." : "New Project"}
            </button>
            
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImportDesign}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isImporting}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-xl shadow-lg transition transform hover:scale-105"
              title="Import an existing project"
            >
              {isImporting
                ? <Loader className="h-5 w-5 animate-spin" />
                : <Upload className="h-5 w-5" />}
              {isImporting ? "Importing..." : "Import Design"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="designer-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Quick Navigation</h3>
              <div className="flex flex-col gap-3">
                <button onClick={() => handleNav("/designer/projects", "Projects")} 
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-2 rounded-lg transition hover:scale-105 shadow-sm" 
                  title="Projects">
                  <Folder className="h-5 w-5" /> Projects
                </button>
                <button onClick={() => handleNav("/designer/clients", "Clients")} 
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-2 rounded-lg transition hover:scale-105 shadow-sm" 
                  title="Clients">
                  <Users className="h-5 w-5" /> Clients
                </button>
                <button onClick={() => handleNav("/designer/materials", "Materials")} 
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-2 rounded-lg transition hover:scale-105 shadow-sm" 
                  title="Materials">
                  <Palette className="h-5 w-5" /> Materials
                </button>
                <button onClick={() => handleNav("/designer/ai-assistant", "AI Assistant")} 
                  className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-3 py-2 rounded-lg transition hover:scale-105 shadow-sm" 
                  title="AI Assistant">
                  <Bot className="h-5 w-5" /> AI Assistant
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Additional dashboard cards can be added here */}
        </div>

        {/* New Project Dialog */}
        <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Fill in the basic details to create a new design project
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="projectName" className="text-right">
                  Name
                </Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="projectType" className="text-right">
                  Type
                </Label>
                <select
                  id="projectType"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewProjectDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DesignerLayout>
  );
};

export default Dashboard;
