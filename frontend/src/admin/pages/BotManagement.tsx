import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Copy,
  Globe,
  FileText,
  Calendar,
  MessageSquare,
  Users
} from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

interface BotData {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'training';
  type: 'document' | 'website';
  source: string;
  conversations: number;
  users: number;
  createdAt: string;
  lastActive: string;
}

const BotManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedBots, setSelectedBots] = useState<number[]>([]);

  // Mock data - in a real app, this would come from your API
  const [bots, setBots] = useState<BotData[]>([
    {
      id: 1,
      name: 'Customer Support Bot',
      description: 'Handles customer inquiries and support tickets',
      status: 'active',
      type: 'document',
      source: 'support-docs.pdf',
      conversations: 245,
      users: 89,
      createdAt: '2024-01-15',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Sales Assistant',
      description: 'Helps with product information and sales queries',
      status: 'active',
      type: 'website',
      source: 'https://example.com',
      conversations: 189,
      users: 67,
      createdAt: '2024-01-10',
      lastActive: '5 minutes ago',
    },
    {
      id: 3,
      name: 'FAQ Helper',
      description: 'Answers frequently asked questions',
      status: 'inactive',
      type: 'document',
      source: 'faq-document.docx',
      conversations: 67,
      users: 23,
      createdAt: '2024-01-05',
      lastActive: '2 days ago',
    },
    {
      id: 4,
      name: 'Product Guide Bot',
      description: 'Provides detailed product information and guides',
      status: 'training',
      type: 'document',
      source: 'product-manual.pdf',
      conversations: 0,
      users: 0,
      createdAt: '2024-01-20',
      lastActive: 'Never',
    },
  ]);

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || bot.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateBot = () => {
    console.log('Create new bot');
  };

  const handleEditBot = (botId: number) => {
    console.log('Edit bot:', botId);
  };

  const handleDeleteBot = (botId: number) => {
    if (window.confirm('Are you sure you want to delete this bot?')) {
      setBots(prev => prev.filter(bot => bot.id !== botId));
    }
  };

  const handleViewBot = (botId: number) => {
    console.log('View bot:', botId);
  };

  const handleCopyEmbedCode = (botId: number) => {
    const embedCode = `<script src="https://fictora-labs.com/embed/${botId}.js"></script>`;
    navigator.clipboard.writeText(embedCode);
    // In a real app, you'd show a toast notification
    console.log('Embed code copied to clipboard');
  };

  const handleToggleStatus = (botId: number) => {
    setBots(prev => prev.map(bot => 
      bot.id === botId 
        ? { ...bot, status: bot.status === 'active' ? 'inactive' : 'active' }
        : bot
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'training':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'document' ? FileText : Globe;
  };

  return (
    <AdminLayout currentPage="bots">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-primary">My Bots</h1>
            <p className="mt-1 text-gray-600">
              Manage and monitor your chatbots
            </p>
          </div>
          <button
            onClick={handleCreateBot}
            className="mt-4 sm:mt-0 btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create New Bot
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-brand-primary rounded-lg">
                <Bot className="w-5 h-5 text-neon-lime" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Bots</p>
                <p className="text-xl font-bold text-brand-primary">{bots.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Conversations</p>
                <p className="text-xl font-bold text-brand-primary">
                  {bots.reduce((sum, bot) => sum + bot.conversations, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-brand-accent rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-xl font-bold text-brand-primary">
                  {bots.reduce((sum, bot) => sum + bot.users, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Bots</p>
                <p className="text-xl font-bold text-brand-primary">
                  {bots.filter(bot => bot.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bots..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 w-64"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="training">Training</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredBots.length} of {bots.length} bots
            </div>
          </div>
        </div>

        {/* Bots Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBots.map((bot) => {
            const TypeIcon = getTypeIcon(bot.type);
            return (
              <div key={bot.id} className="card hover:shadow-brand-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{bot.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <TypeIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{bot.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bot.status)}`}>
                      {bot.status}
                    </span>
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {bot.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Source:</span>
                    <span className="text-gray-900 truncate ml-2 max-w-32" title={bot.source}>
                      {bot.source}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{bot.conversations}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{bot.users}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Created {bot.createdAt}</span>
                    </div>
                    <span>Active {bot.lastActive}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewBot(bot.id)}
                      className="p-2 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditBot(bot.id)}
                      className="p-2 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Edit Bot"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopyEmbedCode(bot.id)}
                      className="p-2 text-gray-400 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      title="Copy Embed Code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(bot.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                        bot.status === 'active'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {bot.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleDeleteBot(bot.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete Bot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredBots.length === 0 && (
          <div className="card text-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterStatus !== 'all' ? 'No bots found' : 'No bots yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first chatbot.'
              }
            </p>
            {(!searchTerm && filterStatus === 'all') && (
              <button
                onClick={handleCreateBot}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                Create Your First Bot
              </button>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default BotManagement;