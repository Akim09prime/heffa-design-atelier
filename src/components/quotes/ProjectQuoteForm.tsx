
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { QuoteService, QuoteDetails } from '@/services/quoteService';
import { Project, Material, AccessoryItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { QuotePreviewDialog } from './QuotePreviewDialog';

interface ProjectQuoteFormProps {
  project: Project;
  materials: Material[];
  accessories: AccessoryItem[];
  onQuoteGenerated?: (quote: QuoteDetails) => void;
}

type FormData = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  notes: string;
  discount: number;
};

export function ProjectQuoteForm({ project, materials, accessories, onQuoteGenerated }: ProjectQuoteFormProps) {
  const { toast } = useToast();
  const [discount, setDiscount] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<QuoteDetails | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      notes: '',
      discount: 0
    }
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount);
  };

  const onSubmit = (data: FormData) => {
    // Generate quote using QuoteService
    const newQuote = QuoteService.generateQuote(
      project,
      materials,
      accessories,
      {
        name: data.clientName,
        email: data.clientEmail,
        phone: data.clientPhone
      },
      discount,
      data.notes
    );

    setGeneratedQuote(newQuote);
    setIsPreviewOpen(true);

    if (onQuoteGenerated) {
      onQuoteGenerated(newQuote);
    }

    toast({
      title: "Ofertă generată",
      description: `Oferta pentru ${data.clientName} a fost generată cu succes.`
    });
  };

  const handleDownloadPdf = () => {
    toast({
      title: "Descărcare PDF",
      description: "Oferta în format PDF se descarcă..."
    });
    // In a real implementation, this would trigger the actual PDF download
  };

  const handleDownloadExcel = () => {
    toast({
      title: "Descărcare Excel",
      description: "Fișierul Excel se descarcă..."
    });
    // In a real implementation, this would trigger the actual Excel download
  };

  const handleSendEmail = () => {
    toast({
      title: "Email trimis",
      description: "Oferta a fost trimisă pe email către client."
    });
    // In a real implementation, this would trigger the actual email sending
  };

  // Calculate the quote breakdown for preview
  const previewBreakdown = QuoteService.calculateQuoteBreakdown(project, materials, accessories, discount);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generare ofertă: {project.name}</CardTitle>
          <CardDescription>
            Completați detaliile clientului și setările ofertei
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="quote-form" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Nume client *</Label>
              <Input
                id="clientName"
                {...register('clientName', { required: 'Numele clientului este obligatoriu' })}
                placeholder="Nume complet client"
                className="glass"
              />
              {errors.clientName && <p className="text-sm text-red-500">{errors.clientName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email client</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  {...register('clientEmail', { 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Adresa de email invalidă'
                    }
                  })}
                  placeholder="email@client.ro"
                  className="glass"
                />
                {errors.clientEmail && <p className="text-sm text-red-500">{errors.clientEmail.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefon client</Label>
                <Input
                  id="clientPhone"
                  {...register('clientPhone')}
                  placeholder="07XX XXX XXX"
                  className="glass"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Note ofertă</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Adăugați orice detalii relevante pentru ofertă..."
                className="glass min-h-[100px]"
              />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <Label htmlFor="discount">Discount aplicat: {discount}%</Label>
                <span className="text-sm font-medium text-green-600">
                  -{formatCurrency((previewBreakdown.subtotal * discount) / 100)}
                </span>
              </div>
              <Slider
                id="discount"
                min={0}
                max={25}
                step={1}
                value={[discount]}
                onValueChange={(value) => setDiscount(value[0])}
                className="py-2"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" form="quote-form" className="w-full md:w-auto">
            Generare ofertă
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rezumat costuri</CardTitle>
          <CardDescription>
            Defalcarea costurilor pentru proiectul {project.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Materiale:</span>
              <span className="font-medium">{formatCurrency(previewBreakdown.materialsCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Accesorii:</span>
              <span className="font-medium">{formatCurrency(previewBreakdown.accessoriesCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Prelucrări:</span>
              <span className="font-medium">{formatCurrency(previewBreakdown.processingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Manoperă:</span>
              <span className="font-medium">{formatCurrency(previewBreakdown.laborCost)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium">{formatCurrency(previewBreakdown.subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount}%):</span>
                <span>-{formatCurrency(previewBreakdown.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>TVA ({previewBreakdown.taxRate}%):</span>
              <span className="font-medium">{formatCurrency(previewBreakdown.taxAmount)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="text-lg font-bold">TOTAL:</span>
              <span className="text-lg font-bold">{formatCurrency(previewBreakdown.totalPrice)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {generatedQuote && (
        <QuotePreviewDialog
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          quote={generatedQuote}
          project={project}
          onDownloadPdf={handleDownloadPdf}
          onDownloadExcel={handleDownloadExcel}
          onSendEmail={handleSendEmail}
        />
      )}
    </div>
  );
}
