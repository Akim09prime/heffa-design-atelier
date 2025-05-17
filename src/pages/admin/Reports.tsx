import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Search, Download, FileSpreadsheet, File, BarChart, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Report } from '@/types';

const Reports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      name: 'Monthly Sales Report',
      type: 'sales',
      dateCreated: new Date('2025-04-15'),
      dateRange: {
        start: new Date('2025-03-01'),
        end: new Date('2025-03-31'),
      },
      format: 'pdf',
      generatedBy: 'admin',
      url: '#',
      status: 'completed',
    },
    {
      id: '2',
      name: 'Materials Inventory',
      type: 'materials',
      dateCreated: new Date('2025-05-01'),
      dateRange: {
        start: new Date('2025-05-01'),
        end: new Date('2025-05-01'),
      },
      format: 'excel',
      generatedBy: 'admin',
      url: '#',
      status: 'completed',
    },
    {
      id: '3',
      name: 'Accessories Usage',
      type: 'accessories',
      dateCreated: new Date('2025-04-28'),
      dateRange: {
        start: new Date('2025-03-01'),
        end: new Date('2025-04-28'),
      },
      format: 'excel',
      generatedBy: 'admin',
      url: '#',
      status: 'completed',
    },
    {
      id: '4',
      name: 'Q1 Sales Analysis',
      type: 'sales',
      dateCreated: new Date('2025-04-10'),
      dateRange: {
        start: new Date('2025-01-01'),
        end: new Date('2025-03-31'),
      },
      format: 'pdf',
      generatedBy: 'admin',
      url: '#',
      status: 'completed',
    },
    {
      id: '5',
      name: 'Processing Statistics',
      type: 'processing',
      dateCreated: new Date('2025-05-10'),
      dateRange: {
        start: new Date('2025-04-01'),
        end: new Date('2025-04-30'),
      },
      format: 'excel',
      generatedBy: 'admin',
      url: null,
      status: 'pending',
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isNewReportDialogOpen, setIsNewReportDialogOpen] = useState(false);
  
  const filteredReports = reports.filter((report) => {
    const matchesSearch = searchQuery === '' || 
      report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesType;
  });
  
  const handleGenerateReport = () => {
    const newReport: Report = {
      id: `${Date.now()}`,
      name: 'New Generated Report',
      type: 'custom',
      dateCreated: new Date(),
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      format: 'excel',
      generatedBy: 'admin',
      url: null,
      status: 'pending',
    };
    
    setReports([...reports, newReport]);
    setIsNewReportDialogOpen(false);
    
    // Simulate report generation
    toast({
      title: "Report Generation Started",
      description: "Your report is being generated. This may take a few minutes."
    });
    
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === newReport.id 
          ? { ...r, status: 'completed', url: '#' } 
          : r
      ));
      
      toast({
        title: "Report Ready",
        description: "Your report has been generated successfully."
      });
    }, 3000);
  };
  
  const handleDownload = (report: Report) => {
    if (report.status === 'pending') {
      toast({
        title: "Report Unavailable",
        description: "This report is still being processed. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Downloading Report",
      description: `${report.name} is being downloaded.`
    });
  };

  const getReportIcon = (reportType: string) => {
    switch(reportType) {
      case 'sales':
        return <BarChart className="h-6 w-6 text-indigo-500" />;
      case 'inventory':
      case 'materials':
        return <FileSpreadsheet className="h-6 w-6 text-green-500" />;
      case 'accessories':
        return <FileSpreadsheet className="h-6 w-6 text-blue-500" />;
      case 'processing':
        return <FileSpreadsheet className="h-6 w-6 text-orange-500" />;
      default:
        return <FilePdf className="h-6 w-6 text-gray-500" />;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Reports</h1>
            <p className="text-gray-300">Generate and manage system reports</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="w-full pl-9 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Report type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsNewReportDialogOpen(true)}>Generate Report</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Sales Reports</CardTitle>
              <CardDescription className="text-gray-400">Revenue analysis and orders</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">24</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Inventory Reports</CardTitle>
              <CardDescription className="text-gray-400">Materials and accessories</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">18</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Generated This Month</CardTitle>
              <CardDescription className="text-gray-400">May 2025</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">7</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Average Generation Time</CardTitle>
              <CardDescription className="text-gray-400">Processing duration</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-white">42s</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Reports</CardTitle>
            <CardDescription className="text-gray-400">
              List of recently generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-400">Report</TableHead>
                  <TableHead className="text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-400">Date Range</TableHead>
                  <TableHead className="text-gray-400">Created</TableHead>
                  <TableHead className="text-gray-400">Format</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      No reports found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow key={report.id} className="border-gray-700 hover:bg-gray-700">
                      <TableCell className="font-medium text-gray-300 flex items-center gap-3">
                        {getReportIcon(report.type)}
                        <span>{report.name}</span>
                      </TableCell>
                      <TableCell className="text-gray-300 capitalize">{report.type}</TableCell>
                      <TableCell className="text-gray-300">
                        {formatDate(report.dateRange.start)} - {formatDate(report.dateRange.end)}
                      </TableCell>
                      <TableCell className="text-gray-300">{formatDate(report.dateCreated)}</TableCell>
                      <TableCell className="text-gray-300 uppercase">{report.format}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            report.status === 'completed'
                              ? 'bg-green-900/30 text-green-400 hover:bg-green-900/40'
                              : report.status === 'pending'
                              ? 'bg-yellow-900/30 text-yellow-400 hover:bg-yellow-900/40'
                              : 'bg-red-900/30 text-red-400 hover:bg-red-900/40'
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(report)}
                          disabled={report.status === 'pending'}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* New Report Dialog */}
      <Dialog open={isNewReportDialogOpen} onOpenChange={setIsNewReportDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-name" className="text-right">Report Name</Label>
              <Input
                id="report-name"
                placeholder="Enter report name"
                className="col-span-3 bg-gray-700 border-gray-600"
                defaultValue="New Report"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-type" className="text-right">Report Type</Label>
              <Select defaultValue="sales">
                <SelectTrigger id="report-type" className="col-span-3 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-range" className="text-right">Date Range</Label>
              <div className="col-span-3 flex items-center gap-2">
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-md px-3 py-1 flex-grow">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">Last 30 days</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-format" className="text-right">Format</Label>
              <Select defaultValue="excel">
                <SelectTrigger id="report-format" className="col-span-3 bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewReportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport}>Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Reports;
