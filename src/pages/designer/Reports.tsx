
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileBarChart2 } from 'lucide-react';

const Reports = () => {
  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium">Rapoarte</h1>
            <p className="text-muted-foreground">Generează și vizualizează rapoarte pentru proiectele tale.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileBarChart2 className="w-5 h-5 mr-2 text-designer-primary" />
                Raport Proiecte
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Vizualizează toate proiectele în lucru și statusul lor.</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileBarChart2 className="w-5 h-5 mr-2 text-designer-primary" />
                Raport Materiale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Statistici despre utilizarea materialelor în proiecte.</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-lg">
                <FileBarChart2 className="w-5 h-5 mr-2 text-designer-primary" />
                Raport Clienți
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Informații despre clienți și proiectele lor.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DesignerLayout>
  );
};

export default Reports;
