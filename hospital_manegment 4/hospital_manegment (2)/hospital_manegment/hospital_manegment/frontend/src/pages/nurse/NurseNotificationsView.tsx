import React from 'react';
import { NurseNotificationItem, NursePatient } from '../../types';
import { Bell, ArrowRight, Check, AlertTriangle, Pill, Stethoscope, Users, RefreshCw } from 'lucide-react';

interface NurseNotificationsViewProps {
  notifications: NurseNotificationItem[];
  patients: NursePatient[];
  onSelectNotification: (notif: NurseNotificationItem) => void;
  onMarkAllRead: () => void;
}

export const NurseNotificationsView: React.FC<NurseNotificationsViewProps> = ({
  notifications,
  patients,
  onSelectNotification,
  onMarkAllRead,
}) => {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'instruction':
        return <Stethoscope className="h-4 w-4 text-teal-600" />;
      case 'medication':
        return <Pill className="h-4 w-4 text-amber-600" />;
      case 'transfer':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'assignment':
        return <Users className="h-4 w-4 text-emerald-600" />;
      case 'vitals':
        return <AlertTriangle className="h-4 w-4 text-rose-600" />;
      default:
        return <Bell className="h-4 w-4 text-teal-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-teal-600" />
            <span>NURSE NOTIFICATIONS</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-rose-500 text-white text-xs font-bold px-2.5 py-0.5">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time clinical alerts, doctor orders, medication schedules, and patient transfers.
          </p>
        </div>

        <button
          onClick={onMarkAllRead}
          className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
        >
          <Check className="h-4 w-4 text-teal-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => onSelectNotification(notif)}
            className={`p-5 flex items-start space-x-4 cursor-pointer transition-all hover:bg-slate-50/90 ${
              !notif.read ? 'bg-teal-50/30' : 'bg-white'
            }`}
          >
            <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs shrink-0 mt-0.5">
              {getCategoryIcon(notif.category)}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`text-xs font-bold ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                  {notif.title}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium">{notif.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
              <div className="mt-2.5 inline-flex items-center space-x-1 text-[11px] font-bold text-teal-600 group-hover:underline">
                <span>Click to open patient care workspace</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>

            {!notif.read && (
              <span className="h-2.5 w-2.5 rounded-full bg-teal-600 shrink-0 mt-2" />
            )}
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No notifications available at this time.
          </div>
        )}
      </div>
    </div>
  );
};
