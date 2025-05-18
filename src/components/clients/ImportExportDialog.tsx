
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Client } from '@/types';
import { Download, Upload } from 'lucide-react';

interface ImportExportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (clients: Client[]) => void;
  clients: Client[];
}

export const ImportExportDialog = ({
  isOpen,
  onOpenChange,
  onImport,
  clients
}: ImportExportDialogProps) => {
  const [activeTab, setActiveTab] = useState<string>("import");
  const [importData, setImportData] = useState<string>("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        setError("Please provide some data to import");
        return;
      }

      const parsedData = JSON.parse(importData) as Client[];
      
      if (!Array.isArray(parsedData)) {
        setError("Invalid format. Import data must be an array of clients");
        return;
      }

      // Basic validation
      const isValid = parsedData.every(client => 
        client.name && typeof client.name === 'string' && 
        client.email && typeof client.email === 'string'
      );

      if (!isValid) {
        setError("Invalid client data. Every client must have a name and email");
        return;
      }

      onImport(parsedData);
      onOpenChange(false);
      setImportData("");
      setError(null);
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setImportFile(file);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setImportData(evt.target.result.toString());
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(clients, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'clients-export.json';
    link.click();
    
    URL.revokeObjectURL(url);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import/Export Clients</DialogTitle>
          <DialogDescription>
            Import clients from a JSON file or export your current client list
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                Upload JSON File
              </label>
              <Input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
              />
              
              <div className="mt-2">
                <label className="text-sm font-medium">
                  Or paste JSON data directly
                </label>
                <Textarea
                  placeholder="Paste JSON data here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  className="h-32 mt-1"
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm mt-2">
                  {error}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <div className="text-center py-8">
              <Download className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>You are about to export {clients.length} clients</p>
              <p className="text-sm text-muted-foreground mt-2">
                This will generate a JSON file with all your current client data
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {activeTab === "import" ? (
            <Button onClick={handleImport} disabled={!importData.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Import Clients
            </Button>
          ) : (
            <Button onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Clients
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportExportDialog;
