import React, { useState } from 'react';
import { AICDSResult } from '../../types';
import { authApi } from '../../services/api';
import { Sparkles, AlertTriangle, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';

interface AIClinicalSuggestionCardProps {
  symptoms: string;
  history?: string;
  allergies?: string;
}

export const AIClinicalSuggestionCard: React.FC<AIClinicalSuggestionCardProps> = ({
  symptoms,
  history = 'None recorded',
  allergies = 'Penicillin'
}) => {
  const [cdsData, setCdsData] = useState<AICDSResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCDS = async () => {
    setLoading(true);
    try {
      const res = await authApi.postAIClinicalSuggestion({
        symptoms,
        history,
        allergies
      });
      setCdsData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/60 via-white to-teal-50/40 p-5 shadow-sm">
      {/* Mandatory Required Disclaimer Header Banner */}
      <div className="flex items-center justify-between border-b border-amber-200/80 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
              AI Suggestion — Doctor Review Required
            </h4>
            <p className="text-[10px] text-amber-700">Clinical decision support recommendation (non-automated)</p>
          </div>
        </div>
        <button
          onClick={fetchCDS}
          disabled={loading}
          className="flex items-center space-x-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50 transition-all shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Analyzing...' : 'Run AI CDS Analysis'}</span>
        </button>
      </div>

      {!cdsData ? (
        <div className="text-center py-6 text-xs text-slate-500 font-medium">
          Click "Run AI CDS Analysis" to evaluate symptoms ({symptoms || 'None'}) against patient history & allergy contraindications.
        </div>
      ) : (
        <div className="space-y-3 text-xs">
          <div className="rounded-xl bg-white p-3 border border-slate-200">
            <span className="font-semibold text-slate-800">Clinical Summary: </span>
            <span className="text-slate-600">{cdsData.summary}</span>
          </div>

          {/* Risk Alerts */}
          {cdsData.risk_alerts.length > 0 && (
            <div className="rounded-xl bg-red-50 p-3 border border-red-200">
              <div className="flex items-center space-x-1.5 text-red-800 font-bold mb-1">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span>Risk & Critical Alerts</span>
              </div>
              <ul className="list-disc list-inside text-red-700 space-y-1 pl-1">
                {cdsData.risk_alerts.map((alert, i) => (
                  <li key={i}>{alert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Allergy Warnings */}
          {cdsData.allergy_warnings.length > 0 && (
            <div className="rounded-xl bg-amber-50 p-3 border border-amber-200">
              <div className="flex items-center space-x-1.5 text-amber-800 font-bold mb-1">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <span>Allergy Contraindication Warnings</span>
              </div>
              <ul className="list-disc list-inside text-amber-800 space-y-1 pl-1">
                {cdsData.allergy_warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Considerations */}
          <div className="rounded-xl bg-teal-50/70 p-3 border border-teal-200">
            <div className="flex items-center space-x-1.5 text-teal-900 font-bold mb-1">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              <span>Recommended Follow-up Considerations</span>
            </div>
            <ul className="list-disc list-inside text-teal-800 space-y-1 pl-1">
              {cdsData.clinical_considerations.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
