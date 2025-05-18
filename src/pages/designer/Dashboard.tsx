
import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SceneContainer } from '../../components/3d/SceneContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Box, Clock, ArrowRight, Plus, ArrowUpRight,
  CheckCircle, AlertCircle, FileText, Folder, Search, Filter
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("Kitchen");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Sample data
  const clients = [
    { id: '1', name: 'John Smith', projects: 3, lastActive: '2 days ago' },
    { id: '2', name: 'Emma Johnson', projects: 1, lastActive: 'Just now' },
    { id: '3', name: 'Michael Brown', projects: 5, lastActive: '1 week ago' },
  ];
  
  const activeProjects = [
    { 
      id: '1', 
      name: 'Modern Kitchen Remodel', 
      client: 'John Smith', 
      deadline: '2023-06-30',
      status: 'In Progress',
      progress: 65,
      modules: 8,
      totalPrice: 4850
    },
    { 
      id: '2', 
      name: 'Office Renovation', 
      client: 'Emma Johnson', 
      deadline: '2023-07-15',
      status: 'Client Review',
      progress: 40,
      modules: 5,
      totalPrice: 3200
    },
    { 
      id: '3', 
      name: 'Bathroom Cabinet Set', 
      client: 'Michael Brown', 
      deadline: '2023-06-10',
      status: 'Pending Approval',
      progress: 90,
      modules: 3,
      totalPrice: 1800
    },
  ];
  
  const materialAlerts = [
    { id: '1', material: 'MDF Classic White', issue: 'Low stock', severity: 'warning' },
    { id: '2', material: 'Glass Panel (10mm)', issue: 'Out of stock', severity: 'error' },
    { id: '3', material: 'Blum Hinges (35mm)', issue: '3 week delay', severity: 'info' },
  ];
  
  const compatibilityIssues = [
    { 
      id: '1', 
      project: 'Modern Kitchen Remodel',
      issue: 'MDF with CNC rifled processing requires special edge banding',
      severity: 'warning'
    },
    { 
      id: '2', 
      project: 'Office Renovation',
      issue: 'Glass panel thickness incompatible with selected frame',
      severity: 'error'
    },
  ];

  const handleNavigation = (path: string, title: string) => {
    toast({
      title: `Navigating to ${title}`,
      description: "Loading content...",
    });
    navigate(path);
  };

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
  
  // Handle importing a design
  const handleImportDesign = () => {
    toast({
      title: "Import Design",
      description: "Opening design import wizard...",
    });
    navigate('/designer/projects/import');
  };

  // Filter projects based on search query
  const filteredProjects = activeProjects.filter(project => {
    if (!projectSearchQuery) return true;
    return project.name.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
           project.client.toLowerCase().includes(projectSearchQuery.toLowerCase());
  });

  // Filter clients based on search query
  const filteredClients = clients.filter(client => {
    if (!clientSearchQuery) return true;
    return client.name.toLowerCase().includes(clientSearchQuery.toLowerCase());
  });

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-medium">Designer Dashboard</h1>
            <p className="text-muted-foreground">Manage your projects and clients</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setIsNewProjectDialogOpen(true)}>
              <Plus size={18} className="mr-2" /> New Project
            </Button>
            <Button variant="outline" onClick={handleImportDesign}>
              Import Design
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Active Projects</CardTitle>
                  <Box className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{activeProjects.length}</div>
                  <p className="text-sm text-muted-foreground">
                    2 awaiting review
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Active Clients</CardTitle>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{clients.length}</div>
                  <p className="text-sm text-muted-foreground">
                    1 online now
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Deadlines</CardTitle>
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">2</div>
                  <p className="text-sm text-muted-foreground">
                    Upcoming this week
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Track your ongoing design work</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <ul className="divide-y">
                      {activeProjects.map((project) => (
                        <li key={project.id} className="py-3 px-6">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{project.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Client: {project.client} • Due: {project.deadline}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="hidden md:flex items-center gap-2">
                                <span className="text-sm font-medium">{project.progress}%</span>
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      project.progress > 80 ? 'bg-green-500' : 
                                      project.progress > 40 ? 'bg-blue-500' : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleNavigation(`/designer/projects/${project.id}`, project.name)}
                              >
                                <ArrowRight size={18} />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="link" 
                      className="ml-auto"
                      onClick={() => handleNavigation('/designer/projects', 'All Projects')}
                    >
                      View all projects
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Material Alerts</CardTitle>
                      <CardDescription>Stock and availability issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {materialAlerts.map((alert) => (
                          <li key={alert.id} className="flex items-start gap-2">
                            {alert.severity === 'error' ? (
                              <AlertCircle size={16} className="mt-0.5 text-red-500" />
                            ) : (
                              <AlertCircle size={16} className="mt-0.5 text-amber-500" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{alert.material}</p>
                              <p className="text-xs text-muted-foreground">{alert.issue}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="ml-auto"
                        onClick={() => handleNavigation('/designer/materials', 'Materials')}
                      >
                        Check inventory
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Compatibility Issues</CardTitle>
                      <CardDescription>Detected in current projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {compatibilityIssues.map((issue) => (
                          <li key={issue.id} className="flex items-start gap-2">
                            {issue.severity === 'error' ? (
                              <AlertCircle size={16} className="mt-0.5 text-red-500" />
                            ) : (
                              <AlertCircle size={16} className="mt-0.5 text-amber-500" />
                            )}
                            <div>
                              <p className="font-medium text-sm">{issue.project}</p>
                              <p className="text-xs text-muted-foreground">{issue.issue}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="ml-auto"
                        onClick={() => handleNavigation('/designer/ai-assistant', 'AI Assistant')}
                      >
                        Resolve all
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              <div>
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>Current Design Preview</CardTitle>
                    <CardDescription>Modern Kitchen Remodel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-md overflow-hidden mb-4">
                      <SceneContainer />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Modules:</span>
                        <span className="font-medium">8 items</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Price:</span>
                        <span className="font-medium">$4,850</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="font-medium">John Smith</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium text-blue-600">In Progress</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleNavigation('/designer/projects/1/share', 'Share Project')}
                    >
                      Send to Client
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleNavigation('/designer/projects/1/edit', 'Edit Project')}
                    >
                      Edit Design <ArrowUpRight size={14} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Clients</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <ul className="divide-y">
                      {clients.map((client) => (
                        <li key={client.id} className="py-2 px-6 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{client.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {client.projects} projects • {client.lastActive}
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleNavigation(`/designer/clients/${client.id}`, client.name)}
                          >
                            <ArrowRight size={16} />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Project Management</h2>
              <div className="flex space-x-2">
                <Button onClick={() => setIsNewProjectDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> New Project
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-9"
                  value={projectSearchQuery}
                  onChange={(e) => setProjectSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleNavigation(`/designer/projects/${project.id}`, project.name)}>
                  <div className="h-36 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                    <Folder className="h-20 w-20 text-blue-200" />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{project.name}</CardTitle>
                      <Badge>{project.status}</Badge>
                    </div>
                    <CardDescription>Client: {project.client}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Deadline:</span>
                        <span>{project.deadline}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div 
                          className={`h-full rounded-full ${
                            project.progress > 80 ? 'bg-green-500' : 
                            project.progress > 40 ? 'bg-blue-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button variant="ghost" size="sm" onClick={(e) => {
                      e.stopPropagation();
                      handleNavigation(`/designer/projects/${project.id}`, project.name);
                    }}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Box className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-lg font-medium">No projects found</h3>
                <p className="mt-1 text-gray-500">
                  {projectSearchQuery ? `No results match "${projectSearchQuery}"` : "Start by creating a new project"}
                </p>
                <Button className="mt-4" onClick={() => setIsNewProjectDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Create New Project
                </Button>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <Button 
                variant="outline"
                onClick={() => handleNavigation('/designer/projects', 'All Projects')}
              >
                View All Projects
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Client Management</h2>
              <Button onClick={() => handleNavigation('/designer/clients/new', 'New Client')}>
                <Plus className="h-4 w-4 mr-2" /> New Client
              </Button>
            </div>
            
            <div className="mb-6">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search clients..."
                  className="pl-9"
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Client List</CardTitle>
                <CardDescription>
                  {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                      <li key={client.id} className="py-3 hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleNavigation(`/designer/clients/${client.id}`, client.name)}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              <span>{client.projects} projects</span>
                              <span className="mx-2">•</span>
                              <span>Last active: {client.lastActive}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigation(`/designer/clients/${client.id}`, client.name);
                            }}
                          >
                            <ArrowRight size={16} />
                          </Button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-lg font-medium">No clients found</h3>
                      <p className="mt-1 text-gray-500">
                        {clientSearchQuery ? `No results match "${clientSearchQuery}"` : "Add a new client to get started"}
                      </p>
                      <Button 
                        className="mt-4" 
                        onClick={() => handleNavigation('/designer/clients/new', 'New Client')}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Client
                      </Button>
                    </div>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => handleNavigation('/designer/clients', 'All Clients')}
                  className="ml-auto"
                >
                  View All Clients
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
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
      </div>
    </DesignerLayout>
  );
};

export default Dashboard;
