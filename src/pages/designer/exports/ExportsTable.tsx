
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Code, Package, Download, Eye } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface Export {
  id: string;
  projectId: string;
  projectName: string;
  format: string;
  date: string;
  size: string;
  url: string;
}

interface ExportsTableProps {
  exports: Export[];
}

export const ExportsTable: React.FC<ExportsTableProps> = ({ exports }) => {
  const { t } = useTranslation();

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'dxf':
      case 'svg':
        return <Code className="h-5 w-5" />;
      case 'json':
        return <Code className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('materials.form.type')}</TableHead>
          <TableHead>{t('common.projects')}</TableHead>
          <TableHead>{t('reports.dateGenerated')}</TableHead>
          <TableHead>{t('reports.size')}</TableHead>
          <TableHead className="text-right">{t('common.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exports.map((exp) => (
          <TableRow key={exp.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getFormatIcon(exp.format)}
                <span className="uppercase">{exp.format}</span>
              </div>
            </TableCell>
            <TableCell>{exp.projectName}</TableCell>
            <TableCell>{formatDateTime(exp.date)}</TableCell>
            <TableCell>{exp.size}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="ghost">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {exports.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              {t('reports.noReportsFound')}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
