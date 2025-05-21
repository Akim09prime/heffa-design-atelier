
import React from 'react';
import { Button } from "@/components/ui/button";
import { File, X } from "lucide-react";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-md bg-blue-50">
          <File className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{file.name}</p>
          <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FilePreview;
