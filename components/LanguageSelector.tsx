
import React from 'react';
import { Language } from '../types';

interface Props {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSelector: React.FC<Props> = ({ currentLang, onLanguageChange }) => {
  const languages = [
    { code: Language.EN, label: 'English' },
    { code: Language.HI, label: 'हिन्दी' },
    { code: Language.TE, label: 'తెలుగు' },
    { code: Language.TA, label: 'தமிழ்' },
    { code: Language.MR, label: 'मराठी' }
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onLanguageChange(lang.code)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            currentLang === lang.code
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
