
import { Button } from "@/components/ui/button";
import { ChevronLeft, Layers, Save, File } from "lucide-react";

interface ProjectHeaderProps {
  projectName: string;
  onBack: () => void;
  onSave: () => void;
  onExport: () => void;
  showLibrary: boolean;
  onToggleLibrary: () => void;
}

export const ProjectHeader = ({
  projectName,
  onBack,
  onSave,
  onExport,
  showLibrary,
  onToggleLibrary
}: ProjectHeaderProps) => {
  return (
    <div className="p-4 bg-white border-b shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-medium">
            {projectName || 'Project'} - 3D Editor
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onToggleLibrary}>
            <Layers size={16} className="mr-2" />
            {showLibrary ? 'Hide Library' : 'Show Library'}
          </Button>
          <Button variant="outline" onClick={onSave}>
            <Save size={16} className="mr-2" />
            Save
          </Button>
          <Button onClick={onExport}>
            <File size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
