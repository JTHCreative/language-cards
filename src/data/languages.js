// Registry of all available languages and their globe positions
import cantoneseVocabulary from './cantonese';

const languages = [
  {
    id: 'cantonese',
    data: cantoneseVocabulary,
    available: true,
  },
  {
    id: 'french',
    languageName: 'French',
    nativeName: 'Français',
    country: 'France',
    countryCode: 'FR',
    coordinates: { lat: 46.2276, lng: 2.2137 },
    available: false,
  },
  {
    id: 'spanish',
    languageName: 'Spanish',
    nativeName: 'Español',
    country: 'Spain',
    countryCode: 'ES',
    coordinates: { lat: 40.4637, lng: -3.7492 },
    available: false,
  },
  {
    id: 'japanese',
    languageName: 'Japanese',
    nativeName: '日本語',
    country: 'Japan',
    countryCode: 'JP',
    coordinates: { lat: 36.2048, lng: 138.2529 },
    available: false,
  },
  {
    id: 'mandarin',
    languageName: 'Mandarin',
    nativeName: '普通話',
    country: 'China',
    countryCode: 'CN',
    coordinates: { lat: 35.8617, lng: 104.1954 },
    available: false,
  },
  {
    id: 'korean',
    languageName: 'Korean',
    nativeName: '한국어',
    country: 'South Korea',
    countryCode: 'KR',
    coordinates: { lat: 35.9078, lng: 127.7669 },
    available: false,
  },
  {
    id: 'german',
    languageName: 'German',
    nativeName: 'Deutsch',
    country: 'Germany',
    countryCode: 'DE',
    coordinates: { lat: 51.1657, lng: 10.4515 },
    available: false,
  },
  {
    id: 'portuguese',
    languageName: 'Portuguese',
    nativeName: 'Português',
    country: 'Brazil',
    countryCode: 'BR',
    coordinates: { lat: -14.235, lng: -51.9253 },
    available: false,
  },
  {
    id: 'italian',
    languageName: 'Italian',
    nativeName: 'Italiano',
    country: 'Italy',
    countryCode: 'IT',
    coordinates: { lat: 41.8719, lng: 12.5674 },
    available: false,
  },
  {
    id: 'hindi',
    languageName: 'Hindi',
    nativeName: 'हिन्दी',
    country: 'India',
    countryCode: 'IN',
    coordinates: { lat: 20.5937, lng: 78.9629 },
    available: false,
  },
  {
    id: 'arabic',
    languageName: 'Arabic',
    nativeName: 'العربية',
    country: 'Egypt',
    countryCode: 'EG',
    coordinates: { lat: 26.8206, lng: 30.8025 },
    available: false,
  },
  {
    id: 'swahili',
    languageName: 'Swahili',
    nativeName: 'Kiswahili',
    country: 'Kenya',
    countryCode: 'KE',
    coordinates: { lat: -0.0236, lng: 37.9062 },
    available: false,
  },
];

export const getLanguageById = (id) => languages.find(l => l.id === id);

export const getAvailableLanguages = () => languages.filter(l => l.available);

export const getAllLanguages = () => languages;

export default languages;
