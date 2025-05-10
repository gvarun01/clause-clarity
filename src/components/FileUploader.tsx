
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText, FileX } from "lucide-react";
import { toast } from '@/components/ui/sonner';

interface FileUploaderProps {
  onContentExtracted: (content: string) => void;
  className?: string;
}

const FileUploader = ({ onContentExtracted, className }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    
    if (!selectedFile) return;
    
    const allowedTypes = [
      'application/pdf', 
      'text/plain', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Please upload a PDF, TXT, or DOCX file only');
      e.target.value = '';
      return;
    }
    
    setFile(selectedFile);
    extractTextFromFile(selectedFile);
  };
  
  const extractTextFromFile = async (file: File) => {
    setIsLoading(true);
    
    try {
      if (file.type === 'text/plain') {
        const text = await file.text();
        onContentExtracted(text);
      } else if (file.type === 'application/pdf') {
        // For PDF files, we would use a library like pdf.js
        // This is a simplified simulation
        const formData = new FormData();
        formData.append('file', file);
        
        // In a real implementation, you'd send to backend for processing
        // Simulating PDF extraction with a delay
        setTimeout(() => {
          const simulatedText = `This is extracted text from "${file.name}".\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nisl nunc vel nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nisl nunc vel nisl.`;
          onContentExtracted(simulatedText);
          setIsLoading(false);
        }, 1500);
        
        return; // Early return due to setTimeout
      } else {
        // For DOCX files
        // Similarly simulating extraction
        setTimeout(() => {
          const simulatedText = `This is extracted text from "${file.name}".\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, eget aliquam nisl nunc vel nisl.`;
          onContentExtracted(simulatedText);
          setIsLoading(false);
        }, 1500);
        
        return; // Early return due to setTimeout
      }
    } catch (error) {
      console.error('Error extracting text:', error);
      toast.error('Failed to extract text from file');
    }
    
    setIsLoading(false);
  };
  
  const removeFile = () => {
    setFile(null);
    onContentExtracted('');
  };
  
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        {!file ? (
          <>
            <Button 
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={isLoading}
            >
              <Upload size={16} />
              Upload Document
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept=".pdf,.txt,.docx,.doc"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <span className="text-xs text-muted-foreground">
              Supports PDF, TXT, DOCX
            </span>
          </>
        ) : (
          <div className="flex items-center gap-3 bg-secondary/50 py-2 px-4 rounded-md w-full">
            <FileText size={16} className="text-legal-action" />
            <span className="text-sm truncate flex-1">{file.name}</span>
            <button 
              onClick={removeFile}
              className="text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Remove file"
            >
              <FileX size={16} />
            </button>
          </div>
        )}
      </div>
      
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
          <span className="inline-block w-4 h-4 border-2 border-legal-action border-t-transparent rounded-full animate-spin"></span>
          Extracting text...
        </div>
      )}
    </div>
  );
};

export default FileUploader;
