
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuoteDetails } from "@/services/quoteService";
import { Project } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Download, File, FileSpreadsheet, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuotePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quote: QuoteDetails | null;
  project: Project | null;
  onDownloadPdf: () => void;
  onDownloadExcel: () => void;
  onSendEmail: () => void;
}

export function QuotePreviewDialog({
  isOpen,
  onClose,
  quote,
  project,
  onDownloadPdf,
  onDownloadExcel,
  onSendEmail
}: QuotePreviewDialogProps) {
  if (!quote || !project) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl glass border-white/20 shadow-lg backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Ofertă {quote.id} - {project.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="preview">Previzualizare</TabsTrigger>
            <TabsTrigger value="details">Detalii</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="p-6 border rounded-lg bg-white/80">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Ofertă Mobilier</h2>
                  <p className="text-gray-600">Nr. {quote.id}</p>
                </div>
                <Badge variant="outline" className={
                  quote.status === 'accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                  quote.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                  quote.status === 'sent' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-gray-100 text-gray-800 border-gray-200'
                }>
                  {quote.status === 'draft' ? 'Ciornă' :
                   quote.status === 'sent' ? 'Trimisă' :
                   quote.status === 'accepted' ? 'Acceptată' :
                   quote.status === 'rejected' ? 'Respinsă' : 'Expirată'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Client</h3>
                  <p className="font-medium">{quote.clientName}</p>
                  {quote.clientEmail && <p className="text-sm">{quote.clientEmail}</p>}
                  {quote.clientPhone && <p className="text-sm">{quote.clientPhone}</p>}
                </div>
                <div className="text-right">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Data</h3>
                  <p className="font-medium">Emisă: {formatDate(quote.createdAt)}</p>
                  <p className="text-sm">Valabilă până la: {formatDate(quote.validUntil)}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 py-4 mb-4">
                <h3 className="font-medium mb-2">Detalii Proiect</h3>
                <p className="text-sm"><span className="font-medium">Proiect:</span> {project.name}</p>
                <p className="text-sm"><span className="font-medium">Tip:</span> {project.type}</p>
                {project.subType && <p className="text-sm"><span className="font-medium">Subtip:</span> {project.subType}</p>}
                <p className="text-sm"><span className="font-medium">Corpuri:</span> {project.modules.length}</p>
              </div>

              <div className="border-t border-gray-200 py-4 mb-4">
                <h3 className="font-medium mb-3">Sumar Costuri</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Materiale:</span>
                    <span>{formatCurrency(quote.breakdown.materialsCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Accesorii:</span>
                    <span>{formatCurrency(quote.breakdown.accessoriesCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Prelucrări:</span>
                    <span>{formatCurrency(quote.breakdown.processingCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Manoperă:</span>
                    <span>{formatCurrency(quote.breakdown.laborCost)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-sm pt-2 border-t">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(quote.breakdown.subtotal)}</span>
                  </div>
                  {quote.breakdown.discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>Discount:</span>
                      <span>-{formatCurrency(quote.breakdown.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>TVA ({quote.breakdown.taxRate}%):</span>
                    <span>{formatCurrency(quote.breakdown.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(quote.breakdown.totalPrice)}</span>
                  </div>
                </div>
              </div>

              {quote.notes && (
                <div className="border-t border-gray-200 py-4">
                  <h3 className="font-medium mb-2">Note</h3>
                  <p className="text-sm text-gray-700">{quote.notes}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <div className="border rounded-lg p-4 bg-white/80">
              <h3 className="font-medium mb-3">Corpuri incluse</h3>
              <div className="space-y-3">
                {project.modules.map((module, index) => (
                  <Card key={module.id || index} className="overflow-hidden">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{module.name}</p>
                          <p className="text-xs text-gray-500">
                            {module.width} x {module.height} x {module.depth} mm
                          </p>
                        </div>
                        <span className="font-medium">{formatCurrency(module.price)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <FileText size={32} className="text-blue-500" />
                  <h3 className="font-medium">Descarcă PDF</h3>
                  <p className="text-sm text-gray-500">Ofertă completă în format PDF</p>
                  <Button onClick={onDownloadPdf} className="w-full mt-2">
                    <Download size={16} className="mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <FileSpreadsheet size={32} className="text-green-500" />
                  <h3 className="font-medium">Descarcă Excel</h3>
                  <p className="text-sm text-gray-500">Detalii producție în Excel</p>
                  <Button onClick={onDownloadExcel} variant="outline" className="w-full mt-2">
                    <Download size={16} className="mr-2" />
                    Download Excel
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                  <File size={32} className="text-orange-500" />
                  <h3 className="font-medium">Trimite pe email</h3>
                  <p className="text-sm text-gray-500">Trimite oferta către client</p>
                  <Button onClick={onSendEmail} variant="secondary" className="w-full mt-2">
                    Trimite Email
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Închide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
