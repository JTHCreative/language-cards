// Cantonese vocabulary database
// Jyutping romanization is used for pronunciation guides
// Categories: numbers, days, animals, people, professions, greetings, food, colors, body, common phrases

const cantoneseVocabulary = {
  languageCode: 'yue',       // ISO 639-3 for Cantonese
  languageName: 'Cantonese',
  nativeName: '廣東話',
  country: 'Hong Kong',
  countryCode: 'HK',
  coordinates: { lat: 22.3193, lng: 114.1694 },

  description: 'Cantonese is a tonal language spoken by over 85 million people worldwide, primarily in the Guangdong province of southern China, Hong Kong, and Macau. Unlike Mandarin which has 4 tones, Cantonese has 6 tones \u2014 making it one of the most melodic and expressive Chinese dialects. It is the language of iconic Hong Kong cinema, Cantopop music, and a rich literary tradition. Cantonese preserves many features of ancient Chinese that have been lost in Mandarin, and its cuisine \u2014 including dim sum and roast meats \u2014 is celebrated globally. Learning Cantonese opens the door to a vibrant culture that blends traditional Chinese heritage with modern cosmopolitan life.',

  difficulties: [
    {
      level: 'Novice',
      description: 'Start with the basics \u2014 numbers, greetings, and simple everyday words.',
      categories: ['Numbers', 'Greetings & Phrases', 'Colors'],
    },
    {
      level: 'Beginner',
      description: 'Build your foundation with family, food, and the days of the week.',
      categories: ['Days of the Week', 'People & Family', 'Food & Drink'],
    },
    {
      level: 'Advanced',
      description: 'Expand into animals, body parts, and useful professions vocabulary.',
      categories: ['Animals', 'Body Parts', 'Professions'],
    },
    {
      level: 'Expert',
      description: 'Challenge yourself with all categories including verbs and full phrases.',
      categories: ['Common Verbs', 'Numbers', 'Days of the Week', 'Animals', 'People & Family', 'Professions', 'Greetings & Phrases', 'Food & Drink', 'Colors', 'Body Parts'],
    },
  ],

  categories: [
    {
      name: 'Numbers',
      icon: '🔢',
      words: [
        { english: 'Zero', target: '零', pronunciation: 'ling4' },
        { english: 'One', target: '一', pronunciation: 'jat1' },
        { english: 'Two', target: '二', pronunciation: 'ji6' },
        { english: 'Three', target: '三', pronunciation: 'saam1' },
        { english: 'Four', target: '四', pronunciation: 'sei3' },
        { english: 'Five', target: '五', pronunciation: 'ng5' },
        { english: 'Six', target: '六', pronunciation: 'luk6' },
        { english: 'Seven', target: '七', pronunciation: 'cat1' },
        { english: 'Eight', target: '八', pronunciation: 'baat3' },
        { english: 'Nine', target: '九', pronunciation: 'gau2' },
        { english: 'Ten', target: '十', pronunciation: 'sap6' },
      ],
    },
    {
      name: 'Days of the Week',
      icon: '📅',
      words: [
        { english: 'Monday', target: '星期一', pronunciation: 'sing1 kei4 jat1' },
        { english: 'Tuesday', target: '星期二', pronunciation: 'sing1 kei4 ji6' },
        { english: 'Wednesday', target: '星期三', pronunciation: 'sing1 kei4 saam1' },
        { english: 'Thursday', target: '星期四', pronunciation: 'sing1 kei4 sei3' },
        { english: 'Friday', target: '星期五', pronunciation: 'sing1 kei4 ng5' },
        { english: 'Saturday', target: '星期六', pronunciation: 'sing1 kei4 luk6' },
        { english: 'Sunday', target: '星期日', pronunciation: 'sing1 kei4 jat6' },
      ],
    },
    {
      name: 'Animals',
      icon: '🐾',
      words: [
        { english: 'Dog', target: '狗', pronunciation: 'gau2' },
        { english: 'Cat', target: '貓', pronunciation: 'maau1' },
        { english: 'Bird', target: '雀', pronunciation: 'zoek3' },
        { english: 'Fish', target: '魚', pronunciation: 'jyu4' },
        { english: 'Horse', target: '馬', pronunciation: 'maa5' },
        { english: 'Pig', target: '豬', pronunciation: 'zyu1' },
        { english: 'Cow', target: '牛', pronunciation: 'ngau4' },
        { english: 'Chicken', target: '雞', pronunciation: 'gai1' },
        { english: 'Dragon', target: '龍', pronunciation: 'lung4' },
        { english: 'Snake', target: '蛇', pronunciation: 'se4' },
      ],
    },
    {
      name: 'People & Family',
      icon: '👨‍👩‍👧‍👦',
      words: [
        { english: 'Person', target: '人', pronunciation: 'jan4' },
        { english: 'Father', target: '爸爸', pronunciation: 'baa4 baa1' },
        { english: 'Mother', target: '媽媽', pronunciation: 'maa4 maa1' },
        { english: 'Older brother', target: '哥哥', pronunciation: 'go4 go1' },
        { english: 'Older sister', target: '家姐', pronunciation: 'gaa1 ze1' },
        { english: 'Younger brother', target: '細佬', pronunciation: 'sai3 lou2' },
        { english: 'Younger sister', target: '妹妹', pronunciation: 'mui6 mui2' },
        { english: 'Friend', target: '朋友', pronunciation: 'pang4 jau5' },
        { english: 'Child', target: '小朋友', pronunciation: 'siu2 pang4 jau5' },
        { english: 'Husband', target: '老公', pronunciation: 'lou5 gung1' },
        { english: 'Wife', target: '老婆', pronunciation: 'lou5 po4' },
      ],
    },
    {
      name: 'Professions',
      icon: '💼',
      words: [
        { english: 'Teacher', target: '老師', pronunciation: 'lou5 si1' },
        { english: 'Doctor', target: '醫生', pronunciation: 'ji1 sang1' },
        { english: 'Student', target: '學生', pronunciation: 'hok6 saang1' },
        { english: 'Police officer', target: '警察', pronunciation: 'ging2 caat3' },
        { english: 'Chef / Cook', target: '廚師', pronunciation: 'cyu4 si1' },
        { english: 'Driver', target: '司機', pronunciation: 'si1 gei1' },
        { english: 'Lawyer', target: '律師', pronunciation: 'leot6 si1' },
        { english: 'Nurse', target: '護士', pronunciation: 'wu6 si6' },
        { english: 'Engineer', target: '工程師', pronunciation: 'gung1 cing4 si1' },
        { english: 'Boss', target: '老闆', pronunciation: 'lou5 baan2' },
      ],
    },
    {
      name: 'Greetings & Phrases',
      icon: '👋',
      words: [
        { english: 'Hello', target: '你好', pronunciation: 'nei5 hou2' },
        { english: 'Good morning', target: '早晨', pronunciation: 'zou2 san4' },
        { english: 'Goodbye', target: '再見', pronunciation: 'zoi3 gin3' },
        { english: 'Thank you', target: '多謝 / 唔該', pronunciation: 'do1 ze6 / m4 goi1' },
        { english: "You're welcome", target: '唔使客氣', pronunciation: 'm4 sai2 haak3 hei3' },
        { english: 'Sorry', target: '對唔住', pronunciation: 'deoi3 m4 zyu6' },
        { english: 'Excuse me', target: '唔好意思', pronunciation: 'm4 hou2 ji3 si1' },
        { english: 'How are you?', target: '你好嗎？', pronunciation: 'nei5 hou2 maa3?' },
        { english: 'My name is...', target: '我叫...', pronunciation: 'ngo5 giu3...' },
        { english: 'I don\'t understand', target: '我唔明', pronunciation: 'ngo5 m4 ming4' },
        { english: 'Please', target: '唔該', pronunciation: 'm4 goi1' },
      ],
    },
    {
      name: 'Food & Drink',
      icon: '🍜',
      words: [
        { english: 'Rice', target: '飯', pronunciation: 'faan6' },
        { english: 'Noodles', target: '麵', pronunciation: 'min6' },
        { english: 'Water', target: '水', pronunciation: 'seoi2' },
        { english: 'Tea', target: '茶', pronunciation: 'caa4' },
        { english: 'Dim sum', target: '點心', pronunciation: 'dim2 sam1' },
        { english: 'Egg', target: '蛋', pronunciation: 'daan6' },
        { english: 'Fruit', target: '生果', pronunciation: 'saang1 gwo2' },
        { english: 'Meat', target: '肉', pronunciation: 'juk6' },
        { english: 'Vegetable', target: '菜', pronunciation: 'coi3' },
        { english: 'Milk', target: '牛奶', pronunciation: 'ngau4 naai5' },
      ],
    },
    {
      name: 'Colors',
      icon: '🎨',
      words: [
        { english: 'Red', target: '紅色', pronunciation: 'hung4 sik1' },
        { english: 'Blue', target: '藍色', pronunciation: 'laam4 sik1' },
        { english: 'Green', target: '綠色', pronunciation: 'luk6 sik1' },
        { english: 'Yellow', target: '黃色', pronunciation: 'wong4 sik1' },
        { english: 'White', target: '白色', pronunciation: 'baak6 sik1' },
        { english: 'Black', target: '黑色', pronunciation: 'hak1 sik1' },
        { english: 'Orange', target: '橙色', pronunciation: 'caang2 sik1' },
        { english: 'Purple', target: '紫色', pronunciation: 'zi2 sik1' },
        { english: 'Pink', target: '粉紅色', pronunciation: 'fan2 hung4 sik1' },
        { english: 'Gold', target: '金色', pronunciation: 'gam1 sik1' },
      ],
    },
    {
      name: 'Body Parts',
      icon: '🫀',
      words: [
        { english: 'Head', target: '頭', pronunciation: 'tau4' },
        { english: 'Eye', target: '眼', pronunciation: 'ngaan5' },
        { english: 'Ear', target: '耳', pronunciation: 'ji5' },
        { english: 'Mouth', target: '口', pronunciation: 'hau2' },
        { english: 'Hand', target: '手', pronunciation: 'sau2' },
        { english: 'Foot', target: '腳', pronunciation: 'goek3' },
        { english: 'Heart', target: '心', pronunciation: 'sam1' },
        { english: 'Nose', target: '鼻', pronunciation: 'bei6' },
      ],
    },
    {
      name: 'Common Verbs',
      icon: '🏃',
      words: [
        { english: 'To eat', target: '食', pronunciation: 'sik6' },
        { english: 'To drink', target: '飲', pronunciation: 'jam2' },
        { english: 'To go', target: '去', pronunciation: 'heoi3' },
        { english: 'To come', target: '嚟', pronunciation: 'lei4' },
        { english: 'To want', target: '要', pronunciation: 'jiu3' },
        { english: 'To have', target: '有', pronunciation: 'jau5' },
        { english: 'To say / speak', target: '講', pronunciation: 'gong2' },
        { english: 'To see / look', target: '睇', pronunciation: 'tai2' },
        { english: 'To buy', target: '買', pronunciation: 'maai5' },
        { english: 'To love', target: '愛', pronunciation: 'oi3' },
        { english: 'To know', target: '知道', pronunciation: 'zi1 dou3' },
        { english: 'To work', target: '做嘢', pronunciation: 'zou6 je5' },
      ],
    },
  ],
};

// Flatten all words with category info for easy access
export const getAllWords = () => {
  const allWords = [];
  cantoneseVocabulary.categories.forEach(category => {
    category.words.forEach(word => {
      allWords.push({ ...word, category: category.name });
    });
  });
  return allWords;
};

export const getCategories = () => cantoneseVocabulary.categories;

export const getWordsByCategory = (categoryName) => {
  const category = cantoneseVocabulary.categories.find(c => c.name === categoryName);
  return category ? category.words : [];
};

export default cantoneseVocabulary;
