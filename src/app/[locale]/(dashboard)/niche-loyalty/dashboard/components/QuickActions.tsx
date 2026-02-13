/**
 * Quick Actions Component
 * Provides quick access to common tasks
 */

'use client';

import { Mail, Upload, Plus } from 'lucide-react';
import { useState } from 'react';
import { CreateCampaignDialog } from './CreateCampaignDialog';
import { ImportMembersDialog } from './ImportMembersDialog';
import { CreateCardDialog } from './CreateCardDialog';

export function QuickActions() {
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            onClick={() => setCampaignOpen(true)}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="rounded-full bg-blue-50 p-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-900">Send Campaign</span>
          </button>

          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="rounded-full bg-green-50 p-2">
              <Upload className="h-5 w-5 text-green-600" />
            </div>
            <span className="font-medium text-gray-900">Import Members</span>
          </button>

          <button
            onClick={() => setCardOpen(true)}
            className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="rounded-full bg-purple-50 p-2">
              <Plus className="h-5 w-5 text-purple-600" />
            </div>
            <span className="font-medium text-gray-900">Create Card</span>
          </button>
        </div>
      </div>

      <CreateCampaignDialog open={campaignOpen} onOpenChange={setCampaignOpen} />
      <ImportMembersDialog open={importOpen} onOpenChange={setImportOpen} />
      <CreateCardDialog open={cardOpen} onOpenChange={setCardOpen} />
    </>
  );
}

