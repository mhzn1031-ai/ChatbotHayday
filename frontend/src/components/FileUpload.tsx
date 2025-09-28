import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FileUploadProps {
  botId: string;
  onUploadComplete: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  error?: string;
  chunks?: number;
  processingTime?: number;
}

export const FileUploadComponent: React.FC<FileUploadProps> = ({
  botId,
  onUploadComplete,
  maxFiles = 10,
  maxSize = 10
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (const [index, file] of acceptedFiles.entries()) {
      try {
        await uploadFile(file, newFiles[index].id);
      } catch (error) {
        updateFileStatus(newFiles[index].id, 'failed', 0, error.message);
      }
    }

    setIsUploading(false);
  }, [botId]);

  const uploadFile = async (file: File, fileId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('botId', botId);

    try {
      // Upload with progress tracking
      const response = await fetch('/api/v1/documents/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      updateFileStatus(fileId, 'processing', 100);

      // Poll for processing status
      await pollProcessingStatus(result.documentId, fileId);

    } catch (error) {
      updateFileStatus(fileId, 'failed', 0, error.message);
      toast.error(`Failed to upload ${file.name}`);
    }
  };

  const pollProcessingStatus = async (documentId: string, fileId: string) => {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/v1/documents/${documentId}/status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const status = await response.json();

        if (status.status === 'COMPLETED') {
          updateFileStatus(fileId, 'completed', 100, undefined, {
            chunks: status.chunks,
            processingTime: status.processingTime
          });
          toast.success(`${status.filename} processed successfully!`);
          return;
        }

        if (status.status === 'FAILED') {
          updateFileStatus(fileId, 'failed', 0, status.error);
          toast.error(`Processing failed for ${status.filename}`);
          return;
        }

        // Still processing
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          updateFileStatus(fileId, 'failed', 0, 'Processing timeout');
          toast.error('Processing timeout');
        }

      } catch (error) {
        updateFileStatus(fileId, 'failed', 0, 'Status check failed');
      }
    };

    poll();
  };

  const updateFileStatus = (
    fileId: string, 
    status: UploadedFile['status'], 
    progress: number, 
    error?: string,
    metadata?: { chunks?: number; processingTime?: number }
  ) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            status, 
            progress, 
            error,
            ...metadata
          }
        : file
    ));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md']
    },
    maxFiles,
    maxSize: maxSize * 1024 * 1024,
    disabled: isUploading
  });

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <File className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (file: UploadedFile) => {
    switch (file.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing document...';
      case 'completed':
        return `Processed • ${file.chunks} chunks • ${file.processingTime}s`;
      case 'failed':
        return `Failed: ${file.error}`;
      default:
        return 'Ready';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Upload training documents'}
        </h3>
        <p className="text-gray-500 mb-4">
          Drag and drop files here, or click to browse
        </p>
        <p className="text-sm text-gray-400">
          Supports PDF, DOCX, TXT, MD • Max {maxSize}MB per file • Up to {maxFiles} files
        </p>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Uploaded Files</h4>
          {files.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1">
                {getStatusIcon(file.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {getStatusText(file)}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {(file.status === 'uploading' || file.status === 'processing') && (
                <div className="w-24 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Remove Button */}
              <button
                onClick={() => removeFile(file.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                disabled={file.status === 'uploading' || file.status === 'processing'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Summary */}
      {files.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-800">
              {files.filter(f => f.status === 'completed').length} of {files.length} files processed
            </span>
            <span className="text-blue-600">
              {files.reduce((sum, f) => sum + (f.chunks || 0), 0)} total chunks created
            </span>
          </div>
        </div>
      )}
    </div>
  );
};