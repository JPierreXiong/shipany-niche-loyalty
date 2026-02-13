/**
 * Recent Activity Component
 * Shows recent customer actions and system events
 */

'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    try {
      const response = await fetch('/api/niche-loyalty/dashboard/activity');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse rounded-lg bg-white p-6 shadow">
        <div className="h-6 w-32 rounded bg-gray-200"></div>
        <div className="mt-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 rounded bg-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
      {activities.length === 0 ? (
        <div className="mt-4 text-center">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">No recent activity yet</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 border-l-2 border-gray-200 pl-4"
            >
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

