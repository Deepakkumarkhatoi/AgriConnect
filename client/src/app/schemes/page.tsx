'use client';

import React, { useState } from 'react';
import { FALLBACK_DATA } from '../../lib/api';
import {
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function SchemesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(['sc1', 'sc2']);

  // Eligibility Checker State
  const [showChecker, setShowChecker] = useState(false);
  const [farmerLandAcres, setFarmerLandAcres] = useState<number>(3.5);
  const [farmerState, setFarmerState] = useState<string>('Odisha');
  const [farmerHasKcc, setFarmerHasKcc] = useState<boolean>(true);
  const [evaluatedResults, setEvaluatedResults] = useState<any[] | null>(null);

  const rawSchemes = FALLBACK_DATA.schemes;

  const categories = ['All', 'Financial', 'Insurance', 'Irrigation'];
  const states = ['All', 'All-India', 'Odisha'];

  const filteredSchemes = rawSchemes.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesState = selectedState === 'All' || item.state === selectedState || item.state === 'All-India';
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.benefits.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesState && matchesSearch;
  });

  const toggleSave = (id: string) => {
    if (savedSchemeIds.includes(id)) {
      setSavedSchemeIds(savedSchemeIds.filter((sId) => sId !== id));
    } else {
      setSavedSchemeIds([...savedSchemeIds, id]);
    }
  };

  const handleEvaluateEligibility = () => {
    const results = rawSchemes.map((scheme) => {
      const rules = scheme.eligibilityRules || {};
      let isEligible = true;
      const reasons: string[] = [];

      // Land rules
      if (rules.minLandAcres !== undefined && farmerLandAcres < rules.minLandAcres) {
        isEligible = false;
        reasons.push(`Minimum land required is ${rules.minLandAcres} acres (You have ${farmerLandAcres})`);
      }
      if (rules.maxLandAcres !== undefined && farmerLandAcres > rules.maxLandAcres) {
        isEligible = false;
        reasons.push(`Scheme restricted to small/marginal holders with max ${rules.maxLandAcres} acres`);
      }

      // State rules
      if (rules.allowedStates && rules.allowedStates.length > 0) {
        if (!rules.allowedStates.includes(farmerState)) {
          isEligible = false;
          reasons.push(`Restricted to residents of: ${rules.allowedStates.join(', ')}`);
        }
      }

      if (isEligible) {
        reasons.push('Meets land holding & state residence criteria');
      }

      return {
        scheme,
        isEligible,
        reasons,
      };
    });

    setEvaluatedResults(results);
    setShowChecker(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-green-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-semibold backdrop-blur-md">
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Direct Benefit Transfer & Welfare Portal</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">Government Scheme Discovery</h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl">
              Browse verified central and state welfare initiatives. Use our rule-based eligibility evaluator to match with schemes suited to your farm size and region.
            </p>
          </div>

          <button
            onClick={() => setShowChecker(!showChecker)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs sm:text-sm shadow-lg transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{showChecker ? 'Hide Eligibility Checker' : 'Test My Eligibility Now'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Rule-Based Eligibility Checker Box */}
      {showChecker && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-lg space-y-6 animate-in fade-in duration-300">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Rule-Based Eligibility Checker</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter your farm profile details below to instantly evaluate rules against active government schemes.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Automated Rules Evaluator
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Total Farm Land (Acres)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={farmerLandAcres}
                onChange={(e) => setFarmerLandAcres(Number(e.target.value))}
                className="w-full text-xs font-bold p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Farmer State</label>
              <select
                value={farmerState}
                onChange={(e) => setFarmerState(e.target.value)}
                className="w-full text-xs font-bold p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="Odisha">Odisha</option>
                <option value="Haryana">Haryana</option>
                <option value="Punjab">Punjab</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Other">Other State</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Kisan Credit Card (KCC)</label>
              <select
                value={farmerHasKcc ? 'yes' : 'no'}
                onChange={(e) => setFarmerHasKcc(e.target.value === 'yes')}
                className="w-full text-xs font-bold p-2.5 bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="yes">Yes — Active KCC Account</option>
                <option value="no">No — No KCC yet</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleEvaluateEligibility}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition"
          >
            Run Rule Evaluation
          </button>

          {evaluatedResults && (
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Evaluation Matches for {farmerLandAcres} Acres in {farmerState}:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluatedResults.map((res) => (
                  <div
                    key={res.scheme._id}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      res.isEligible
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                        : 'bg-stone-50 border-stone-200 text-stone-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900">{res.scheme.title}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          res.isEligible ? 'bg-emerald-200 text-emerald-900' : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {res.isEligible ? 'Likely Eligible' : 'Criteria Not Met'}
                      </span>
                    </div>
                    <ul className="text-[11px] list-disc list-inside space-y-0.5">
                      {res.reasons.map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legal Disclaimer Alert */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Preliminary Guidance Notice:</strong> Eligibility results are advisory calculations based on published program parameters. Final sanction depends on official verification of revenue records (Patta / RoR) by your District Nodal Agency.
            </span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Filter by Jurisdiction</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-300 rounded-xl px-3 py-2"
            >
              {states.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Search Keyword</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. subsidy, PM-KISAN, insurance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scheme Cards Directory */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900">
          Showing {filteredSchemes.length} Schemes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => {
            const isSaved = savedSchemeIds.includes(scheme._id);

            return (
              <div
                key={scheme._id}
                className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                          {scheme.category}
                        </span>
                        <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md">
                          {scheme.state}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-stone-900 mt-2">{scheme.title}</h3>
                    </div>

                    <button
                      onClick={() => toggleSave(scheme._id)}
                      className={`p-2 rounded-xl transition ${
                        isSaved
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                      title={isSaved ? 'Saved to your shortlist' : 'Save to shortlist'}
                    >
                      {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{scheme.description}</p>

                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-950">
                    <p className="font-bold mb-0.5">Direct Benefit:</p>
                    <p>{scheme.benefits}</p>
                  </div>

                  {/* Documents Required Checklist */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Required Documentation:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {scheme.documentsRequired.map((doc, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200"
                        >
                          ✓ {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">Deadline: {scheme.deadline}</span>
                  <a
                    href={scheme.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                  >
                    <span>Visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
