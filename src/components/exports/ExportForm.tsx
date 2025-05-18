import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { Project, ExportFormat } from '@/types';
import { ExportService } from '@/services/exportService';
import { Download, FileText, FileSpreadsheet, Code, Package, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportFormProps {
  project: Project;
  onExportSuccess?: (type: string) => void;
  onExportError?: (type: string, error: string) => void;
}

interface ExportFormValues {
  format: ExportFormat;
  includeDetails: boolean;
  includeImages: boolean;
  includeAccessories: boolean;
  includeCutting: boolean;
  recipientEmail?: string;
}

export const ExportForm: React.FC<ExportFormProps> = ({ project, onExportSuccess, onExportError }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const form = useForm<ExportFormValues>({
    defaultValues: {
      format: 'pdf',
      includeDetails: true,
      includeImages: true,
      includeAccessories: true,
      includeCutting: true,
      recipientEmail: '',
    },
  });

  const selectedFormat = form.watch('format');

  const handleExport = async (values: ExportFormValues) => {
    setIsExporting(true);
    try {
      let url: string | string[] | null = null;

      // Handle export based on selected format
      switch (values.format) {
        case 'pdf':
          url = await ExportService.generatePdfOffer(project, values);
          break;
        case 'excel':
          url = await ExportService.generateExcelCuttingSheet(project, values);
          break;
        case 'dxf':
          url = await ExportService.generateDxfFiles(project, values);
          if (Array.isArray(url) && url.length > 0) {
            url = url[0]; // Just use the first one for display
          }
          break;
        case 'svg':
          url = await ExportService.generateSvgFronts(project);
          if (Array.isArray(url) && url.length > 0) {
            url = url[0]; // Just use the first one for display
          }
          break;
        case 'json':
          url = await ExportService.exportAsJson(project);
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // If email should be sent
      if (showEmailField && values.recipientEmail) {
        const success = await ExportService.emailExports(
          project,
          values.recipientEmail,
          [values.format],
          `Here's your export in ${values.format.toUpperCase()} format.`
        );

        if (success) {
          toast({
            title: "Export sent successfully",
            description: `Export has been sent to ${values.recipientEmail}`,
          });
        } else {
          throw new Error('Failed to send email');
        }
      }

      if (url) {
        setExportUrl(typeof url === 'string' ? url : url[0]);
        toast({
          title: "Export generated successfully",
          description: `Your ${values.format.toUpperCase()} export is ready`,
        });
        
        // Call onExportSuccess if provided
        if (onExportSuccess) {
          onExportSuccess(values.format);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "There was an error creating your export",
        variant: "destructive",
      });
      
      // Call onExportError if provided
      if (onExportError && error instanceof Error) {
        onExportError(values.format, error.message);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
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
        return <Download className="h-5 w-5" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Export Project</CardTitle>
        <CardDescription>
          Export your project in various formats for clients, production, or backup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleExport)} className="space-y-6">
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Export Format</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Offer</SelectItem>
                      <SelectItem value="excel">Excel Cutting Sheet</SelectItem>
                      <SelectItem value="dxf">DXF for CNC</SelectItem>
                      <SelectItem value="svg">SVG Visualizations</SelectItem>
                      <SelectItem value="json">JSON Backup</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the format you want to export your project to.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="includeDetails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Details</FormLabel>
                      <FormDescription>
                        Include project specifications and dimensions.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeImages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Images</FormLabel>
                      <FormDescription>
                        Include renderings and visualizations.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeAccessories"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Accessories</FormLabel>
                      <FormDescription>
                        Include a list of all accessories used in the project.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="includeCutting"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Cutting List</FormLabel>
                      <FormDescription>
                        Include detailed cutting specifications for manufacturing.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sendEmail" 
                checked={showEmailField} 
                onCheckedChange={() => setShowEmailField(!showEmailField)} 
              />
              <label
                htmlFor="sendEmail"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email this export
              </label>
            </div>

            {showEmailField && (
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Email</FormLabel>
                    <FormControl>
                      <Input placeholder="client@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the email address to send this export to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-4">
              <Button 
                type="submit" 
                disabled={isExporting}
                className="flex items-center gap-2"
              >
                {isExporting ? (
                  <>Processing...</>
                ) : showEmailField ? (
                  <>
                    <Send className="h-4 w-4" /> Send Export
                  </>
                ) : (
                  <>
                    {getFormatIcon(selectedFormat as ExportFormat)} Export
                  </>
                )}
              </Button>
              
              {exportUrl && !showEmailField && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => window.open(exportUrl, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" /> Download
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {selectedFormat === 'pdf' && (
          <Button 
            variant="outline" 
            onClick={async () => {
              setIsExporting(true);
              try {
                const previewUrl = await ExportService.previewPdf(project);
                setExportUrl(previewUrl);
                toast({
                  title: "Preview generated",
                  description: "You can now view the PDF preview",
                });
              } catch (error) {
                toast({
                  title: "Preview failed",
                  description: "Could not generate PDF preview",
                  variant: "destructive",
                });
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
          >
            Preview PDF
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={async () => {
            setIsExporting(true);
            try {
              const zipUrl = await ExportService.generateZipBundle(project);
              setExportUrl(zipUrl);
              toast({
                title: "Bundle generated",
                description: "Complete export bundle is ready for download",
              });
            } catch (error) {
              toast({
                title: "Bundle generation failed",
                description: "Could not create export bundle",
                variant: "destructive",
              });
            } finally {
              setIsExporting(false);
            }
          }}
          disabled={isExporting}
        >
          <Package className="h-4 w-4 mr-2" /> Generate Complete Bundle
        </Button>
      </CardFooter>
    </Card>
  );
};
