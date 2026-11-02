import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiAssistantApi, authApi } from '../../services/api';
import { ChatMessage, MessageItem } from './ChatMessage';
import { SuggestedQuestions } from './SuggestedQuestions';
import { AIInput } from './AIInput';
import { X, Bot, Sparkles, Trash2, ShieldAlert, RefreshCw } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const role = user?.role || 'Patient';

  // Load chat history on open
  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadHistory = async () => {
    try {
      setError(null);
      const res = await aiAssistantApi.getHistory();
      if (res.data.success && Array.isArray(res.data.history) && res.data.history.length > 0) {
        const loaded: MessageItem[] = [];
        res.data.history.forEach((h: any) => {
          loaded.push({ sender: 'user', text: h.message, timestamp: h.created_at });
          loaded.push({ sender: 'bot', text: h.response, timestamp: h.created_at, sources: h.sources });
        });
        setMessages(loaded);
      } else {
        setMessages([
          {
            sender: 'bot',
            text: `Hello ${user?.first_name || user?.email || 'there'}! I am your Smart Care ${role} AI Assistant. How can I help you today?`
          }
        ]);
      }
    } catch (err) {
      // Fallback greeting if history fetch fails or endpoint not ready
      setMessages([
        {
          sender: 'bot',
          text: `Hello ${user?.first_name || 'User'}! I am your Smart Care ${role} AI Assistant. Ask me about your authorized ${role.toLowerCase()} records or hospital status.`
        }
      ]);
    }
  };

  const handleClearHistory = async () => {
    try {
      await aiAssistantApi.clearHistory();
      setMessages([
        {
          sender: 'bot',
          text: `Chat history cleared. How can I assist you as a ${role}?`
        }
      ]);
    } catch (err) {
      setMessages([]);
    }
  };

  const handleSend = async (text: string) => {
    setError(null);
    const userMsg: MessageItem = { sender: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await aiAssistantApi.postChat(text);
      const botResponse = res.data.message || res.data.response;
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          role: res.data.role,
          timestamp: new Date().toISOString(),
          sources: res.data.sources
        }
      ]);
    } catch (err: any) {
      // Fallback to authApi.postAIChatbot if needed
      try {
        const fallbackRes = await authApi.postAIChatbot(text);
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: fallbackRes.data.response || fallbackRes.data.message,
            timestamp: new Date().toISOString()
          }
        ]);
      } catch (fallbackErr: any) {
        const errMsg = err?.response?.data?.message || err?.response?.data?.detail || 'Connection error. Please try again.';
        setError(errMsg);
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `I encountered an issue accessing data: ${errMsg}`
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex h-[600px] w-full max-w-xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 px-5 py-3.5 text-white">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shadow-inner">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm tracking-wide">Smart Care AI Assistant</h3>
                <span className="rounded-full bg-teal-800/80 text-teal-100 px-2 py-0.5 text-[10px] font-semibold border border-teal-400/30 uppercase">
                  {role}
                </span>
              </div>
              <p className="text-[11px] text-teal-100 flex items-center gap-1 mt-0.5">
                <Sparkles className="h-3 w-3 text-cyan-200" /> Authorized Data & Decision Support Engine
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="rounded-lg p-1.5 text-teal-100 hover:bg-white/10 hover:text-white transition-all"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-teal-100 hover:bg-white/10 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Suggested Questions Banner */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2">
          <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Suggested Questions:</div>
          <SuggestedQuestions role={role} onSelect={handleSend} />
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-amber-600 hover:text-amber-800 font-bold text-xs">✕</button>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 custom-scrollbar">
          {messages.map((m, idx) => (
            <ChatMessage key={idx} message={m} />
          ))}

          {loading && (
            <div className="flex items-center space-x-2.5 my-3 px-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-600 text-white animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 text-xs text-slate-500 shadow-sm">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-600" />
                <span>Analyzing authorized database telemetry...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Medical Safety Disclaimer Footer */}
        <div className="bg-slate-50 px-4 py-1 text-[10px] text-slate-400 text-center border-t border-slate-100">
          Smart Care AI provides decision support only. Consult a doctor for medical emergencies.
        </div>

        {/* Input Bar */}
        <AIInput onSend={handleSend} loading={loading} />
      </div>
    </div>
  );
};
