import React, { useState, useEffect } from 'react';
import { authApi } from '../../services/api';
import { X, Mic, MicOff, Volume2, Sparkles } from 'lucide-react';

interface AIVoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export const AIVoiceAssistantModal: React.FC<AIVoiceAssistantModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('Click the microphone and state your command (e.g., "Book appointment with cardiologist" or "Show my lab reports").');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setTranscript('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setTranscript('Listening to your voice command...');

    // Browser SpeechRecognition fallback simulator
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processVoiceCommand(text);
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
        setTranscript('Voice input error. Please try again.');
      };
      recognition.start();
    } else {
      // Demo simulated voice command if browser speech API unavailable
      setTimeout(() => {
        const demoCommand = "Book appointment with cardiologist";
        setTranscript(demoCommand);
        processVoiceCommand(demoCommand);
        setIsListening(false);
      }, 2500);
    }
  };

  const processVoiceCommand = async (text: string) => {
    setLoading(true);
    try {
      const res = await authApi.postAIVoice(text);
      setResponse(res.data.spoken_response);
      if (res.data.target_route) {
        setTimeout(() => {
          onNavigate(res.data.target_route);
          onClose();
        }, 1500);
      }
    } catch (err) {
      setResponse('Failed to process voice request.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="h-5 w-5" />
        </button>

        <div className="mb-2 flex items-center space-x-2 text-teal-600">
          <Sparkles className="h-5 w-5 animate-spin" />
          <span className="font-bold text-sm tracking-wide">Smart Care Voice AI</span>
        </div>

        {/* Animated Mic Button */}
        <div className="my-6 relative flex items-center justify-center">
          {isListening && (
            <div className="absolute h-28 w-28 rounded-full bg-teal-500/20 animate-ping"></div>
          )}
          <button
            onClick={toggleListening}
            className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition-all ${
              isListening ? 'bg-red-500 scale-110' : 'bg-gradient-to-tr from-teal-600 to-cyan-500 hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="h-9 w-9" /> : <Mic className="h-9 w-9" />}
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-500 mb-2">
          {isListening ? 'Listening...' : 'Tap Mic to Speak'}
        </p>

        {transcript && (
          <div className="w-full rounded-xl bg-slate-50 p-3 text-xs text-slate-700 font-medium mb-3 border border-slate-200">
            "{transcript}"
          </div>
        )}

        <div className="w-full rounded-2xl bg-teal-50 p-4 text-xs text-teal-900 font-medium border border-teal-200 flex items-start space-x-2">
          <Volume2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
          <span>{loading ? 'Processing intent...' : response}</span>
        </div>
      </div>
    </div>
  );
};
