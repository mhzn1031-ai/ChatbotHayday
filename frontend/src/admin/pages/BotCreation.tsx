import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Globe, 
  Plus, 
  X, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Bot
} from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

interface FileUpload {
  id: string;
  file: File;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

const BotCreation: React.FC = () => {
  const [step, setStep] = useState(1);
  const [botType, setBotType] = useState<'document' | 'website' | null>(null);
  const [botName, setBotName] = useState('');
  const [botDescription, setBotDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUpload[]>([]);
  const [websiteUrls, setWebsiteUrls] = useState<string[]>(['']);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (files: FileList) => {
    const newFiles: FileUpload[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate file upload progress
    newFiles.forEach(fileUpload => {
      const interval = setInterval(() => {
        setUploadedFiles(prev => prev.map(f => {
          if (f.id === fileUpload.id) {
            const newProgress = f.progress + 10;
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, progress: 100, status: 'success' };
            }
            return { ...f, progress: newProgress };
          }
          return f;
        }));
      }, 200);
    });
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleAddUrl = () => {
    setWebsiteUrls(prev => [...prev, '']);
  };

  const handleRemoveUrl = (index: number) => {
    setWebsiteUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUrlChange = (index: number, value: string) => {
    setWebsiteUrls(prev => prev.map((url, i) => i === index ? value : url));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCreateBot = async () => {
    setIsProcessing(true);
    
    // Simulate bot creation process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsProcessing(false);
    console.log('Bot created successfully');
    // In a real app, redirect to bot management or show success message
  };

  const canProceedToStep2 = botType !== null;
  const canProceedToStep3 = botName.trim() !== '' && 
    (botType === 'document' ? uploadedFiles.length > 0 : websiteUrls.some(url => url.trim() !== ''));

  return (
    <AdminLayout currentPage="bots">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => window.history.back()}
            className="p-2 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">Create New Bot</h1>
            <p className="text-gray-600">Set up your chatbot in just a few steps</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  ${step >= stepNumber 
                    ? 'bg-brand-primary text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`
                    w-24 h-1 mx-4
                    ${step > stepNumber ? 'bg-brand-primary' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className={step >= 1 ? 'text-brand-primary font-medium' : 'text-gray-500'}>
              Choose Type
            </span>
            <span className={step >= 2 ? 'text-brand-primary font-medium' : 'text-gray-500'}>
              Add Content
            </span>
            <span className={step >= 3 ? 'text-brand-primary font-medium' : 'text-gray-500'}>
              Configure
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          {/* Step 1: Choose Bot Type */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-brand-primary mb-2">
                  Choose Your Bot Type
                </h2>
                <p className="text-gray-600">
                  Select how you want to train your chatbot
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setBotType('document')}
                  className={`
                    p-6 border-2 rounded-xl text-left transition-all duration-200
                    ${botType === 'document' 
                      ? 'border-brand-primary bg-blue-50' 
                      : 'border-gray-200 hover:border-brand-accent hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${botType === 'document' ? 'bg-brand-primary' : 'bg-gray-100'}
                    `}>
                      <FileText className={`
                        w-6 h-6 
                        ${botType === 'document' ? 'text-neon-lime' : 'text-gray-600'}
                      `} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Document Upload</h3>
                      <p className="text-sm text-gray-600">PDF, DOCX, TXT files</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Upload your documents and let the AI learn from your content. 
                    Perfect for manuals, FAQs, and knowledge bases.
                  </p>
                </button>

                <button
                  onClick={() => setBotType('website')}
                  className={`
                    p-6 border-2 rounded-xl text-left transition-all duration-200
                    ${botType === 'website' 
                      ? 'border-brand-primary bg-blue-50' 
                      : 'border-gray-200 hover:border-brand-accent hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${botType === 'website' ? 'bg-brand-primary' : 'bg-gray-100'}
                    `}>
                      <Globe className={`
                        w-6 h-6 
                        ${botType === 'website' ? 'text-neon-lime' : 'text-gray-600'}
                      `} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Website Scraping</h3>
                      <p className="text-sm text-gray-600">URLs and web pages</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Provide website URLs and the AI will crawl and learn from your web content. 
                    Great for product pages and online documentation.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Add Content */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-brand-primary mb-2">
                  {botType === 'document' ? 'Upload Documents' : 'Add Website URLs'}
                </h2>
                <p className="text-gray-600">
                  {botType === 'document' 
                    ? 'Upload the documents you want your bot to learn from'
                    : 'Enter the website URLs you want your bot to crawl and learn from'
                  }
                </p>
              </div>

              {botType === 'document' && (
                <div className="space-y-4">
                  {/* File Upload Area */}
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-accent transition-colors duration-200"
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        handleFileUpload(files);
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Drop files here or click to upload
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Supports PDF, DOCX, and TXT files up to 10MB each
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleFileUpload(e.target.files);
                        }
                      }}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                      Choose Files
                    </label>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Uploaded Files</h4>
                      {uploadedFiles.map((fileUpload) => (
                        <div key={fileUpload.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900">{fileUpload.file.name}</p>
                              <p className="text-sm text-gray-500">
                                {(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {fileUpload.status === 'uploading' && (
                              <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-brand-accent h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${fileUpload.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600">{fileUpload.progress}%</span>
                              </div>
                            )}
                            {fileUpload.status === 'success' && (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            )}
                            {fileUpload.status === 'error' && (
                              <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <button
                              onClick={() => handleRemoveFile(fileUpload.id)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {botType === 'website' && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {websiteUrls.map((url, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => handleUrlChange(index, e.target.value)}
                            placeholder="https://example.com"
                            className="form-input"
                          />
                        </div>
                        {websiteUrls.length > 1 && (
                          <button
                            onClick={() => handleRemoveUrl(index)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddUrl}
                    className="btn-secondary"
                  >
                    <Plus className="w-4 h-4" />
                    Add Another URL
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Configure Bot */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-brand-primary mb-2">
                  Configure Your Bot
                </h2>
                <p className="text-gray-600">
                  Give your bot a name and description
                </p>
              </div>

              <div className="space-y-6">
                <div className="form-group">
                  <label htmlFor="botName" className="form-label">
                    Bot Name *
                  </label>
                  <input
                    id="botName"
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder="e.g., Customer Support Bot"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="botDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="botDescription"
                    value={botDescription}
                    onChange={(e) => setBotDescription(e.target.value)}
                    placeholder="Describe what your bot does and how it helps users..."
                    className="form-textarea"
                    rows={4}
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Bot Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{botType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Content Sources:</span>
                      <span className="font-medium text-gray-900">
                        {botType === 'document' 
                          ? `${uploadedFiles.length} files`
                          : `${websiteUrls.filter(url => url.trim()).length} URLs`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">
                        {botName || 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`btn-secondary ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 ? !canProceedToStep2 : !canProceedToStep3}
                className={`btn-primary ${
                  (step === 1 ? !canProceedToStep2 : !canProceedToStep3) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleCreateBot}
                disabled={isProcessing || !botName.trim()}
                className={`btn-primary ${
                  (isProcessing || !botName.trim()) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner mr-2" />
                    Creating Bot...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    Create Bot
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BotCreation;