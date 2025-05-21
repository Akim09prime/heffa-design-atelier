
import React from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';

const Clients = () => {
  return (
    <DesignerLayout>
      <div className="p-6 designer-theme">
        <h1 className="text-3xl font-semibold designer-gradient-text">Clients</h1>
        <p className="text-designer-text-muted">Manage client accounts and projects</p>
        
        <div className="mt-8">
          <p>Clients content will be added here.</p>
        </div>
      </div>
    </DesignerLayout>
  );
};

export default Clients;
