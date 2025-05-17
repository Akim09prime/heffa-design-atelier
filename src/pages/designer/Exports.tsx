
import React, { useState } from 'react';
import { DesignerLayout } from '@/components/layout/DesignerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, FileSpreadsheet, Code, Package, Download, Eye } from 'lucide-react';
import { ProjectService } from '@/services/projectService';
import { Project } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';

const projectMockData = [
  {
    id: 'proj-1',
    name: 'Modern Kitchen',
    status: 'approved',
    lastExport: '2023-10-15',
    exportCount: 5,
  },
  {
    id: 'proj-2',
    name: 'Classic Bedroom',
    status: 'in_production',
    lastExport: '2023-10-10',
    exportCount: 3,
  },
  {
    id: 'proj-3',
    name: 'Minimalist Living Room',
    status: 'completed',
    lastExport: '2023-09-28',
    exportCount: 8,
  },
];

const recentExportsMockData = [
  {
    id: 'exp-1',
    projectId: 'proj-1',
    projectName: 'Modern Kitchen',
    format: 'pdf',
    date: '2023-10-15T10:30:00',
    size: '2.3MB',
    url: '/exports/pdf/modern_kitchen_offer.pdf',
  },
  {
    id: 'exp-2',
    projectId: 'proj-1',
    projectName: 'Modern Kitchen',
    format: 'dxf',
    date: '2023-10-15T10:32:00',
    size: '1.8MB',
    url: '/exports/dxf/modern_kitchen_cnc.dxf',
  },
  {
    id: 'exp-3',
    projectId: 'proj-2',
    projectName: 'Classic Bedroom',
    format: 'excel',
    date: '2023-10-10T14:15:00',
    size: '980KB',
    url: '/exports/excel/bedroom_cutting_list.xlsx',
  },
  {
    id: 'exp-4',
    projectId: 'proj-3',
    projectName: 'Minimalist Living Room',
    format: 'json',
    date: '2023-09-28T09:45:00',
    size: '126KB',
    url: '/exports/json/living_room_backup.json',
  },
  {
    id: 'exp-5',
    projectId: 'proj-3',
    projectName: 'Minimalist Living Room',
    format: 'svg',
    date: '2023-09-28T09:50:00',
    size: '540KB',
    url: '/exports/svg/living_room_fronts.svg',
  },
];

const ExportsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const { t } = useTranslation();
  
  // Initialize with mock data
  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await ProjectService.getAllProjects();
        setProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to fetch projects", error);
      }
    };
    
    fetchProjects();
  }, []);

  const filteredProjects = projectMockData.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExports = recentExportsMockData.filter(exp =>
    exp.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'dxf':
      case 'svg':
        return <Code className="h-5 w-5" />;
      case 'json':
        return <Code className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">{t('common.approved')}</Badge>;
      case 'in_production':
        return <Badge className="bg-blue-500">{t('common.pending')}</Badge>;
      case 'completed':
        return <Badge className="bg-purple-500">{t('common.completed')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-medium">{t('common.export')}</h1>
          <Input
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="recent">{t('importExport.exportData')}</TabsTrigger>
            <TabsTrigger value="projects">{t('importExport.exportDataDesc')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('importExport.exportData')}</CardTitle>
                <CardDescription>
                  {t('importExport.exportDataDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('materials.form.type')}</TableHead>
                      <TableHead>{t('common.projects')}</TableHead>
                      <TableHead>{t('reports.dateGenerated')}</TableHead>
                      <TableHead>{t('reports.size')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExports.map((exp) => (
                      <TableRow key={exp.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFormatIcon(exp.format)}
                            <span className="uppercase">{exp.format}</span>
                          </div>
                        </TableCell>
                        <TableCell>{exp.projectName}</TableCell>
                        <TableCell>{formatDateTime(exp.date)}</TableCell>
                        <TableCell>{exp.size}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredExports.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {t('reports.noReportsFound')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('common.projects')}</CardTitle>
                <CardDescription>
                  {t('importExport.templates')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('materials.form.name')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead>{t('reports.lastModified')}</TableHead>
                      <TableHead>{t('reports.count')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell>{formatDate(project.lastExport)}</TableCell>
                        <TableCell>{project.exportCount}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            onClick={() => navigate(`/designer/exports/${project.id}`)}
                          >
                            {t('common.export')}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredProjects.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {t('reports.noReportsFound')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesignerLayout>
  );
};

export default ExportsPage;
