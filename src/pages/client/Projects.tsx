
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClientLayout } from '../../components/layout/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectService } from '@/services/projectService';
import { useAuth } from '@/contexts/AuthContext';
import { Project } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Plus, FileEdit, Trash2, Eye } from 'lucide-react';

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) return;

    const loadProjects = async () => {
      try {
        const userProjects = await ProjectService.getProjectsByUserId(user.id);
        setProjects(userProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  return (
    <ClientLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-medium">My Projects</h1>
          <Button 
            onClick={() => navigate('/client/projects/new')}
            className="bg-heffa-600 hover:bg-heffa-700"
          >
            <Plus size={18} className="mr-2" /> Create New Project
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-heffa-100 to-heffa-200 flex items-center justify-center">
                  <span className="text-heffa-800 text-lg font-medium">{project.type} Project</span>
                </div>
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>
                        {project.subType ? `${project.subType} - ` : ''}
                        Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'saved' ? 'bg-blue-100 text-blue-800' : 
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                </CardContent>
                <CardFooter className="p-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/client/projects/${project.id}`)}
                  >
                    <Eye size={16} className="mr-2" /> View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate(`/client/projects/${project.id}/edit`)}
                  >
                    <FileEdit size={16} className="mr-2" /> Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="mb-4 p-4 rounded-full bg-heffa-100">
                <FileEdit size={32} className="text-heffa-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first furniture project to start designing.
              </p>
              <Button 
                onClick={() => navigate('/client/projects/new')}
                className="bg-heffa-600 hover:bg-heffa-700"
              >
                <Plus size={18} className="mr-2" /> Create First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
};

export default Projects;
