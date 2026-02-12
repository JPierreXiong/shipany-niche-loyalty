/**
 * Glow Dashboard - Artisan Theme
 * Real-time brand customization with live preview
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Heart, 
  ShoppingBag, 
  Mail,
  Sparkles,
  Settings,
  Plus,
  ArrowRight,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNicheLoyaltyStore } from '@/shared/stores/niche-loyalty-store';
import { 
  StatsCardGrid, 
  MemberCard,
} from '@/themes/artisan/components';
import { BrandConfigPanel } from '@/themes/artisan/components/BrandConfigPanel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { Button } from '@/shared/components/ui/button';

export default function GlowDashboard() {
  const { brandConfig, stats, members, setStats, setMembers, isLoading, setLoading } = useNicheLoyaltyStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'brand' | 'members' | 'campaigns'>('overview');
  
  // Dialog states
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  
  // Form states
  const [memberForm, setMemberForm] = useState({ name: '', email: '', points: 0 });
  const [campaignForm, setCampaignForm] = useState({ name: '', subject: '', message: '' });
  const [importFile, setImportFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 模拟数据加载
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // First, get or create store
      const storeResponse = await fetch('/api/niche-loyalty/store/get');
      if (!storeResponse.ok) {
        toast.error('Failed to load store information');
        setLoading(false);
        return;
      }
      
      const storeData = await storeResponse.json();
      const storeId = storeData.data?.id;
      
      if (!storeId) {
        // Show demo data if no store exists
        setMembers([
          {
            id: '1',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            points: 240,
            joinedAt: '2025-12-01',
            lastActivity: '2025-02-05',
            tier: 'gold',
          },
          {
            id: '2',
            name: 'Michael Chen',
            email: 'michael@example.com',
            points: 180,
            joinedAt: '2026-01-15',
            lastActivity: '2025-02-06',
            tier: 'silver',
          },
          {
            id: '3',
            name: 'Emma Wilson',
            email: 'emma@example.com',
            points: 420,
            joinedAt: '2025-11-20',
            lastActivity: '2025-02-04',
            tier: 'gold',
          },
        ]);
        setLoading(false);
        return;
      }
      
      // Load real members from API
      const response = await fetch(`/api/niche-loyalty/members/list?storeId=${storeId}`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data.data?.members || []);
      }
    } catch (error) {
      console.error('Failed to load members:', error);
      toast.error('Failed to load dashboard data');
    }
    
    setLoading(false);
  };

  const handleAddMember = async () => {
    if (!memberForm.name || !memberForm.email) {
      toast.error('Name and email are required');
      return;
    }

    setSubmitting(true);
    try {
      // Get store ID first
      const storeResponse = await fetch('/api/niche-loyalty/store/get');
      if (!storeResponse.ok) {
        toast.error('Please connect your store first');
        setSubmitting(false);
        return;
      }
      
      const storeData = await storeResponse.json();
      const storeId = storeData.data?.id;
      
      if (!storeId) {
        toast.error('Please connect your store first');
        setSubmitting(false);
        return;
      }

      const response = await fetch('/api/niche-loyalty/members/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...memberForm,
          storeId,
        }),
      });

      if (response.ok) {
        toast.success('Member added successfully!');
        setShowAddMemberDialog(false);
        setMemberForm({ name: '', email: '', points: 0 });
        loadDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add member');
      }
    } catch (error) {
      toast.error('Failed to add member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportMembers = async () => {
    if (!importFile) {
      toast.error('Please select a CSV file');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const response = await fetch('/api/niche-loyalty/members/import-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Successfully imported ${data.imported} members!`);
        setShowImportDialog(false);
        setImportFile(null);
        loadDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to import members');
      }
    } catch (error) {
      toast.error('Failed to import members');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!campaignForm.name || !campaignForm.subject || !campaignForm.message) {
      toast.error('All fields are required');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/niche-loyalty/campaigns/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignForm),
      });

      if (response.ok) {
        toast.success('Campaign created successfully!');
        setShowCampaignDialog(false);
        setCampaignForm({ name: '', subject: '', message: '' });
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create campaign');
      }
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="theme-artisan min-h-screen bg-[#FDFCFB]">
      {/* Page Header */}
      <div className="border-b border-stone-200 bg-white">
        <div className="container py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl artisan-heading mb-2">Dashboard</h1>
              <p className="text-stone-600">Manage your loyalty program</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="artisan-button-secondary"
                onClick={() => setActiveTab('brand')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <button 
                className="artisan-button-primary"
                onClick={() => setShowAddMemberDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Members
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b border-stone-200 -mb-px">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'brand', label: 'Brand Setup' },
              { id: 'members', label: 'Members' },
              { id: 'campaigns', label: 'Campaigns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-stone-800 text-stone-800 font-medium'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Welcome Section */}
            <div className="artisan-glass-card p-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl artisan-heading mb-2">
                    Welcome back! 👋
                  </h2>
                  <p className="text-stone-600 text-lg mb-6">
                    Your loyalty program is growing. Here's what's happening today.
                  </p>
                  
                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      className="artisan-button-primary"
                      onClick={() => setShowCampaignDialog(true)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Campaign
                    </button>
                    <button 
                      className="artisan-button-secondary"
                      onClick={() => setShowImportDialog(true)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Import Members
                    </button>
                  </div>
                </div>

                {/* Mini Preview Card */}
                <div className="hidden lg:block">
                  <div className="scale-75 origin-top-right">
                    <MemberCard
                      brandColor={brandConfig.brandColor}
                      brandName={brandConfig.brandName}
                      logoUrl={brandConfig.logoUrl || undefined}
                      memberName="Preview"
                      points={100}
                      size="sm"
                      animated={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid - COMMENTED OUT: Waiting for real customer data */}
            {/* 
            <div>
              <h3 className="text-xl font-medium text-stone-800 mb-6">Key Metrics</h3>
              <StatsCardGrid
                columns={4}
                stats={[
                  {
                    label: 'Total Members',
                    value: stats.totalMembers,
                    icon: Users,
                    iconColor: '#8B9D83',
                    trend: 'up',
                    trendValue: `+${stats.memberGrowth}%`,
                    trendLabel: 'this month',
                  },
                  {
                    label: 'Active Members',
                    value: stats.activeMembers,
                    icon: TrendingUp,
                    iconColor: '#6B8E23',
                    trend: 'up',
                    trendValue: '+8%',
                    trendLabel: 'vs last month',
                  },
                  {
                    label: 'Engagement Rate',
                    value: `${stats.engagementRate}%`,
                    icon: Heart,
                    iconColor: '#C97064',
                    trend: 'up',
                    trendValue: '+5%',
                  },
                  {
                    label: 'Redemption Rate',
                    value: `${stats.redemptionRate}%`,
                    icon: ShoppingBag,
                    iconColor: '#D4A574',
                    trend: 'up',
                    trendValue: '+3%',
                  },
                ]}
              />
            </div>
            */}

            {/* Recent Members - COMMENTED OUT: Waiting for real customer data */}
            {/* 
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium text-stone-800">Recent Members</h3>
                <button className="text-sm text-stone-600 hover:text-stone-800 flex items-center">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {members.slice(0, 3).map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MemberCard
                      brandColor={brandConfig.brandColor}
                      brandName={brandConfig.brandName}
                      logoUrl={brandConfig.logoUrl || undefined}
                      memberName={member.name}
                      memberEmail={member.email}
                      memberSince={new Date(member.joinedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                      points={member.points}
                      nextRewardPoints={300}
                      size="md"
                      animated={true}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
            */}

            {/* Growth Tip */}
            <div className="artisan-card p-6 bg-gradient-to-br from-stone-50 to-white">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-medium text-stone-800 mb-2">
                    💡 Growth Tip
                  </h4>
                  <p className="text-stone-600 mb-4">
                    Members who receive a welcome email within 24 hours are 3x more likely to make a repeat purchase. 
                    Set up your first campaign to boost engagement!
                  </p>
                  <button className="text-sm text-stone-800 font-medium hover:underline">
                    Create Welcome Campaign →
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Brand Setup Tab */}
        {activeTab === 'brand' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl artisan-heading mb-2">Brand Setup</h2>
              <p className="text-stone-600 text-lg">
                Customize your loyalty program to match your brand identity
              </p>
            </div>

            <BrandConfigPanel />
          </motion.div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl artisan-heading mb-2">Members</h2>
                <p className="text-stone-600 text-lg">
                  Manage your loyalty program members
                </p>
              </div>
              <button 
                className="artisan-button-primary"
                onClick={() => setShowAddMemberDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </button>
            </div>

            {/* Members List */}
            <div className="artisan-card p-6">
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 hover:bg-stone-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-stone-200 to-stone-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-stone-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-stone-800">{member.name}</p>
                        <p className="text-sm text-stone-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-2xl font-light text-stone-800">{member.points}</p>
                        <p className="text-xs text-stone-500 uppercase">Points</p>
                      </div>
                      <span className={`artisan-badge ${
                        member.tier === 'gold' ? 'bg-amber-100 text-amber-700' :
                        member.tier === 'silver' ? 'bg-stone-100 text-stone-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {member.tier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl artisan-heading mb-2">Campaigns</h2>
                <p className="text-stone-600 text-lg">
                  Engage your members with targeted campaigns
                </p>
              </div>
              <button 
                className="artisan-button-primary"
                onClick={() => setShowCampaignDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </button>
            </div>

            {/* Empty State */}
            <div className="artisan-glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-stone-400" />
              </div>
              <h3 className="text-xl font-medium text-stone-800 mb-2">
                No campaigns yet
              </h3>
              <p className="text-stone-600 mb-6 max-w-md mx-auto">
                Create your first campaign to start engaging with your members
              </p>
              <button 
                className="artisan-button-primary"
                onClick={() => setShowCampaignDialog(true)}
              >
                Create Your First Campaign
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
            <DialogDescription>
              Add a new member to your loyalty program
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={memberForm.name}
                onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                placeholder="Enter member name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={memberForm.email}
                onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                placeholder="Enter member email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Initial Points (Optional)</Label>
              <Input
                id="points"
                type="number"
                value={memberForm.points}
                onChange={(e) => setMemberForm({ ...memberForm, points: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Member'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Members Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Members</DialogTitle>
            <DialogDescription>
              Upload a CSV file with member data (name, email, points)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <span className="text-sm text-stone-600">
                  {importFile ? importFile.name : 'Click to upload CSV file'}
                </span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportMembers} disabled={submitting || !importFile}>
              {submitting ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Campaign</DialogTitle>
            <DialogDescription>
              Create a new email campaign for your members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={campaignForm.name}
                onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                placeholder="e.g., Welcome Campaign"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={campaignForm.subject}
                onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                placeholder="Enter email subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={campaignForm.message}
                onChange={(e) => setCampaignForm({ ...campaignForm, message: e.target.value })}
                placeholder="Enter your message..."
                rows={6}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowCampaignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Campaign'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
