
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ImportDesignDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  importUrl: string;
  onImportUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportDesign: () => void;
}

export const ImportDesignDialog = ({
  isOpen,
  onOpenChange,
  importUrl,
  onImportUrlChange,
  onImportDesign
}: ImportDesignDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Design</DialogTitle>
          <DialogDescription>
            Enter the URL or file path of the design you want to import
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="importUrl" className="text-right">
              URL / File
            </label>
            <Input
              id="importUrl"
              value={importUrl}
              onChange={onImportUrlChange}
              placeholder="Enter import URL or file path"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onImportDesign}>Import Design</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
