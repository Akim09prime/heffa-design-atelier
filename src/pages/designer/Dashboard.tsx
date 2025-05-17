
import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SceneContainer } from '../../components/3d/SceneContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Box, Clock, ArrowRight, Plus, ArrowUpRight,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
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

  const handleNavigation = (path: string, title: string) => {
    toast({
      title: `Navigating to ${title}`,
      description: "Loading content...",
    });
    console.log(`Navigating to ${path}`);
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-medium">Designer Dashboard</h1>
            <p className="text-muted-foreground">Manage your projects and clients</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => handleNavigation('/designer/new-project', 'New Project')}>
              <Plus size={18} className="mr-2" /> New Project
            </Button>
            <Button variant="outline" onClick={() => handleNavigation('/designer/import-design', 'Import Design')}>
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
            <Card>
              <CardHeader>
                <CardTitle>Projects Content</CardTitle>
                <CardDescription>View and manage all your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Projects listing and management would be shown here.</p>
                <Button 
                  className="mt-4"
                  onClick={() => handleNavigation('/designer/projects', 'Project List')}
                >
                  Go to Project Management
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Clients Content</CardTitle>
                <CardDescription>View and manage your clients</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Client listing and management would be shown here.</p>
                <Button 
                  className="mt-4"
                  onClick={() => handleNavigation('/designer/clients', 'Client List')}
                >
                  Go to Client Management
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesignerLayout>
  );
};

export default Dashboard;
