
import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';

const VoiceAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const gemini = useRef(new GeminiService());
  const sessionRef = useRef<any>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const decodeAudio = async (base64: string) => {
    if (!audioContextRef.current) return;
    
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    
    const dataInt16 = new Int16Array(bytes.buffer);
    const buffer = audioContextRef.current.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const startSession = async () => {
    setIsConnecting(true);
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    sessionRef.current = await gemini.current.connectVoiceAssistant({
      onopen: () => {
        setIsActive(true);
        setIsConnecting(false);
        const source = audioContextRef.current!.createMediaStreamSource(stream);
        const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = (e) => {
          const input = e.inputBuffer.getChannelData(0);
          const int16 = new Int16Array(input.length);
          for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
          
          let binary = '';
          const bytes = new Uint8Array(int16.buffer);
          for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
          
          sessionRef.current.then((session: any) => {
            session.sendRealtimeInput({
              media: { data: btoa(binary), mimeType: 'audio/pcm;rate=16000' }
            });
          });
        };
        source.connect(processor);
        processor.connect(audioContextRef.current!.destination);
      },
      onmessage: async (msg: any) => {
        const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (audioData && audioContextRef.current) {
          const buffer = await decodeAudio(audioData);
          if (buffer) {
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
        }
        if (msg.serverContent?.interrupted) {
          sourcesRef.current.forEach(s => s.stop());
          sourcesRef.current.clear();
          nextStartTimeRef.current = 0;
        }
      },
      onerror: () => setIsActive(false),
      onclose: () => setIsActive(false)
    });
  };

  const stopSession = () => {
    // Basic cleanup
    setIsActive(false);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={isActive ? stopSession : startSession}
        disabled={isConnecting}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isActive ? 'bg-red-500 scale-110 animate-pulse' : 'bg-green-600 hover:bg-green-700'
        } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isConnecting ? (
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : isActive ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
      {isActive && (
        <div className="absolute bottom-20 right-0 bg-white p-4 rounded-lg shadow-xl w-64 text-center border border-green-100">
          <p className="text-sm font-semibold text-green-800">AgroDost is listening...</p>
          <p className="text-xs text-gray-500 mt-1">Ask: "What is the price of Wheat today?"</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
