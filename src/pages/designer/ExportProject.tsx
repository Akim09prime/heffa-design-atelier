
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DesignerLayout } from '@/components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ExportForm } from '@/components/exports/ExportForm';
import { SupplierOrderForm } from '@/components/exports/SupplierOrderForm';
import { CuttingListView } from '@/components/exports/CuttingListView';
import { Project } from '@/types';
import { ProjectService } from '@/services/projectService';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Loader, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { useUi } from '@/contexts/UiContext';
import { db } from '@/firebase-config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const ExportProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showToast, setLoading: setUiLoading, isLoading } = useUi();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setUiLoading('fetchProject', true);
        if (projectId) {
          const fetchedProject = await ProjectService.getProjectById(projectId);
          if (fetchedProject) {
            setProject(fetchedProject);
            showToast(`Proiect "${fetchedProject.name}" încărcat`, "success");
            
            // Log view to Firebase
            try {
              await setDoc(doc(db, "project_exports", `view_${Date.now()}`), {
                projectId,
                timestamp: serverTimestamp(),
                action: 'view_export',
                userId: '1' // This would be the current user's ID
              });
            } catch (firebaseError) {
              console.error("Firebase log error:", firebaseError);
            }
          } else {
            throw new Error("Project not found");
          }
        } else {
          throw new Error("Invalid project ID");
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
        showToast(t('reports.failedToLoad'), "error");
      } finally {
        setLoading(false);
        setUiLoading('fetchProject', false);
      }
    };

    fetchProject();
  }, [projectId, toast, t, showToast, setUiLoading]);

  const handleBackToExports = () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    showToast("Înapoi la exporturi...", "info");
    
    setTimeout(() => {
      navigate('/designer/exports');
      setIsNavigating(false);
    }, 300);
  };
  
  const logExportAction = async (type: string) => {
    if (!projectId) return;
    
    try {
      await setDoc(doc(db, "project_exports", `export_${Date.now()}`), {
        projectId,
        exportType: type,
        timestamp: serverTimestamp(),
        userId: '1' // This would be the current user's ID
      });
    } catch (firebaseError) {
      console.error("Firebase log error:", firebaseError);
    }
  };

  if (loading) {
    return (
      <DesignerLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <Loader size={36} className="animate-spin text-primary" />
              <p>{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  if (!project) {
    return (
      <DesignerLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 flex items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle size={32} />
              </div>
              <p className="text-xl font-medium">{t('reports.noProjectFound')}</p>
              <Button onClick={handleBackToExports}>
                {t('common.backToExports')}
              </Button>
            </div>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleBackToExports}
              disabled={isNavigating}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold">{t('common.export')}: {project.name}</h1>
          </div>
        </div>

        <Tabs defaultValue="export" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4 mb-6">
            <TabsTrigger 
              value="export"
              onClick={() => showToast("Opțiuni export", "info")}
            >
              {t('common.export')}
            </TabsTrigger>
            <TabsTrigger 
              value="cutting"
              onClick={() => {
                showToast("Listă debitare", "info");
                logExportAction('cutting_list_view');
              }}
            >
              {t('importExport.cuttingList')}
            </TabsTrigger>
            <TabsTrigger 
              value="supplier"
              onClick={() => {
                showToast("Comandă furnizor", "info");
                logExportAction('supplier_order_view');
              }}
            >
              {t('importExport.supplierOrder')}
            </TabsTrigger>
            <TabsTrigger 
              value="preview"
              onClick={() => {
                showToast("Previzualizare proiect", "info");
                logExportAction('preview_view');
              }}
            >
              {t('common.preview')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="export">
            <ExportForm 
              project={project}
              onExportSuccess={(type) => {
                showToast(`Export ${type} realizat cu succes`, "success");
                logExportAction(type);
              }}
              onExportError={(type, error) => {
                showToast(`Eroare la exportul ${type}: ${error}`, "error");
              }}
            />
          </TabsContent>
          
          <TabsContent value="cutting">
            <CuttingListView 
              project={project}
              onExport={() => {
                showToast("Liste de debitare exportate", "success");
                logExportAction('cutting_list_excel');
              }}
            />
          </TabsContent>
          
          <TabsContent value="supplier">
            <SupplierOrderForm 
              project={project}
              onOrderSubmitted={() => {
                showToast("Comandă furnizor trimisă", "success");
                logExportAction('supplier_order_submit');
              }}
            />
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="w-full lg:w-1/2 h-96">
                    <SceneContainer 
                      modules={project.modules} 
                      roomWidth={project.dimensions.width}
                      roomLength={project.dimensions.length}
                      roomHeight={project.dimensions.height}
                    />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <h3 className="text-xl font-medium mb-4">{t('importExport.projectDetails')}</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('materials.form.name')}</p>
                        <p className="font-medium">{project.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('importExport.description')}</p>
                        <p>{project.description || t('importExport.noDescription')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('importExport.roomType')}</p>
                        <p className="font-medium capitalize">{project.roomType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('importExport.dimensions')}</p>
                        <p>
                          {project.dimensions.width}m × {project.dimensions.length}m × {project.dimensions.height}m
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('common.modules')}</p>
                        <p>{project.modules.length} {t('common.modules')}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Button
                        onClick={() => {
                          showToast("Proiect exportat ca PDF", "success");
                          logExportAction('pdf_preview');
                        }}
                      >
                        {t('importExport.exportAsPdf')}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesignerLayout>
  );
};

export default ExportProject;
