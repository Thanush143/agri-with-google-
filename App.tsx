
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Language, CropRecommendation, WeatherData, MarketData } from './types';
import { t } from './i18n';
import LanguageSelector from './components/LanguageSelector';
import CropDetails from './components/CropDetails';
import VoiceAssistant from './components/VoiceAssistant';
import MediaLab from './components/MediaLab';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [crops, setCrops] = useState<CropRecommendation[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<CropRecommendation | null>(null);
  const [sources, setSources] = useState<any[]>([]);

  const gemini = useRef(new GeminiService());

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (!navigator.geolocation) {
          setError(t(lang, 'noLocation'));
          setIsLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          
          // Mock weather for demo, in production we'd fetch from an API or use Gemini Search
          setWeather({
            temp: 28,
            humidity: 65,
            condition: 'Partly Cloudy',
            location: 'Nearby Fields'
          });

          const result = await gemini.current.getCropRecommendations(latitude, longitude, lang);
          setCrops(result.data);
          setSources(result.sources);
          setIsLoading(false);
        }, (err) => {
          setError(t(lang, 'noLocation'));
          setIsLoading(false);
        });
      } catch (e) {
        setError("Failed to consult AI experts. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [lang]);

  return (
    <Router>
      <div className="min-h-screen pb-24 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-40 px-4 py-4 md:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white text-2xl">🌾</div>
              <h1 className="text-xl font-bold text-green-800 tracking-tight">{t(lang, 'appName')}</h1>
            </div>
            <LanguageSelector currentLang={lang} onLanguageChange={setLang} />
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
          {/* Hero / Welcome */}
          <section className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">{t(lang, 'welcome')}</h2>
              <p className="opacity-90 text-lg">AI-powered suggestions based on your local weather and current market prices.</p>
            </div>
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </section>

          {/* Real-time Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-xl text-2xl">☀️</div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">{t(lang, 'weather')}</p>
                <p className="text-2xl font-bold text-gray-900">{weather?.temp}°C</p>
                <p className="text-sm text-gray-600">{weather?.condition}</p>
              </div>
            </div>
            
            <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 overflow-hidden">
              <div className="p-4 bg-orange-50 text-orange-600 rounded-xl text-2xl">📈</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase">{t(lang, 'marketPrices')}</p>
                <div className="flex gap-4 overflow-x-auto pb-2 mt-1 no-scrollbar">
                  {crops.slice(0, 3).map((c, i) => (
                    <div key={i} className="flex-shrink-0 bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">
                      <span className="font-bold text-gray-800">{c.name}</span>: <span className="text-green-600 font-medium">{c.marketPrice}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <section>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-green-600">🌱</span> {t(lang, 'recommendations')}
            </h3>
            
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 h-48 animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-700 p-8 rounded-2xl text-center border border-red-100">
                <p className="font-bold mb-2">Oops!</p>
                <p>{error}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {crops.map((crop, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedCrop(crop)}
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-green-400 hover:shadow-md transition-all cursor-pointer flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">{crop.name}</h4>
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                        {Math.round(crop.suitabilityScore * 100)}% Match
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{crop.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Market Price</p>
                        <p className="font-bold text-green-700">{crop.marketPrice}</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Media Lab for Image/Video functions */}
          <MediaLab lang={lang} />

          {/* Grounding Sources */}
          {sources.length > 0 && (
            <section className="bg-gray-100 rounded-2xl p-6 text-sm">
              <h4 className="font-bold text-gray-700 mb-2">Sources for Market Data:</h4>
              <ul className="space-y-1">
                {sources.map((chunk, i) => (
                  <li key={i}>
                    <a href={chunk.web?.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      🔗 {chunk.web?.title || 'Grounding Source'}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>

        {/* Global Components */}
        <VoiceAssistant />
        {selectedCrop && (
          <CropDetails 
            crop={selectedCrop} 
            lang={lang} 
            onClose={() => setSelectedCrop(null)} 
          />
        )}

        <footer className="bg-white border-t border-gray-100 py-8 px-4 text-center">
          <p className="text-gray-400 text-sm">© 2024 AgroSmart India • Empowering Farmers with AI</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
