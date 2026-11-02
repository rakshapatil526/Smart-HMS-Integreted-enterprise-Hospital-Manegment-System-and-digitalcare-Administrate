import React from 'react';
import { AIAssistant } from './AIAssistant';

interface AIChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatbotModal: React.FC<AIChatbotModalProps> = ({ isOpen, onClose }) => {
  return <AIAssistant isOpen={isOpen} onClose={onClose} />;
};
