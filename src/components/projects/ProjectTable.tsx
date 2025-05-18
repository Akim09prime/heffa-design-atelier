
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from '@/types';

interface ProjectTableProps {
  projects: any[];
  loading: boolean;
  searchQuery: string;
  onViewProject: (projectId: string, projectName: string) => void;
  onCreateProject: () => void;
}

export const ProjectTable = ({
  projects,
  loading,
  searchQuery,
  onViewProject,
  onCreateProject
}: ProjectTableProps) => {
  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'in_progress':
      case 'draft':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'client_review':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Client Review</Badge>;
      case 'approved':
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'pending_approval':
      case 'saved':
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

  return (
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
        {loading ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <div className="flex flex-col items-center justify-center">
                <p className="text-muted-foreground mb-2">Loading projects...</p>
              </div>
            </TableCell>
          </TableRow>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <TableRow key={project.id} className="cursor-pointer hover:bg-gray-50"
              onClick={() => onViewProject(project.id, project.name)}>
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
                    onViewProject(project.id, project.name);
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
                <Button onClick={onCreateProject}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Create New Project
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
