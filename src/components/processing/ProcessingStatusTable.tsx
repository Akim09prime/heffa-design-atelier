
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Eye, Clock } from 'lucide-react';

interface ProcessingProject {
  id: string;
  name: string;
  client: string;
  status: string;
  currentSection: string;
  nextSection: string;
  totalPieces: number;
  completedPieces: number;
  startDate: string;
  estimatedCompletion: string;
}

interface ProcessingStatusTableProps {
  projects: ProcessingProject[];
}

export const ProcessingStatusTable: React.FC<ProcessingStatusTableProps> = ({ projects }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ro-RO', options);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'în producție':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'în așteptare':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'finalizat':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getProgressColor = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-admin-bg-tertiary text-admin-text-secondary">
          <tr>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Proiect</th>
            <th scope="col" className="px-6 py-3">Client</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Secție curentă</th>
            <th scope="col" className="px-6 py-3">Progres</th>
            <th scope="col" className="px-6 py-3">Termen</th>
            <th scope="col" className="px-6 py-3">Acțiuni</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-admin-border-light">
          {projects.map((project) => (
            <tr 
              key={project.id} 
              className="hover:bg-admin-bg-highlight transition-colors duration-200"
            >
              <td className="px-6 py-4 text-admin-text-secondary font-mono">
                {project.id}
              </td>
              <td className="px-6 py-4 text-white font-medium">
                {project.name}
              </td>
              <td className="px-6 py-4 text-admin-text-primary">
                {project.client}
              </td>
              <td className="px-6 py-4">
                <Badge className={`${getStatusBadgeClass(project.status)} border`}>
                  {project.status}
                </Badge>
              </td>
              <td className="px-6 py-4">
                {project.currentSection !== 'Finalizat' && project.nextSection !== '-' ? (
                  <div className="flex items-center">
                    <span className="text-admin-text-primary">{project.currentSection}</span>
                    <ArrowRight size={12} className="text-admin-text-muted mx-1" />
                    <span className="text-admin-text-secondary">{project.nextSection}</span>
                  </div>
                ) : (
                  <span className="text-admin-text-primary">{project.currentSection}</span>
                )}
              </td>
              <td className="px-6 py-4 w-48">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-admin-text-secondary">
                      {project.completedPieces} / {project.totalPieces} piese
                    </span>
                    <span className="text-white font-medium">
                      {Math.round((project.completedPieces / project.totalPieces) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(project.completedPieces / project.totalPieces) * 100} 
                    className="h-2 bg-admin-bg-tertiary"
                    indicatorClassName={getProgressColor(project.completedPieces, project.totalPieces)}
                  />
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <div className="flex items-center text-admin-text-primary">
                    <Clock size={12} className="mr-1" />
                    <span>{formatDate(project.estimatedCompletion)}</span>
                  </div>
                  <span className="text-xs text-admin-text-muted">
                    Start: {formatDate(project.startDate)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-admin-text-link hover:bg-admin-bg-tertiary"
                >
                  <Eye size={14} className="mr-1" /> Detalii
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
