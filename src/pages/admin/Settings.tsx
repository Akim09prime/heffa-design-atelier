
import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-medium text-white mb-6">System Settings</h1>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="flex items-center justify-center p-12 text-center">
            <p className="text-gray-300">System settings interface will be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;
