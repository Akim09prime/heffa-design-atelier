
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Table, BarChart3 } from 'lucide-react';

const Reports = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: `Your ${reportType} report has been successfully generated.`,
      });
    }, 1500);
  };

  const handleDownloadReport = (format: string) => {
    toast({
      title: `Downloading ${format.toUpperCase()}`,
      description: `Your report is being downloaded in ${format} format.`,
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium text-white mb-6">Reports & Analytics</h1>
        
        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="generate">Generate Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Generate Reports</CardTitle>
                <CardDescription className="text-gray-400">
                  Create custom reports from system data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select 
                        value={reportType} 
                        onValueChange={setReportType}
                      >
                        <SelectTrigger id="report-type" className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="sales">Sales Report</SelectItem>
                          <SelectItem value="inventory">Inventory Report</SelectItem>
                          <SelectItem value="materials">Materials Usage</SelectItem>
                          <SelectItem value="accessories">Accessories Usage</SelectItem>
                          <SelectItem value="processing">Processing Statistics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="date-range">Time Period</Label>
                      <Select 
                        value={dateRange} 
                        onValueChange={setDateRange}
                      >
                        <SelectTrigger id="date-range" className="bg-gray-700 border-gray-600">
                          <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="day">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {dateRange === 'custom' && (
                      <div className="space-y-2">
                        <Label>Custom Date Range</Label>
                        <div className="flex space-x-2">
                          <Input 
                            type="date" 
                            className="bg-gray-700 border-gray-600" 
                            placeholder="Start Date" 
                          />
                          <Input 
                            type="date" 
                            className="bg-gray-700 border-gray-600" 
                            placeholder="End Date" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-medium">Report Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="include-charts" 
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary"
                        />
                        <Label htmlFor="include-charts">Include Charts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="include-tables" 
                          defaultChecked 
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary"
                        />
                        <Label htmlFor="include-tables">Include Tables</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="include-summary" 
                          defaultChecked 
                          className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary"
                        />
                        <Label htmlFor="include-summary">Include Summary</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 pt-4">
                    <Button 
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? 'Generating...' : 'Generate Report'}
                    </Button>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleDownloadReport('pdf')}
                        disabled={isGenerating}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDownloadReport('excel')}
                        disabled={isGenerating}
                      >
                        <Table className="h-4 w-4 mr-2" />
                        Excel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scheduled">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Scheduled Reports</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure automated report generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 text-center">
                  <p className="text-gray-400">Scheduled reports configuration will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Analytics Dashboard</CardTitle>
                <CardDescription className="text-gray-400">
                  Real-time system analytics and KPIs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-12 text-center">
                  <BarChart3 className="h-12 w-12 text-gray-500 mr-3" />
                  <p className="text-gray-400">Analytics dashboard will be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Reports;
