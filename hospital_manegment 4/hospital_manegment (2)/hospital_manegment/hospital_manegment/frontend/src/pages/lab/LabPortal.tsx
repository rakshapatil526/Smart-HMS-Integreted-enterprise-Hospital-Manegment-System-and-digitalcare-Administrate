import React, { useState, useEffect } from 'react';
import { sharedStore } from '../../services/sharedStore';
import {
  LabTestRequest,
  LabNotificationItem,
  LabStaffProfile,
  LabTestParameter
} from '../../types';
import {
  initialLabRequests,
  initialLabNotifications,
  initialLabProfile
} from './labData';
import { LabDashboardView } from './LabDashboardView';
import { LabRequestsView } from './LabRequestsView';
import { LabRequestDetailView } from './LabRequestDetailView';
import { LabSampleCollectionView } from './LabSampleCollectionView';
import { LabProcessingView } from './LabProcessingView';
import { LabResultsView } from './LabResultsView';
import { LabReportsView } from './LabReportsView';
import { LabNotificationsView } from './LabNotificationsView';
import { LabProfileView } from './LabProfileView';
import { AILabResultAnalyzerCard } from '../../components/ai/AILabResultAnalyzerCard';

interface LabPortalProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const LabPortal: React.FC<LabPortalProps> = ({ activeTab, setActiveTab }) => {
  const [requests, setRequests] = useState<LabTestRequest[]>(() => {
    const storeReqs = sharedStore.getLabRequests();
    return storeReqs && storeReqs.length > 0 ? storeReqs : initialLabRequests;
  });
  const [notifications, setNotifications] = useState<LabNotificationItem[]>(initialLabNotifications);
  const [profile, setProfile] = useState<LabStaffProfile>(initialLabProfile);

  useEffect(() => {
    const handleSync = () => {
      const storeReqs = sharedStore.getLabRequests();
      if (storeReqs && storeReqs.length > 0) {
        setRequests(storeReqs);
      }
    };
    window.addEventListener('smartcare_lab_request_added', handleSync);
    window.addEventListener('smartcare_doctor_added', handleSync);
    return () => {
      window.removeEventListener('smartcare_lab_request_added', handleSync);
      window.removeEventListener('smartcare_doctor_added', handleSync);
    };
  }, []);

  // Active Selected Request Workspace Context
  const [selectedRequest, setSelectedRequest] = useState<LabTestRequest | null>(null);
  const [requestDetailTab, setRequestDetailTab] = useState<string>('detail');

  const handleOpenRequest = (request: LabTestRequest, tab: string = 'detail') => {
    setSelectedRequest(request);
    setRequestDetailTab(tab);
  };

  const handleBackToList = () => {
    setSelectedRequest(null);
  };

