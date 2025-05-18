
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Client } from '@/types';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface ClientFormProps {
  client: Partial<Client>;
  onChange: (field: keyof Client, value: string) => void;
  isEditing?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export const ClientForm = ({ 
  client, 
  onChange, 
  isEditing = false,
  onValidationChange
}: ClientFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate form on client change
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    // Name validation
    if (!client.name?.trim()) {
      newErrors.name = 'Name is required';
    } else if (client.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!client.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(client.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    // Phone validation (optional but validate format if provided)
    if (client.phone?.trim() && !/^[+\d\s()-]{7,}$/.test(client.phone)) {
      newErrors.phone = 'Phone number format is invalid';
    }
    
    setErrors(newErrors);
    
    // Inform parent component about validation state
    if (onValidationChange) {
      onValidationChange(Object.keys(newErrors).length === 0);
    }
  }, [client, onValidationChange]);

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-start gap-4">
        <Label 
          htmlFor="name" 
          className="text-right pt-2"
        >
          Name*
        </Label>
        <div className="col-span-3 space-y-1">
          <Input 
            id="name" 
            className={errors.name ? "border-red-500" : ""}
            value={client.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter client name"
          />
          {errors.name && (
            <div className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.name}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label 
          htmlFor="email" 
          className="text-right pt-2"
        >
          Email*
        </Label>
        <div className="col-span-3 space-y-1">
          <Input 
            id="email" 
            type="email" 
            className={errors.email ? "border-red-500" : ""}
            value={client.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="Enter client email"
          />
          {errors.email && (
            <div className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.email}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label 
          htmlFor="phone" 
          className="text-right pt-2"
        >
          Phone
        </Label>
        <div className="col-span-3 space-y-1">
          <Input 
            id="phone" 
            type="tel" 
            className={errors.phone ? "border-red-500" : ""}
            value={client.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="Enter client phone"
          />
          {errors.phone && (
            <div className="text-red-500 text-xs flex items-center mt-1">
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.phone}
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="grid grid-cols-4 items-start gap-4">
          <Label 
            htmlFor="status" 
            className="text-right pt-2"
          >
            Status
          </Label>
          <div className="col-span-3">
            <Select 
              value={client.status || 'active'} 
              onValueChange={(value) => onChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientForm;
