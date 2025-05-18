
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Calculator, FileText, Printer, Send } from 'lucide-react';
import { QuoteService, QuoteBreakdown } from '@/services/quoteService';
import { Project, Material, AccessoryItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { showSuccessToast } from '@/utils/toast';

interface QuoteGeneratorProps {
  project: Project;
  materials: Material[];
  accessories: AccessoryItem[];
}

export const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({
  project,
  materials,
  accessories
}) => {
  const { toast } = useToast();
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [quoteBreakdown, setQuoteBreakdown] = useState<QuoteBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Calculate quote breakdown
  const handleCalculate = () => {
    setIsCalculating(true);
    
    try {
      const breakdown = QuoteService.calculateQuoteBreakdown(
        project,
        materials,
        accessories,
        discountPercentage
      );
      
      setQuoteBreakdown(breakdown);
      showSuccessToast(toast, "Calcul finalizat", "Oferta a fost calculată cu succes");
    } catch (error) {
      toast({
        title: "Eroare de calcul",
        description: "A apărut o eroare în timpul calculului ofertei",
        variant: "destructive"
      });
      console.error("Quote calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Generate and save quote
  const handleGenerateQuote = () => {
    if (!clientName) {
      toast({
        title: "Numele clientului este obligatoriu",
        description: "Vă rugăm să completați numele clientului pentru a genera oferta",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const quote = QuoteService.generateQuote(
        project,
        materials,
        accessories,
        {
          name: clientName,
          email: clientEmail,
          phone: clientPhone
        },
        discountPercentage,
        notes
      );
      
      // In a real app, you would save this quote to a database
      console.log("Generated quote:", quote);
      
      showSuccessToast(toast, "Ofertă generată", "Oferta a fost generată și salvată cu succes");
      
      // Here you would typically navigate to the quote view page
      // navigate(`/designer/quotes/${quote.id}`);
    } catch (error) {
      toast({
        title: "Eroare la generarea ofertei",
        description: "A apărut o eroare în timpul generării ofertei",
        variant: "destructive"
      });
      console.error("Quote generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="mr-2" />
            Generator Ofertă
          </CardTitle>
          <CardDescription>Creați o ofertă personalizată pentru client</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nume client *</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Introduceți numele clientului"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email client</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="email@exemplu.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Telefon client</Label>
                <Input
                  id="clientPhone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="07XX XXX XXX"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discount">Discount: {discountPercentage}%</Label>
                <Slider
                  id="discount"
                  min={0}
                  max={30}
                  step={1}
                  value={[discountPercentage]}
                  onValueChange={(value) => setDiscountPercentage(value[0])}
                  className="py-2"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Note ofertă</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adăugați note sau condiții speciale..."
                className="w-full min-h-[100px] p-2 border rounded-md bg-background"
              />
            </div>
            
            <Button 
              onClick={handleCalculate}
              className="w-full md:w-auto"
              disabled={isCalculating}
            >
              <Calculator className="mr-2 h-4 w-4" />
              {isCalculating ? "Se calculează..." : "Calculează oferta"}
            </Button>
            
            {quoteBreakdown && (
              <div className="mt-8 border rounded-lg p-4 bg-muted/30">
                <h3 className="text-lg font-medium mb-4">Detalii Ofertă</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Materiale:</span>
                    <span>{QuoteService.formatCurrency(quoteBreakdown.materialsCost)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Accesorii:</span>
                    <span>{QuoteService.formatCurrency(quoteBreakdown.accessoriesCost)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Prelucrare:</span>
                    <span>{QuoteService.formatCurrency(quoteBreakdown.processingCost)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Manoperă:</span>
                    <span>{QuoteService.formatCurrency(quoteBreakdown.laborCost)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-medium">
                    <span>Subtotal:</span>
                    <span>{QuoteService.formatCurrency(quoteBreakdown.subtotal)}</span>
                  </div>
                  
                  {quoteBreakdown.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discountPercentage}%):</span>
                      <span>-{QuoteService.formatCurrency(quoteBreakdown.discount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>TVA ({quoteBreakdown.taxRate}%):</span>
                    <span>{QuoteService.formatCurrency(quoteBreakdown.taxAmount)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{QuoteService.formatCurrency(quoteBreakdown.totalPrice)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        
        {quoteBreakdown && (
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Salvează ca PDF
            </Button>
            
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Printează
            </Button>
            
            <Button 
              onClick={handleGenerateQuote}
              disabled={isGenerating || !clientName}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="mr-2 h-4 w-4" />
              {isGenerating ? "Se generează..." : "Generează oferta"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
