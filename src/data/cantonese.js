// Cantonese vocabulary database — 200 flashcards
// Jyutping romanization is used for pronunciation guides
// Organized into 4 difficulty tiers: Novice, Beginner, Advanced, Expert

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
      description: 'Survive your first day \u2014 polite phrases, numbers, essential food, and core pronouns.',
      categories: ['Polite Phrases', 'Numbers & Essential Time', 'Essential Food & Drink', 'Core Pronouns & People'],
    },
    {
      level: 'Beginner',
      description: 'Get around town \u2014 navigation, shopping, common actions, and basic descriptors.',
      categories: ['Navigation & Places', 'Shopping & Money', 'Common Actions', 'Basic Descriptors'],
    },
    {
      level: 'Advanced',
      description: 'Hold a real conversation \u2014 feelings, work vocabulary, connecting words, and time nuances.',
      categories: ['Feelings & Health', 'Work & Tech', 'Connecting Words', 'Time Nuances'],
    },
    {
      level: 'Expert',
      description: 'Sound like a local \u2014 slang, idioms, social etiquette, and abstract commentary.',
      categories: ['Slang & Particles', 'Four-Character Idioms', 'Social Etiquette', 'Abstract Commentary'],
    },
  ],

  categories: [
    // =====================================================
    // NOVICE — 50 Cards: "I Can Survive"
    // =====================================================
    {
      name: 'Polite Phrases',
      icon: '👋',
      words: [
        { english: 'Hello', target: '你好', pronunciation: 'nei5 hou2' },
        { english: 'Good morning', target: '早晨', pronunciation: 'zou2 san4' },
        { english: 'Goodbye', target: '再見', pronunciation: 'zoi3 gin3' },
        { english: 'Thank you (for a gift/favour)', target: '多謝', pronunciation: 'do1 ze6' },
        { english: 'Thank you (for a service)', target: '唔該', pronunciation: 'm4 goi1' },
        { english: 'Sorry', target: '對唔住', pronunciation: 'deoi3 m4 zyu6' },
        { english: "You're welcome", target: '唔使客氣', pronunciation: 'm4 sai2 haak3 hei3' },
        { english: 'Yes / Correct', target: '係', pronunciation: 'hai6' },
        { english: 'No / Not', target: '唔係', pronunciation: 'm4 hai6' },
        { english: "I don't understand", target: '我唔明', pronunciation: 'ngo5 m4 ming4' },
      ],
    },
    {
      name: 'Numbers & Essential Time',
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
        { english: 'Hundred', target: '百', pronunciation: 'baak3' },
        { english: 'Thousand', target: '千', pronunciation: 'cin1' },
        { english: 'Today', target: '今日', pronunciation: 'gam1 jat6' },
        { english: 'Now', target: '而家', pronunciation: 'ji4 gaa1' },
      ],
    },
    {
      name: 'Essential Food & Drink',
      icon: '🍜',
      words: [
        { english: 'Water', target: '水', pronunciation: 'seoi2' },
        { english: 'Tea', target: '茶', pronunciation: 'caa4' },
        { english: 'Coffee', target: '咖啡', pronunciation: 'gaa3 fe1' },
        { english: 'Rice (cooked)', target: '飯', pronunciation: 'faan6' },
        { english: 'Noodles', target: '麵', pronunciation: 'min6' },
        { english: 'Bread', target: '麵包', pronunciation: 'min6 baau1' },
        { english: 'Egg', target: '蛋', pronunciation: 'daan6' },
        { english: 'Chicken', target: '雞', pronunciation: 'gai1' },
        { english: 'Pork', target: '豬肉', pronunciation: 'zyu1 juk6' },
        { english: 'Beef', target: '牛肉', pronunciation: 'ngau4 juk6' },
        { english: 'Fish', target: '魚', pronunciation: 'jyu4' },
        { english: 'Vegetable', target: '菜', pronunciation: 'coi3' },
        { english: 'Fruit', target: '生果', pronunciation: 'saang1 gwo2' },
        { english: 'Dim sum', target: '點心', pronunciation: 'dim2 sam1' },
        { english: 'Delicious', target: '好食', pronunciation: 'hou2 sik6' },
      ],
    },
    {
      name: 'Core Pronouns & People',
      icon: '👨‍👩‍👧‍👦',
      words: [
        { english: 'I / Me', target: '我', pronunciation: 'ngo5' },
        { english: 'You', target: '你', pronunciation: 'nei5' },
        { english: 'He / Him', target: '佢', pronunciation: 'keoi5' },
        { english: 'She / Her', target: '佢', pronunciation: 'keoi5' },
        { english: 'We / Us', target: '我哋', pronunciation: 'ngo5 dei6' },
        { english: 'They / Them', target: '佢哋', pronunciation: 'keoi5 dei6' },
        { english: 'Father / Dad', target: '爸爸', pronunciation: 'baa4 baa1' },
        { english: 'Mother / Mom', target: '媽媽', pronunciation: 'maa4 maa1' },
        { english: 'Friend', target: '朋友', pronunciation: 'pang4 jau5' },
        { english: 'Person / People', target: '人', pronunciation: 'jan4' },
      ],
    },

    // =====================================================
    // BEGINNER — 50 Cards: "I Can Get Around"
    // =====================================================
    {
      name: 'Navigation & Places',
      icon: '🗺️',
      words: [
        { english: 'Left', target: '左', pronunciation: 'zo2' },
        { english: 'Right', target: '右', pronunciation: 'jau6' },
        { english: 'Straight ahead', target: '直行', pronunciation: 'zik6 haang4' },
        { english: 'MTR / Train', target: '地鐵', pronunciation: 'dei6 tit3' },
        { english: 'Bus', target: '巴士', pronunciation: 'baa1 si2' },
        { english: 'Taxi', target: '的士', pronunciation: 'dik1 si2' },
        { english: 'Airport', target: '機場', pronunciation: 'gei1 coeng4' },
        { english: 'Hotel', target: '酒店', pronunciation: 'zau2 dim3' },
        { english: 'Restaurant', target: '餐廳', pronunciation: 'caan1 teng1' },
        { english: 'Bathroom / Toilet', target: '洗手間', pronunciation: 'sai2 sau2 gaan1' },
        { english: 'Hospital', target: '醫院', pronunciation: 'ji1 jyun2' },
        { english: 'School', target: '學校', pronunciation: 'hok6 haau6' },
        { english: 'Here', target: '呢度', pronunciation: 'ni1 dou6' },
        { english: 'There', target: '嗰度', pronunciation: 'go2 dou6' },
        { english: 'Where?', target: '邊度？', pronunciation: 'bin1 dou6?' },
      ],
    },
    {
      name: 'Shopping & Money',
      icon: '🛒',
      words: [
        { english: 'How much? (price)', target: '幾多錢？', pronunciation: 'gei2 do1 cin2?' },
        { english: 'Money', target: '錢', pronunciation: 'cin2' },
        { english: 'Dollar (HKD)', target: '蚊', pronunciation: 'man1' },
        { english: 'Expensive', target: '貴', pronunciation: 'gwai3' },
        { english: 'Cheap', target: '平', pronunciation: 'peng4' },
        { english: 'To buy', target: '買', pronunciation: 'maai5' },
        { english: 'To sell', target: '賣', pronunciation: 'maai6' },
        { english: 'I want this', target: '我要呢個', pronunciation: 'ngo5 jiu3 ni1 go3' },
        { english: "I don't want", target: '我唔要', pronunciation: 'ngo5 m4 jiu3' },
        { english: 'This one', target: '呢個', pronunciation: 'ni1 go3' },
        { english: 'That one', target: '嗰個', pronunciation: 'go2 go3' },
        { english: 'Too expensive', target: '太貴', pronunciation: 'taai3 gwai3' },
        { english: 'Can it be cheaper?', target: '可唔可以平啲？', pronunciation: 'ho2 m4 ho2 ji5 peng4 di1?' },
        { english: 'Receipt', target: '收據', pronunciation: 'sau1 geoi3' },
        { english: 'Credit card', target: '信用卡', pronunciation: 'seon3 jung6 kaat1' },
      ],
    },
    {
      name: 'Common Actions',
      icon: '🏃',
      words: [
        { english: 'To go', target: '去', pronunciation: 'heoi3' },
        { english: 'To come', target: '嚟', pronunciation: 'lei4' },
        { english: 'To eat', target: '食', pronunciation: 'sik6' },
        { english: 'To drink', target: '飲', pronunciation: 'jam2' },
        { english: 'To see / look', target: '睇', pronunciation: 'tai2' },
        { english: 'To hear / listen', target: '聽', pronunciation: 'teng1' },
        { english: 'To sleep', target: '瞓覺', pronunciation: 'fan3 gaau3' },
        { english: 'To speak / say', target: '講', pronunciation: 'gong2' },
        { english: 'To walk', target: '行', pronunciation: 'haang4' },
        { english: 'To sit', target: '坐', pronunciation: 'co5' },
      ],
    },
    {
      name: 'Basic Descriptors',
      icon: '🎨',
      words: [
        { english: 'Big', target: '大', pronunciation: 'daai6' },
        { english: 'Small', target: '細', pronunciation: 'sai3' },
        { english: 'Hot (weather)', target: '熱', pronunciation: 'jit6' },
        { english: 'Cold', target: '凍', pronunciation: 'dung3' },
        { english: 'Very', target: '好', pronunciation: 'hou2' },
        { english: 'Good', target: '好', pronunciation: 'hou2' },
        { english: 'Red', target: '紅色', pronunciation: 'hung4 sik1' },
        { english: 'Blue', target: '藍色', pronunciation: 'laam4 sik1' },
        { english: 'Black', target: '黑色', pronunciation: 'hak1 sik1' },
        { english: 'White', target: '白色', pronunciation: 'baak6 sik1' },
      ],
    },

    // =====================================================
    // ADVANCED — 50 Cards: "I Can Converse"
    // =====================================================
    {
      name: 'Feelings & Health',
      icon: '❤️‍🩹',
      words: [
        { english: 'Happy', target: '開心', pronunciation: 'hoi1 sam1' },
        { english: 'Sad', target: '唔開心', pronunciation: 'm4 hoi1 sam1' },
        { english: 'Tired', target: '攰', pronunciation: 'gui6' },
        { english: 'Angry', target: '嬲', pronunciation: 'nau1' },
        { english: 'Worried', target: '擔心', pronunciation: 'daam1 sam1' },
        { english: 'Scared / Afraid', target: '驚', pronunciation: 'geng1' },
        { english: 'Sick / Ill', target: '病', pronunciation: 'beng6' },
        { english: 'Painful', target: '痛', pronunciation: 'tung3' },
        { english: 'Headache', target: '頭痛', pronunciation: 'tau4 tung3' },
        { english: 'Stomach ache', target: '肚痛', pronunciation: 'tou5 tung3' },
        { english: 'Head', target: '頭', pronunciation: 'tau4' },
        { english: 'Stomach / Belly', target: '肚', pronunciation: 'tou5' },
        { english: 'Heart', target: '心', pronunciation: 'sam1' },
        { english: 'To see a doctor', target: '睇醫生', pronunciation: 'tai2 ji1 sang1' },
        { english: 'Medicine', target: '藥', pronunciation: 'joek6' },
      ],
    },
    {
      name: 'Work & Tech',
      icon: '💻',
      words: [
        { english: 'Computer', target: '電腦', pronunciation: 'din6 nou5' },
        { english: 'Phone / Mobile', target: '電話', pronunciation: 'din6 waa2' },
        { english: 'Meeting', target: '開會', pronunciation: 'hoi1 wui2' },
        { english: 'Boss / Manager', target: '老闆', pronunciation: 'lou5 baan2' },
        { english: 'Colleague', target: '同事', pronunciation: 'tung4 si6' },
        { english: 'Office', target: '寫字樓', pronunciation: 'se2 zi6 lau2' },
        { english: 'To work', target: '做嘢', pronunciation: 'zou6 je5' },
        { english: 'To finish / complete', target: '做完', pronunciation: 'zou6 jyun4' },
        { english: 'To help', target: '幫', pronunciation: 'bong1' },
        { english: 'Email', target: '電郵', pronunciation: 'din6 jau4' },
        { english: 'Document', target: '文件', pronunciation: 'man4 gin2' },
        { english: 'To send', target: '寄', pronunciation: 'gei3' },
        { english: 'Internet', target: '互聯網', pronunciation: 'wu6 lyun4 mong5' },
        { english: 'Password', target: '密碼', pronunciation: 'mat6 maa5' },
        { english: 'To search', target: '搜尋', pronunciation: 'sau2 cam4' },
      ],
    },
    {
      name: 'Connecting Words',
      icon: '🔗',
      words: [
        { english: 'Because', target: '因為', pronunciation: 'jan1 wai6' },
        { english: 'But', target: '但係', pronunciation: 'daan6 hai6' },
        { english: 'Although', target: '雖然', pronunciation: 'seoi1 jin4' },
        { english: 'So / Therefore', target: '所以', pronunciation: 'so2 ji5' },
        { english: 'If', target: '如果', pronunciation: 'jyu4 gwo2' },
        { english: 'Then (sequence)', target: '然後', pronunciation: 'jin4 hau6' },
        { english: 'Also / Too', target: '都', pronunciation: 'dou1' },
        { english: 'Or', target: '定係', pronunciation: 'ding6 hai6' },
        { english: 'And (connecting nouns)', target: '同', pronunciation: 'tung4' },
        { english: 'Moreover / Furthermore', target: '而且', pronunciation: 'ji4 ce2' },
      ],
    },
    {
      name: 'Time Nuances',
      icon: '⏳',
      words: [
        { english: 'Already', target: '已經', pronunciation: 'ji5 ging1' },
        { english: 'Not yet', target: '未', pronunciation: 'mei6' },
        { english: 'Sometimes', target: '有時', pronunciation: 'jau5 si4' },
        { english: 'Usually / Normally', target: '通常', pronunciation: 'tung1 soeng4' },
        { english: 'Often', target: '成日', pronunciation: 'seng4 jat6' },
        { english: 'Never', target: '從來未', pronunciation: 'cung4 loi4 mei6' },
        { english: 'Just now', target: '頭先', pronunciation: 'tau4 sin1' },
        { english: 'Later', target: '遲啲', pronunciation: 'ci4 di1' },
        { english: 'Yesterday', target: '尋日', pronunciation: 'cam4 jat6' },
        { english: 'Tomorrow', target: '聽日', pronunciation: 'ting1 jat6' },
      ],
    },

    // =====================================================
    // EXPERT — 50 Cards: "I Can Sound Native"
    // =====================================================
    {
      name: 'Slang & Particles',
      icon: '🗣️',
      words: [
        { english: 'Particle: gentle assertion', target: '啦', pronunciation: 'laa1' },
        { english: 'Particle: obvious/emphasizing', target: '㗎', pronunciation: 'gaa3' },
        { english: 'Particle: of course / obviously', target: '囉', pronunciation: 'lo1' },
        { english: 'Particle: softening a statement', target: '啫', pronunciation: 'ze1' },
        { english: 'Particle: seeking agreement', target: '呀', pronunciation: 'aa3' },
        { english: 'Cool / Awesome', target: '正', pronunciation: 'zeng3' },
        { english: 'Annoying / Troublesome', target: '煩', pronunciation: 'faan4' },
        { english: 'Crazy / Ridiculous', target: '癲', pronunciation: 'din1' },
        { english: 'To show off', target: '晒命', pronunciation: 'saai3 meng6' },
        { english: 'Awesome / Impressive', target: '勁', pronunciation: 'ging6' },
        { english: 'Stingy / Cheap (person)', target: '孤寒', pronunciation: 'gu1 hon4' },
        { english: 'Clumsy / Useless', target: '論盡', pronunciation: 'leon6 zeon6' },
        { english: 'Whatever / Up to you', target: '隨便', pronunciation: 'ceoi4 bin6' },
        { english: 'No way! / Impossible!', target: '冇可能！', pronunciation: 'mou5 ho2 nang4!' },
        { english: "Don't bother", target: '唔使', pronunciation: 'm4 sai2' },
      ],
    },
    {
      name: 'Four-Character Idioms',
      icon: '📜',
      words: [
        { english: 'Learn something new daily', target: '日學一新', pronunciation: 'jat6 hok6 jat1 san1' },
        { english: 'One step at a time', target: '一步一腳印', pronunciation: 'jat1 bou6 jat1 goek3 jan3' },
        { english: 'Perseverance leads to success', target: '有志竟成', pronunciation: 'jau5 zi3 ging2 sing4' },
        { english: 'All in one go', target: '一氣呵成', pronunciation: 'jat1 hei3 ho1 sing4' },
        { english: 'Like a fish in water', target: '如魚得水', pronunciation: 'jyu4 jyu4 dak1 seoi2' },
        { english: 'Effortless / Easy', target: '易如反掌', pronunciation: 'ji6 jyu4 faan2 zoeng2' },
        { english: 'Unique / One of a kind', target: '獨一無二', pronunciation: 'duk6 jat1 mou4 ji6' },
        { english: 'To learn from the past', target: '前車可鑑', pronunciation: 'cin4 ce1 ho2 gaam3' },
        { english: 'Mutual benefit / Win-win', target: '互惠互利', pronunciation: 'wu6 wai6 wu6 lei6' },
        { english: 'Actions speak louder than words', target: '坐言起行', pronunciation: 'co5 jin4 hei2 haang4' },
        { english: 'Knowledge is power', target: '知識就是力量', pronunciation: 'zi1 sik1 zau6 si6 lik6 loeng6' },
        { english: 'Turn misfortune into blessing', target: '逢凶化吉', pronunciation: 'fung4 hung1 faa3 gat1' },
        { english: 'Heart and mind united', target: '同心協力', pronunciation: 'tung4 sam1 hip3 lik6' },
        { english: 'Perfectly matched', target: '天衣無縫', pronunciation: 'tin1 ji1 mou4 fung4' },
        { english: 'Seize the moment', target: '把握時機', pronunciation: 'baa2 aak1 si4 gei1' },
      ],
    },
    {
      name: 'Social Etiquette',
      icon: '🤝',
      words: [
        { english: 'To give face (show respect)', target: '俾面', pronunciation: 'bei2 min2' },
        { english: 'To lose face', target: '冇面', pronunciation: 'mou5 min2' },
        { english: 'Long time no see', target: '好耐冇見', pronunciation: 'hou2 noi6 mou5 gin3' },
        { english: 'Nice to meet you', target: '好高興認識你', pronunciation: 'hou2 gou1 hing3 jing6 sik1 nei5' },
        { english: 'Please take care', target: '保重', pronunciation: 'bou2 zung6' },
        { english: "Let's keep in touch", target: '保持聯絡', pronunciation: 'bou2 ci4 lyun4 lok3' },
        { english: 'May I ask...?', target: '請問...', pronunciation: 'cing2 man6...' },
        { english: 'I appreciate it', target: '感激', pronunciation: 'gam2 gik1' },
        { english: 'Congratulations', target: '恭喜', pronunciation: 'gung1 hei2' },
        { english: "I'm just being polite", target: '客氣啫', pronunciation: 'haak3 hei3 ze1' },
      ],
    },
    {
      name: 'Abstract Commentary',
      icon: '💡',
      words: [
        { english: 'Perspective / Viewpoint', target: '角度', pronunciation: 'gok3 dou6' },
        { english: 'Environment', target: '環境', pronunciation: 'waan4 ging2' },
        { english: 'Efficiency', target: '效率', pronunciation: 'haau6 leot2' },
        { english: 'Influence', target: '影響', pronunciation: 'jing2 hoeng2' },
        { english: 'Responsibility', target: '責任', pronunciation: 'zaak3 jam6' },
        { english: 'Experience', target: '經驗', pronunciation: 'ging1 jim6' },
        { english: 'Opportunity', target: '機會', pronunciation: 'gei1 wui6' },
        { english: 'Challenge', target: '挑戰', pronunciation: 'tiu1 zin3' },
        { english: 'Development', target: '發展', pronunciation: 'faat3 zin2' },
        { english: 'Quality', target: '質素', pronunciation: 'zat1 sou3' },
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
