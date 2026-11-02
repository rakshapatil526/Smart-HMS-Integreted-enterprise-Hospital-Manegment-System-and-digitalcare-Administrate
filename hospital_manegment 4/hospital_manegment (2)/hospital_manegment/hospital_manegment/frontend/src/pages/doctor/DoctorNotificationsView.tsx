import React, { useState, useEffect } from 'react';
import { Bell, FlaskConical, Image as ImageIcon, Calendar, HeartPulse, Video, Bed, CheckCircle2, User, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sharedStore } from '../../services/sharedStore';
import { DoctorNotificationItem } from '../../types';

interface DoctorNotificationsViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
}

export const DoctorNotificationsView: React.FC<DoctorNotificationsViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const activeDoctor = sharedStore.getDoctorNameForUser(user);
  const [notifications, setNotifications] = useState<DoctorNotificationItem[]>([]);

  const refreshNotifs = () => {
    setNotifications(sharedStore.getDoctorNotifications(activeDoctor));
  };

  useEffect(() => {
    sharedStore.setSelectedDoctor(activeDoctor);
    refreshNotifs();

    const handleNotifAdded = () => refreshNotifs();

    window.addEventListener('smartcare_notification_added', handleNotifAdded);
    return () => {
      window.removeEventListener('smartcare_notification_added', handleNotifAdded);
    };
  }, [activeDoctor]);

  const getIcon = (category: string) => {
    switch (category) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-teal-600" />;
      case 'lab':
        return <FlaskConical className="h-4 w-4 text-purple-600" />;
      case 'radiology':
        return <ImageIcon className="h-4 w-4 text-rose-600" />;
      case 'ipd':
        return <Bed className="h-4 w-4 text-amber-600" />;
      default:
        return <Bell className="h-4 w-4 text-cyan-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="h-5 w-5 text-teal-600" />
            <span>NOTIFICATIONS ({activeDoctor})</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time clinical alerts, new patient appointment bookings, and schedule updates for {activeDoctor}.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800">
          <User className="h-4 w-4 text-teal-600" />
          <span>{activeDoctor}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Feed */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-3 flex items-center justify-between">
            <span>🔔 Clinical Feed for {activeDoctor}</span>
            <span className="text-xs font-semibold text-teal-600">{notifications.length} Total Alerts</span>
          </h2>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No active notifications for {activeDoctor}.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onNavigate(notif.category === 'appointment' ? 'appointments' : 'dashboard')}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-start justify-between space-x-4 ${
                    !notif.read
                      ? 'bg-teal-50/50 border-teal-200 hover:border-teal-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm shrink-0">
                      {getIcon(notif.category)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{notif.title}</span>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">{notif.message}</p>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                    {notif.timestamp}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* INTER-DOCTOR & INTER-MODULE DISPATCH BOX */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-3 flex items-center space-x-2">
            <Send className="h-4 w-4 text-teal-600" />
            <span>INTER-MODULE NOTIFICATION DISPATCH</span>
          </h2>

          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as any;
            const targetRole = form.targetRole.value;
            const targetDoc = form.targetDoctor.value;
            const patientName = form.patientName.value;
            const msg = form.messageText.value;

            if (targetRole === 'DOCTOR') {
              sharedStore.sendDoctorToDoctorMessage({
                senderDoctor: activeDoctor,
                recipientDoctor: targetDoc,
                patientName: patientName || 'Rakshitha',
                message: msg
              });
              alert(`Message/Referral from ${activeDoctor} transmitted to ${targetDoc}!\nNotification dispatched to ${targetDoc}'s panel.`);
            } else if (targetRole === 'NURSE') {
              sharedStore.sendDoctorToNurseInstruction({
                doctorName: activeDoctor,
                patientName: patientName || 'Rakshitha',
                bedNumber: 'B102',
                instruction: msg
              });
              alert(`Instruction from ${activeDoctor} sent to Nurse Module!\nNotification dispatched to Nurse Panel.`);
            } else if (targetRole === 'LAB') {
              sharedStore.addLabNotification({
                id: `lab-notif-${Date.now()}`,
                title: `🧪 Lab Order from ${activeDoctor}`,
                message: `${activeDoctor} ordered test for Patient ${patientName || 'Rakshitha'}: "${msg}"`,
                category: 'request',
                timestamp: 'Just Now',
                read: false
              });
              alert(`Lab Order/Notification from ${activeDoctor} sent to Laboratory Panel!`);
            } else if (targetRole === 'RADIOLOGY') {
              sharedStore.addRadiologyNotification({
                id: `rad-notif-${Date.now()}`,
                title: `🩻 Imaging Order from ${activeDoctor}`,
                message: `${activeDoctor} ordered scan for Patient ${patientName || 'Rakshitha'}: "${msg}"`,
                category: 'radiology',
                timestamp: 'Just Now',
                read: false
              });
              alert(`Radiology Scan Order/Notification from ${activeDoctor} sent to RIS Radiology Panel!`);
            } else if (targetRole === 'PHARMACY') {
              sharedStore.addPharmacyNotification({
                id: `ph-notif-${Date.now()}`,
                title: `💊 Prescription Order from ${activeDoctor}`,
                message: `${activeDoctor} prescribed medication for Patient ${patientName || 'Rakshitha'}: "${msg}"`,
                category: 'prescription',
                timestamp: 'Just Now',
                read: false
              });
              alert(`Prescription Notification from ${activeDoctor} sent to Pharmacy Panel!`);
            } else if (targetRole === 'AMBULANCE') {
              sharedStore.addAmbulanceNotification({
                id: `amb-notif-${Date.now()}`,
                title: `🚨 Emergency Dispatch Alert from ${activeDoctor}`,
                message: `${activeDoctor} requested ambulance for Patient ${patientName || 'Rakshitha'}: "${msg}"`,
                category: 'emergency',
                timestamp: 'Just Now',
                read: false
              });
              alert(`Emergency Alert from ${activeDoctor} sent to Ambulance Operator Panel!`);
            } else {
              sharedStore.sendDoctorToReceptionMessage({
                doctorName: activeDoctor,
                patientName: patientName || 'Rakshitha',
                message: msg
              });
              alert(`Update from ${activeDoctor} sent to Receptionist Panel!`);
            }
            form.reset();
            refreshNotifs();
          }} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Recipient Module / Role</label>
              <select name="targetRole" className="w-full rounded-xl border p-2 text-xs font-semibold">
                <option value="DOCTOR">Another Doctor (Doctor-to-Doctor)</option>
                <option value="NURSE">Nursing Staff (Doctor-to-Nurse)</option>
                <option value="LAB">Laboratory Tech (Doctor-to-Laboratory)</option>
                <option value="RADIOLOGY">Radiologist (Doctor-to-Radiology)</option>
                <option value="PHARMACY">Pharmacist (Doctor-to-Pharmacy)</option>
                <option value="AMBULANCE">Ambulance Operator (Doctor-to-Ambulance)</option>
                <option value="RECEPTION">Front Desk / Receptionist</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Target Doctor (If Doctor)</label>
              <select name="targetDoctor" className="w-full rounded-xl border p-2 text-xs">
                {sharedStore.getDoctors().filter(d => d.name !== activeDoctor).map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.department})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Patient Name</label>
              <input type="text" name="patientName" defaultValue="Rakshitha" className="w-full rounded-xl border p-2 text-xs" />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message / Clinical Referral / Order</label>
              <textarea name="messageText" rows={3} required defaultValue="Patient requires cardiology follow-up & second opinion." className="w-full rounded-xl border p-2 text-xs" />
            </div>

            <button type="submit" className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-xs font-bold text-white uppercase shadow-sm">
              Transmit Notification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

