
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from '@/types';

interface ClientFormProps {
  client: Partial<Client>;
  onChange: (field: keyof Client, value: string) => void;
  isEditing?: boolean;
}

export const ClientForm = ({ client, onChange, isEditing = false }: ClientFormProps) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="name" className="text-right">
          Name*
        </label>
        <Input 
          id="name" 
          className="col-span-3" 
          value={client.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="Enter client name"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="email" className="text-right">
          Email*
        </label>
        <Input 
          id="email" 
          type="email" 
          className="col-span-3" 
          value={client.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Enter client email"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="phone" className="text-right">
          Phone
        </label>
        <Input 
          id="phone" 
          type="tel" 
          className="col-span-3" 
          value={client.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="Enter client phone"
        />
      </div>

      {isEditing && (
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="status" className="text-right">
            Status
          </label>
          <Select 
            value={client.status || 'active'} 
            onValueChange={(value) => onChange('status', value)}
          >
            <SelectTrigger id="status" className="col-span-3">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ClientForm;
