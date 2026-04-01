// Registry of all available languages and their globe positions
import cantoneseVocabulary from './cantonese';

const languages = [
  {
    id: 'cantonese',
    data: cantoneseVocabulary,
    flag: '\u{1F1ED}\u{1F1F0}',
    available: true,
  },
  {
    id: 'french',
    languageName: 'French',
    nativeName: 'Fran\u00e7ais',
    country: 'France',
    countryCode: 'FR',
    flag: '\u{1F1EB}\u{1F1F7}',
    coordinates: { lat: 46.2276, lng: 2.2137 },
    available: false,
  },
  {
    id: 'spanish',
    languageName: 'Spanish',
    nativeName: 'Espa\u00f1ol',
    country: 'Spain',
    countryCode: 'ES',
    flag: '\u{1F1EA}\u{1F1F8}',
    coordinates: { lat: 40.4637, lng: -3.7492 },
    available: false,
  },
  {
    id: 'japanese',
    languageName: 'Japanese',
    nativeName: '\u65E5\u672C\u8A9E',
    country: 'Japan',
    countryCode: 'JP',
    flag: '\u{1F1EF}\u{1F1F5}',
    coordinates: { lat: 36.2048, lng: 138.2529 },
    available: false,
  },
  {
    id: 'mandarin',
    languageName: 'Mandarin',
    nativeName: '\u666E\u901A\u8A71',
    country: 'China',
    countryCode: 'CN',
    flag: '\u{1F1E8}\u{1F1F3}',
    coordinates: { lat: 35.8617, lng: 104.1954 },
    available: false,
  },
  {
    id: 'korean',
    languageName: 'Korean',
    nativeName: '\uD55C\uAD6D\uC5B4',
    country: 'South Korea',
    countryCode: 'KR',
    flag: '\u{1F1F0}\u{1F1F7}',
    coordinates: { lat: 35.9078, lng: 127.7669 },
    available: false,
  },
  {
    id: 'german',
    languageName: 'German',
    nativeName: 'Deutsch',
    country: 'Germany',
    countryCode: 'DE',
    flag: '\u{1F1E9}\u{1F1EA}',
    coordinates: { lat: 51.1657, lng: 10.4515 },
    available: false,
  },
  {
    id: 'portuguese',
    languageName: 'Portuguese',
    nativeName: 'Portugu\u00eas',
    country: 'Brazil',
    countryCode: 'BR',
    flag: '\u{1F1E7}\u{1F1F7}',
    coordinates: { lat: -14.235, lng: -51.9253 },
    available: false,
  },
  {
    id: 'italian',
    languageName: 'Italian',
    nativeName: 'Italiano',
    country: 'Italy',
    countryCode: 'IT',
    flag: '\u{1F1EE}\u{1F1F9}',
    coordinates: { lat: 41.8719, lng: 12.5674 },
    available: false,
  },
  {
    id: 'hindi',
    languageName: 'Hindi',
    nativeName: '\u0939\u093F\u0928\u094D\u0926\u0940',
    country: 'India',
    countryCode: 'IN',
    flag: '\u{1F1EE}\u{1F1F3}',
    coordinates: { lat: 20.5937, lng: 78.9629 },
    available: false,
  },
  {
    id: 'arabic',
    languageName: 'Arabic',
    nativeName: '\u0627\u0644\u0639\u0631\u0628\u064A\u0629',
    country: 'Egypt',
    countryCode: 'EG',
    flag: '\u{1F1EA}\u{1F1EC}',
    coordinates: { lat: 26.8206, lng: 30.8025 },
    available: false,
  },
  {
    id: 'swahili',
    languageName: 'Swahili',
    nativeName: 'Kiswahili',
    country: 'Kenya',
    countryCode: 'KE',
    flag: '\u{1F1F0}\u{1F1EA}',
    coordinates: { lat: -0.0236, lng: 37.9062 },
    available: false,
  },
];

export const getLanguageById = (id) => languages.find(l => l.id === id);

export const getAvailableLanguages = () => languages.filter(l => l.available);

export const getAllLanguages = () => languages;

export default languages;
