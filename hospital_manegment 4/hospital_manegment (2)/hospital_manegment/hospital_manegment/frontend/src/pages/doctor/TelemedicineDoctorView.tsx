import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, MessageSquare, Send, PhoneOff, HeartPulse, FileText, Pill, CheckCircle2 } from 'lucide-react';
import { MobileNotificationPayload } from '../../components/common/MobileNotificationToast';

interface TelemedicineDoctorViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onTriggerNotification: (payload: MobileNotificationPayload) => void;
}

export const TelemedicineDoctorView: React.FC<TelemedicineDoctorViewProps> = ({
  onNavigate,
  onTriggerNotification,
}) => {
  const [inCall, setInCall] = useState(false);
  const [activeCallPatient, setActiveCallPatient] = useState<any | null>(null);

  // Call Controls
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Chat & Notes state during call
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Patient', text: 'Hello Dr. Jenkins, thank you for joining.', time: '11:15 AM' },
    { sender: 'Doctor', text: 'Good morning! How are you feeling today?', time: '11:16 AM' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [telemedNotes, setTelemedNotes] = useState('Patient reported mild dizziness after starting morning medication. Advised hydration.');
  const [telemedPrescription, setTelemedPrescription] = useState('Hydration tabs 1-0-1 for 3 days');

  const onlineQueue = [
    { id: 'TELE-1', time: '11:15', patient: 'Patient D (Anita Roy)', patientId: 'P004', status: 'Waiting', complaint: 'Mild dizziness & palpitations', phone: '+1 555-0198', email: 'anita.roy@gmail.com' },
    { id: 'TELE-2', time: '11:45', patient: 'Patient B (Priya Patel)', patientId: 'P002', status: 'Confirmed', complaint: 'Blood sugar checkup follow-up', phone: '+1 555-0194', email: 'priya.patel@gmail.com' },
  ];

  const handleJoinCall = (p: any) => {
    setActiveCallPatient(p);
    setInCall(true);
  };

  const handleSendChat = () => {
    if (!chatInput) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'Doctor', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setChatInput('');
  };

  const handleEndConsultation = () => {
    onTriggerNotification({
      id: 'tele_' + Date.now(),
      patientName: activeCallPatient.patient,
      mobileNumber: activeCallPatient.phone,
      emailAddress: activeCallPatient.email,
      actionTitle: 'Telemedicine Session Ended & Recorded',
      messageBody: `Smart Care HMS: Online Consultation complete with ${activeCallPatient.patient}. Summary & Prescription saved to Patient Dashboard.`,
      timestamp: new Date().toLocaleTimeString(),
    });

    alert(`Telemedicine Consultation completed!\n- Notes & Prescription pushed to EHR\n- Dispatch SMS sent to mobile ${activeCallPatient.phone}`);
    setInCall(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Video className="h-5 w-5 text-teal-600" />
            <span>TELEMEDICINE — DOCTOR SIDE</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time HD Video / Voice consultations with integrated chat & EHR sidebar
          </p>
        </div>
      </div>

      {!inCall ? (
        /* TODAY'S ONLINE CONSULTATIONS QUEUE */
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b pb-3">TODAY'S ONLINE CONSULTATIONS</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b">
                  <th className="p-3">Time</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Chief Complaint</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {onlineQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold font-mono text-teal-700">{item.time}</td>
                    <td className="p-3 font-bold text-slate-900">{item.patient}</td>
                    <td className="p-3 text-slate-600">{item.complaint}</td>
                    <td className="p-3">
                      <span className="rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-[10px] font-bold">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleJoinCall(item)}
                        className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-1.5 text-xs font-bold shadow-md shadow-teal-500/20 transition-all flex items-center space-x-1 ml-auto"
                      >
                        <Video className="h-3.5 w-3.5" />
                        <span>[JOIN]</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* INTERACTIVE VIDEO / VOICE CALL SCREEN */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Canvas */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-3xl bg-slate-950 p-4 h-[420px] flex flex-col justify-between overflow-hidden shadow-2xl border border-slate-800">
              {/* Top Bar */}
              <div className="z-10 flex items-center justify-between bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-xs">
                <div className="flex items-center space-x-2 font-bold">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <span>LIVE CALL: {activeCallPatient.patient}</span>
                </div>
                <div className="font-mono text-teal-400 font-bold">04:32</div>
              </div>

              {/* Patient Video Stream Simulation */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <div className="text-center text-slate-400">
                  <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-teal-500/40 mx-auto flex items-center justify-center text-2xl font-bold text-teal-300 shadow-inner mb-2">
                    👨‍💼
                  </div>
                  <div className="text-xs font-bold text-white">{activeCallPatient.patient}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Encrypted WebRTC HD Stream</div>
                </div>
              </div>

              {/* Doctor PiP (Picture in Picture) Preview */}
              <div className="absolute bottom-16 right-4 h-28 w-36 rounded-2xl bg-slate-800 border-2 border-slate-700 overflow-hidden shadow-xl flex items-center justify-center text-white text-[11px] font-bold">
                {isVideoOn ? (
                  <div className="text-center">
                    <div className="text-lg">👨‍⚕️</div>
                    <div className="text-[9px] text-teal-300">Dr. Sarah Jenkins</div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-[10px]">Video Paused</div>
                )}
              </div>

              {/* Bottom Control Dock */}
              <div className="z-10 flex items-center justify-center space-x-4 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl w-fit mx-auto border border-slate-800">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-full transition-all ${isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'}`}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>

                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-full transition-all ${isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'}`}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>

                <button
                  onClick={handleEndConsultation}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-bold text-xs flex items-center space-x-2 shadow-lg shadow-red-600/30 transition-all"
                >
                  <PhoneOff className="h-4 w-4" />
                  <span>[END CONSULTATION]</span>
                </button>
              </div>
            </div>

            {/* Consultation Notes & Quick Prescription */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-slate-800 flex items-center space-x-1.5 border-b pb-2">
                <FileText className="h-4 w-4 text-teal-600" />
                <span>Telemedicine Clinical Notes & Prescription</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Consultation Summary</label>
                  <textarea
                    rows={3}
                    value={telemedNotes}
                    onChange={(e) => setTelemedNotes(e.target.value)}
                    className="w-full rounded-xl border p-2 focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Quick Prescription</label>
                  <textarea
                    rows={3}
                    value={telemedPrescription}
                    onChange={(e) => setTelemedPrescription(e.target.value)}
                    className="w-full rounded-xl border p-2 focus:border-teal-500 focus:outline-none font-semibold text-teal-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Chat & Patient EHR */}
          <div className="space-y-4">
            {/* Live Chat Box */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm h-[320px] flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-800 border-b pb-2 flex items-center space-x-1.5">
                <MessageSquare className="h-4 w-4 text-teal-600" />
                <span>Live Consultation Chat</span>
              </h3>

              <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 custom-scrollbar text-xs">
                {chatMessages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[85%] p-2.5 rounded-2xl text-[11px] ${
                      m.sender === 'Doctor'
                        ? 'bg-teal-600 text-white ml-auto rounded-br-none'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <div className="font-bold text-[9px] opacity-80">{m.sender} • {m.time}</div>
                    <div className="mt-0.5">{m.text}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t text-xs">
                <input
                  type="text"
                  placeholder="Type message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  className="flex-1 rounded-xl border p-2 focus:border-teal-500 focus:outline-none"
                />
                <button
                  onClick={handleSendChat}
                  className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Patient EHR Preview */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                <HeartPulse className="h-4 w-4 text-teal-600" />
                <span>Patient EHR Summary</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Allergies: <strong className="text-red-600">Penicillin</strong> | Last Visit: 15 Aug 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
