import React, { useState, useMemo } from 'react';
import {
  Sparkles, Search, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck,
  HeartPulse, Pill, Lightbulb, ArrowRight, X, Clock, Sun, Moon,
  Stethoscope, Activity, FileText, ChevronRight, Apple, Dumbbell
} from 'lucide-react';
import { ALL_50_CONDITIONS_LIST, HealthCondition } from '../../data/healthConditionsData';

interface AIPatientSuggestionCardProps {
  patientName?: string;
  bloodGroup?: string;
  allergies?: string;
  onAskAI?: (prompt: string) => void;
}

export const AIPatientSuggestionCard: React.FC<AIPatientSuggestionCardProps> = ({
  patientName = 'Alex Smith',
  bloodGroup = 'O+',
  allergies = 'Penicillin, Dust',
  onAskAI
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<HealthCondition | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'medicines' | 'diet' | 'exercises' | 'routine' | 'recovery' | 'doctor' | 'precautions'>('medicines');
  const [loading, setLoading] = useState(false);

  const categories = [
    'All',
    'Cardiovascular',
    'Metabolic & Endocrine',
    'Respiratory',
    'Digestive & Gastric',
    'Neurological & Mental',
    'Musculoskeletal',
    'Infectious & Immune',
    'Dermatological',
    'Renal & Urology',
    'General Wellness'
  ];

  const filteredConditions = useMemo(() => {
    return ALL_50_CONDITIONS_LIST.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.overview.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.medicines.some(m => m.name.toLowerCase().includes(q)) ||
        item.diet.eat.some(e => e.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const quickPrompts = [
    "How to manage high blood pressure at home?",
    "What diet is best for Type 2 Diabetes?",
    "Fastest relief for Acid Reflux & Gastritis",
    "Home routine for Lower Back Pain"
  ];

  return (
    <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50/70 via-white to-amber-50/30 p-5 shadow-sm space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-teal-100 pb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-500/20">
            <Sparkles className="h-6 w-6 animate-pulse-subtle" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <span>Personalized Health & Care Suggestions</span>
              <span className="rounded-full bg-teal-100 text-teal-900 text-[10px] font-extrabold px-2.5 py-0.5 border border-teal-200">
                50 Health Solutions
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select or search any of 50 common health conditions for complete treatment, medicines, diet, routines & recovery plans.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="flex items-center space-x-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all border border-slate-200"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Search</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any health problem, disease, tablet, symptom (e.g. Migraine, Diabetes, Acid Reflux, Back Pain)..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-xs text-slate-900 shadow-xs focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold border transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 50 Health Conditions Catalog Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Found {filteredConditions.length} Health Care Solutions
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Click any card to view full medicines, diet & routines</span>
        </div>

        {filteredConditions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500 space-y-2">
            <Search className="h-8 w-8 text-slate-300 mx-auto" />
            <p className="font-bold text-slate-700">No matching health conditions found</p>
            <p className="text-slate-400">Try searching with broader terms like "headache", "fever", "pain", or "stomach".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredConditions.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedCondition(item);
                  setActiveDetailTab('medicines');
                }}
                className="cursor-pointer rounded-2xl bg-white p-4 border border-slate-200/90 hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{item.icon}</span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                        item.severity === 'Mild'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : item.severity === 'Moderate'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}
                    >
                      {item.severity}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs group-hover:text-teal-700 transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                      {item.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.overview}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600 group-hover:text-teal-700">
                  <span>View Full Treatment Plan</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Interactive AI Prompts */}
      <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 space-y-2">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span>Ask Health Assistant for Instant Guidance:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => onAskAI && onAskAI(prompt)}
              className="flex items-center space-x-1 text-[11px] font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-all"
            >
              <span>{prompt}</span>
              <ArrowRight className="h-3 w-3 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <div className="flex items-start space-x-2 rounded-xl bg-amber-50/80 p-3 border border-amber-200/80 text-[11px] text-amber-900">
        <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Medical Guidance Disclaimer:</strong> Health suggestions & treatment plans are provided for educational & wellness awareness. They do not replace formal clinical diagnosis by a licensed physician. Always follow instructions from your attending doctor.
        </div>
      </div>

      {/* DETAILED TREATMENT PLAN MODAL */}
      {selectedCondition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white p-6 shadow-2xl relative space-y-5 border border-slate-100 flex flex-col justify-between overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{selectedCondition.icon}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-extrabold text-lg text-slate-900">
                      {selectedCondition.name}
                    </h3>
                    <span className="rounded-full bg-teal-50 text-teal-800 text-[10px] font-extrabold px-2.5 py-0.5 border border-teal-200">
                      {selectedCondition.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                    {selectedCondition.overview}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCondition(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Section Tabs */}
            <div className="flex items-center space-x-2 overflow-x-auto border-b pb-2 custom-scrollbar shrink-0">
              {[
                { id: 'medicines', label: '💊 Tablets & Medicines', icon: <Pill className="h-3.5 w-3.5" /> },
                { id: 'diet', label: '🥗 Diet & Foods', icon: <Apple className="h-3.5 w-3.5" /> },
                { id: 'exercises', label: '🧘 Exercises & Meditation', icon: <Dumbbell className="h-3.5 w-3.5" /> },
                { id: 'routine', label: '🌅 Day & Night Routine', icon: <Sun className="h-3.5 w-3.5" /> },
                { id: 'recovery', label: '⏱️ Recovery Timeline', icon: <Clock className="h-3.5 w-3.5" /> },
                { id: 'doctor', label: '🏥 When to See Doctor', icon: <Stethoscope className="h-3.5 w-3.5" /> },
                { id: 'precautions', label: '⚠️ Precautions & Safety', icon: <ShieldCheck className="h-3.5 w-3.5" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDetailTab(tab.id as any)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    activeDetailTab === tab.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Modal Body Content Area */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar text-xs space-y-4 min-h-[300px]">
              {/* TAB 1: MEDICINES */}
              {activeDetailTab === 'medicines' && (
                <div className="space-y-3">
                  <div className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                    <Pill className="h-4 w-4 text-teal-600" />
                    <span>Recommended Medicines & Tablet Schedule</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedCondition.medicines.map((med, idx) => (
                      <div key={idx} className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 text-sm">{med.name}</span>
                          <span className="rounded-lg bg-teal-50 text-teal-700 font-bold text-[11px] px-2.5 py-1 border border-teal-200">
                            {med.dosage}
                          </span>
                        </div>
                        <div className="text-slate-700 font-medium">
                          <strong>Timing:</strong> {med.timing}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          <strong>Clinical Note:</strong> {med.note}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: DIET & FOODS */}
              {activeDetailTab === 'diet' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-emerald-50/70 p-4 border border-emerald-200 space-y-2">
                    <div className="font-bold text-emerald-950 text-sm flex items-center space-x-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Foods to Eat & Include</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-emerald-900 font-medium pl-1">
                      {selectedCondition.diet.eat.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-rose-50/70 p-4 border border-rose-200 space-y-2">
                    <div className="font-bold text-rose-950 text-sm flex items-center space-x-1.5">
                      <X className="h-4 w-4 text-rose-600" />
                      <span>Foods & Drinks to Avoid</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-rose-900 font-medium pl-1">
                      {selectedCondition.diet.avoid.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: EXERCISES & MEDITATION */}
              {activeDetailTab === 'exercises' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-cyan-50/70 p-4 border border-cyan-200 space-y-2">
                    <div className="font-bold text-cyan-950 text-sm flex items-center space-x-1.5">
                      <Dumbbell className="h-4 w-4 text-cyan-600" />
                      <span>Recommended Physical Exercises</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-cyan-900 font-medium pl-1">
                      {selectedCondition.exercisesAndMeditation.exercises.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-200 space-y-2">
                    <div className="font-bold text-amber-950 text-sm flex items-center space-x-1.5">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      <span>Meditation & Breathing Routines</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1.5 text-amber-900 font-medium pl-1">
                      {selectedCondition.exercisesAndMeditation.meditation.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 4: DAY & NIGHT ROUTINE */}
              {activeDetailTab === 'routine' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-amber-50/60 p-4 border border-amber-200 space-y-2">
                    <div className="font-bold text-amber-950 text-sm flex items-center space-x-1.5">
                      <Sun className="h-4 w-4 text-amber-600" />
                      <span>Morning & Afternoon Routine</span>
                    </div>
                    <ul className="space-y-2 text-amber-900 font-medium">
                      {selectedCondition.dayRoutine.map((item, idx) => (
                        <li key={idx} className="p-2 rounded-xl bg-white/80 border border-amber-100">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl bg-indigo-50/60 p-4 border border-indigo-200 space-y-2">
                    <div className="font-bold text-indigo-950 text-sm flex items-center space-x-1.5">
                      <Moon className="h-4 w-4 text-indigo-600" />
                      <span>Evening & Night Sleep Routine</span>
                    </div>
                    <ul className="space-y-2 text-indigo-900 font-medium">
                      {selectedCondition.nightRoutine.map((item, idx) => (
                        <li key={idx} className="p-2 rounded-xl bg-white/80 border border-indigo-100">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 5: RECOVERY TIMELINE */}
              {activeDetailTab === 'recovery' && (
                <div className="rounded-2xl bg-teal-50/80 p-5 border border-teal-200 space-y-3">
                  <div className="font-bold text-teal-950 text-sm flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-teal-600" />
                    <span>Expected Recovery Timeline & Prognosis</span>
                  </div>
                  <p className="text-teal-900 text-xs leading-relaxed font-medium bg-white p-4 rounded-xl border border-teal-100">
                    {selectedCondition.recoveryTimeline}
                  </p>
                </div>
              )}

              {/* TAB 6: WHEN TO SEE DOCTOR */}
              {activeDetailTab === 'doctor' && (
                <div className="rounded-2xl bg-rose-50/80 p-5 border border-rose-200 space-y-3">
                  <div className="font-bold text-rose-950 text-sm flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                    <span>Red Flag Symptoms — When to Consult Doctor Urgently</span>
                  </div>
                  <ul className="space-y-2 text-rose-900 font-medium">
                    {selectedCondition.whenToSeeDoctor.map((item, idx) => (
                      <li key={idx} className="p-3 rounded-xl bg-white border border-rose-100 flex items-start space-x-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* TAB 7: PRECAUTIONS */}
              {activeDetailTab === 'precautions' && (
                <div className="rounded-2xl bg-amber-50/80 p-5 border border-amber-200 space-y-3">
                  <div className="font-bold text-amber-950 text-sm flex items-center space-x-2">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                    <span>Essential Health Precautions & Contraindications</span>
                  </div>
                  <ul className="space-y-2 text-amber-900 font-medium">
                    {selectedCondition.precautions.map((item, idx) => (
                      <li key={idx} className="p-3 rounded-xl bg-white border border-amber-100 flex items-start space-x-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t pt-3 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-medium">
                Condition ID: {selectedCondition.id} • Smart Care Clinical Reference
              </span>
              <button
                onClick={() => setSelectedCondition(null)}
                className="rounded-xl bg-teal-600 px-6 py-2.5 text-xs font-bold text-white uppercase hover:bg-teal-700 shadow-md"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
