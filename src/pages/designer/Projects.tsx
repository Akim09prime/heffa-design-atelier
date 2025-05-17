
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Projects = () => {
  // Sample projects data
  const projects = [
    { 
      id: '1',
      name: 'Modern Kitchen Remodel',
      client: 'John Smith',
      createdAt: '2023-05-10',
      deadline: '2023-06-30',
      status: 'in_progress',
      modules: 8,
      progress: 65
    },
    { 
      id: '2',
      name: 'Office Renovation',
      client: 'Emma Johnson',
      createdAt: '2023-05-05',
      deadline: '2023-07-15',
      status: 'client_review',
      modules: 5,
      progress: 40
    },
    { 
      id: '3',
      name: 'Master Bedroom Wardrobe',
      client: 'Robert Davis',
      createdAt: '2023-04-20',
      deadline: '2023-06-10',
      status: 'approved',
      modules: 6,
      progress: 100
    },
    { 
      id: '4',
      name: 'Bathroom Cabinet Set',
      client: 'Michael Brown',
      createdAt: '2023-05-15',
      deadline: '2023-06-10',
      status: 'pending_approval',
      modules: 3,
      progress: 90
    },
    { 
      id: '5',
      name: 'Living Room Entertainment Center',
      client: 'Sarah Wilson',
      createdAt: '2023-04-25',
      deadline: '2023-07-05',
      status: 'in_progress',
      modules: 4,
      progress: 30
    },
  ];

  // Status badge helper
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
      case 'client_review':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Client Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'pending_approval':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Pending Approval</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium">Projects</h1>
            <p className="text-muted-foreground">Manage and monitor your design projects</p>
          </div>
          <div className="flex w-full lg:w-auto gap-4">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="w-full pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>View and manage your design projects</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
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
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.name}
                      <div className="text-xs text-muted-foreground">{project.modules} modules</div>
                    </TableCell>
                    <TableCell>{project.client}</TableCell>
                    <TableCell>{project.createdAt}</TableCell>
                    <TableCell>{project.deadline}</TableCell>
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
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DesignerLayout>
  );
};

export default Projects;
