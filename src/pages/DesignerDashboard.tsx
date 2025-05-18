import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SceneContainer } from '../components/3d/SceneContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Package, Clock, ArrowRight, Plus, ArrowUpRight,
  CheckCircle, AlertCircle, Printer, Folder, FolderPlus, Search
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

const DesignerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("Kitchen");
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleCreateProject = () => {
    setIsNewProjectDialogOpen(false);
    
    if (!projectName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Creating project",
      description: `Creating new ${projectType} project: ${projectName}`,
    });
    
    navigate('/designer/projects/new');
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleEditDesign = () => {
    toast({
      title: "Opening design editor",
      description: "Loading the design editor for Modern Kitchen Remodel",
    });
    navigate('/designer/projects/1');
  };

  const handleSendToClient = () => {
    toast({
      title: "Project shared with client",
      description: "Modern Kitchen Remodel has been shared with John Smith",
    });
  };

  const handleViewAllProjects = () => {
    navigate('/designer/projects');
  };

  const handleCheckInventory = () => {
    navigate('/designer/materials');
  };

  const handleResolveIssues = () => {
    toast({
      title: "Processing compatibility issues",
      description: "Resolving all compatibility issues...",
    });
  };

  return (
    <DesignerLayout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">Designer Dashboard</h1>
            <p className="text-muted-foreground">Manage your projects and clients</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsNewProjectDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow hover:shadow-lg transition-all duration-200 btn-glow"
            >
              <Plus size={18} className="mr-2" /> New Project
            </Button>
            <Button variant="outline" className="border-gray-300 hover:border-gray-400 hover:bg-gray-100">Import Design</Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md bg-white border border-gray-200 shadow-sm">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="clients"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Clients
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-white shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Active Projects</CardTitle>
                  <Package className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{activeProjects.length}</div>
                  <p className="text-sm text-muted-foreground">
                    2 awaiting review
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Active Clients</CardTitle>
                  <Users className="h-5 w-5 text-violet-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-violet-600">{clients.length}</div>
                  <p className="text-sm text-muted-foreground">
                    1 online now
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Deadlines</CardTitle>
                  <Clock className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">2</div>
                  <p className="text-sm text-muted-foreground">
                    Upcoming this week
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                <Card className="bg-white shadow-md border border-gray-200">
                  <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Track your ongoing design work</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <ul className="divide-y">
                      {activeProjects.map((project) => (
                        <li key={project.id} className="py-3 px-6 hover:bg-gray-50 transition-colors cursor-pointer" 
                          onClick={() => handleNavigation(`/designer/projects/${project.id}`)}>
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
                              <Button variant="ghost" size="icon">
                                <ArrowRight size={18} />
                              </Button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100">
                    <Button variant="link" className="ml-auto text-blue-600" onClick={handleViewAllProjects}>
                      View all projects
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-pink-50 to-red-50">
                      <CardTitle>Material Alerts</CardTitle>
                      <CardDescription>Stock and availability issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 py-2">
                        {materialAlerts.map((alert) => (
                          <li key={alert.id} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
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
                    <CardFooter className="border-t border-gray-100">
                      <Button variant="link" size="sm" className="ml-auto text-blue-600" onClick={handleCheckInventory}>
                        Check inventory
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                      <CardTitle>Compatibility Issues</CardTitle>
                      <CardDescription>Detected in current projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 py-2">
                        {compatibilityIssues.map((issue) => (
                          <li key={issue.id} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
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
                    <CardFooter className="border-t border-gray-100">
                      <Button variant="link" size="sm" className="ml-auto text-blue-600" onClick={handleResolveIssues}>
                        Resolve all
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
              
              <div>
                <Card className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle>Current Design Preview</CardTitle>
                    <CardDescription>Modern Kitchen Remodel</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-md overflow-hidden mb-4 border border-gray-200 shadow-inner">
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
                  <CardFooter className="flex justify-between border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-300"
                      onClick={handleSendToClient}
                    >
                      Send to Client
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleEditDesign}
                    >
                      Edit Design <ArrowUpRight size={14} className="ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card className="mt-6 bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2 border-b border-gray-100">
                    <CardTitle className="text-base">Recent Clients</CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <ul className="divide-y">
                      {clients.map((client) => (
                        <li 
                          key={client.id} 
                          className="py-2 px-6 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleNavigation(`/designer/clients/${client.id}`)}
                        >
                          <div>
                            <p className="font-medium text-sm">{client.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {client.projects} projects • {client.lastActive}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon">
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
            <div className="flex justify-between mb-6">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-9" />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleNavigation('/designer/projects/import')}>
                  Import
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleNavigation('/designer/projects/new')}
                >
                  <Plus size={16} className="mr-2" />
                  New Project
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.map((project) => (
                <Card key={project.id} className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleNavigation(`/designer/projects/${project.id}`)}>
                  <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Folder className="h-16 w-16 text-blue-300" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{project.name}</CardTitle>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        project.status === 'Client Review' ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <CardDescription>Client: {project.client}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mt-1 mb-3">
                      <div 
                        className={`h-full rounded-full ${
                          project.progress > 80 ? 'bg-green-500' : 
                          project.progress > 40 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Modules</p>
                        <p className="font-medium">{project.modules}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Price</p>
                        <p className="font-medium">${project.totalPrice}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 flex justify-between">
                    <Button variant="ghost" size="sm" className="text-blue-600">Details</Button>
                    <Button variant="outline" size="sm">
                      <Printer size={14} className="mr-1" /> 3D View
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center h-[340px] hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleNavigation('/designer/projects/new')}>
                <FolderPlus className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600">Create New Project</p>
                <p className="text-sm text-gray-500 mt-1">Start designing something new</p>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="clients" className="mt-6">
            <div className="flex justify-between mb-6">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search clients..." className="pl-9" />
              </div>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleNavigation('/designer/clients/new')}
              >
                <Plus size={16} className="mr-2" />
                New Client
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <Card key={client.id} className="bg-white shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                  onClick={() => handleNavigation(`/designer/clients/${client.id}`)}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 text-blue-800 h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle>{client.name}</CardTitle>
                        <CardDescription>{client.projects} projects</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Status:</span>
                        <span className={client.lastActive === 'Just now' ? 'text-green-600' : 'text-gray-600'}>
                          {client.lastActive === 'Just now' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-muted-foreground">Last active:</span>
                        <span>{client.lastActive}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t border-gray-100 flex justify-between">
                    <Button variant="ghost" size="sm" className="text-blue-600">Details</Button>
                    <Button variant="outline" size="sm">Message</Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Card className="bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center h-[230px] hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleNavigation('/designer/clients/new')}>
                <Users className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-600">Add New Client</p>
                <p className="text-sm text-gray-500 mt-1">Create a new client profile</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* New Project Dialog */}
        <Dialog open={isNewProjectDialogOpen} onOpenChange={setIsNewProjectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Fill in the basic information to start a new project.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter project name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="type" className="text-right text-sm font-medium">
                  Type
                </label>
                <select
                  id="type"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                >
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateProject} className="bg-blue-600 hover:bg-blue-700">
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DesignerLayout>
  );
};

export default DesignerDashboard;
