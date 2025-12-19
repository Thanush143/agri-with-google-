
export enum Language {
  EN = 'en',
  HI = 'hi',
  TE = 'te',
  TA = 'ta',
  MR = 'mr'
}

export interface CropRecommendation {
  name: string;
  scientificName: string;
  expectedYield: string;
  marketPrice: string;
  suitabilityScore: number;
  description: string;
  roadmap: Step[];
  image: string;
}

export interface Step {
  title: string;
  duration: string;
  tasks: string[];
}

export interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  location: string;
}

export interface MarketData {
  crop: string;
  price: string;
  trend: 'up' | 'down' | 'stable';
  source: string;
}
