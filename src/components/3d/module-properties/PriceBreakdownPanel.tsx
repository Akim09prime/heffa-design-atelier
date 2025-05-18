
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, FileText, Loader } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useUi } from '@/contexts/UiContext';

interface PriceBreakdownPanelProps {
  priceBreakdown: {
    materials: number;
    accessories: number;
    processing: number;
    labor: number;
  };
  totalPrice: number;
  showPriceBreakdown: boolean;
  setShowPriceBreakdown: (show: boolean) => void;
  moduleName?: string;
}

export const PriceBreakdownPanel: React.FC<PriceBreakdownPanelProps> = ({
  priceBreakdown,
  totalPrice,
  showPriceBreakdown,
  setShowPriceBreakdown,
  moduleName = 'Module'
}) => {
  const { isLoading, wrapWithLoading, showSuccessToast, showErrorToast } = useUi();
  const [exportLoading, setExportLoading] = useState(false);

  const handleExportPdf = async () => {
    try {
      setExportLoading(true);
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(`Price Quote: ${moduleName}`, 20, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Add price breakdown table
      const breakdownData = [
        ['Component', 'Price (RON)'],
        ['Materials', priceBreakdown.materials.toFixed(2)],
        ['Accessories', priceBreakdown.accessories.toFixed(2)],
        ['Processing', priceBreakdown.processing.toFixed(2)],
        ['Labor', priceBreakdown.labor.toFixed(2)],
        ['Total', totalPrice.toFixed(2)]
      ];
      
      // @ts-ignore - jsPDF-autotable types are not properly recognized
      doc.autoTable({
        startY: 40,
        head: [breakdownData[0]],
        body: breakdownData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        footStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });
      
      // Add footer
      doc.setFontSize(10);
      const pageHeight = doc.internal.pageSize.height;
      doc.text('This is an estimate. Final prices may vary.', 20, pageHeight - 20);
      
      // Save the PDF
      doc.save(`${moduleName.replace(/\s+/g, '-')}-price-quote.pdf`);
      
      showSuccessToast('PDF Export', 'Price quote exported successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      showErrorToast('Export Failed', (error as Error).message);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">Total Price</span>
        <div className="flex items-center justify-end">
          <span className="text-lg font-bold">{totalPrice.toFixed(2)} RON</span>
          <Button 
            variant="ghost" 
            size="sm"
            className="ml-1 h-6 w-6 p-0" 
            onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
            aria-label={showPriceBreakdown ? "Hide price breakdown" : "Show price breakdown"}
          >
            {showPriceBreakdown ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />
            }
          </Button>
        </div>
      </div>
      
      {showPriceBreakdown && (
        <div className="space-y-3">
          <div className="bg-muted rounded-md p-2 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Materials</span>
              <span>{priceBreakdown.materials.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between">
              <span>Accessories</span>
              <span>{priceBreakdown.accessories.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between">
              <span>Processing</span>
              <span>{priceBreakdown.processing.toFixed(2)} RON</span>
            </div>
            <div className="flex justify-between">
              <span>Labor</span>
              <span>{priceBreakdown.labor.toFixed(2)} RON</span>
            </div>
          </div>
          
          <Button 
            onClick={handleExportPdf} 
            disabled={exportLoading}
            className="w-full"
            size="sm"
          >
            {exportLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate PDF Quote
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
