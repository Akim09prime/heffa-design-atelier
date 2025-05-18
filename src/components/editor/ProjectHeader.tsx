
import { Button } from "@/components/ui/button";
import { ChevronLeft, Layers, Save, File, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useUi } from "@/contexts/UiContext";

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
  const { showToast } = useUi();
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);

  const handleBack = () => {
    if (isNavigatingBack) return;
    
    setIsNavigatingBack(true);
    showToast("Navigare înapoi...", "info");
    
    setTimeout(() => {
      onBack();
      setIsNavigatingBack(false);
    }, 300);
  };

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    showToast("Salvare în curs...", "info");
    
    try {
      await onSave();
      showToast("Proiect salvat cu succes", "success");
    } catch (error) {
      console.error("Save error:", error);
      showToast("Eroare la salvare", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    showToast("Export în curs...", "info");
    
    try {
      await onExport();
      showToast("PDF exportat cu succes", "success");
    } catch (error) {
      console.error("Export error:", error);
      showToast("Eroare la export", "error");
    } finally {
      setIsExporting(false);
    }
  };

  const handleToggleLibrary = () => {
    onToggleLibrary();
    showToast(
      showLibrary ? "Biblioteca ascunsă" : "Biblioteca afișată", 
      "info"
    );
  };

  return (
    <div className="p-4 bg-white border-b shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleBack}
            disabled={isNavigatingBack}
            className={isNavigatingBack ? "opacity-50" : ""}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-medium">
            {projectName || 'Project'} - 3D Editor
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleToggleLibrary}>
            {showLibrary ? (
              <EyeOff size={16} className="mr-2" />
            ) : (
              <Eye size={16} className="mr-2" />
            )}
            {showLibrary ? 'Hide Library' : 'Show Library'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSave} 
            disabled={isSaving}
            className={isSaving ? "opacity-50" : ""}
          >
            <Save size={16} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button 
            onClick={handleExport}
            disabled={isExporting}
            className={isExporting ? "opacity-50" : ""}
          >
            <File size={16} className="mr-2" />
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </div>
  );
};
