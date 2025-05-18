
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash, Loader } from 'lucide-react';
import { PriceBreakdownPanel } from './PriceBreakdownPanel';
import { useUi } from '@/contexts/UiContext';

interface PropertiesFooterProps {
  priceBreakdown: {
    materials: number;
    accessories: number;
    processing: number;
    labor: number;
  };
  totalPrice: number;
  showPriceBreakdown: boolean;
  setShowPriceBreakdown: (show: boolean) => void;
  onSave: () => void;
  onDelete: () => void;
  moduleName?: string;
}

export const PropertiesFooter: React.FC<PropertiesFooterProps> = ({
  priceBreakdown,
  totalPrice,
  showPriceBreakdown,
  setShowPriceBreakdown,
  onSave,
  onDelete,
  moduleName = 'Module'
}) => {
  const { isLoading, setLoading, showSuccessToast, showErrorToast } = useUi();

  const handleSave = async () => {
    try {
      setLoading('save-module', true);
      await onSave();
      showSuccessToast('Module Saved', 'Changes have been saved successfully');
    } catch (error) {
      console.error('Error saving module:', error);
      showErrorToast('Save Failed', (error as Error).message);
    } finally {
      setLoading('save-module', false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading('delete-module', true);
      await onDelete();
      showSuccessToast('Module Deleted', 'Module has been deleted successfully');
    } catch (error) {
      console.error('Error deleting module:', error);
      showErrorToast('Delete Failed', (error as Error).message);
    } finally {
      setLoading('delete-module', false);
    }
  };
  
  return (
    <div className="border-t p-4 space-y-3">
      <PriceBreakdownPanel
        priceBreakdown={priceBreakdown}
        totalPrice={totalPrice}
        showPriceBreakdown={showPriceBreakdown}
        setShowPriceBreakdown={setShowPriceBreakdown}
        moduleName={moduleName}
      />
      
      <div className="flex items-center space-x-2">
        <Button 
          onClick={handleSave} 
          className="flex-1"
          disabled={isLoading('save-module')}
        >
          {isLoading('save-module') ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          size="icon"
          disabled={isLoading('delete-module')}
        >
          {isLoading('delete-module') ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
