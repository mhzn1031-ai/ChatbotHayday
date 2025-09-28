import React, { useState } from 'react';
import {
  Code,
  Copy,
  CheckCircle,
  Eye,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  ExternalLink,
  MessageSquare,
  X
} from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

interface EmbedSettings {
  width: string;
  height: string;
  position: 'bottom-right' | 'bottom-left' | 'inline';
  theme: 'light' | 'dark' | 'auto';
  showBranding: boolean;
  customCSS: string;
}

const EmbedCode: React.FC = () => {
  const [selectedBot, setSelectedBot] = useState('1');
  const [embedType, setEmbedType] = useState<'script' | 'iframe' | 'react'>('script');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [settings, setSettings] = useState<EmbedSettings>({
    width: '400',
    height: '600',
    position: 'bottom-right',
    theme: 'light',
    showBranding: true,
    customCSS: '',
  });

  // Mock bot list
  const bots = [
    { id: '1', name: 'Customer Support Bot', domain: 'support.example.com' },
    { id: '2', name: 'Sales Assistant', domain: 'sales.example.com' },
    { id: '3', name: 'FAQ Helper', domain: 'help.example.com' },
  ];

  const selectedBotData = bots.find(bot => bot.id === selectedBot);

  const generateEmbedCode = () => {
    const baseUrl = 'https://fictora-labs.com/embed';
    const botId = selectedBot;
    
    switch (embedType) {
      case 'script':
        return `<!-- Fictora Labs Chatbot -->
<script>
  window.fictoraConfig = {
    botId: '${botId}',
    position: '${settings.position}',
    theme: '${settings.theme}',
    width: '${settings.width}px',
    height: '${settings.height}px',
    showBranding: ${settings.showBranding}
  };
</script>
<script src="${baseUrl}/${botId}.js" async></script>`;

      case 'iframe':
        return `<!-- Fictora Labs Chatbot (iframe) -->
<iframe 
  src="${baseUrl}/${botId}?theme=${settings.theme}&branding=${settings.showBranding}"
  width="${settings.width}"
  height="${settings.height}"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="Fictora Labs Chatbot">
</iframe>`;

      case 'react':
        return `// Install: npm install @fictora-labs/react-chatbot

import { FictoraBot } from '@fictora-labs/react-chatbot';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      <FictoraBot
        botId="${botId}"
        position="${settings.position}"
        theme="${settings.theme}"
        width="${settings.width}px"
        height="${settings.height}px"
        showBranding={${settings.showBranding}}
      />
    </div>
  );
}`;

      default:
        return '';
    }
  };

  const handleCopyCode = async (code: string, type: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleSettingChange = (key: keyof EmbedSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const embedCode = generateEmbedCode();

  return (
    <AdminLayout currentPage="embed">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Embed Code</h1>
          <p className="mt-1 text-gray-600">
            Get the code to embed your chatbot on your website
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bot Selection */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Select Bot</h3>
                <p className="card-description">Choose which bot to embed</p>
              </div>
              <div className="space-y-4">
                {bots.map(bot => (
                  <div
                    key={bot.id}
                    className={`
                      p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
                      ${selectedBot === bot.id
                        ? 'border-brand-primary bg-blue-50'
                        : 'border-gray-200 hover:border-brand-accent'
                      }
                    `}
                    onClick={() => setSelectedBot(bot.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{bot.name}</h4>
                        <p className="text-sm text-gray-500">{bot.domain}</p>
                      </div>
                      <div className={`
                        w-4 h-4 rounded-full border-2
                        ${selectedBot === bot.id
                          ? 'border-brand-primary bg-brand-primary'
                          : 'border-gray-300'
                        }
                      `}>
                        {selectedBot === bot.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Embed Type */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Embed Type</h3>
                <p className="card-description">Choose your preferred integration method</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    type: 'script',
                    title: 'JavaScript',
                    description: 'Easy drop-in script tag',
                    icon: Code,
                    recommended: true,
                  },
                  {
                    type: 'iframe',
                    title: 'iFrame',
                    description: 'Embedded iframe widget',
                    icon: Globe,
                    recommended: false,
                  },
                  {
                    type: 'react',
                    title: 'React Component',
                    description: 'React/Next.js component',
                    icon: Settings,
                    recommended: false,
                  },
                ].map(option => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.type}
                      onClick={() => setEmbedType(option.type as any)}
                      className={`
                        p-4 border-2 rounded-lg text-left transition-all duration-200 relative
                        ${embedType === option.type
                          ? 'border-brand-primary bg-blue-50'
                          : 'border-gray-200 hover:border-brand-accent'
                        }
                      `}
                    >
                      {option.recommended && (
                        <div className="absolute -top-2 -right-2 bg-neon-lime text-brand-primary text-xs font-bold px-2 py-1 rounded-full">
                          Recommended
                        </div>
                      )}
                      <Icon className="w-6 h-6 text-brand-primary mb-2" />
                      <h4 className="font-medium text-gray-900 mb-1">{option.title}</h4>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Configuration Options */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Configuration</h3>
                <p className="card-description">Customize the embed behavior</p>
              </div>
              <div className="space-y-6">
                {/* Dimensions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="form-label">Width (px)</label>
                    <input
                      type="number"
                      min="300"
                      max="800"
                      value={settings.width}
                      onChange={(e) => handleSettingChange('width', e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Height (px)</label>
                    <input
                      type="number"
                      min="400"
                      max="800"
                      value={settings.height}
                      onChange={(e) => handleSettingChange('height', e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Position (only for script embed) */}
                {embedType === 'script' && (
                  <div className="form-group">
                    <label className="form-label">Position</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'bottom-right', label: 'Bottom Right' },
                        { value: 'bottom-left', label: 'Bottom Left' },
                        { value: 'inline', label: 'Inline' },
                      ].map(position => (
                        <button
                          key={position.value}
                          onClick={() => handleSettingChange('position', position.value)}
                          className={`
                            p-3 border-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${settings.position === position.value
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
                )}

                {/* Theme */}
                <div className="form-group">
                  <label className="form-label">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light' },
                      { value: 'dark', label: 'Dark' },
                      { value: 'auto', label: 'Auto' },
                    ].map(theme => (
                      <button
                        key={theme.value}
                        onClick={() => handleSettingChange('theme', theme.value)}
                        className={`
                          p-3 border-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${settings.theme === theme.value
                            ? 'border-brand-primary bg-blue-50 text-brand-primary'
                            : 'border-gray-200 text-gray-700 hover:border-brand-accent'
                          }
                        `}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show Branding */}
                <div className="form-group">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="form-label mb-0">Show Fictora Labs Branding</label>
                      <p className="text-sm text-gray-600">Display "Powered by Fictora Labs" link</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('showBranding', !settings.showBranding)}
                      className={`
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
                        ${settings.showBranding ? 'bg-brand-primary' : 'bg-gray-200'}
                      `}
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                          ${settings.showBranding ? 'translate-x-6' : 'translate-x-1'}
                        `}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Code */}
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="card-title">Generated Code</h3>
                    <p className="card-description">Copy and paste this code into your website</p>
                  </div>
                  <button
                    onClick={() => handleCopyCode(embedCode, 'main')}
                    className="btn-primary"
                  >
                    {copiedCode === 'main' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{embedCode}</code>
                </pre>
              </div>
            </div>

            {/* Installation Instructions */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Installation Instructions</h3>
                <p className="card-description">Step-by-step guide to add the chatbot</p>
              </div>
              <div className="space-y-4">
                {embedType === 'script' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Copy the code above</h4>
                        <p className="text-sm text-gray-600">Select and copy the entire script block</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Paste before closing &lt;/body&gt; tag</h4>
                        <p className="text-sm text-gray-600">Add the code just before the closing body tag in your HTML</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Test your chatbot</h4>
                        <p className="text-sm text-gray-600">Visit your website to see the chatbot in action</p>
                      </div>
                    </div>
                  </div>
                )}

                {embedType === 'iframe' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Copy the iframe code</h4>
                        <p className="text-sm text-gray-600">Select and copy the iframe element above</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Paste where you want the chatbot</h4>
                        <p className="text-sm text-gray-600">Add the iframe code in your HTML where you want the chatbot to appear</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Customize styling if needed</h4>
                        <p className="text-sm text-gray-600">Adjust the iframe dimensions and styling to fit your design</p>
                      </div>
                    </div>
                  </div>
                )}

                {embedType === 'react' && (
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Install the package</h4>
                        <p className="text-sm text-gray-600">Run: npm install @fictora-labs/react-chatbot</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Import and use the component</h4>
                        <p className="text-sm text-gray-600">Add the FictoraBot component to your React app</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Customize props as needed</h4>
                        <p className="text-sm text-gray-600">Adjust the component props to match your requirements</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Preview</h3>
                <p className="card-description">How your chatbot will look</p>
              </div>
              
              <div className="space-y-4">
                {/* Device Preview */}
                <div className="flex justify-center">
                  <div className="w-full max-w-sm">
                    <div className="bg-gray-100 rounded-lg p-4 relative" style={{ height: '300px' }}>
                      {/* Mock website content */}
                      <div className="bg-white rounded p-3 mb-3">
                        <div className="h-2 bg-gray-200 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="bg-white rounded p-3 mb-3">
                        <div className="h-2 bg-gray-200 rounded mb-2"></div>
                        <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      
                      {/* Chat widget preview */}
                      {settings.position !== 'inline' && (
                        <div 
                          className={`absolute bottom-4 ${
                            settings.position === 'bottom-right' ? 'right-4' : 'left-4'
                          } w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200`}
                        >
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                      )}
                      
                      {settings.position === 'inline' && (
                        <div className="bg-white rounded-lg shadow-lg p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-6 h-6 bg-brand-primary rounded-full"></div>
                            <span className="text-sm font-medium">Chat with us</span>
                          </div>
                          <div className="h-20 bg-gray-50 rounded mb-3"></div>
                          <div className="flex space-x-2">
                            <div className="flex-1 h-8 bg-gray-100 rounded"></div>
                            <div className="w-8 h-8 bg-brand-primary rounded"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bot:</span>
                    <span className="font-medium text-gray-900">{selectedBotData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900 capitalize">{embedType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium text-gray-900">{settings.width}×{settings.height}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-medium text-gray-900 capitalize">{settings.theme}</span>
                  </div>
                </div>

                {/* Test Button */}
                <button className="w-full btn-secondary">
                  <ExternalLink className="w-4 h-4" />
                  Test in New Window
                </button>
              </div>
            </div>

            {/* Domain Whitelist */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Domain Settings</h3>
                <p className="card-description">Manage where your bot can be embedded</p>
              </div>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Allowed Domains</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">example.com</span>
                      <button className="text-red-600 hover:text-red-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-700">*.example.com</span>
                      <button className="text-red-600 hover:text-red-800">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Add domain (e.g., mysite.com)"
                    className="form-input mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EmbedCode;