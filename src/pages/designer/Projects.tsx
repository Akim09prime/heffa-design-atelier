
import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, ArrowRight, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("Kitchen");

  // Sample projects data
  const projects = [
    { 
      id: '1',
      name: 'Modern Kitchen Remodel',
      client: 'John Smith',
      createdAt: '2023-05-10',
      deadline: '2023-06-30',
      status: 'in_progress',
      modules: 8,
      progress: 65
    },
    { 
      id: '2',
      name: 'Office Renovation',
      client: 'Emma Johnson',
      createdAt: '2023-05-05',
      deadline: '2023-07-15',
      status: 'client_review',
      modules: 5,
      progress: 40
    },
    { 
      id: '3',
      name: 'Master Bedroom Wardrobe',
      client: 'Robert Davis',
      createdAt: '2023-04-20',
      deadline: '2023-06-10',
      status: 'approved',
      modules: 6,
      progress: 100
    },
    { 
      id: '4',
      name: 'Bathroom Cabinet Set',
      client: 'Michael Brown',
      createdAt: '2023-05-15',
      deadline: '2023-06-10',
      status: 'pending_approval',
      modules: 3,
      progress: 90
    },
    { 
      id: '5',
      name: 'Living Room Entertainment Center',
      client: 'Sarah Wilson',
      createdAt: '2023-04-25',
      deadline: '2023-07-05',
      status: 'in_progress',
      modules: 4,
      progress: 30
    },
  ];

  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'client_review':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Client Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'pending_approval':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Pending Approval</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    return (
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle creating a new project
  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Project Created",
      description: `Created new ${projectType} project: ${projectName}`,
    });

    // Navigate to the new project page
    navigate('/designer/projects/new');
    
    // Reset form and close dialog
    setProjectName("");
    setIsNewProjectDialogOpen(false);
  };

  // Handle viewing project details
  const handleViewProject = (projectId: string, projectName: string) => {
    toast({
      title: "Opening Project",
      description: `Loading ${projectName}...`,
    });
    navigate(`/designer/projects/${projectId}`);
  };

  // Handle importing a design
  const handleImportDesign = () => {
    toast({
      title: "Import Design",
      description: "Opening design import wizard...",
    });
    navigate('/designer/projects/import');
  };

  return (
    <DesignerLayout>
      <div className="p-6">
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleImportDesign}>
              Import Design
            </Button>
            <Button onClick={() => setIsNewProjectDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>View and manage your design projects</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleViewProject(project.id, project.name)}>
                      <TableCell className="font-medium">
                        {project.name}
                        <div className="text-xs text-muted-foreground">{project.modules} modules</div>
                      </TableCell>
                      <TableCell>{project.client}</TableCell>
                      <TableCell>{project.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                          {project.deadline}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                project.progress >= 100 ? 'bg-green-500' :
                                project.progress > 70 ? 'bg-emerald-500' : 
                                project.progress > 30 ? 'bg-blue-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs whitespace-nowrap">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProject(project.id, project.name);
                          }}
                        >
                          <ArrowRight className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-muted-foreground mb-2">
                          {searchQuery ? `No projects found matching "${searchQuery}"` : "No projects have been created yet"}
                        </p>
                        <Button onClick={() => setIsNewProjectDialogOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" /> Create New Project
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {projects.length} projects
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled={!searchQuery} onClick={() => setSearchQuery("")}>
                Clear filters
              </Button>
            </div>
          </CardFooter>
        </Card>
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
              <label htmlFor="projectName" className="text-right">
                Name
              </label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="projectType" className="text-right">
                Type
              </label>
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
    </DesignerLayout>
  );
};

export default Projects;
