import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Activity, Mic, MessageSquare, Bell, User, LogOut, ChevronDown, Shield, PhoneCall
} from 'lucide-react';

interface HeaderProps {
  onOpenChat: () => void;
  onOpenVoice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenChat }) => {
  const { user, role, switchRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const rolesList: UserRole[] = [
    'Patient', 'Reception', 'Doctor', 'Nurse', 'Laboratory Technician',
    'Radiologist', 'Pharmacist', 'OT Staff', 'Billing Staff', 'Insurance Staff',
    'Inventory Manager', 'Blood Bank Staff', 'Ambulance Operator', 'Ambulance Driver',
    'HR Staff', 'Admin'
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-6 backdrop-blur-md">
      {/* Brand */}
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-500 text-white shadow-md shadow-teal-500/20">
          <Activity className="h-6 w-6 animate-pulse-subtle" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900">Smart<span className="text-teal-600">Care</span></span>
          <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
            Enterprise HMIS
          </span>
        </div>
      </div>

      {/* AI Assistant Triggers & Actions */}
      <div className="flex items-center space-x-3">
        {/* Quick Emergency SOS Callout */}
        <a
          href="#emergency"
          className="flex items-center space-x-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 shadow-sm transition-all animate-pulse"
        >
          <PhoneCall className="h-3.5 w-3.5" />
          <span>Emergency SOS</span>
        </a>

        {/* AI Chatbot Button */}
        <button
          onClick={onOpenChat}
          className="flex items-center space-x-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
          title="Open AI RAG Assistant"
        >
          <MessageSquare className="h-4 w-4 text-teal-600" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        {/* Role Switcher Dropdown - ADMIN ONLY */}
        {role === 'Admin' && (
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center space-x-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-200 border border-slate-200 transition-all"
            >
              <Shield className="h-3.5 w-3.5 text-teal-600" />
              <span>Role: <strong className="text-teal-700">{role}</strong></span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-xl z-50 max-h-96 overflow-y-auto custom-scrollbar">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Switch Role Dashboard (Admin Governance)
                </div>
                {rolesList.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-xs font-medium transition-colors ${
                      r === role
                        ? 'bg-teal-50 font-bold text-teal-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-all">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-500"></span>
        </button>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-2 border-l border-slate-200 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            {user?.first_name ? user.first_name[0] : 'U'}
          </div>
          <div className="hidden md:block text-left text-xs">
            <div className="font-semibold text-slate-800">{user?.first_name} {user?.last_name}</div>
            <div className="text-[10px] text-slate-500">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
