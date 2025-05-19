
import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, Plus, Upload, Users, Database, Box, FileText, BarChart3, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Sample data for activity chart
const activityData = [
  { month: 'Jan', projects: 20, materials: 15, accessories: 12 },
  { month: 'Feb', projects: 25, materials: 22, accessories: 14 },
  { month: 'Mar', projects: 30, materials: 28, accessories: 18 },
  { month: 'Apr', projects: 27, materials: 25, accessories: 16 },
  { month: 'May', projects: 32, materials: 30, accessories: 19 },
  { month: 'Jun', projects: 35, materials: 32, accessories: 24 },
];

// Sample material data
const materials = [
  {
    code: 'PAL-H1334-ST9',
    name: 'Light Oak',
    type: 'PAL',
    price: '€32.50/m²'
  },
  {
    code: 'MDF-AGT-754',
    name: 'Grey Matt',
    type: 'MDF-AGT',
    price: '€45.90/m²'
  },
  {
    code: 'GLASS-S-8',
    name: 'Satin 8mm',
    type: 'GLASS',
    price: '€68.00/m²'
  }
];

// Sample system alerts
const systemAlerts = [
  {
    id: 1,
    title: 'Material Import Failed',
    description: 'The automatic import from Egger catalog failed. Check connection.',
    severity: 'error'
  },
  {
    id: 2,
    title: 'Low Stock Alert',
    description: '5 materials are below minimum stock level',
    severity: 'warning'
  },
  {
    id: 3,
    title: 'New Price Update',
    description: 'Hafele updated their price list. Review changes.',
    severity: 'info'
  },
  {
    id: 4,
    title: 'System Maintenance',
    description: 'Scheduled maintenance in 2 days',
    severity: 'info'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigation = (path: string, title: string) => {
    toast({
      title: `Navigating to ${title}`,
      description: "Loading content..."
    });
    navigate(path);
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} initiated`,
      description: "Processing your request..."
    });
    
    // Navigate based on action
    switch (action) {
      case 'Import Materials':
        navigate('/admin/import-data');
        break;
      case 'Add User':
        navigate('/admin/users');
        break;
      case 'Add Accessory':
        navigate('/admin/accessories');
        break;
      case 'Generate Report':
        navigate('/admin/reports');
        break;
      default:
        break;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-medium text-white">Admin Dashboard</h1>
            <p className="text-admin-text-secondary">System overview and management</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => handleNavigation("/admin/reports/new", "Create Report")}
              className="bg-admin-accent-purple hover:bg-admin-accent-purple/80 text-white"
            >
              <FileText size={18} className="mr-2" /> Generate Report
            </Button>
            <Button 
              variant="outline"
              className="border-admin-border-light text-admin-text-secondary hover:bg-admin-bg-highlight hover:text-admin-text-primary"
              onClick={() => handleNavigation("/admin/import-data", "Import Data")}
            >
              <Upload size={18} className="mr-2" /> Import Data
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-admin-bg-secondary to-admin-bg-tertiary border-admin-border-light text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">248</div>
              <p className="text-sm text-admin-status-success font-medium">
                +12% <span className="text-admin-text-secondary font-normal">vs. last month</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-admin-bg-secondary to-admin-bg-tertiary border-admin-border-light text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white">Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">542</div>
              <p className="text-sm text-admin-status-success font-medium">
                +8 <span className="text-admin-text-secondary font-normal">new items added</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-admin-bg-secondary to-admin-bg-tertiary border-admin-border-light text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white">Accessories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">324</div>
              <p className="text-sm text-admin-status-success font-medium">
                +4% <span className="text-admin-text-secondary font-normal">inventory value</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-admin-bg-secondary to-admin-bg-tertiary border-admin-border-light text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">157</div>
              <p className="text-sm text-admin-status-info font-medium">
                +24 <span className="text-admin-text-secondary font-normal">active projects</span>
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-admin-bg-secondary border-admin-border-light">
              <CardHeader>
                <CardTitle className="text-white">System Activity</CardTitle>
                <CardDescription className="text-admin-text-muted">Monthly data overview</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <XAxis dataKey="month" stroke="#8E9196" />
                    <YAxis stroke="#8E9196" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1A1F2C', 
                        borderColor: '#2d3748',
                        color: '#FFFFFF' 
                      }} 
                    />
                    <Bar dataKey="projects" fill="#8B5CF6" name="Projects" />
                    <Bar dataKey="materials" fill="#0EA5E9" name="Materials" />
                    <Bar dataKey="accessories" fill="#D946EF" name="Accessories" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="bg-admin-bg-secondary border-admin-border-light">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Recently Added Materials</CardTitle>
                  <CardDescription className="text-admin-text-muted">Latest additions to your materials database</CardDescription>
                </div>
                <Button 
                  variant="link" 
                  size="sm"
                  className="text-admin-text-link"
                  onClick={() => handleNavigation("/admin/materials-database", "Materials Database")}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-admin-border-mid">
                        <th className="px-6 py-3 text-left text-xs font-medium text-admin-text-muted uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-admin-text-muted uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-admin-text-muted uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-admin-text-muted uppercase tracking-wider">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-border-light">
                      {materials.map((material, i) => (
                        <tr key={i} className="hover:bg-admin-bg-highlight">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{material.code}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-text-secondary">{material.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-text-secondary">{material.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-text-secondary">{material.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="border-t border-admin-border-mid px-6 py-4">
                <Button 
                  className="ml-auto bg-admin-accent-purple hover:bg-admin-accent-purple/80 text-white"
                  onClick={() => handleNavigation("/admin/materials-database/new", "Add Material")}
                >
                  <Plus size={16} className="mr-2" />
                  Add New Material
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="bg-admin-bg-secondary border-admin-border-light">
              <CardHeader>
                <CardTitle className="text-white">System Alerts</CardTitle>
                <CardDescription className="text-admin-text-muted">Important notifications</CardDescription>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <ul className="divide-y divide-admin-border-light">
                  {systemAlerts.map((alert) => (
                    <li key={alert.id} className="px-6 py-4 hover:bg-admin-bg-highlight">
                      <div className="flex flex-col space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-white flex items-center">
                            {alert.severity === 'error' && (
                              <AlertTriangle size={16} className="text-admin-status-error mr-2" />
                            )}
                            {alert.severity === 'warning' && (
                              <AlertTriangle size={16} className="text-admin-status-warning mr-2" />
                            )}
                            {alert.severity === 'info' && (
                              <AlertTriangle size={16} className="text-admin-status-info mr-2" />
                            )}
                            {alert.title}
                            {alert.severity === 'error' && (
                              <Badge className="ml-2 bg-admin-status-error text-white">Error</Badge>
                            )}
                            {alert.severity === 'warning' && (
                              <Badge className="ml-2 bg-admin-status-warning text-white">Warning</Badge>
                            )}
                          </p>
                        </div>
                        <p className="text-sm text-admin-text-muted">{alert.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="border-t border-admin-border-mid px-6 py-4">
                <Button 
                  variant="link" 
                  className="ml-auto text-admin-text-link"
                  onClick={() => handleNavigation("/admin/alerts", "All Alerts")}
                >
                  View All Alerts
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-admin-bg-secondary border-admin-border-light">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button 
                  className="w-full sm:w-auto flex-grow bg-admin-bg-tertiary hover:bg-admin-bg-highlight text-admin-text-secondary border border-admin-border-light"
                  onClick={() => handleQuickAction("Import Materials")}
                >
                  <Database size={16} className="mr-2" />
                  Import Materials
                </Button>
                <Button 
                  className="w-full sm:w-auto flex-grow bg-admin-bg-tertiary hover:bg-admin-bg-highlight text-admin-text-secondary border border-admin-border-light"
                  onClick={() => handleQuickAction("Add User")}
                >
                  <Users size={16} className="mr-2" />
                  Add User
                </Button>
                <Button 
                  className="w-full sm:w-auto flex-grow bg-admin-bg-tertiary hover:bg-admin-bg-highlight text-admin-text-secondary border border-admin-border-light"
                  onClick={() => handleQuickAction("Add Accessory")}
                >
                  <Box size={16} className="mr-2" />
                  Add Accessory
                </Button>
                <Button 
                  className="w-full sm:w-auto flex-grow bg-admin-bg-tertiary hover:bg-admin-bg-highlight text-admin-text-secondary border border-admin-border-light"
                  onClick={() => handleQuickAction("Generate Report")}
                >
                  <FileText size={16} className="mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
