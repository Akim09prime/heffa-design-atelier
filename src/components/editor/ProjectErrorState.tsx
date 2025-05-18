
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DesignerLayout } from '../../components/layout/DesignerLayout';

interface ProjectErrorStateProps {
  onBack: () => void;
}

export const ProjectErrorState = ({ onBack }: ProjectErrorStateProps) => {
  return (
    <DesignerLayout>
      <div className="p-6 flex justify-center items-center h-[calc(100vh-100px)]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-2">Project Not Found</h3>
            <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={onBack}>Return to Projects</Button>
          </CardContent>
        </Card>
      </div>
    </DesignerLayout>
  );
};
