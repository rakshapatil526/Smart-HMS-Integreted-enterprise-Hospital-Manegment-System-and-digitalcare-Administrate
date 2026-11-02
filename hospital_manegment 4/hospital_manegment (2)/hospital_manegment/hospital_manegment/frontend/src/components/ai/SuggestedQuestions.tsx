import React from 'react';

interface SuggestedQuestionsProps {
  role?: string;
  onSelect: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ role, onSelect }) => {
  const normRole = (role || '').toLowerCase();

  let questions: string[] = [];

  if (normRole === 'patient') {
    questions = [
      "What is my next appointment?",
      "Who is my doctor?",
      "Show my latest lab report",
      "Explain my prescription",
      "What hospital facilities are available?"
    ];
  } else if (normRole === 'doctor') {
    questions = [
      "Show me today's patients.",
      "Which patients are waiting for consultation?",
      "Show me my appointments for today.",
      "Show me this patient's complete medical history.",
      "What are this patient's previous diagnoses?",
      "Show me the patient's previous prescriptions.",
      "Show me the patient's allergies.",
      "Show me the patient's current medications.",
      "Show me previous medications.",
      "Show me documented medication allergies.",
      "How many patients do I have today?",
      "How many consultations are pending?",
      "How many follow-ups are scheduled?",
      "How many patients are admitted?"
    ];
  } else if (normRole === 'nurse') {
    questions = [
      "Show me all patients assigned to me today.",
      "Which patients need immediate attention?",
      "Show me the latest vital signs of my patients.",
      "Which patients have abnormal recorded vitals?",
      "Show me today's medication and nursing tasks.",
      "Which medications or nursing tasks are pending?",
      "Show me today's admissions, transfers, and discharges.",
      "Show me available and occupied beds in my ward.",
      "Show me new instructions or orders from doctors.",
      "Generate today's nursing/ward activity report PDF."
    ];
  } else if (normRole.includes('radiolog') || normRole.includes('ris')) {
    questions = [
      "Show me today's radiology requests.",
      "Show me all pending imaging procedures.",
      "Which radiology cases are marked urgent?",
      "Show me today's completed scans.",
      "Which radiology reports are waiting for verification?",
      "Show me this patient's previous imaging and reports.",
      "Compare the patient's previous and current radiology reports.",
      "Show me the referring doctor's request for this patient.",
      "Show me today's radiology workload.",
      "Generate the radiology report PDF."
    ];
  } else if (normRole.includes('pharmacist') || normRole.includes('pharmacy')) {
    questions = [
      "Show me today's pending prescriptions.",
      "Check whether this medicine is currently available.",
      "Show me medicines that are low or out of stock.",
      "Show me expired medicines and medicines expiring soon.",
      "Show me today's medicine dispensing records.",
      "Show me this patient's current prescription and medication history.",
      "Check for duplicate medicines or documented medication allergies.",
      "Show me today's pharmacy stock movements.",
      "Which medicines need to be reordered?",
      "Generate today's pharmacy inventory/stock report PDF."
    ];
  } else if (normRole.includes('recept')) {
    questions = [
      "Register a new patient.",
      "Find this patient's existing hospital record.",
      "Show me today's appointments.",
      "Book an appointment for this patient.",
      "Show me available doctors and appointment slots.",
      "Reschedule or cancel this patient's appointment.",
      "Show me today's waiting patients.",
      "Show me available hospital departments and services.",
      "Show me available beds and current admissions.",
      "Generate the patient's registration/appointment PDF."
    ];
  } else if (normRole.includes('ambul') || normRole.includes('dispatch') || normRole.includes('driver')) {
    questions = [
      "Show me all available ambulances.",
      "Show me currently active ambulance trips.",
      "Show me pending emergency requests.",
      "Which ambulance is assigned to this emergency?",
      "Show me the assigned driver and medical staff.",
      "Show me the current status of this ambulance trip.",
      "Show me today's completed ambulance trips.",
      "Which ambulances require maintenance?",
      "Show me the emergency patient's transfer details.",
      "Generate today's ambulance activity report PDF."
    ];
  } else if (normRole.includes('lab') || normRole.includes('laboratory') || normRole.includes('tech')) {
    questions = [
      "Show me today's pending laboratory tests.",
      "Show me samples that are waiting for processing.",
      "Which samples have been rejected and why?",
      "Show me today's urgent laboratory requests.",
      "Which test reports are waiting for verification?",
      "Show me abnormal or critical laboratory results requiring review.",
      "Show me this patient's previous laboratory reports.",
      "Compare this patient's previous and current laboratory results.",
      "Show me today's completed laboratory tests.",
      "Generate the laboratory report PDF."
    ];
  } else {
    // Admin, Reception, Inventory, HR, Ambulance, etc.
    questions = [
      "Today's appointments",
      "Hospital statistics",
      "Low stock",
      "Pending bills"
    ];
  }

  return (
    <div className="flex flex-wrap gap-1.5 py-1">
      {questions.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(q)}
          className="rounded-full bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-700 px-3 py-1 text-[11px] font-medium transition-all hover:scale-105"
        >
          {q}
        </button>
      ))}
    </div>
  );
};
