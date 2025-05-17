
import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  Box,
  CircleDollarSign,
  Palette,
  Plus,
  Settings,
  Users,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { toast } = useToast();

  const handleNavigation = (path: string, title: string) => {
    toast({
      title: `Navigating to ${title}`,
      description: "Loading content...",
    });
    console.log(`Navigating to ${path}`);
  };

  // Sample statistics for the dashboard
  const stats = [
    { 
      title: "Total Users", 
      value: "248", 
      change: "+12%", 
      description: "vs. last month", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      title: "Materials", 
      value: "542", 
      change: "+8", 
      description: "new items added", 
      icon: <Palette className="h-5 w-5" /> 
    },
    { 
      title: "Accessories", 
      value: "324", 
      change: "+4%", 
      description: "inventory value", 
      icon: <Wrench className="h-5 w-5" /> 
    },
    { 
      title: "Projects", 
      value: "157", 
      change: "+24", 
      description: "active projects", 
      icon: <Box className="h-5 w-5" /> 
    },
  ];

  // Sample alerts
  const alerts = [
    { 
      id: 1, 
      title: "Material Import Failed", 
      description: "The automatic import from Egger catalog failed. Check connection.", 
      severity: "error" 
    },
    { 
      id: 2, 
      title: "Low Stock Alert", 
      description: "5 materials are below minimum stock level", 
      severity: "warning" 
    },
    { 
      id: 3, 
      title: "New Price Update", 
      description: "Hafele updated their price list. Review changes.", 
      severity: "info" 
    },
    { 
      id: 4, 
      title: "System Maintenance", 
      description: "Scheduled maintenance in 2 days", 
      severity: "info" 
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">Admin Dashboard</h1>
            <p className="text-gray-300">System overview and management</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => handleNavigation('/admin/import-data', 'Import Data')}
            >
              <Plus size={18} className="mr-2" /> Import Data
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleNavigation('/admin/settings', 'Settings')}
            >
              <Settings size={18} className="mr-2" /> Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">{stat.title}</CardTitle>
                <div className="p-1 bg-gray-700 rounded-md">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs flex items-center">
                  <span className="text-green-400 mr-1">{stat.change}</span> 
                  <span className="text-gray-400">{stat.description}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Main content area */}
          <div className="col-span-2 space-y-6">
            {/* Revenue Chart Card */}
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>System Activity</CardTitle>
                  <CircleDollarSign className="h-4 w-4 text-gray-400" />
                </div>
                <CardDescription className="text-gray-400">Monthly data overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-md">
                  <BarChart3 className="h-16 w-16 text-gray-600" />
                  <p className="ml-4 text-gray-400">Activity visualization will appear here</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Materials */}
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recently Added Materials</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleNavigation('/admin/materials-database', 'Materials Database')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between pb-2 border-b border-gray-700">
                    <div className="w-1/4">Code</div>
                    <div className="w-1/3">Name</div>
                    <div className="w-1/5">Type</div>
                    <div className="w-1/5 text-right">Price</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-1/4 text-gray-400">PAL-H1334-ST9</div>
                    <div className="w-1/3">Light Oak</div>
                    <div className="w-1/5">PAL</div>
                    <div className="w-1/5 text-right">€32.50/m²</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-1/4 text-gray-400">MDF-AGT-754</div>
                    <div className="w-1/3">Grey Matt</div>
                    <div className="w-1/5">MDF-AGT</div>
                    <div className="w-1/5 text-right">€45.90/m²</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-1/4 text-gray-400">GLASS-S-8</div>
                    <div className="w-1/3">Satin 8mm</div>
                    <div className="w-1/5">GLASS</div>
                    <div className="w-1/5 text-right">€68.00/m²</div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  variant="outline"
                  onClick={() => handleNavigation('/admin/materials-database/add', 'Add Material')}
                >
                  Add New Material
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription className="text-gray-400">Important notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className={`flex p-3 rounded-lg ${
                      alert.severity === 'error' ? 'bg-red-900/20 border-red-900' :
                      alert.severity === 'warning' ? 'bg-amber-900/20 border-amber-900' :
                      'bg-blue-900/20 border-blue-900'
                    } border`}
                  >
                    <AlertCircle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'error' ? 'text-red-500' :
                      alert.severity === 'warning' ? 'text-amber-500' :
                      'text-blue-500'
                    } mr-3`} />
                    <div>
                      <h5 className="font-medium">{alert.title}</h5>
                      <p className="text-sm text-gray-400">{alert.description}</p>
                    </div>
                  </div>
                ))}
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => handleNavigation('/admin/alerts', 'All Alerts')}
                >
                  View All Alerts
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleNavigation('/admin/materials-database/import', 'Import Materials')}
                >
                  <Box className="mr-2 h-4 w-4" /> Import Materials
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleNavigation('/admin/users/new', 'Add User')}
                >
                  <Users className="mr-2 h-4 w-4" /> Add User
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleNavigation('/admin/accessories/new', 'Add Accessory')}
                >
                  <Wrench className="mr-2 h-4 w-4" /> Add Accessory
                </Button>
                <Button 
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleNavigation('/admin/reports/generate', 'Generate Report')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" /> Generate Report
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
