
import React, { useState, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { Language } from '../types';
import { t } from '../i18n';

interface Props {
  lang: Language;
}

const MediaLab: React.FC<Props> = ({ lang }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [resultMedia, setResultMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
  
  const gemini = useRef(new GeminiService());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    }
  };

  const processImage = async () => {
    if (!preview || !instruction) return;
    setIsProcessing(true);
    try {
      const base64 = preview.split(',')[1];
      const edited = await gemini.current.editCropImage(base64, instruction);
      if (edited) setResultMedia({ url: edited, type: 'image' });
    } finally {
      setIsProcessing(false);
    }
  };

  const processVideo = async () => {
    if (!preview || !instruction) return;
    
    // API KEY SELECTION CHECK for Veo
    if (!(window as any).aistudio?.hasSelectedApiKey?.()) {
        await (window as any).aistudio?.openSelectKey?.();
    }

    setIsProcessing(true);
    try {
      const base64 = preview.split(',')[1];
      const videoUrl = await gemini.current.generateEducationalVideo(base64, instruction);
      setResultMedia({ url: videoUrl, type: 'video' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-green-600">🎨</span> {t(lang, 'mediaLab')}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] hover:border-green-400 transition-colors">
            {preview ? (
              <img src={preview} className="max-h-[300px] rounded-lg object-contain" alt="Preview" />
            ) : (
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm text-gray-500">Upload crop photo for analysis or editing</p>
              </div>
            )}
            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
          </div>

          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder='e.g., "Analyze disease", "Add growth labels", "Animate growth"'
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none h-24"
          />

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={processImage}
              disabled={isProcessing || !preview}
              className="bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing...' : t(lang, 'editImage')}
            </button>
            <button
              onClick={processVideo}
              disabled={isProcessing || !preview}
              className="bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Animating...' : t(lang, 'generateVideo')}
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center justify-center">
          {resultMedia ? (
            <div className="w-full text-center">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">AI Result:</h4>
              {resultMedia.type === 'image' ? (
                <img src={resultMedia.url} className="w-full rounded-lg shadow-md" alt="Result" />
              ) : (
                <video src={resultMedia.url} controls className="w-full rounded-lg shadow-md" />
              )}
            </div>
          ) : (
            <p className="text-gray-400 italic">Results will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaLab;
