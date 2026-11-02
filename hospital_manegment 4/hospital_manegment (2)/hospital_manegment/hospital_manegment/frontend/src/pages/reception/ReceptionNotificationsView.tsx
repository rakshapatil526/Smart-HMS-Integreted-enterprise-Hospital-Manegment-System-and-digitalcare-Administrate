import React from 'react';
import { ReceptionNotificationItem } from '../../types';
import { Bell, Check, AlertTriangle, Users, Bed, Calendar, CheckCircle2 } from 'lucide-react';

interface ReceptionNotificationsViewProps {
  notifications: ReceptionNotificationItem[];
  onMarkAllRead: () => void;
}

export const ReceptionNotificationsView: React.FC<ReceptionNotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">RECEPTION NOTIFICATIONS</h1>
          <p className="text-xs text-slate-500">Real-time alerts for front desk registration, appointments, beds & emergency arrivals</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="inline-flex items-center space-x-1 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-all"
          >
            <Check className="h-3.5 w-3.5" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl p-4 border transition-all flex items-start space-x-4 ${
              !n.read ? 'bg-blue-50/40 border-blue-200 shadow-xs' : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <div className="rounded-xl bg-blue-100 p-2 text-blue-700 shrink-0 mt-0.5">
              {n.category === 'emergency' ? (
                <AlertTriangle className="h-4 w-4 text-rose-600" />
              ) : n.category === 'bed' ? (
                <Bed className="h-4 w-4 text-purple-600" />
              ) : (
                <Bell className="h-4 w-4 text-blue-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{n.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
