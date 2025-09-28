import React, { useState } from 'react';
import { 
  CreditCard, 
  Check, 
  Star, 
  Zap, 
  Users, 
  Bot, 
  MessageSquare,
  Calendar,
  Download,
  ExternalLink
} from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: string[];
  limits: {
    bots: number;
    messages: number;
    users: number;
  };
  popular?: boolean;
  current?: boolean;
}

const Subscription: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [isUpgrading, setIsUpgrading] = useState(false);

  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: billingInterval,
      description: 'Perfect for getting started',
      features: [
        'Up to 3 chatbots',
        '1,000 messages/month',
        'Basic customization',
        'Email support',
        'Standard response time',
      ],
      limits: {
        bots: 3,
        messages: 1000,
        users: 100,
      },
      current: true,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: billingInterval === 'month' ? 29 : 290,
      interval: billingInterval,
      description: 'Best for growing businesses',
      features: [
        'Up to 25 chatbots',
        '10,000 messages/month',
        'Advanced customization',
        'Priority support',
        'Analytics dashboard',
        'Custom branding',
        'API access',
      ],
      limits: {
        bots: 25,
        messages: 10000,
        users: 5000,
      },
      popular: true,
    },
    {
      id: 'business',
      name: 'Business',
      price: billingInterval === 'month' ? 99 : 990,
      interval: billingInterval,
      description: 'For large organizations',
      features: [
        'Unlimited chatbots',
        '100,000 messages/month',
        'White-label solution',
        'Dedicated support',
        'Advanced analytics',
        'Custom integrations',
        'SLA guarantee',
        'Team collaboration',
      ],
      limits: {
        bots: -1, // unlimited
        messages: 100000,
        users: 50000,
      },
    },
  ];

  const currentUsage = {
    bots: 12,
    messages: 2847,
    users: 1234,
  };

  const currentPlan = plans.find(plan => plan.current);

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUpgrading(false);
    console.log('Upgrading to plan:', planId);
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const formatLimit = (limit: number) => {
    if (limit === -1) return 'Unlimited';
    return limit.toLocaleString();
  };

  return (
    <AdminLayout currentPage="subscription">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-primary">Subscription Plans</h1>
          <p className="mt-2 text-gray-600">
            Choose the perfect plan for your business needs
          </p>
        </div>

        {/* Current Plan Status */}
        <div className="card bg-neural-mint border-brand-accent">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-brand-primary rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-neon-lime" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand-primary">
                  Current Plan: {currentPlan?.name}
                </h3>
                <p className="text-brand-primary opacity-80">
                  {currentPlan?.price === 0 
                    ? 'Free forever' 
                    : `$${currentPlan?.price}/${currentPlan?.interval}`
                  }
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-brand-primary opacity-80">Next billing</p>
              <p className="font-semibold text-brand-primary">
                {currentPlan?.price === 0 ? 'N/A' : 'Feb 15, 2024'}
              </p>
            </div>
          </div>
        </div>

        {/* Usage Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Current Usage</h3>
            <p className="card-description">Your usage this month</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-medium text-gray-700">Bots</span>
                </div>
                <span className="text-sm text-gray-600">
                  {currentUsage.bots} / {formatLimit(currentPlan?.limits.bots || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage(currentUsage.bots, currentPlan?.limits.bots || 0)}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-medium text-gray-700">Messages</span>
                </div>
                <span className="text-sm text-gray-600">
                  {currentUsage.messages.toLocaleString()} / {formatLimit(currentPlan?.limits.messages || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-brand-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage(currentUsage.messages, currentPlan?.limits.messages || 0)}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-medium text-gray-700">Users</span>
                </div>
                <span className="text-sm text-gray-600">
                  {currentUsage.users.toLocaleString()} / {formatLimit(currentPlan?.limits.users || 0)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getUsagePercentage(currentUsage.users, currentPlan?.limits.users || 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center">
          <div className="bg-gray-100 p-1 rounded-lg">
            <div className="flex space-x-1">
              <button
                onClick={() => setBillingInterval('month')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  billingInterval === 'month'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('year')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 relative ${
                  billingInterval === 'year'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-neon-lime text-brand-primary text-xs font-bold px-1.5 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`
                relative rounded-xl border-2 p-6 transition-all duration-200
                ${plan.popular
                  ? 'border-brand-primary bg-blue-50 scale-105'
                  : plan.current
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-brand-accent'
                }
              `}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-brand-primary">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/{plan.interval}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {!plan.current ? (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isUpgrading}
                    className={`w-full ${
                      plan.popular ? 'btn-primary' : 'btn-secondary'
                    } justify-center`}
                  >
                    {isUpgrading ? (
                      <>
                        <div className="spinner mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="text-center py-3">
                    <span className="text-green-600 font-medium">✓ Active Plan</span>
                  </div>
                )}

                <div className="text-center">
                  <button className="text-sm text-brand-accent hover:text-brand-primary font-medium">
                    View detailed features
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Billing History */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">Billing History</h3>
                <p className="card-description">Your recent invoices and payments</p>
              </div>
              <button className="btn-secondary">
                <Download className="w-4 h-4" />
                Download All
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { date: '2024-01-15', amount: 0, status: 'paid', plan: 'Free Plan' },
              { date: '2023-12-15', amount: 0, status: 'paid', plan: 'Free Plan' },
              { date: '2023-11-15', amount: 0, status: 'paid', plan: 'Free Plan' },
            ].map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-neon-lime" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{invoice.plan}</p>
                    <p className="text-sm text-gray-600">{invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-brand-primary">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Payment Method</h3>
            <p className="card-description">Manage your billing information</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-neon-lime" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">No payment method</p>
                  <p className="text-sm text-gray-600">Add a payment method to upgrade</p>
                </div>
              </div>
              <button className="btn-secondary">
                <CreditCard className="w-4 h-4" />
                Add Card
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Frequently Asked Questions</h3>
            <p className="card-description">Common questions about billing and plans</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Can I change my plan anytime?</h4>
              <p className="text-sm text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and you'll be prorated for any differences.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What happens if I exceed my limits?</h4>
              <p className="text-sm text-gray-600">
                If you exceed your plan limits, your chatbots will continue to work, but you'll be prompted 
                to upgrade. We'll never shut down your service without notice.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Do you offer refunds?</h4>
              <p className="text-sm text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans. Contact our support team 
                if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help choosing the right plan or have questions about billing?
          </p>
          <button className="btn-secondary">
            <ExternalLink className="w-4 h-4" />
            Contact Support
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Subscription;