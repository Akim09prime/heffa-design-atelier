
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AccessoryItem } from '@/types';
import { Download, Upload, AlertCircle, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AccessoryImportExportProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (accessories: AccessoryItem[]) => void;
  accessories: AccessoryItem[];
}

export const AccessoryImportExport: React.FC<AccessoryImportExportProps> = ({
  isOpen,
  onOpenChange,
  onImport,
  accessories
}) => {
  const [activeTab, setActiveTab] = useState<string>("import");
  const [importData, setImportData] = useState<string>("");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [parsedAccessories, setParsedAccessories] = useState<AccessoryItem[]>([]);
  const [parsing, setParsing] = useState<boolean>(false);

  const validateAccessoryData = (parsedData: any[]): boolean => {
    if (!Array.isArray(parsedData)) {
      setError("Invalid format. Import data must be an array of accessories");
      return false;
    }
    
    // Basic validation
    const isValid = parsedData.every(accessory => 
      accessory && typeof accessory === 'object' && 
      accessory.name && typeof accessory.name === 'string' && 
      accessory.code && typeof accessory.code === 'string' &&
      accessory.type && typeof accessory.type === 'string' &&
      accessory.manufacturer && typeof accessory.manufacturer === 'string' &&
      (typeof accessory.price === 'number') &&
      Array.isArray(accessory.compatibility)
    );

    if (!isValid) {
      setError("Invalid accessory data. Every accessory must have required fields (name, code, type, manufacturer, price, compatibility)");
      return false;
    }
    
    return true;
  };

  const parseImportData = () => {
    try {
      setParsing(true);
      setError(null);
      setImportSuccess(false);
      
      if (!importData.trim()) {
        setError("Please provide some data to import");
        setParsing(false);
        return;
      }

      const parsedData = JSON.parse(importData) as AccessoryItem[];
      
      if (!validateAccessoryData(parsedData)) {
        setParsing(false);
        return;
      }

      // Process accessory data to ensure it has all required fields
      const processedAccessories = parsedData.map(accessory => ({
        ...accessory,
        id: accessory.id || `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        properties: accessory.properties || {}
      }));

      setParsedAccessories(processedAccessories);
      setImportSuccess(true);
      setParsing(false);
    } catch (e) {
      console.error("Error parsing import data:", e);
      setError("Invalid JSON format");
      setParsing(false);
    }
  };

  const handleImport = () => {
    if (parsedAccessories.length > 0) {
      onImport(parsedAccessories);
      onOpenChange(false);
      setImportData("");
      setImportFile(null);
      setError(null);
      setImportSuccess(false);
      setParsedAccessories([]);
    } else {
      parseImportData();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    setImportFile(file);
    setError(null);
    setImportSuccess(false);
    setParsedAccessories([]);
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setImportData(evt.target.result.toString());
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(accessories, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'accessories-export.json';
    link.click();
    
    URL.revokeObjectURL(url);
    onOpenChange(false);
  };

  const resetImport = () => {
    setImportData("");
    setImportFile(null);
    setError(null);
    setImportSuccess(false);
    setParsedAccessories([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import/Export Accessories</DialogTitle>
          <DialogDescription>
            Import accessories from a JSON file or export your current accessory catalog
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
                  onChange={(e) => {
                    setImportData(e.target.value);
                    setError(null);
                    setImportSuccess(false);
                    setParsedAccessories([]);
                  }}
                  className="h-32 mt-1"
                />
              </div>
              
              {parsing && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Parsing data...</p>
                  <Progress value={50} className="h-1" />
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2">
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <p>{error}</p>
                  </div>
                </div>
              )}
              
              {importSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-2">
                  <div className="flex items-center text-green-600 text-sm mb-2">
                    <Check className="h-4 w-4 mr-2" />
                    <p>Successfully parsed {parsedAccessories.length} accessories</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">{parsedAccessories.length} accessories ready to import</Badge>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4">
            <div className="text-center py-8">
              <Download className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p>You are about to export {accessories.length} accessories</p>
              <p className="text-sm text-muted-foreground mt-2">
                This will generate a JSON file with all your current accessory data
              </p>
              
              {accessories.length > 0 && (
                <div className="mt-4">
                  <Badge variant="outline" className="mb-2">
                    {accessories.filter(a => a.type === 'hinge').length} hinges
                  </Badge>
                  {' '}
                  <Badge variant="outline" className="mb-2">
                    {accessories.filter(a => a.type === 'slide').length} slides
                  </Badge>
                  {' '}
                  <Badge variant="outline" className="mb-2">
                    {accessories.filter(a => a.type === 'handle').length} handles
                  </Badge>
                  {' '}
                  <Badge variant="outline" className="mb-2">
                    {accessories.filter(a => !['hinge', 'slide', 'handle'].includes(a.type)).length} others
                  </Badge>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => {
            if (activeTab === "import" && (importFile || importData.trim())) {
              resetImport();
            } else {
              onOpenChange(false);
            }
          }}>
            {activeTab === "import" && (importFile || importData.trim()) ? "Reset" : "Cancel"}
          </Button>
          {activeTab === "import" ? (
            <Button 
              onClick={handleImport} 
              disabled={parsing || (!importSuccess && !importData.trim())}
              className={importSuccess ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <Upload className="h-4 w-4 mr-2" />
              {importSuccess ? "Confirm Import" : "Validate & Import"}
            </Button>
          ) : (
            <Button 
              onClick={handleExport}
              disabled={accessories.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Accessories
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccessoryImportExport;
