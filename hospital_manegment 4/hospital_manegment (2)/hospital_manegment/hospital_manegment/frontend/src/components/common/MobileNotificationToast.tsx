import React from 'react';
import { Smartphone, Mail, CheckCircle2, X } from 'lucide-react';

export interface MobileNotificationPayload {
  id: string;
  patientName: string;
  mobileNumber: string;
  emailAddress: string;
  actionTitle: string;
  messageBody: string;
  timestamp: string;
}

interface MobileNotificationToastProps {
  notifications: MobileNotificationPayload[];
  onDismiss: (id: string) => void;
}

export const MobileNotificationToast: React.FC<MobileNotificationToastProps> = ({
  notifications,
  onDismiss,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-md w-full px-4 sm:px-0">
      {notifications.map((item) => (
        <div
          key={item.id}
          className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-teal-500/40 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 w-full" />

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2 text-teal-300 font-bold text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{item.actionTitle} - Dispatch Confirmed</span>
            </div>
            <button
              onClick={() => onDismiss(item.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-slate-300 mt-1">
            Patient: <strong className="text-white">{item.patientName}</strong>
          </p>

          <div className="mt-2.5 space-y-1.5 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-[11px]">
            <div className="flex items-center space-x-2 text-emerald-300 font-medium">
              <Smartphone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">
                <strong>SMS Sent to Mobile:</strong> {item.mobileNumber}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-cyan-300 font-medium">
              <Mail className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">
                <strong>Email Sent:</strong> {item.emailAddress}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 italic mt-1 border-t border-slate-700/50 pt-1">
              "{item.messageBody}"
            </p>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>Smart Care Telemetry Gateway</span>
            <span>{item.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
