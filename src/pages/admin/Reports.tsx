import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Search, Download, FileSpreadsheet, File, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Report } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip, Cell } from 'recharts';

const Reports = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
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
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'quarter', 'year'
  
  const filteredReports = reports.filter((report) => {
    const matchesSearch = searchQuery === '' || 
      report.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesType;
  });
  
  // Mock data for charts
  const monthlySalesData = [
    { name: t('months.january'), sales: 12400 },
    { name: t('months.february'), sales: 15600 },
    { name: t('months.march'), sales: 16200 },
    { name: t('months.april'), sales: 18100 },
    { name: t('months.may'), sales: 17800 },
    { name: t('months.june'), sales: 19200 },
  ];
  
  const furnitureProducedData = [
    { name: t('months.january'), count: 85 },
    { name: t('months.february'), count: 93 },
    { name: t('months.march'), count: 102 },
    { name: t('months.april'), count: 110 },
    { name: t('months.may'), count: 105 },
    { name: t('months.june'), count: 120 },
  ];
  
  const materialsConsumedData = [
    { name: 'PAL', value: 45 },
    { name: 'MDF', value: 25 },
    { name: 'Accesorii', value: 20 },
    { name: 'Sticlă', value: 10 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
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

  const handleExportChart = (chartType: string) => {
    toast({
      title: t('reports.exportStarted'),
      description: t('reports.preparingExport', { type: chartType }),
    });
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: t('reports.exportSuccess'),
        description: t('reports.exportCompleted', { type: chartType }),
      });
    }, 1500);
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
        return <File className="h-6 w-6 text-gray-500" />;
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
            <h1 className="text-3xl font-medium text-white mb-2">{t('admin.reports')}</h1>
            <p className="text-gray-300">{t('admin.reports.description')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('common.search')}
                className="w-full pl-9 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder={t('common.filter')} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="sales">{t('reports.sales')}</SelectItem>
                <SelectItem value="materials">{t('reports.materials')}</SelectItem>
                <SelectItem value="accessories">{t('reports.accessories')}</SelectItem>
                <SelectItem value="processing">{t('reports.processing')}</SelectItem>
                <SelectItem value="custom">{t('reports.custom')}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsNewReportDialogOpen(true)}>{t('reports.generateReport')}</Button>
          </div>
        </div>

        {/* Charts section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-medium text-white">{t('reports.analytics')}</h2>
            <div className="flex gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder={t('reports.selectPeriod')} />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="week">{t('reports.lastWeek')}</SelectItem>
                  <SelectItem value="month">{t('reports.lastMonth')}</SelectItem>
                  <SelectItem value="quarter">{t('reports.lastQuarter')}</SelectItem>
                  <SelectItem value="year">{t('reports.lastYear')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Sales Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-lg">{t('admin.reports.monthlySales')}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleExportChart('sales')}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlySalesData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
                      />
                      <Bar dataKey="sales" fill="#10b981" name={t('reports.sales')} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Furniture Produced Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-lg">{t('admin.reports.furnitureProduced')}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleExportChart('furniture')}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={furnitureProducedData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
                      />
                      <Line type="monotone" dataKey="count" stroke="#60a5fa" name={t('reports.furniturePieces')} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Materials Consumed Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white text-lg">{t('admin.reports.materialsConsumed')}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleExportChart('materials')}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={materialsConsumedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {materialsConsumedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reports list */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{t('reports.recentReports')}</CardTitle>
            <CardDescription className="text-gray-400">
              {t('reports.recentReportsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-400">{t('reports.reportName')}</TableHead>
                  <TableHead className="text-gray-400">{t('reports.type')}</TableHead>
                  <TableHead className="text-gray-400">{t('reports.dateRange')}</TableHead>
                  <TableHead className="text-gray-400">{t('reports.created')}</TableHead>
                  <TableHead className="text-gray-400">{t('reports.format')}</TableHead>
                  <TableHead className="text-gray-400">{t('reports.status')}</TableHead>
                  <TableHead className="text-gray-400">{t('reports.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                      {t('common.noData')}
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
            <DialogTitle>{t('reports.generateNewReport')}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-name" className="text-right">{t('reports.reportName')}</Label>
              <Input
                id="report-name"
                placeholder={t('reports.enterReportName')}
                className="col-span-3 bg-gray-700 border-gray-600"
                defaultValue={t('reports.newReport')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-type" className="text-right">{t('reports.type')}</Label>
              <Select defaultValue="sales">
                <SelectTrigger id="report-type" className="col-span-3 bg-gray-700 border-gray-600">
                  <SelectValue placeholder={t('reports.selectType')} />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="sales">{t('reports.sales')}</SelectItem>
                  <SelectItem value="materials">{t('reports.materials')}</SelectItem>
                  <SelectItem value="accessories">{t('reports.accessories')}</SelectItem>
                  <SelectItem value="processing">{t('reports.processing')}</SelectItem>
                  <SelectItem value="custom">{t('reports.custom')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-range" className="text-right">{t('reports.dateRange')}</Label>
              <div className="col-span-3 flex items-center gap-2">
                <div className="flex items-center bg-gray-700 border border-gray-600 rounded-md px-3 py-1 flex-grow">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{t('reports.last30days')}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="report-format" className="text-right">{t('reports.format')}</Label>
              <Select defaultValue="excel">
                <SelectTrigger id="report-format" className="col-span-3 bg-gray-700 border-gray-600">
                  <SelectValue placeholder={t('reports.selectFormat')} />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="excel">{t('reports.excel')}</SelectItem>
                  <SelectItem value="pdf">{t('reports.pdf')}</SelectItem>
                  <SelectItem value="json">{t('reports.json')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewReportDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleGenerateReport}>{t('common.generate')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Reports;
