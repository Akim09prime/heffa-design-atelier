
import React from 'react';
import { AdminLayout } from '../components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Database, FileText, Settings, Upload, Download,
  BarChart3, PieChart, Users, Package, AlertCircle,
  ArrowUpRightFromCircle, Plus
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage materials, accessories, and system settings</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload size={16} className="mr-2" /> Import Data
            </Button>
            <Button variant="outline">
              <Download size={16} className="mr-2" /> Export
            </Button>
          </div>
        </div>
        
        {/* Stats overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-admin-800 border-admin-700">
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
          
          <Card className="bg-admin-800 border-admin-700">
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
          
          <Card className="bg-admin-800 border-admin-700">
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
          
          <Card className="bg-admin-800 border-admin-700">
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
            <Card className="bg-admin-800 border-admin-700">
              <CardHeader>
                <CardTitle className="text-white">Material Database Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage and update all material types and properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="materials" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                    <TabsTrigger value="accessories">Accessories</TabsTrigger>
                    <TabsTrigger value="processing">Processing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="materials" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="space-x-2">
                        <Badge className="bg-blue-600 hover:bg-blue-700">All</Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700">PAL</Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700">MDF</Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700">GLASS</Badge>
                        <Badge variant="outline" className="text-gray-300 border-gray-700">Other</Badge>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus size={14} className="mr-1" /> Add Material
                      </Button>
                    </div>
                    
                    <div className="rounded-md border border-admin-700 overflow-hidden">
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
                            <tr key={i} className="hover:bg-admin-700">
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
                                <Badge className={i % 3 === 0 ? "bg-red-900/50 text-red-300" : "bg-green-900/50 text-green-300"}>
                                  {i % 3 === 0 ? "Low Stock" : "In Stock"}
                                </Badge>
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="icon">
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
                    <p className="text-gray-400">Accessories management would go here</p>
                  </TabsContent>
                  
                  <TabsContent value="processing">
                    <p className="text-gray-400">Processing options management would go here</p>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-admin-700 py-3">
                <p className="text-xs text-gray-400">Showing 5 of 1,283 entries</p>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" className="text-gray-300 border-gray-700">Previous</Button>
                  <Button size="sm" variant="outline" className="text-gray-300 border-gray-700">Next</Button>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-admin-800 border-admin-700">
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
                    <div className="w-full h-52 bg-admin-700/50 rounded-md flex items-center justify-center">
                      <p className="text-sm text-gray-400">Analytics chart would go here</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="text-blue-400 ml-auto">
                    View full report <ArrowUpRightFromCircle size={14} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-admin-800 border-admin-700">
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
                    <div className="w-full h-52 bg-admin-700/50 rounded-md flex items-center justify-center">
                      <p className="text-sm text-gray-400">Analytics chart would go here</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="text-blue-400 ml-auto">
                    View full report <ArrowUpRightFromCircle size={14} className="ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          {/* Right sidebar */}
          <div className="space-y-6">
            <Card className="bg-admin-800 border-admin-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start gap-3">
                  <Upload size={16} /> Import Material Catalog
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start gap-3">
                  <Database size={16} /> Update Price Lists
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start gap-3">
                  <FileText size={16} /> Generate Reports
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 justify-start gap-3">
                  <Settings size={16} /> System Settings
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-admin-800 border-admin-700">
              <CardHeader>
                <CardTitle className="text-white">System Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    { title: "Low stock on 12 materials", severity: "high" },
                    { title: "Price updates needed for Egger catalog", severity: "medium" },
                    { title: "3 user accounts pending approval", severity: "low" },
                  ].map((alert, i) => (
                    <li key={i} className="flex gap-3 items-start p-2 rounded-md bg-admin-700/50">
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
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="border-t border-admin-700">
                <Button variant="link" className="text-blue-400">View all alerts</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-admin-800 border-admin-700">
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
                    <Badge className="bg-green-900/50 text-green-300">Online</Badge>
                  </div>
                  <div className="w-full h-1.5 bg-admin-700 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: "65%" }}></div>
                  </div>
                  <p className="text-xs text-gray-400">65% capacity • 13.2 GB free</p>
                </div>
                
                <Separator className="my-2 bg-admin-700" />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300">File Storage</p>
                    <Badge className="bg-green-900/50 text-green-300">Online</Badge>
                  </div>
                  <div className="w-full h-1.5 bg-admin-700 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: "32%" }}></div>
                  </div>
                  <p className="text-xs text-gray-400">32% capacity • 68 GB free</p>
                </div>
                
                <Separator className="my-2 bg-admin-700" />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-300">API Services</p>
                    <Badge className="bg-green-900/50 text-green-300">Online</Badge>
                  </div>
                  <div className="w-full h-1.5 bg-admin-700 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full" style={{ width: "18%" }}></div>
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
