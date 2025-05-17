
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from 'recharts';
import { 
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  Line, ResponsiveContainer, Cell, Pie
} from 'recharts';
import { Calendar, Filter } from 'lucide-react';

// Sample data for charts
const monthlyRevenue = [
  { name: 'Jan', revenue: 12500 },
  { name: 'Feb', revenue: 14200 },
  { name: 'Mar', revenue: 16800 },
  { name: 'Apr', revenue: 19500 },
  { name: 'May', revenue: 21200 },
  { name: 'Jun', revenue: 18900 },
  { name: 'Jul', revenue: 20100 },
  { name: 'Aug', revenue: 22800 },
  { name: 'Sep', revenue: 25500 },
  { name: 'Oct', revenue: 27800 },
  { name: 'Nov', revenue: 29500 },
  { name: 'Dec', revenue: 31200 },
];

const materialUsage = [
  { name: 'PAL', value: 35 },
  { name: 'MDF', value: 25 },
  { name: 'MDF-AGT', value: 15 },
  { name: 'GLASS', value: 10 },
  { name: 'PFL', value: 10 },
  { name: 'COUNTERTOP', value: 5 },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57'];

const accessoryUsage = [
  { name: 'Hinges', value: 1200 },
  { name: 'Slides', value: 850 },
  { name: 'Handles', value: 720 },
  { name: 'Shelf Supports', value: 650 },
  { name: 'Feet', value: 450 },
  { name: 'Push Systems', value: 320 },
];

const clientProjects = [
  { name: 'Jan', newProjects: 8, completedProjects: 5 },
  { name: 'Feb', newProjects: 10, completedProjects: 7 },
  { name: 'Mar', newProjects: 12, completedProjects: 9 },
  { name: 'Apr', newProjects: 15, completedProjects: 11 },
  { name: 'May', newProjects: 18, completedProjects: 13 },
  { name: 'Jun', newProjects: 14, completedProjects: 12 },
];

const revenueSources = [
  { name: 'Materials', value: 45 },
  { name: 'Accessories', value: 25 },
  { name: 'Labor', value: 20 },
  { name: 'Services', value: 10 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Analytics Dashboard</h1>
            <p className="text-gray-300">Detailed analytics and performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
                <SelectItem value="quarter">Last Quarter</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* High-level KPI summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Total Revenue</CardDescription>
              <CardTitle className="text-white text-2xl">€215,800</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-medium text-green-500">+18.2% from last year</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Projects Completed</CardDescription>
              <CardTitle className="text-white text-2xl">126</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-medium text-green-500">+12.5% from last year</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Materials Used (m²)</CardDescription>
              <CardTitle className="text-white text-2xl">4,520</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-medium text-green-500">+7.8% from last year</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-gray-400">Client Retention</CardDescription>
              <CardTitle className="text-white text-2xl">92.4%</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm font-medium text-green-500">+3.6% from last year</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-gray-800">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>
          
          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Monthly Revenue Chart */}
              <Card className="bg-gray-800 border-gray-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Over Time</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly revenue breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyRevenue}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                          formatter={(value) => [`€${value}`, 'Revenue']}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Sources Chart */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Revenue Sources</CardTitle>
                  <CardDescription className="text-gray-400">
                    Revenue breakdown by source
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueSources}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {revenueSources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Projects Timeline */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Timeline</CardTitle>
                  <CardDescription className="text-gray-400">
                    New vs. completed projects over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={clientProjects}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="newProjects" stroke="#8884d8" name="New Projects" />
                        <Line type="monotone" dataKey="completedProjects" stroke="#82ca9d" name="Completed Projects" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Projects by Room Type */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Projects by Room Type</CardTitle>
                  <CardDescription className="text-gray-400">
                    Distribution of projects by room category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Kitchen', value: 40 },
                            { name: 'Bedroom', value: 25 },
                            { name: 'Living Room', value: 15 },
                            { name: 'Bathroom', value: 12 },
                            { name: 'Office', value: 8 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Materials Tab */}
          <TabsContent value="materials">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Material Usage Chart */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Material Usage</CardTitle>
                  <CardDescription className="text-gray-400">
                    Distribution of material types used in projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={materialUsage}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {materialUsage.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Material Cost Analysis */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Material Cost Analysis</CardTitle>
                  <CardDescription className="text-gray-400">
                    Average cost per square meter by material type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'PAL', cost: 25 },
                          { name: 'MDF', cost: 32 },
                          { name: 'MDF-AGT', cost: 45 },
                          { name: 'GLASS', cost: 78 },
                          { name: 'PFL', cost: 18 },
                          { name: 'COUNTERTOP', cost: 95 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                          formatter={(value) => [`€${value}`, 'Cost per m²']}
                        />
                        <Bar dataKey="cost" fill="#82ca9d" name="Cost per m²" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Accessories Tab */}
          <TabsContent value="accessories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Accessory Usage Chart */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Accessory Usage</CardTitle>
                  <CardDescription className="text-gray-400">
                    Most used accessories by quantity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={accessoryUsage}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis type="number" stroke="#888" />
                        <YAxis dataKey="name" type="category" stroke="#888" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                          formatter={(value) => [value, 'Quantity']}
                        />
                        <Bar dataKey="value" fill="#8884d8" name="Quantity" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Accessory Cost Breakdown */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Accessory Cost Breakdown</CardTitle>
                  <CardDescription className="text-gray-400">
                    Percentage of total accessory costs by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] flex justify-center items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Hinges', value: 20 },
                            { name: 'Slides', value: 35 },
                            { name: 'Handles', value: 15 },
                            { name: 'Shelf Supports', value: 10 },
                            { name: 'Feet', value: 8 },
                            { name: 'Push Systems', value: 12 },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value}%`, 'Percentage']}
                          contentStyle={{ backgroundColor: '#333', border: '1px solid #555' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
