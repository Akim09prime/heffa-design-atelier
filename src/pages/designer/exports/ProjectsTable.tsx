
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/contexts/TranslationContext';

interface Project {
  id: string;
  name: string;
  status: string;
  lastExport: string;
  exportCount: number;
}

interface ProjectsTableProps {
  projects: Project[];
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  return (
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
        {projects.map((project) => (
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
        {projects.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              {t('reports.noReportsFound')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