  // State Mutators
  const handleAcceptRequest = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Accepted' } : r))
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: 'Accepted' } : null));
    }
  };

  const handleMarkSampleCollected = (id: string, sampleType: string, sampleId: string) => {
    const timeStr = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Sample Collected',
              sample_details: {
                sample_id: sampleId,
                sample_type: sampleType,
                collection_date: timeStr,
                collected_by: 'Alex Mercer (Lab Tech)',
                status: 'Collected',
              },
            }
          : r
      )
    );

    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status: 'Sample Collected',
              sample_details: {
                sample_id: sampleId,
                sample_type: sampleType,
                collection_date: timeStr,
                collected_by: 'Alex Mercer (Lab Tech)',
                status: 'Collected',
              },
            }
          : null
      );
    }
  };

  const handleSaveProcessingStatus = (id: string, status: any, notes: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              processing_notes: notes,
              sample_details: r.sample_details
                ? { ...r.sample_details, status: status === 'Processing' ? 'Processing' : r.sample_details.status }
                : undefined,
            }
          : r
      )
    );

    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status,
              processing_notes: notes,
            }
          : null
      );
    }
  };

  const handleSaveResults = (id: string, parameters: LabTestParameter[], remarks: string) => {
    const timeStr = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Result Entered',
              result: {
                parameters,
                remarks,
                entered_at: timeStr,
                entered_by: 'Alex Mercer (Lab Tech)',
              },
            }
          : r
      )
    );

    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status: 'Result Entered',
              result: {
                parameters,
                remarks,
                entered_at: timeStr,
                entered_by: 'Alex Mercer (Lab Tech)',
              },
            }
          : null
      );
    }
  };

  const handleVerifyResult = (id: string, status: 'Verified' | 'Correction Requested', notes?: string) => {
    const timeStr = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: status === 'Verified' ? 'Verified' : 'Processing',
              verification: {
                verified_by: 'Dr. Neha Shah (Senior Pathologist)',
                verified_at: timeStr,
                status,
                notes,
              },
              sample_details: r.sample_details
                ? { ...r.sample_details, status: status === 'Verified' ? 'Completed' : r.sample_details.status }
                : undefined,
            }
          : r
      )
    );

    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status: status === 'Verified' ? 'Verified' : 'Processing',
              verification: {
                verified_by: 'Dr. Neha Shah (Senior Pathologist)',
                verified_at: timeStr,
                status,
                notes,
              },
            }
          : null
      );
    }
  };

  const handleMarkSampleIssue = (id: string, reason: string, remarks: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'Sample Issue',
              sample_details: r.sample_details
                ? {
                    ...r.sample_details,
                    status: 'Sample Issue',
                    issue_reason: reason,
                    issue_remarks: remarks,
                  }
                : {
                    sample_id: `LAB-S-ISSUE`,
                    sample_type: 'Unknown',
                    collection_date: 'N/A',
                    collected_by: 'Alex Mercer',
                    status: 'Sample Issue',
                    issue_reason: reason,
                    issue_remarks: remarks,
                  },
            }
          : r
      )
    );

    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status: 'Sample Issue',
            }
          : null
      );
    }
  };

  const handleNotificationSelect = (notif: LabNotificationItem) => {
    // Mark notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    if (notif.request_id) {
      const targetReq = requests.find((r) => r.id === notif.request_id || r.request_id === notif.request_id);
      if (targetReq) {
        handleOpenRequest(targetReq, 'detail');
        return;
      }
    }

    if (notif.target_tab) {
      setActiveTab(notif.target_tab);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // If a request workspace is selected, render LabRequestDetailView
  if (selectedRequest) {
    return (
      <LabRequestDetailView
        request={selectedRequest}
        initialTab={requestDetailTab}
        onBack={handleBackToList}
        onAcceptRequest={handleAcceptRequest}
        onMarkSampleCollected={handleMarkSampleCollected}
        onSaveProcessingStatus={handleSaveProcessingStatus}
        onSaveResults={handleSaveResults}
        onVerifyResult={handleVerifyResult}
        onMarkSampleIssue={handleMarkSampleIssue}
      />
    );
  }

  // Otherwise render top-level view based on activeTab
  switch (activeTab) {
    case 'dashboard':
      return (
        <LabDashboardView
          requests={requests}
          onOpenRequest={handleOpenRequest}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      );

    case 'requests':
      return (
        <LabRequestsView
          requests={requests}
          onOpenRequest={handleOpenRequest}
        />
      );

    case 'collection':
      return (
        <LabSampleCollectionView
          requests={requests}
          onOpenRequest={handleOpenRequest}
          onMarkSampleCollected={handleMarkSampleCollected}
        />
      );

    case 'processing':
      return (
        <LabProcessingView
          requests={requests}
          onOpenRequest={handleOpenRequest}
          onSaveProcessingStatus={handleSaveProcessingStatus}
        />
      );

    case 'results':
      return (
        <LabResultsView
          requests={requests}
          onOpenRequest={handleOpenRequest}
          onVerifyResult={handleVerifyResult}
        />
      );

    case 'reports':
      return (
        <LabReportsView
          requests={requests}
          onOpenRequest={handleOpenRequest}
        />
      );

    case 'notifications':
      return (
        <LabNotificationsView
          notifications={notifications}
          requests={requests}
          onSelectNotification={handleNotificationSelect}
          onMarkAllRead={handleMarkAllRead}
        />
      );

    case 'profile':
      return (
        <LabProfileView
          profile={profile}
          onUpdateProfile={(updated) => setProfile(updated)}
        />
      );

    case 'ai-assistant':
      return (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">AI LAB RESULT ANALYZER & DELTA CHECK</h1>
              <p className="text-xs text-slate-500">Diagnostic decision support, reference range cross-examination, and panic value alerts</p>
            </div>
          </div>
          <AILabResultAnalyzerCard
            requestId={requests[0]?.request_id}
            patientName={requests[0]?.patient_name}
            testName={requests[0]?.test_name}
          />
        </div>
      );


    default:
      return (
        <LabDashboardView
          requests={requests}
          onOpenRequest={handleOpenRequest}
          onNavigateTab={(tab) => setActiveTab(tab)}
        />
      );
  }
};
