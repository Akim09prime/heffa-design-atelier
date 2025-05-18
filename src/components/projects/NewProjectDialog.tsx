
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NewProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  projectType: string;
  onProjectNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProjectTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onCreateProject: () => void;
}

export const NewProjectDialog = ({
  isOpen,
  onOpenChange,
  projectName,
  projectType,
  onProjectNameChange,
  onProjectTypeChange,
  onCreateProject
}: NewProjectDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Fill in the basic details to create a new design project
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="projectName" className="text-right">
              Name
            </label>
            <Input
              id="projectName"
              value={projectName}
              onChange={onProjectNameChange}
              placeholder="Enter project name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="projectType" className="text-right">
              Type
            </label>
            <select
              id="projectType"
              value={projectType}
              onChange={onProjectTypeChange}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="Kitchen">Kitchen</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Living Room">Living Room</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onCreateProject}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
