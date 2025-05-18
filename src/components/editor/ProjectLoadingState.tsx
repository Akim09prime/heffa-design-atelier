
import { DesignerLayout } from '../../components/layout/DesignerLayout';

export const ProjectLoadingState = () => {
  return (
    <DesignerLayout>
      <div className="p-6 flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="animate-pulse text-center">
          <div className="text-xl font-medium">Loading project...</div>
        </div>
      </div>
    </DesignerLayout>
  );
};
