
import React from 'react';
import { CropRecommendation, Language } from '../types';
import { t } from '../i18n';

interface Props {
  crop: CropRecommendation;
  lang: Language;
  onClose: () => void;
}

const CropDetails: React.FC<Props> = ({ crop, lang, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b flex justify-between items-center bg-green-50">
          <div>
            <h2 className="text-2xl font-bold text-green-900">{crop.name}</h2>
            <p className="text-sm text-green-700 italic">{crop.scientificName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-green-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <span className="text-green-600">📊</span> {t(lang, 'roadmap')}
            </h3>
            <div className="relative border-l-2 border-green-200 ml-3 space-y-8">
              {crop.roadmap.map((step, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-[-9px] top-1 w-4 h-4 bg-green-600 rounded-full border-4 border-white"></div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-800">{step.title}</h4>
                      <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                        {step.duration}
                      </span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                      {step.tasks.map((task, tidx) => (
                        <li key={tidx}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <p className="text-xs text-orange-600 font-semibold uppercase">{t(lang, 'currentPrice')}</p>
              <p className="text-lg font-bold text-orange-900">{crop.marketPrice}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold uppercase">Est. Yield</p>
              <p className="text-lg font-bold text-blue-900">{crop.expectedYield}</p>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed">{crop.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CropDetails;
