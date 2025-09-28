import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  MessageSquare, 
  Eye, 
  Save,
  Upload,
  RotateCcw,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

interface CustomizationSettings {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: string;
  borderRadius: string;
  chatPosition: 'bottom-right' | 'bottom-left' | 'center';
  welcomeMessage: string;
  placeholderText: string;
  botName: string;
  botAvatar: string;
  tone: 'professional' | 'friendly' | 'casual' | 'formal';
  language: string;
}

const BotCustomization: React.FC = () => {
  const [selectedBot, setSelectedBot] = useState('1');
  const [activeTab, setActiveTab] = useState('appearance');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<CustomizationSettings>({
    primaryColor: '#002C4D',
    secondaryColor: '#3AA0B7',
    textColor: '#374151',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: '14',
    borderRadius: '12',
    chatPosition: 'bottom-right',
    welcomeMessage: 'Hello! How can I help you today?',
    placeholderText: 'Type your message...',
    botName: 'Assistant',
    botAvatar: '',
    tone: 'friendly',
    language: 'en',
  });

  // Mock bot list
  const bots = [
    { id: '1', name: 'Customer Support Bot' },
    { id: '2', name: 'Sales Assistant' },
    { id: '3', name: 'FAQ Helper' },
  ];

  const colorPresets = [
    { name: 'Fictora Default', primary: '#002C4D', secondary: '#3AA0B7' },
    { name: 'Ocean Blue', primary: '#0EA5E9', secondary: '#38BDF8' },
    { name: 'Forest Green', primary: '#059669', secondary: '#10B981' },
    { name: 'Sunset Orange', primary: '#EA580C', secondary: '#FB923C' },
    { name: 'Royal Purple', primary: '#7C3AED', secondary: '#A78BFA' },
    { name: 'Rose Pink', primary: '#E11D48', secondary: '#FB7185' },
  ];

  const fontOptions = [
    'Inter',
    'Poppins',
    'Montserrat',
    'Roboto',
    'Open Sans',
    'Lato',
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
    { value: 'casual', label: 'Casual', description: 'Relaxed and informal' },
    { value: 'formal', label: 'Formal', description: 'Structured and polite' },
  ];

  const handleSettingChange = (key: keyof CustomizationSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleColorPreset = (preset: { primary: string; secondary: string }) => {
    setSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all customizations to default?')) {
      setSettings({
        primaryColor: '#002C4D',
        secondaryColor: '#3AA0B7',
        textColor: '#374151',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter',
        fontSize: '14',
        borderRadius: '12',
        chatPosition: 'bottom-right',
        welcomeMessage: 'Hello! How can I help you today?',
        placeholderText: 'Type your message...',
        botName: 'Assistant',
        botAvatar: '',
        tone: 'friendly',
        language: 'en',
      });
    }
  };

  const getPreviewSize = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-80 h-96';
      case 'tablet':
        return 'w-96 h-[500px]';
      default:
        return 'w-full h-96';
    }
  };

  return (
    <AdminLayout currentPage="customize">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">Bot Customization</h1>
            <p className="mt-1 text-gray-600">
              Customize the appearance and behavior of your chatbots
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleReset}
              className="btn-secondary"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? (
                <>
                  <div className="spinner mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bot Selection */}
        <div className="card">
          <div className="form-group">
            <label className="form-label">Select Bot to Customize</label>
            <select
              value={selectedBot}
              onChange={(e) => setSelectedBot(e.target.value)}
              className="form-select max-w-xs"
            >
              {bots.map(bot => (
                <option key={bot.id} value={bot.id}>{bot.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customization Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="card">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'appearance', label: 'Appearance', icon: Palette },
                  { id: 'behavior', label: 'Behavior', icon: MessageSquare },
                  { id: 'content', label: 'Content', icon: Type },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200
                        ${activeTab === tab.id
                          ? 'bg-white text-brand-primary shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                {/* Color Presets */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Color Presets</h3>
                    <p className="card-description">Quick color combinations</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {colorPresets.map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => handleColorPreset(preset)}
                        className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-brand-accent transition-colors duration-200"
                      >
                        <div className="flex space-x-1">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Colors */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Custom Colors</h3>
                    <p className="card-description">Fine-tune your color scheme</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Primary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                          className="form-input flex-1"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Secondary Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.secondaryColor}
                          onChange={(e) => handleSettingChange('secondaryColor', e.target.value)}
                          className="form-input flex-1"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Text Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.textColor}
                          onChange={(e) => handleSettingChange('textColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.textColor}
                          onChange={(e) => handleSettingChange('textColor', e.target.value)}
                          className="form-input flex-1"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Background Color</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.backgroundColor}
                          onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.backgroundColor}
                          onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                          className="form-input flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Typography</h3>
                    <p className="card-description">Font and text styling</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="form-group">
                      <label className="form-label">Font Family</label>
                      <select
                        value={settings.fontFamily}
                        onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                        className="form-select"
                      >
                        {fontOptions.map(font => (
                          <option key={font} value={font}>{font}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Font Size (px)</label>
                      <input
                        type="number"
                        min="12"
                        max="20"
                        value={settings.fontSize}
                        onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Border Radius (px)</label>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        value={settings.borderRadius}
                        onChange={(e) => handleSettingChange('borderRadius', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Position */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Chat Position</h3>
                    <p className="card-description">Where the chat widget appears</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'bottom-right', label: 'Bottom Right' },
                      { value: 'bottom-left', label: 'Bottom Left' },
                      { value: 'center', label: 'Center' },
                    ].map(position => (
                      <button
                        key={position.value}
                        onClick={() => handleSettingChange('chatPosition', position.value)}
                        className={`
                          p-3 border-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${settings.chatPosition === position.value
                            ? 'border-brand-primary bg-blue-50 text-brand-primary'
                            : 'border-gray-200 text-gray-700 hover:border-brand-accent'
                          }
                        `}
                      >
                        {position.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Behavior Tab */}
            {activeTab === 'behavior' && (
              <div className="space-y-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Conversation Tone</h3>
                    <p className="card-description">How your bot communicates</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {toneOptions.map(tone => (
                      <button
                        key={tone.value}
                        onClick={() => handleSettingChange('tone', tone.value)}
                        className={`
                          p-4 border-2 rounded-lg text-left transition-all duration-200
                          ${settings.tone === tone.value
                            ? 'border-brand-primary bg-blue-50'
                            : 'border-gray-200 hover:border-brand-accent'
                          }
                        `}
                      >
                        <h4 className="font-medium text-gray-900 mb-1">{tone.label}</h4>
                        <p className="text-sm text-gray-600">{tone.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Language Settings</h3>
                    <p className="card-description">Bot language and localization</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="form-select max-w-xs"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="it">Italian</option>
                      <option value="pt">Portuguese</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Bot Identity</h3>
                    <p className="card-description">Name and avatar for your bot</p>
                  </div>
                  <div className="space-y-6">
                    <div className="form-group">
                      <label className="form-label">Bot Name</label>
                      <input
                        type="text"
                        value={settings.botName}
                        onChange={(e) => handleSettingChange('botName', e.target.value)}
                        className="form-input max-w-xs"
                        placeholder="Assistant"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bot Avatar</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          {settings.botAvatar ? (
                            <img 
                              src={settings.botAvatar} 
                              alt="Bot Avatar" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <MessageSquare className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <button className="btn-secondary">
                          <Upload className="w-4 h-4" />
                          Upload Avatar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Messages</h3>
                    <p className="card-description">Customize bot messages</p>
                  </div>
                  <div className="space-y-6">
                    <div className="form-group">
                      <label className="form-label">Welcome Message</label>
                      <textarea
                        value={settings.welcomeMessage}
                        onChange={(e) => handleSettingChange('welcomeMessage', e.target.value)}
                        className="form-textarea"
                        rows={3}
                        placeholder="Hello! How can I help you today?"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Input Placeholder</label>
                      <input
                        type="text"
                        value={settings.placeholderText}
                        onChange={(e) => handleSettingChange('placeholderText', e.target.value)}
                        className="form-input"
                        placeholder="Type your message..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title">Live Preview</h3>
                    <p className="card-description">See your changes in real-time</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-2 rounded-lg ${previewDevice === 'desktop' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('tablet')}
                      className={`p-2 rounded-lg ${previewDevice === 'tablet' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-2 rounded-lg ${previewDevice === 'mobile' ? 'bg-brand-primary text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className={`${getPreviewSize()} border border-gray-200 rounded-lg bg-gray-100 relative overflow-hidden`}>
                  {/* Mock chat widget */}
                  <div 
                    className="absolute bottom-4 right-4 w-80 h-96 rounded-lg shadow-lg overflow-hidden"
                    style={{ 
                      backgroundColor: settings.backgroundColor,
                      borderRadius: `${settings.borderRadius}px`,
                    }}
                  >
                    {/* Chat Header */}
                    <div 
                      className="p-4 text-white"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium" style={{ fontFamily: settings.fontFamily }}>
                            {settings.botName}
                          </h4>
                          <p className="text-xs opacity-90">Online</p>
                        </div>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4 space-y-3 flex-1">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div 
                          className="bg-gray-100 rounded-lg p-3 max-w-xs"
                          style={{ 
                            borderRadius: `${settings.borderRadius}px`,
                            fontSize: `${settings.fontSize}px`,
                            fontFamily: settings.fontFamily,
                            color: settings.textColor,
                          }}
                        >
                          {settings.welcomeMessage}
                        </div>
                      </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder={settings.placeholderText}
                          className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                          style={{ 
                            borderRadius: `${settings.borderRadius}px`,
                            fontSize: `${settings.fontSize}px`,
                            fontFamily: settings.fontFamily,
                          }}
                          disabled
                        />
                        <button 
                          className="p-2 rounded-lg text-white"
                          style={{ 
                            backgroundColor: settings.secondaryColor,
                            borderRadius: `${settings.borderRadius}px`,
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BotCustomization;