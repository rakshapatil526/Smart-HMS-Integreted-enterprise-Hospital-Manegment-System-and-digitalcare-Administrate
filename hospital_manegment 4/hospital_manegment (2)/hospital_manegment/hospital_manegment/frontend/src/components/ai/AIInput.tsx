import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface AIInputProps {
  onSend: (message: string) => void;
  loading: boolean;
}

export const AIInput: React.FC<AIInputProps> = ({ onSend, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white p-3 flex items-center space-x-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
        disabled={loading}
        placeholder="Ask AI Assistant about appointments, reports, patients, pharmacy..."
        className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:border-teal-500 focus:outline-none disabled:bg-slate-50 disabled:opacity-70 transition-all"
      />
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="flex items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-white hover:bg-teal-700 disabled:opacity-40 transition-all shadow-sm shrink-0"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </button>
    </form>
  );
};
