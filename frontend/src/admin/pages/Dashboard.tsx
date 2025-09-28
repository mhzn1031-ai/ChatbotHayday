import React from 'react';
import { 
  Bot, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Plus,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

const Dashboard: React.FC = () => {
  // Mock data - in a real app, this would come from your API
  const stats = [
    {
      name: 'Total Bots',
      value: '12',
      change: '+2 this month',
      changeType: 'positive',
      icon: Bot,
    },
    {
      name: 'Total Conversations',
      value: '2,847',
      change: '+12% from last month',
      changeType: 'positive',
      icon: MessageSquare,
    },
    {
      name: 'Active Users',
      value: '1,234',
      change: '+8% from last month',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: 'Response Rate',
      value: '98.5%',
      change: '+0.5% from last month',
      changeType: 'positive',
      icon: TrendingUp,
    },
  ];

  const recentBots = [
    {
      id: 1,
      name: 'Customer Support Bot',
      status: 'active',
      conversations: 245,
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Sales Assistant',
      status: 'active',
      conversations: 189,
      lastActive: '5 minutes ago',
    },
    {
      id: 3,
      name: 'FAQ Helper',
      status: 'inactive',
      conversations: 67,
      lastActive: '2 days ago',
    },
  ];

  const handleCreateBot = () => {
    console.log('Create new bot');
  };

  const handleViewBot = (botId: number) => {
    console.log('View bot:', botId);
  };

  const handleEditBot = (botId: number) => {
    console.log('Edit bot:', botId);
  };

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-brand p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-primary mb-2">
                Welcome back, John! 👋
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your chatbots today.
              </p>
            </div>
            <button
              onClick={handleCreateBot}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              Create New Bot
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.name} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-brand-primary">
                      {stat.value}
                    </p>
                    <p className={`text-xs mt-1 ${
                      stat.changeType === 'positive' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 bg-brand-primary rounded-lg">
                    <Icon className="w-6 h-6 text-neon-lime" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bots */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Bots</h3>
              <p className="card-description">
                Your most recently active chatbots
              </p>
            </div>
            <div className="space-y-4">
              {recentBots.map((bot) => (
                <div key={bot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{bot.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{bot.conversations} conversations</span>
                        <span>•</span>
                        <span>Last active {bot.lastActive}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      bot.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bot.status}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleViewBot(bot.id)}
                        className="p-1 text-gray-400 hover:text-brand-primary"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditBot(bot.id)}
                        className="p-1 text-gray-400 hover:text-brand-primary"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
              <p className="card-description">
                Common tasks to get you started
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleCreateBot}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4 text-neon-lime" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Create New Bot</p>
                    <p className="text-sm text-gray-500">Upload documents or add website URL</p>
                  </div>
                </div>
                <div className="text-gray-400">→</div>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Customize Appearance</p>
                    <p className="text-sm text-gray-500">Change colors, style, and branding</p>
                  </div>
                </div>
                <div className="text-gray-400">→</div>
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Analytics</p>
                    <p className="text-sm text-gray-500">Check performance and usage stats</p>
                  </div>
                </div>
                <div className="text-gray-400">→</div>
              </button>
            </div>
          </div>
        </div>

        {/* Usage Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Usage Overview</h3>
            <p className="card-description">
              Your current plan usage and limits
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Bot className="w-8 h-8 text-neon-lime" />
              </div>
              <p className="text-2xl font-bold text-brand-primary">12 / 25</p>
              <p className="text-sm text-gray-600">Bots Created</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-brand-accent h-2 rounded-full" style={{ width: '48%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-accent rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-brand-primary">2,847 / 10,000</p>
              <p className="text-sm text-gray-600">Messages This Month</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-brand-accent h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-brand-primary">1,234 / 5,000</p>
              <p className="text-sm text-gray-600">Active Users</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;