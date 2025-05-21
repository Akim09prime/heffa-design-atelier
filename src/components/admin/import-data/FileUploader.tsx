
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useTranslation } from '@/contexts/TranslationContext';
import FilePreview from './FilePreview';

interface FileUploaderProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ file, onFileSelect }: FileUploaderProps) => {
  const { t } = useTranslation();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    onFileSelect(selectedFile);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      onFileSelect(droppedFile);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
  };
  
  if (file) {
    return <FilePreview file={file} onRemove={handleRemoveFile} />;
  }
  
  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
      />
      <Upload className="mx-auto h-12 w-12 text-gray-500" />
      <p className="mt-2 text-sm text-gray-700">{t('importExport.dragAndDrop')}</p>
      <p className="text-xs text-gray-600">{t('importExport.csvOrExcel')}</p>
      <Button variant="outline" className="mt-4">
        {t('importExport.selectFile')}
      </Button>
    </div>
  );
};

export default FileUploader;
