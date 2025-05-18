import React, { useState } from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/contexts/TranslationContext';
import { useUi } from '@/contexts/UiContext';
import {
  Database, FileText, Settings, Upload, Download,
  BarChart3, PieChart, Users, Package, AlertCircle,
  ArrowUpRightFromCircle, Plus, Loader
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isLoading, setLoading, showSuccessToast, showErrorToast } = useUi();
  
  // Sample data for export functionality
  const materialsData = [
    { id: "EG1000", name: "White Oak", type: "PAL", price: 15.00, status: "In Stock" },
    { id: "EG1001", name: "Dark Walnut", type: "MDF", price: 23.00, status: "Low Stock" },
    { id: "EG1002", name: "Matte Black", type: "MDF-AGT", price: 31.00, status: "In Stock" },
    { id: "EG1003", name: "Brushed Gray", type: "PFL", price: 39.00, status: "In Stock" },
    { id: "EG1004", name: "Natural Maple", type: "GLASS", price: 47.00, status: "Low Stock" }
  ];
  
  const handleNavigation = (path: string, title: string) => {
    navigate(path);
    toast({
      title: `Navigating to ${title}`,
      description: "Loading content...",
    });
  };

  const handleExportExcel = async () => {
    try {
      setLoading('export-excel', true);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Convert data to worksheet
      const ws = XLSX.utils.json_to_sheet(materialsData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Materials");
      
      // Generate buffer
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      
      // Convert buffer to Blob
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Save file
      saveAs(blob, "materials-catalog.xlsx");
      
      showSuccessToast('Export Successful', 'Materials data exported to Excel');
    } catch (error) {
      console.error('Excel export error:', error);
      showErrorToast('Export Failed', (error as Error).message);
    } finally {
      setLoading('export-excel', false);
    }
  };
  
  const handleExportPdf = async () => {
    try {
      setLoading('export-pdf', true);
      
      // Create PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text("Materials Catalog", 20, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
      
      // Prepare table data
      const tableData = [
        ['Code', 'Name', 'Type', 'Price', 'Status'],
        ...materialsData.map(item => [
          item.id,
          item.name,
          item.type,
          `$${item.price.toFixed(2)}/m²`,
          item.status
        ])
      ];
      
      // @ts-ignore - jsPDF-autotable types are not properly recognized
      doc.autoTable({
        startY: 40,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }
      });
      
      // Save the PDF
      doc.save("materials-catalog.pdf");
      
      showSuccessToast('Export Successful', 'Materials data exported to PDF');
    } catch (error) {
      console.error('PDF export error:', error);
      showErrorToast('Export Failed', (error as Error).message);
    } finally {
      setLoading('export-pdf', false);
    }
  };
  
  const handleAction = (action: string) => {
    if (action === "Export") {
      // Show export options
      const exportType = window.confirm("Choose export format: \nClick OK for PDF, Cancel for Excel") ? "PDF" : "Excel";
      
      if (exportType === "PDF") {
        handleExportPdf();
      } else {
        handleExportExcel();
      }
    } else {
      toast({
        title: `${action} initiated`,
        description: "Processing your request...",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gradient-to-br from-admin-900 to-admin-950">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">Admin Dashboard</h1>
            <p className="text-gray-400">Manage materials, accessories, and system settings</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
              onClick={() => handleNavigation("/admin/import-data", "Import Data")}
            >
              <Upload size={16} className="mr-2" /> Import Data
            </Button>
            <Button 
              variant="outline" 
              className="border-blue-400/30 text-blue-400 hover:bg-blue-800/30 transition-all hover:scale-105"
              onClick={() => handleAction("Export")}
              disabled={isLoading('export-pdf') || isLoading('export-excel')}
            >
              {(isLoading('export-pdf') || isLoading('export-excel')) ? (
                <>
                  <Loader size={16} className="mr-2 animate-spin" /> Exporting...
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" /> Export
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl hover:shadow-admin-700/20 hover:scale-[1.02] transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-400">Total Materials</CardTitle>
                <Database className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">1,283</div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-green-400">+24</span> added this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl hover:shadow-admin-700/20 hover:scale-[1.02] transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-400">Accessories</CardTitle>
                <Package className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">857</div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-green-400">+12</span> added this month
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl hover:shadow-admin-700/20 hover:scale-[1.02] transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-400">Users</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">48</div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-amber-400">12</span> active now
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl hover:shadow-admin-700/20 hover:scale-[1.02] transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-gray-400">System Alerts</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">7</div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-red-400">3 critical</span> issues
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - left side */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Material Database Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage and update all material types and properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="materials" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4 bg-admin-700/50">
                    <TabsTrigger value="materials" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Materials</TabsTrigger>
                    <TabsTrigger value="accessories" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Accessories</TabsTrigger>
                    <TabsTrigger value="processing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Processing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="materials" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-x-2">
                        <Badge className="bg-blue-600 hover:bg-blue-700 cursor-pointer">All</Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700 hover:border-blue-400 cursor-pointer">PAL</Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700 hover:border-blue-400 cursor-pointer">MDF</Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700 hover:border-blue-400 cursor-pointer">GLASS</Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700 hover:border-blue-400 cursor-pointer">Other</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105"
                        onClick={() => handleNavigation("/admin/materials-database/new", "Add Material")}
                      >
                        <Plus size={14} className="mr-1" /> Add Material
                      </Button>
                    </div>
                    
                    <div className="rounded-md border border-admin-700 overflow-hidden shadow-inner shadow-admin-700/30">
                      <table className="min-w-full divide-y divide-admin-700">
                        <thead className="bg-admin-900">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-admin-800 divide-y divide-admin-700">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="hover:bg-admin-700 cursor-pointer" onClick={() => handleNavigation(`/admin/materials-database/${1000 + i}`, `Material EG${1000 + i}`)}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">EG{1000 + i}</td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                                {["White Oak", "Dark Walnut", "Matte Black", "Brushed Gray", "Natural Maple"][i]}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                                {["PAL", "MDF", "MDF-AGT", "PFL", "GLASS"][i]}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300">
                                ${(15 + i * 8).toFixed(2)}/m²
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap">
                                <Badge className={i % 3 === 0 ? "bg-red-900/50 text-red-300 border border-red-500/20" : "bg-green-900/50 text-green-300 border border-green-500/20"}>
                                  {i % 3 === 0 ? "Low Stock" : "In Stock"}
                                </Badge>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavigation(`/admin/materials-database/${1000 + i}/edit`, `Edit Material EG${1000 + i}`);
                                  }}
                                  className="hover:bg-blue-800/30 hover:text-blue-400"
                                >
                                  <Settings size={16} />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="accessories">
                    <div className="flex justify-end mb-4">
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleNavigation("/admin/accessories/new", "Add Accessory")}
                      >
                        <Plus size={14} className="mr-1" /> Add Accessory
                      </Button>
                    </div>
                    <div className="p-8 bg-admin-700/20 rounded-lg border border-admin-700/50 text-center">
                      <p className="text-gray-400">Select an accessory category to manage</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {["Hinges", "Handles", "Slides", "Lift Systems", "Connectors", "Lighting"].map((category, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            className="border-admin-700 text-gray-300 hover:bg-blue-800/30 hover:text-blue-400"
                            onClick={() => handleNavigation(`/admin/accessories/${category.toLowerCase().replace(' ', '-')}`, category)}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="processing">
                    <div className="flex justify-end mb-4">
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleNavigation("/admin/processing/new", "Add Processing Rule")}
                      >
                        <Plus size={14} className="mr-1" /> Add Processing Rule
                      </Button>
                    </div>
                    <div className="p-8 bg-admin-700/20 rounded-lg border border-admin-700/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["Edge Banding", "CNC Operations", "Drilling", "Assembly Rules", "Compatibility Matrix"].map((category, i) => (
                          <Card key={i} className="bg-admin-800 border-admin-700 hover:bg-admin-700 cursor-pointer transition-all" 
                            onClick={() => handleNavigation(`/admin/processing/${category.toLowerCase().replace(' ', '-')}`, category)}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-white text-lg">{category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-400">
                                {[
                                  "Configure edge banding types and relationships",
                                  "Set up CNC operations for different materials",
                                  "Define drilling parameters and positions",
                                  "Configure component assembly rules",
                                  "Define material compatibility settings"
                                ][i]}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-admin-700 py-3">
                <p className="text-xs text-gray-400">Showing 5 of 1,283 entries</p>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" className="text-gray-300 border-gray-700 hover:bg-admin-700">Previous</Button>
                  <Button size="sm" variant="outline" className="text-gray-300 border-gray-700 hover:bg-admin-700">Next</Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl hover:shadow-admin-700/20 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">System Usage</CardTitle>
                    <PieChart size={18} className="text-blue-400" />
                  </div>
                  <CardDescription className="text-gray-400">
                    User activity over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="flex justify-center">
                    <div className="w-full h-52 bg-admin-700/20 rounded-md flex flex-col items-center justify-center border border-admin-700/50 overflow-hidden relative">
                      <div className="absolute inset-0 bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-indigo-900 via-purple-900 to-blue-900 opacity-20"></div>
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-2">
                          <span className="text-xl font-bold text-white">78%</span>
                        </div>
                        <p className="text-sm text-gray-400">Monthly active users</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="text-blue-400 ml-auto" 
                    onClick={() => handleNavigation("/admin/analytics", "Analytics")}>
                    View full report <ArrowUpRightFromCircle size={14} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl hover:shadow-admin-700/20 transition-all">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Material Usage</CardTitle>
                    <BarChart3 size={18} className="text-blue-400" />
                  </div>
                  <CardDescription className="text-gray-400">
                    Most popular materials
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="flex justify-center">
                    <div className="w-full h-52 bg-admin-700/20 rounded-md flex items-center justify-center border border-admin-700/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900 to-indigo-500 opacity-10"></div>
                      <div className="absolute bottom-0 left-0 w-full px-4 pb-2">
                        {["White Oak", "Matte Black", "Natural Maple"].map((material, i) => (
                          <div key={i} className="mb-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-gray-300">{material}</span>
                              <span className="text-gray-400">{65 - i * 20}%</span>
                            </div>
                            <div className="h-2 bg-admin-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  i === 0 ? "bg-gradient-to-r from-blue-500 to-purple-500" : 
                                  i === 1 ? "bg-gradient-to-r from-purple-500 to-pink-500" : 
                                  "bg-gradient-to-r from-pink-500 to-red-500"
                                }`}
                                style={{ width: `${65 - i * 20}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="text-blue-400 ml-auto"
                    onClick={() => handleNavigation("/admin/reports", "Material Reports")}>
                    View full report <ArrowUpRightFromCircle size={14} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Right sidebar */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl hover:shadow-admin-700/20 transition-all">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start gap-3 shadow-lg shadow-blue-500/10 hover:scale-[1.02] transition-all"
                  onClick={() => handleNavigation("/admin/import-data", "Import Material Catalog")}>
                  <Upload size={16} /> Import Material Catalog
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start gap-3 shadow-lg shadow-blue-500/10 hover:scale-[1.02] transition-all"
                  onClick={() => handleAction("Update Price Lists")}>
                  <Database size={16} /> Update Price Lists
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start gap-3 shadow-lg shadow-blue-500/10 hover:scale-[1.02] transition-all"
                  onClick={() => handleNavigation("/admin/reports", "Generate Reports")}>
                  <FileText size={16} /> Generate Reports
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start gap-3 shadow-lg shadow-blue-500/10 hover:scale-[1.02] transition-all"
                  onClick={() => handleNavigation("/admin/settings", "System Settings")}>
                  <Settings size={16} /> System Settings
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl hover:shadow-admin-700/20 transition-all">
              <CardHeader>
                <CardTitle className="text-white">System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    { title: "Low stock on 12 materials", severity: "high", action: "Restock Inventory" },
                    { title: "Price updates needed for Egger catalog", severity: "medium", action: "Update Prices" },
                    { title: "3 user accounts pending approval", severity: "low", action: "Review Users" },
                  ].map((alert, i) => (
                    <li key={i} className="flex gap-3 items-start p-3 rounded-md bg-admin-700/30 border border-admin-700/50 hover:bg-admin-700/50 transition-all">
                      <div className={`h-2 w-2 rounded-full mt-1.5 ${
                        alert.severity === "high" ? "bg-red-500" :
                        alert.severity === "medium" ? "bg-amber-500" : "bg-blue-500"
                      }`}>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-200">{alert.title}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {alert.severity === "high" ? "Critical" :
                           alert.severity === "medium" ? "Warning" : "Info"} • {i + 1}h ago
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hover:bg-blue-800/30 hover:text-blue-400"
                        onClick={() => handleAction(alert.action)}
                      >
                        View
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="border-t border-admin-700">
                <Button 
                  variant="link" 
                  className="text-blue-400"
                  onClick={() => handleNavigation("/admin/alerts", "All Alerts")}
                >
                  View all alerts
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-admin-800 to-admin-900 border-admin-700 backdrop-blur-sm shadow-xl hover:shadow-admin-700/20 transition-all">
              <CardHeader>
                <CardTitle className="text-white">System Status</CardTitle>
                <CardDescription className="text-gray-400">
                  All systems operational
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300">Database</p>
                    <Badge className="bg-green-900/50 text-green-300 border border-green-500/20">Online</Badge>
                  </div>
                  <div className="w-full h-1.5 bg-admin-700 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full" style={{ width: "65%" }}></div>
                  </div>
                  <p className="text-xs text-gray-400">65% capacity • 13.2 GB free</p>
                </div>
                
                <Separator className="my-2 bg-admin-700" />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300">File Storage</p>
                    <Badge className="bg-green-900/50 text-green-300 border border-green-500/20">Online</Badge>
                  </div>
                  <div className="w-full h-1.5 bg-admin-700 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full" style={{ width: "32%" }}></div>
                  </div>
                  <p className="text-xs text-gray-400">32% capacity • 68 GB free</p>
                </div>
                
                <Separator className="my-2 bg-admin-700" />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300">API Services</p>
                    <Badge className="bg-green-900/50 text-green-300 border border-green-500/20">Online</Badge>
                  </div>
                  <div className="w-full h-1.5 bg-admin-700 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-violet-400 h-full" style={{ width: "18%" }}></div>
                  </div>
                  <p className="text-xs text-gray-400">163 requests/min • 18% load</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
