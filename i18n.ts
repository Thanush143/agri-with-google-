
import { Language } from './types';

const translations: Record<Language, Record<string, string>> = {
  [Language.EN]: {
    appName: "AgroSmart India",
    welcome: "Welcome back, Farmer!",
    recommendations: "Crop Recommendations",
    weather: "Local Weather",
    marketPrices: "Market Prices",
    voiceAssistant: "Agro Voice Assistant",
    mediaLab: "Media Lab",
    roadmap: "Cultivation Roadmap",
    searchPlaceholder: "Ask about crops, prices, or weather...",
    editImage: "Edit Crop Image",
    generateVideo: "Create Farm Video",
    loading: "Consulting AI Experts...",
    noLocation: "Please enable location to get local data.",
    currentPrice: "Current Price",
    trend: "Market Trend"
  },
  [Language.HI]: {
    appName: "एग्रोस्मार्ट इंडिया",
    welcome: "नमस्ते किसान भाई!",
    recommendations: "फसल सिफारिशें",
    weather: "स्थानीय मौसम",
    marketPrices: "बाजार भाव",
    voiceAssistant: "एग्रो वॉइस असिस्टेंट",
    mediaLab: "मीडिया लैब",
    roadmap: "खेती का रोडमैप",
    searchPlaceholder: "फसलों, कीमतों या मौसम के बारे में पूछें...",
    editImage: "फसल छवि संपादित करें",
    generateVideo: "फार्म वीडियो बनाएं",
    loading: "AI विशेषज्ञों से परामर्श...",
    noLocation: "स्थानीय डेटा के लिए स्थान सक्षम करें।",
    currentPrice: "वर्तमान मूल्य",
    trend: "बाजार का रुझान"
  },
  [Language.TE]: {
    appName: "అగ్రోస్మార్ట్ ఇండియా",
    welcome: "స్వాగతం, రైతు సోదరా!",
    recommendations: "పంట సిఫార్సులు",
    weather: "స్థానిక వాతావరణం",
    marketPrices: "మార్కెట్ ధరలు",
    voiceAssistant: "అగ్రో వాయిస్ అసిస్టెంట్",
    mediaLab: "మీడియా ల్యాబ్",
    roadmap: "సాగు ప్రణాళిక",
    searchPlaceholder: "పంటలు, ధరలు లేదా వాతావరణం గురించి అడగండి...",
    editImage: "పంట చిత్రాన్ని ఎడిట్ చేయండి",
    generateVideo: "ఫామ్ వీడియోను సృష్టించండి",
    loading: "AI నిపుణులతో సంప్రదిస్తున్నాము...",
    noLocation: "స్థానిక డేటా కోసం లొకేషన్ ఎనేబుల్ చేయండి.",
    currentPrice: "ప్రస్తుత ధర",
    trend: "మార్కెట్ ధోరణి"
  },
  [Language.TA]: {
    appName: "அக்ரோஸ்மார்ட் இந்தியா",
    welcome: "வரவேற்கிறோம், விவசாயி நண்பரே!",
    recommendations: "பயிர் பரிந்துரைகள்",
    weather: "உள்ளூர் வானிலை",
    marketPrices: "சந்தை விலைகள்",
    voiceAssistant: "அக்ரோ குரல் உதவியாளர்",
    mediaLab: "ஊடக ஆய்வகம்",
    roadmap: "சாகுபடி வரைபடம்",
    searchPlaceholder: "பயிர்கள், விலைகள் அல்லது வானிலை பற்றி கேளுங்கள்...",
    editImage: "பயிர் படத்தை மாற்றவும்",
    generateVideo: "பண்ணை வீடியோவை உருவாக்கவும்",
    loading: "AI நிபுணர்களுடன் ஆலோசிக்கிறோம்...",
    noLocation: "உள்ளூர் தரவைப் பெற இருப்பிடத்தை இயக்கவும்.",
    currentPrice: "தற்போதைய விலை",
    trend: "சந்தை போக்கு"
  },
  [Language.MR]: {
    appName: "अ‍ॅग्रोस्मार्ट इंडिया",
    welcome: "स्वागत आहे, शेतकरी मित्र!",
    recommendations: "पीक शिफारसी",
    weather: "स्थानिक हवामान",
    marketPrices: "बाजार भाव",
    voiceAssistant: "अ‍ॅग्रो व्हॉइस असिस्टंट",
    mediaLab: "मीडिया लॅब",
    roadmap: "शेतीचा रोडमॅप",
    searchPlaceholder: "पिके, किंमती किंवा हवामानाबद्दल विचारा...",
    editImage: "पीक प्रतिमा संपादित करा",
    generateVideo: "फार्म व्हिडिओ तयार करा",
    loading: "AI तज्ञांचा सल्ला घेत आहे...",
    noLocation: "स्थानिक डेटासाठी लोकेशन सक्षम करा.",
    currentPrice: "चालू किंमत",
    trend: "बाजार कल"
  }
};

export const t = (lang: Language, key: string): string => {
  return translations[lang]?.[key] || translations[Language.EN][key] || key;
};
