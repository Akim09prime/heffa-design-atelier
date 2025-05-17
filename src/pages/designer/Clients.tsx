
import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Mail, Phone, User, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Clients = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock client data
  const clients = [
    { 
      id: 'c1', 
      name: 'John Doe', 
      email: 'john.doe@example.com', 
      phone: '0722 123 456', 
      projects: 3, 
      lastActive: '2023-05-12',
      status: 'active'
    },
    { 
      id: 'c2', 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com', 
      phone: '0733 456 789', 
      projects: 1, 
      lastActive: '2023-06-04',
      status: 'active'
    },
    { 
      id: 'c3', 
      name: 'Michael Johnson', 
      email: 'michael.j@example.com', 
      phone: '0744 789 123', 
      projects: 2, 
      lastActive: '2023-04-18',
      status: 'inactive'
    },
    { 
      id: 'c4', 
      name: 'Anna Williams', 
      email: 'anna.w@example.com', 
      phone: '0755 321 654', 
      projects: 0, 
      lastActive: '2023-06-10',
      status: 'pending'
    }
  ];

  const handleAddClient = () => {
    toast({
      title: "Client Added",
      description: "New client has been successfully added",
    });
  };
  
  const handleEditClient = (clientId: string) => {
    toast({
      title: "Edit Client",
      description: `Opening edit form for client ID: ${clientId}`,
    });
  };
  
  const handleViewProjects = (clientId: string, clientName: string) => {
    toast({
      title: "View Projects",
      description: `Viewing projects for ${clientName}`,
    });
  };

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium mb-2">Client Management</h1>
            <p className="text-gray-500">Manage your clients and their projects</p>
          </div>
          <div className="flex w-full sm:w-auto space-x-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search clients..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new client
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      Name
                    </label>
                    <Input id="name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-right">
                      Email
                    </label>
                    <Input id="email" type="email" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="phone" className="text-right">
                      Phone
                    </label>
                    <Input id="phone" type="tel" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleAddClient}>Add Client</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Client List</CardTitle>
            <CardDescription>
              {clients.length} clients found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{client.email}</span>
                        </div>
                        <div className="flex items-center text-sm mt-1">
                          <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span>{client.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8"
                        onClick={() => handleViewProjects(client.id, client.name)}
                      >
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        {client.projects} projects
                      </Button>
                    </TableCell>
                    <TableCell>{client.lastActive}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          client.status === 'active' ? 'default' :
                          client.status === 'inactive' ? 'secondary' : 'outline'
                        }
                      >
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClient(client.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {clients.length} of {clients.length} clients
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DesignerLayout>
  );
};

export default Clients;
