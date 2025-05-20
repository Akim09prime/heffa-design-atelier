
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, ArrowRight, Plus, Upload, Users, Database, Box, FileText, BarChart3, Filter, CheckCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTranslation } from '@/contexts/TranslationContext';

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

// Sample project data
const projectsData = [
  {
    id: '1',
    name: 'Modern Kitchen Set',
    client: 'John Smith',
    designer: 'Maria Popescu',
    progress: 75,
    status: 'În lucru',
    lastUpdate: '2 ore în urmă',
    isNew: true
  },
  {
    id: '2',
    name: 'Office Furniture Set',
    client: 'Tech Solutions SRL',
    designer: 'Alex Ionescu',
    progress: 90,
    status: 'În lucru',
    lastUpdate: '1 zi în urmă',
    isNew: false
  },
  {
    id: '3',
    name: 'Living Room Remodel',
    client: 'Elena Dumitru',
    designer: 'Maria Popescu',
    progress: 30,
    status: 'În lucru',
    lastUpdate: '3 ore în urmă',
    isNew: true
  },
  {
    id: '4',
    name: 'Master Bedroom Closets',
    client: 'Daniel Popa',
    designer: 'Mihai Stanescu',
    progress: 100,
    status: 'Finalizat',
    lastUpdate: '2 zile în urmă',
    isNew: false
  },
  {
    id: '5',
    name: 'Kid Room Furniture',
    client: 'Ana Marin',
    designer: 'Alex Ionescu',
    progress: 100,
    status: 'Finalizat',
    lastUpdate: '4 zile în urmă',
    isNew: false
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('');
  const [designerFilter, setDesignerFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(projectsData);

  // Filter projects based on selected filters
  React.useEffect(() => {
    let result = projectsData;
    
    if (statusFilter !== 'all') {
      result = result.filter(project => 
        statusFilter === 'active' 
          ? project.status === 'În lucru' 
          : project.status === 'Finalizat'
      );
    }
    
    if (clientFilter) {
      result = result.filter(project => 
        project.client.toLowerCase().includes(clientFilter.toLowerCase())
      );
    }
    
    if (designerFilter !== 'all') {
      result = result.filter(project => 
        project.designer === designerFilter
      );
    }
    
    setFilteredProjects(result);
  }, [statusFilter, clientFilter, designerFilter]);

  const handleNavigation = (path: string, title: string) => {
    toast({
      title: `${t('common.loading')}: ${title}`,
      description: t('common.loading')
    });
    navigate(path);
  };

  const handleQuickAction = (action: string) => {
    toast({
      title: `${action} ${t('common.loading').toLowerCase()}`,
      description: t('common.loading')
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

  // Count active and completed projects
  const activeProjects = projectsData.filter(p => p.status === 'În lucru').length;
  const completedProjects = projectsData.filter(p => p.status === 'Finalizat').length;
  const totalClients = [...new Set(projectsData.map(p => p.client))].length;
  const totalFurniturePieces = 127; // Exemplu static

  // Get unique designers for filter
  const designers = ['all', ...new Set(projectsData.map(p => p.designer))];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-medium text-white">{t('admin.menu.dashboard')}</h1>
            <p className="text-admin-text-secondary">Vizualizare generală a sistemului</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => handleNavigation("/admin/reports/new", t('admin.reports.exportReport'))}
              className="bg-admin-accent-purple hover:bg-admin-accent-purple/80 text-white"
            >
              <FileText size={18} className="mr-2 animate-icon" /> {t('admin.reports.exportReport')}
            </Button>
            <Button 
              variant="outline"
              className="border-admin-border-light text-admin-text-secondary hover:bg-admin-bg-highlight hover:text-admin-text-primary"
              onClick={() => handleNavigation("/admin/import-data", t('admin.menu.importData'))}
            >
              <Upload size={18} className="mr-2 animate-icon" /> {t('common.import')}
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-admin-bg-secondary border border-admin-border-light rounded-lg p-4 mb-8 flex flex-wrap gap-4 items-center">
          <div className="flex items-center">
            <span className="text-white mr-2">{t('admin.dashboard.status')}:</span>
            <Select defaultValue="all" onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-admin-bg-tertiary text-admin-text-secondary border-admin-border-light">
                <SelectValue placeholder={t('common.all')} />
              </SelectTrigger>
              <SelectContent className="bg-admin-bg-secondary border-admin-border-light">
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="active">{t('admin.dashboard.active')}</SelectItem>
                <SelectItem value="completed">{t('admin.dashboard.completed')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <span className="text-white mr-2">{t('admin.dashboard.client')}:</span>
            <Input 
              type="text" 
              placeholder={t('admin.dashboard.searchClient')} 
              className="w-[200px] bg-admin-bg-tertiary text-admin-text-secondary border-admin-border-light"
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <span className="text-white mr-2">{t('admin.dashboard.designer')}:</span>
            <Select defaultValue="all" onValueChange={setDesignerFilter}>
              <SelectTrigger className="w-[180px] bg-admin-bg-tertiary text-admin-text-secondary border-admin-border-light">
                <SelectValue placeholder={t('admin.dashboard.allDesigners')} />
              </SelectTrigger>
              <SelectContent className="bg-admin-bg-secondary border-admin-border-light">
                {designers.map((designer, index) => (
                  <SelectItem key={index} value={designer}>
                    {designer === 'all' ? t('admin.dashboard.allDesigners') : designer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            className="ml-auto border-admin-border-light text-admin-text-secondary hover:bg-admin-bg-highlight"
          >
            <Filter size={16} className="mr-2 animate-icon" /> {t('admin.dashboard.advancedFilters')}
          </Button>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-admin-bg-secondary to-admin-bg-tertiary border-admin-border-light text-white card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-blue-500/20 mr-3">
                  <Clock size={20} className="text-blue-500 animate-icon" />
                </div>
                <CardTitle className="text-lg font-medium text-white">{t('admin.dashboard.activeProjects')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{activeProjects}</div>
              <p className="text-sm text-admin-status-success font-medium">
                {activeProjects > 3 ? '+12% ' : '+3% '}
                <span className="text-admin-text-secondary font-normal">vs. luna trecută</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-admin-bg-secondary to-admin-bg-tertiary border-admin-border-light text-white card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-green-500/20 mr-3">
                  <CheckCircle size={20} className="text-green-500 animate-icon" />
                </div>
                <CardTitle className="text-lg font-medium text-white">{t('admin.dashboard.completedProjects')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{completedProjects}</div>
              <p className="text-sm text-admin-status-success font-medium">
                +5 <span className="text-admin-text-secondary font-normal">luna aceasta</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-admin-bg-secondary to-admin-bg-tertiary border-admin-border-light text-white card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-purple-500/20 mr-3">
                  <Users size={20} className="text-purple-500 animate-icon" />
                </div>
                <CardTitle className="text-lg font-medium text-white">{t('admin.dashboard.clients')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalClients}</div>
              <p className="text-sm text-admin-status-success font-medium">
                +2 <span className="text-admin-text-secondary font-normal">noi săptămâna asta</span>
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-admin-bg-secondary to-admin-bg-tertiary border-admin-border-light text-white card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-amber-500/20 mr-3">
                  <Box size={20} className="text-amber-500 animate-icon" />
                </div>
                <CardTitle className="text-lg font-medium text-white">{t('admin.dashboard.furniturePieces')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{totalFurniturePieces}</div>
              <p className="text-sm text-admin-status-info font-medium">
                +17 <span className="text-admin-text-secondary font-normal">luna aceasta</span>
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Projects Cards */}
        <h2 className="text-xl font-semibold text-white mb-4">{t('admin.dashboard.recentProjects')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="bg-admin-bg-secondary border-admin-border-light overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 card-hover"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      {project.name}
                      {project.isNew && (
                        <Badge className="bg-admin-accent-blue text-white ml-2">{t('admin.dashboard.new')}</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="text-admin-text-secondary">
                      {t('admin.dashboard.client')}: {project.client}
                    </CardDescription>
                  </div>
                  <Badge className={project.status === 'Finalizat' 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-admin-text-secondary">{t('admin.dashboard.designer')}:</span>
                      <span className="text-white">{project.designer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-admin-text-secondary">{t('admin.dashboard.lastUpdate')}:</span>
                      <span className="text-white">{project.lastUpdate}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-admin-text-secondary">{t('admin.dashboard.progress')}:</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-admin-bg-tertiary rounded-full overflow-hidden">
                      <div 
                        className={`h-full progress-bar ${
                          project.progress >= 100 ? 'bg-green-500' : 
                          project.progress > 50 ? 'bg-blue-500' : 
                          project.progress > 25 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-admin-border-mid">
                <Button 
                  variant="default"
                  size="sm"
                  className="bg-admin-accent-blue hover:bg-admin-accent-blue/80 text-white w-full"
                  onClick={() => handleNavigation(`/admin/projects/${project.id}`, project.name)}
                >
                  {t('admin.dashboard.viewDetails')}
                  <ArrowRight size={16} className="ml-2 animate-icon" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* No results message */}
        {filteredProjects.length === 0 && (
          <Card className="bg-admin-bg-secondary border-admin-border-light py-8 text-center">
            <CardContent>
              <p className="text-admin-text-secondary">{t('common.noData')}</p>
              <Button 
                variant="link" 
                className="text-admin-accent-blue mt-2"
                onClick={() => {
                  setStatusFilter('all');
                  setClientFilter('');
                  setDesignerFilter('all');
                }}
              >
                {t('common.filter')}
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <Card className="bg-admin-bg-secondary border-admin-border-light card-hover">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.dashboard.systemActivity')}</CardTitle>
                <CardDescription className="text-admin-text-muted">{t('admin.dashboard.monthlyView')}</CardDescription>
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
                    <Bar dataKey="projects" fill="#8B5CF6" name="Proiecte" />
                    <Bar dataKey="materials" fill="#0EA5E9" name="Materiale" />
                    <Bar dataKey="accessories" fill="#D946EF" name="Accesorii" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-admin-bg-secondary border-admin-border-light card-hover">
              <CardHeader>
                <CardTitle className="text-white">{t('admin.dashboard.systemAlerts')}</CardTitle>
                <CardDescription className="text-admin-text-muted">{t('admin.dashboard.importantNotifications')}</CardDescription>
              </CardHeader>
              <CardContent className="px-0 py-0">
                <ul className="divide-y divide-admin-border-light">
                  {systemAlerts.map((alert) => (
                    <li key={alert.id} className="px-6 py-4 hover:bg-admin-bg-highlight">
                      <div className="flex flex-col space-y-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-white flex items-center">
                            {alert.severity === 'error' && (
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                            )}
                            {alert.severity === 'warning' && (
                              <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                            )}
                            {alert.severity === 'info' && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                            )}
                            {alert.title}
                            {alert.severity === 'error' && (
                              <Badge className="ml-2 bg-red-500/20 text-red-400 border border-red-500/30">
                                {t('admin.dashboard.error')}
                              </Badge>
                            )}
                            {alert.severity === 'warning' && (
                              <Badge className="ml-2 bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                {t('admin.dashboard.warning')}
                              </Badge>
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
                  onClick={() => handleNavigation("/admin/alerts", t('admin.dashboard.viewAllAlerts'))}
                >
                  {t('admin.dashboard.viewAllAlerts')}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
