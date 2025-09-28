import React, { useState, useEffect } from 'react';
import { Palette, Upload, Eye, Save, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface BotCustomizationProps {
  botId: string;
  initialConfig?: BotConfig;
  onSave: (config: BotConfig) => void;
}

interface BotConfig {
  name: string;
  welcomeMessage: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  logoUrl?: string;
  tone: 'professional' | 'friendly' | 'casual' | 'technical';
  language: string;
  temperature: number;
  maxTokens: number;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: 'light' | 'dark' | 'auto';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  showBranding: boolean;
  customCSS?: string;
}

const DEFAULT_CONFIG: BotConfig = {
  name: 'AI Assistant',
  welcomeMessage: 'Hello! How can I help you today?',
  primaryColor: '#3B82F6',
  secondaryColor: '#F1F5F9',
  fontFamily: 'Inter',
  fontSize: 'medium',
  tone: 'friendly',
  language: 'en',
  temperature: 0.7,
  maxTokens: 500,
  position: 'bottom-right',
  theme: 'light',
  borderRadius: 'medium',
  showBranding: true
};

const COLOR_PRESETS = [
  { name: 'Blue', primary: '#3B82F6', secondary: '#EFF6FF' },
  { name: 'Green', primary: '#10B981', secondary: '#ECFDF5' },
  { name: 'Purple', primary: '#8B5CF6', secondary: '#F3E8FF' },
  { name: 'Red', primary: '#EF4444', secondary: '#FEF2F2' },
  { name: 'Orange', primary: '#F59E0B', secondary: '#FFFBEB' },
  { name: 'Pink', primary: '#EC4899', secondary: '#FDF2F8' },
  { name: 'Indigo', primary: '#6366F1', secondary: '#EEF2FF' },
  { name: 'Teal', primary: '#14B8A6', secondary: '#F0FDFA' }
];

const FONT_OPTIONS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' }
];

const TONE_OPTIONS = [
  { 
    value: 'professional', 
    label: 'Professional', 
    description: 'Formal and business-like responses' 
  },
  { 
    value: 'friendly', 
    label: 'Friendly', 
    description: 'Warm and approachable tone' 
  },
  { 
    value: 'casual', 
    label: 'Casual', 
    description: 'Relaxed and conversational' 
  },
  { 
    value: 'technical', 
    label: 'Technical', 
    description: 'Precise and detailed explanations' 
  }
];

export const BotCustomization: React.FC<BotCustomizationProps> = ({
  botId,
  initialConfig,
  onSave
}) => {
  const [config, setConfig] = useState<BotConfig>(initialConfig || DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'appearance' | 'behavior' | 'advanced'>('appearance');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const updateConfig = (updates: Partial<BotConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/v1/bots/${botId}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(config)
      });

      onSave(config);
      toast.success('Bot configuration saved successfully!');
    } catch (error) {
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    toast.success('Reset to default configuration');
  };

  const handleLogoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch(`/api/v1/bots/${botId}/logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();
      updateConfig({ logoUrl: result.logoUrl });
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  const TabButton = ({ tab, label }: { tab: string; label: string }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        activeTab === tab
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bot Customization</h2>
          <p className="text-gray-600">Customize your chatbot's appearance and behavior</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <TabButton tab="appearance" label="Appearance" />
        <TabButton tab="behavior" label="Behavior" />
        <TabButton tab="advanced" label="Advanced" />
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'appearance' && (
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bot Name
                </label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => updateConfig({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="AI Assistant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  value={config.position}
                  onChange={(e) => updateConfig({ position: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
            </div>

            {/* Welcome Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welcome Message
              </label>
              <textarea
                value={config.welcomeMessage}
                onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Hello! How can I help you today?"
              />
            </div>

            {/* Color Presets */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Color Theme
              </label>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-3 mb-4">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => updateConfig({ 
                      primaryColor: preset.primary,
                      secondaryColor: preset.secondary 
                    })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      config.primaryColor === preset.primary
                        ? 'border-gray-400 ring-2 ring-blue-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={preset.name}
                  >
                    <div 
                      className="w-full h-8 rounded"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div 
                      className="w-full h-2 rounded-b mt-1"
                      style={{ backgroundColor: preset.secondary }}
                    />
                  </button>
                ))}
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.secondaryColor}
                      onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => updateConfig({ fontFamily: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.name} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Size
                </label>
                <select
                  value={config.fontSize}
                  onChange={(e) => updateConfig({ fontSize: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="flex items-center space-x-4">
                {config.logoUrl && (
                  <img
                    src={config.logoUrl}
                    alt="Bot logo"
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                )}
                <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="space-y-6">
            {/* Tone Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Conversation Tone
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TONE_OPTIONS.map((tone) => (
                  <label
                    key={tone.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      config.tone === tone.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tone"
                      value={tone.value}
                      checked={config.tone === tone.value}
                      onChange={(e) => updateConfig({ tone: e.target.value as any })}
                      className="sr-only"
                    />
                    <div className="font-medium text-gray-900">{tone.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{tone.description}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={config.language}
                onChange={(e) => updateConfig({ language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>

            {/* AI Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creativity Level: {config.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => updateConfig({ temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative</span>
                  <span>Creative</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Length
                </label>
                <select
                  value={config.maxTokens}
                  onChange={(e) => updateConfig({ maxTokens: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={250}>Short (250 tokens)</option>
                  <option value={500}>Medium (500 tokens)</option>
                  <option value={1000}>Long (1000 tokens)</option>
                  <option value={2000}>Very Long (2000 tokens)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            {/* Theme and Styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <select
                  value={config.theme}
                  onChange={(e) => updateConfig({ theme: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Radius
                </label>
                <select
                  value={config.borderRadius}
                  onChange={(e) => updateConfig({ borderRadius: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="none">None</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
            </div>

            {/* Branding */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.showBranding}
                  onChange={(e) => updateConfig({ showBranding: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show "Powered by" branding
                </span>
              </label>
            </div>

            {/* Custom CSS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom CSS
              </label>
              <textarea
                value={config.customCSS || ''}
                onChange={(e) => updateConfig({ customCSS: e.target.value })}
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="/* Add your custom CSS here */
.chatbot-widget {
  /* Custom styles */
}"
              />
              <p className="text-xs text-gray-500 mt-1">
                Advanced users can add custom CSS to further customize the appearance
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Bot Preview</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div 
                className="p-4 rounded-lg text-white mb-3"
                style={{ backgroundColor: config.primaryColor }}
              >
                <div className="font-medium">{config.name}</div>
                <div className="text-sm opacity-90">Online</div>
              </div>
              <div 
                className="p-3 rounded-lg mb-3"
                style={{ backgroundColor: config.secondaryColor }}
              >
                {config.welcomeMessage}
              </div>
              <div className="text-xs text-gray-500">
                Font: {config.fontFamily} • Size: {config.fontSize} • Tone: {config.tone}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};