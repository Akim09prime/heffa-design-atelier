
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileSpreadsheet, FileText, Check } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useToast } from '@/hooks/use-toast';

interface ExportSidebarProps {
  modulesRef: { current: Array<{
    scale: { x: number; y: number; z: number; };
    material: { color: { getHexString: () => string; }; };
  }> };
  projectName?: string;
}

export const ExportSidebar: React.FC<ExportSidebarProps> = ({ 
  modulesRef,
  projectName = "HeffaDesign Project"
}) => {
  const { toast } = useToast();
  
  const handlePDFExport = () => {
    try {
      const doc = new jsPDF();
      
      // Add header with logo
      doc.setFontSize(20);
      doc.setTextColor(106, 75, 49); // #6A4B31 (wood color)
      doc.text('HeffaDesign', 105, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(projectName, 105, 30, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 35, { align: 'center' });
      
      // Create table data
      const tableData = modulesRef.current.map((module, index) => {
        const dimensions = {
          width: module.scale.x * 1000, // Convert to mm
          height: module.scale.y * 1000,
          depth: module.scale.z * 1000
        };
        
        // Get color in hex
        const color = `#${module.material.color.getHexString()}`;
        
        // Calculate estimated price based on volume
        const volume = dimensions.width * dimensions.height * dimensions.depth / 1000000000; // in cubic meters
        const estimatedPrice = Math.round(volume * 2000); // Simple price calculation
        
        return [
          (index + 1).toString(),
          `Module ${index + 1}`,
          `${dimensions.width.toFixed(0)}×${dimensions.height.toFixed(0)}×${dimensions.depth.toFixed(0)}`,
          color,
          `${estimatedPrice} RON`
        ];
      });
      
      // Add table
      (doc as any).autoTable({
        head: [['#', 'Module Name', 'Dimensions (mm)', 'Color', 'Est. Price']],
        body: tableData,
        startY: 45,
        headStyles: {
          fillColor: [193, 165, 123], // #C1A57B (gold color)
          textColor: [255, 255, 255]
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        theme: 'grid'
      });
      
      // Add total
      const total = tableData.reduce((sum, row) => {
        return sum + parseInt(row[4].split(' ')[0]);
      }, 0);
      
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', 145, finalY);
      doc.text(`${total} RON`, 170, finalY);
      
      // Add footer
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text('HeffaDesign - Custom Furniture Solutions', 105, (doc as any).internal.pageSize.height - 10, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, 195, (doc as any).internal.pageSize.height - 10);
      }
      
      // Save the PDF
      const filename = `${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      
      // Show success toast
      toast({
        title: "PDF Export Successful",
        description: `Exported to ${filename}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "PDF Export Failed",
        description: "There was an error exporting your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleExcelExport = () => {
    try {
      const worksheet = XLSX.utils.aoa_to_sheet([
        ['HeffaDesign Project Export'],
        ['Project Name:', projectName],
        ['Export Date:', new Date().toLocaleDateString()],
        [],
        ['#', 'Module Name', 'Width (mm)', 'Height (mm)', 'Depth (mm)', 'Color', 'Est. Price'],
      ]);
      
      // Add module data
      const data = modulesRef.current.map((module, index) => {
        const dimensions = {
          width: module.scale.x * 1000, // Convert to mm
          height: module.scale.y * 1000,
          depth: module.scale.z * 1000
        };
        
        // Get color in hex
        const color = `#${module.material.color.getHexString()}`;
        
        // Calculate estimated price based on volume
        const volume = dimensions.width * dimensions.height * dimensions.depth / 1000000000; // in cubic meters
        const estimatedPrice = Math.round(volume * 2000); // Simple price calculation
        
        return [
          index + 1,
          `Module ${index + 1}`,
          dimensions.width.toFixed(0),
          dimensions.height.toFixed(0),
          dimensions.depth.toFixed(0),
          color,
          estimatedPrice
        ];
      });
      
      // Add all rows to worksheet
      XLSX.utils.sheet_add_aoa(worksheet, data, { origin: 6 });
      
      // Calculate total and add it
      const total = data.reduce((sum, row) => sum + (row[6] as number), 0);
      const totalRowIndex = 7 + data.length;
      XLSX.utils.sheet_add_aoa(worksheet, [
        [],
        ['Total:', '', '', '', '', '', total]
      ], { origin: totalRowIndex });
      
      // Set column widths
      const wscols = [
        { wch: 5 },  // #
        { wch: 20 }, // Module Name
        { wch: 12 }, // Width
        { wch: 12 }, // Height
        { wch: 12 }, // Depth
        { wch: 12 }, // Color
        { wch: 12 }, // Price
      ];
      worksheet['!cols'] = wscols;
      
      // Create workbook and add worksheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Modules');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save file
      const filename = `${projectName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
      saveAs(blob, filename);
      
      // Show success toast
      toast({
        title: "Excel Export Successful",
        description: `Exported to ${filename}`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast({
        title: "Excel Export Failed",
        description: "There was an error exporting your Excel file. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <ScrollArea className="h-full">
      <Card className="border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-playfair text-[#6A4B31]">Export Options</CardTitle>
          <CardDescription>Generate reports for your design</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Project Summary</h3>
            <div className="bg-muted rounded-md p-2">
              <p className="text-sm"><strong>Total Modules:</strong> {modulesRef.current.length}</p>
              <p className="text-sm"><strong>Project Name:</strong> {projectName}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Export Formats</h3>
            <div className="grid grid-cols-1 gap-2">
              <Button 
                onClick={handlePDFExport}
                className="flex justify-start bg-[#6A4B31] hover:bg-[#5a3f2a] text-white"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export to PDF
              </Button>
              
              <Button 
                onClick={handleExcelExport} 
                variant="outline"
                className="flex justify-start border-[#C1A57B] text-[#6A4B31]"
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <p className="text-xs text-muted-foreground">Exports include all modules currently in the scene.</p>
        </CardFooter>
      </Card>
    </ScrollArea>
  );
};
