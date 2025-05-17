
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Project } from '@/types';
import { ExportService } from '@/services/exportService';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';

interface CuttingListViewProps {
  project: Project;
}

export const CuttingListView: React.FC<CuttingListViewProps> = ({ project }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [cuttingList, setCuttingList] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuttingList = async () => {
      try {
        const data = await ExportService.generateCuttingList(project);
        setCuttingList(data);
      } catch (error) {
        console.error('Failed to generate cutting list:', error);
        toast({
          title: t('common.error'),
          description: t('reports.failedToLoad'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCuttingList();
  }, [project, toast, t]);

  const handleDownloadExcel = async () => {
    try {
      const excelUrl = await ExportService.generateExcelCuttingSheet(project);
      window.open(excelUrl, '_blank');
      toast({
        title: t('common.success'),
        description: t('importExport.exportComplete'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('reports.failedToLoad'),
        variant: "destructive",
      });
    }
  };

  const getMaterialColor = (material: string) => {
    switch (material) {
      case 'PAL':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MDF':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PFL':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <p>{t('common.loading')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!cuttingList) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-32">
            <p>{t('reports.failedToLoad')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('importExport.cuttingList')}</CardTitle>
        <CardDescription>
          {t('importExport.cuttingList')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{t('common.projects')}: {cuttingList.projectId}</h3>
            <p className="text-sm text-muted-foreground">
              {t('reports.dateGenerated')}: {new Date(cuttingList.dateGenerated).toLocaleDateString()}
            </p>
          </div>
          <p>{t('common.client')}: {cuttingList.clientName}</p>
        </div>

        {cuttingList.modules.map((module: any, index: number) => (
          <div key={module.moduleId} className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-md font-medium">
                {t('common.modules')}: {module.moduleName}
              </h4>
              <Badge variant="outline">{`${t('common.modules')} ${index + 1} of ${cuttingList.modules.length}`}</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('materials.form.type')}</TableHead>
                  <TableHead>{t('materials.title')}</TableHead>
                  <TableHead className="text-right">{t('importExport.dimensions')}</TableHead>
                  <TableHead className="text-right">{t('importExport.dimensions')}</TableHead>
                  <TableHead className="text-right">{t('materials.form.thickness')}</TableHead>
                  <TableHead>{t('accessories.title')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {module.parts.map((part: any, pIndex: number) => (
                  <TableRow key={`${module.moduleId}-part-${pIndex}`}>
                    <TableCell className="font-medium capitalize">{part.partType}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded border ${getMaterialColor(part.material)}`}>
                        {part.material}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{part.length}</TableCell>
                    <TableCell className="text-right">{part.width}</TableCell>
                    <TableCell className="text-right">{part.thickness}</TableCell>
                    <TableCell>{part.edgeBanding === 'none' ? '-' : part.edgeBanding}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="h-4 w-4 mr-2" /> {t('common.download')}
        </Button>
        <Button onClick={handleDownloadExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" /> {t('common.export')}
        </Button>
      </CardFooter>
    </Card>
  );
};
