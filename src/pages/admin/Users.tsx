
import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Search, Plus, Edit, Trash, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, UserRole } from '@/types';
import { useTranslation } from '@/contexts/TranslationContext';

const Users = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      active: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      active: true,
    },
    {
      id: '3',
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      active: true,
    },
    {
      id: '4',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      role: 'designer',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      active: true,
    },
    {
      id: '5',
      name: 'Michael Williams',
      email: 'michael.williams@example.com',
      role: 'client',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      active: true,
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsAddUserDialogOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserDialogOpen(true);
  };
  
  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast({
      title: t('admin.users.deleteUser'),
      description: t('admin.users.userDetails'),
    });
  };
  
  const handleSaveUser = (formData: FormData) => {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as UserRole;
    
    if (selectedUser) {
      // Update existing user
      setUsers(prev => 
        prev.map(user => user.id === selectedUser.id ? { ...user, name, email, role } : user)
      );
      toast({
        title: t('admin.users.editUser'),
        description: `${name}'s information has been updated.`,
      });
      setIsEditUserDialogOpen(false);
    } else {
      // Add new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
        // Default avatar based on name initials
        avatar: undefined,
        active: true, // Add the missing active property
      };
      
      setUsers(prev => [...prev, newUser]);
      toast({
        title: t('admin.users.addUser'),
        description: `${name} has been added successfully.`,
      });
      setIsAddUserDialogOpen(false);
    }
  };
  
  const handleInviteUser = (email: string) => {
    toast({
      title: t('admin.users.invitation'),
      description: `${t('admin.users.invitationSent')} ${email}.`,
    });
  };

  const getUserRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-purple-900/30 text-purple-400 hover:bg-purple-900/40">{t('admin.users.admins')}</Badge>;
      case 'designer':
        return <Badge className="bg-blue-900/30 text-blue-400 hover:bg-blue-900/40">{t('admin.users.designers')}</Badge>;
      case 'client':
        return <Badge className="bg-green-900/30 text-green-400 hover:bg-green-900/40">{t('admin.users.clients')}</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">{t('admin.users.userManagement')}</h1>
            <p className="text-gray-300">{t('admin.users.manageSystemUsers')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('admin.users.searchUsers')}
                className="w-full pl-9 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder={t('admin.users.filterByRole')} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all">{t('admin.users.allUsers')}</SelectItem>
                <SelectItem value="admin">{t('admin.users.admins')}</SelectItem>
                <SelectItem value="designer">{t('admin.users.designers')}</SelectItem>
                <SelectItem value="client">{t('admin.users.clients')}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.users.addUser')}
            </Button>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{t('admin.users.systemUsers')}</CardTitle>
            <CardDescription className="text-gray-400">
              {t('admin.users.manageSystemUsers')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800">
                  <TableHead className="text-gray-400">{t('admin.users.userDetails')}</TableHead>
                  <TableHead className="text-gray-400">{t('auth.email')}</TableHead>
                  <TableHead className="text-gray-400">{t('admin.users.role')}</TableHead>
                  <TableHead className="text-gray-400 text-right">{t('common.edit')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow className="border-gray-700">
                    <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                      {t('admin.users.noUsersFound')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-gray-700 hover:bg-gray-700">
                      <TableCell className="font-medium text-gray-300">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name.split(' ').map(part => part[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-400">ID: {user.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{user.email}</TableCell>
                      <TableCell>{getUserRoleBadge(user.role)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash className="h-4 w-4 text-gray-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleInviteUser(user.email)}
                          >
                            <Mail className="h-4 w-4 text-gray-400" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{t('admin.users.addUser')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveUser(new FormData(e.currentTarget));
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">{t('admin.users.name')}</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Full name"
                  className="col-span-3 bg-gray-700 border-gray-600"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">{t('admin.users.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  className="col-span-3 bg-gray-700 border-gray-600"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">{t('admin.users.role')}</Label>
                <Select name="role" defaultValue="client">
                  <SelectTrigger id="role" className="col-span-3 bg-gray-700 border-gray-600">
                    <SelectValue placeholder={t('admin.users.role')} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="admin">{t('admin.users.admins')}</SelectItem>
                    <SelectItem value="designer">{t('admin.users.designers')}</SelectItem>
                    <SelectItem value="client">{t('admin.users.clients')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">
                {t('admin.users.addUser')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>{t('admin.users.editUser')}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveUser(new FormData(e.currentTarget));
            }}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">{t('admin.users.name')}</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={selectedUser.name}
                    className="col-span-3 bg-gray-700 border-gray-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">{t('admin.users.email')}</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    defaultValue={selectedUser.email}
                    className="col-span-3 bg-gray-700 border-gray-600"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-role" className="text-right">{t('admin.users.role')}</Label>
                  <Select name="role" defaultValue={selectedUser.role}>
                    <SelectTrigger id="edit-role" className="col-span-3 bg-gray-700 border-gray-600">
                      <SelectValue placeholder={t('admin.users.role')} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="admin">{t('admin.users.admins')}</SelectItem>
                      <SelectItem value="designer">{t('admin.users.designers')}</SelectItem>
                      <SelectItem value="client">{t('admin.users.clients')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Users;
