// Japanese vocabulary database — 150 flashcards
// Romaji romanization is used for pronunciation guides
// Organized into 4 difficulty tiers: Novice, Beginner, Advanced, Expert

const japaneseVocabulary = {
  languageCode: 'ja',
  languageName: 'Japanese',
  nativeName: '日本語',
  country: 'Japan',
  countryCode: 'JP',
  coordinates: { lat: 36.2048, lng: 138.2529 },

  description: 'Japanese is spoken by over 125 million people and is the primary language of Japan. It uses three writing systems: Hiragana and Katakana (phonetic alphabets of 46 characters each) and Kanji (characters borrowed from Chinese, numbering in the thousands). Japanese is known for its levels of politeness — the same sentence can be said in casual, polite, or honorific forms depending on social context. From anime and manga to cutting-edge technology and centuries-old traditions like tea ceremony and calligraphy, learning Japanese opens a window into one of the world\'s most fascinating cultures.',

  difficulties: [
    {
      level: 'Novice',
      description: 'Survive your first day \u2014 greetings, numbers, essential food, and core pronouns.',
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
      description: 'Sound like a local \u2014 casual speech, proverbs, social etiquette, and abstract commentary.',
      categories: ['Casual Speech & Slang', 'Proverbs & Sayings', 'Social Etiquette', 'Abstract Commentary'],
    },
  ],

  categories: [
    // =====================================================
    // NOVICE — ~38 Cards: "I Can Survive"
    // =====================================================
    {
      name: 'Polite Phrases',
      icon: '👋',
      words: [
        { english: 'Hello (general)', target: 'こんにちは', pronunciation: 'konnichiwa' },
        { english: 'Good morning', target: 'おはようございます', pronunciation: 'ohayou gozaimasu' },
        { english: 'Good evening', target: 'こんばんは', pronunciation: 'konbanwa' },
        { english: 'Goodbye', target: 'さようなら', pronunciation: 'sayounara' },
        { english: 'See you later', target: 'またね', pronunciation: 'mata ne' },
        { english: 'Thank you', target: 'ありがとうございます', pronunciation: 'arigatou gozaimasu' },
        { english: 'Thank you (casual)', target: 'ありがとう', pronunciation: 'arigatou' },
        { english: "You're welcome", target: 'どういたしまして', pronunciation: 'dou itashimashite' },
        { english: 'Excuse me / Sorry', target: 'すみません', pronunciation: 'sumimasen' },
        { english: 'Sorry (apology)', target: 'ごめんなさい', pronunciation: 'gomen nasai' },
        { english: 'Yes', target: 'はい', pronunciation: 'hai' },
        { english: 'No', target: 'いいえ', pronunciation: 'iie' },
        { english: 'Please', target: 'お願いします', pronunciation: 'onegai shimasu' },
        { english: "I don't understand", target: '分かりません', pronunciation: 'wakarimasen' },
      ],
    },
    {
      name: 'Numbers & Essential Time',
      icon: '🔢',
      words: [
        { english: 'One', target: '一', pronunciation: 'ichi' },
        { english: 'Two', target: '二', pronunciation: 'ni' },
        { english: 'Three', target: '三', pronunciation: 'san' },
        { english: 'Four', target: '四', pronunciation: 'shi / yon' },
        { english: 'Five', target: '五', pronunciation: 'go' },
        { english: 'Six', target: '六', pronunciation: 'roku' },
        { english: 'Seven', target: '七', pronunciation: 'shichi / nana' },
        { english: 'Eight', target: '八', pronunciation: 'hachi' },
        { english: 'Nine', target: '九', pronunciation: 'kyuu / ku' },
        { english: 'Ten', target: '十', pronunciation: 'juu' },
        { english: 'Today', target: '今日', pronunciation: 'kyou' },
        { english: 'Now', target: '今', pronunciation: 'ima' },
      ],
    },
    {
      name: 'Essential Food & Drink',
      icon: '🍣',
      words: [
        { english: 'Water', target: '水', pronunciation: 'mizu' },
        { english: 'Tea (green)', target: 'お茶', pronunciation: 'ocha' },
        { english: 'Coffee', target: 'コーヒー', pronunciation: 'koohii' },
        { english: 'Beer', target: 'ビール', pronunciation: 'biiru' },
        { english: 'Rice (cooked)', target: 'ご飯', pronunciation: 'gohan' },
        { english: 'Sushi', target: '寿司', pronunciation: 'sushi' },
        { english: 'Ramen', target: 'ラーメン', pronunciation: 'raamen' },
        { english: 'Fish', target: '魚', pronunciation: 'sakana' },
        { english: 'Meat', target: '肉', pronunciation: 'niku' },
        { english: 'Egg', target: '卵', pronunciation: 'tamago' },
        { english: 'Vegetable', target: '野菜', pronunciation: 'yasai' },
        { english: 'Delicious', target: 'おいしい', pronunciation: 'oishii' },
      ],
    },
    {
      name: 'Core Pronouns & People',
      icon: '👨‍👩‍👧‍👦',
      words: [
        { english: 'I (polite)', target: '私', pronunciation: 'watashi' },
        { english: 'You', target: 'あなた', pronunciation: 'anata' },
        { english: 'He / That person', target: '彼', pronunciation: 'kare' },
        { english: 'She / That person', target: '彼女', pronunciation: 'kanojo' },
        { english: 'We', target: '私たち', pronunciation: 'watashitachi' },
        { english: 'Father', target: 'お父さん', pronunciation: 'otousan' },
        { english: 'Mother', target: 'お母さん', pronunciation: 'okaasan' },
        { english: 'Friend', target: '友達', pronunciation: 'tomodachi' },
        { english: 'Person', target: '人', pronunciation: 'hito' },
        { english: 'Child', target: '子供', pronunciation: 'kodomo' },
      ],
    },

    // =====================================================
    // BEGINNER — ~38 Cards: "I Can Get Around"
    // =====================================================
    {
      name: 'Navigation & Places',
      icon: '🗺️',
      words: [
        { english: 'Left', target: '左', pronunciation: 'hidari' },
        { english: 'Right', target: '右', pronunciation: 'migi' },
        { english: 'Straight ahead', target: 'まっすぐ', pronunciation: 'massugu' },
        { english: 'Train', target: '電車', pronunciation: 'densha' },
        { english: 'Bus', target: 'バス', pronunciation: 'basu' },
        { english: 'Taxi', target: 'タクシー', pronunciation: 'takushii' },
        { english: 'Airport', target: '空港', pronunciation: 'kuukou' },
        { english: 'Hotel', target: 'ホテル', pronunciation: 'hoteru' },
        { english: 'Restaurant', target: 'レストラン', pronunciation: 'resutoran' },
        { english: 'Bathroom / Toilet', target: 'トイレ', pronunciation: 'toire' },
        { english: 'Station', target: '駅', pronunciation: 'eki' },
        { english: 'Where is...?', target: '...はどこですか？', pronunciation: '...wa doko desu ka?' },
      ],
    },
    {
      name: 'Shopping & Money',
      icon: '🛒',
      words: [
        { english: 'How much is it?', target: 'いくらですか？', pronunciation: 'ikura desu ka?' },
        { english: 'Money', target: 'お金', pronunciation: 'okane' },
        { english: 'Yen', target: '円', pronunciation: 'en' },
        { english: 'Expensive', target: '高い', pronunciation: 'takai' },
        { english: 'Cheap', target: '安い', pronunciation: 'yasui' },
        { english: 'To buy', target: '買う', pronunciation: 'kau' },
        { english: 'I want this', target: 'これが欲しいです', pronunciation: 'kore ga hoshii desu' },
        { english: 'This one', target: 'これ', pronunciation: 'kore' },
        { english: 'That one (near you)', target: 'それ', pronunciation: 'sore' },
        { english: 'That one (over there)', target: 'あれ', pronunciation: 'are' },
      ],
    },
    {
      name: 'Common Actions',
      icon: '🏃',
      words: [
        { english: 'To go', target: '行く', pronunciation: 'iku' },
        { english: 'To come', target: '来る', pronunciation: 'kuru' },
        { english: 'To eat', target: '食べる', pronunciation: 'taberu' },
        { english: 'To drink', target: '飲む', pronunciation: 'nomu' },
        { english: 'To see / look', target: '見る', pronunciation: 'miru' },
        { english: 'To hear / listen', target: '聞く', pronunciation: 'kiku' },
        { english: 'To sleep', target: '寝る', pronunciation: 'neru' },
        { english: 'To speak / talk', target: '話す', pronunciation: 'hanasu' },
        { english: 'To read', target: '読む', pronunciation: 'yomu' },
        { english: 'To write', target: '書く', pronunciation: 'kaku' },
      ],
    },
    {
      name: 'Basic Descriptors',
      icon: '🎨',
      words: [
        { english: 'Big', target: '大きい', pronunciation: 'ookii' },
        { english: 'Small', target: '小さい', pronunciation: 'chiisai' },
        { english: 'Hot (weather)', target: '暑い', pronunciation: 'atsui' },
        { english: 'Cold (weather)', target: '寒い', pronunciation: 'samui' },
        { english: 'Good / Nice', target: 'いい', pronunciation: 'ii' },
        { english: 'Bad', target: '悪い', pronunciation: 'warui' },
        { english: 'New', target: '新しい', pronunciation: 'atarashii' },
        { english: 'Old (things)', target: '古い', pronunciation: 'furui' },
      ],
    },

    // =====================================================
    // ADVANCED — ~38 Cards: "I Can Converse"
    // =====================================================
    {
      name: 'Feelings & Health',
      icon: '❤️‍🩹',
      words: [
        { english: 'Happy', target: '嬉しい', pronunciation: 'ureshii' },
        { english: 'Sad', target: '悲しい', pronunciation: 'kanashii' },
        { english: 'Tired', target: '疲れた', pronunciation: 'tsukareta' },
        { english: 'Angry', target: '怒っている', pronunciation: 'okotte iru' },
        { english: 'Scared', target: '怖い', pronunciation: 'kowai' },
        { english: 'Sick / Ill', target: '病気', pronunciation: 'byouki' },
        { english: 'Headache', target: '頭痛', pronunciation: 'zutsuu' },
        { english: 'Stomach ache', target: '腹痛', pronunciation: 'fukutsuu' },
        { english: 'Doctor', target: '医者', pronunciation: 'isha' },
        { english: 'Medicine', target: '薬', pronunciation: 'kusuri' },
      ],
    },
    {
      name: 'Work & Tech',
      icon: '💻',
      words: [
        { english: 'Computer', target: 'パソコン', pronunciation: 'pasokon' },
        { english: 'Phone / Mobile', target: '携帯', pronunciation: 'keitai' },
        { english: 'Meeting', target: '会議', pronunciation: 'kaigi' },
        { english: 'Company', target: '会社', pronunciation: 'kaisha' },
        { english: 'Boss / Manager', target: '上司', pronunciation: 'joushi' },
        { english: 'Colleague', target: '同僚', pronunciation: 'douryou' },
        { english: 'Office', target: 'オフィス', pronunciation: 'ofisu' },
        { english: 'To work', target: '働く', pronunciation: 'hataraku' },
        { english: 'Email', target: 'メール', pronunciation: 'meeru' },
        { english: 'Internet', target: 'インターネット', pronunciation: 'intaanetto' },
      ],
    },
    {
      name: 'Connecting Words',
      icon: '🔗',
      words: [
        { english: 'Because', target: 'なぜなら', pronunciation: 'nazenara' },
        { english: 'But', target: 'でも', pronunciation: 'demo' },
        { english: 'So / Therefore', target: 'だから', pronunciation: 'dakara' },
        { english: 'If', target: 'もし', pronunciation: 'moshi' },
        { english: 'Then / After that', target: 'それから', pronunciation: 'sorekara' },
        { english: 'Also / Too', target: 'も', pronunciation: 'mo' },
        { english: 'Or', target: 'または', pronunciation: 'matawa' },
        { english: 'However', target: 'しかし', pronunciation: 'shikashi' },
        { english: 'Actually / In fact', target: '実は', pronunciation: 'jitsu wa' },
      ],
    },
    {
      name: 'Time Nuances',
      icon: '⏳',
      words: [
        { english: 'Already', target: 'もう', pronunciation: 'mou' },
        { english: 'Not yet', target: 'まだ', pronunciation: 'mada' },
        { english: 'Sometimes', target: '時々', pronunciation: 'tokidoki' },
        { english: 'Usually', target: '普通', pronunciation: 'futsuu' },
        { english: 'Often', target: 'よく', pronunciation: 'yoku' },
        { english: 'Yesterday', target: '昨日', pronunciation: 'kinou' },
        { english: 'Tomorrow', target: '明日', pronunciation: 'ashita' },
        { english: 'Later', target: '後で', pronunciation: 'ato de' },
        { english: 'Soon', target: 'もうすぐ', pronunciation: 'mou sugu' },
      ],
    },

    // =====================================================
    // EXPERT — ~36 Cards: "I Can Sound Native"
    // =====================================================
    {
      name: 'Casual Speech & Slang',
      icon: '🗣️',
      words: [
        { english: 'Really? / Seriously?', target: 'マジ？', pronunciation: 'maji?' },
        { english: 'Amazing / Awesome', target: 'すごい', pronunciation: 'sugoi' },
        { english: 'Cute', target: 'かわいい', pronunciation: 'kawaii' },
        { english: 'Cool / Stylish', target: 'かっこいい', pronunciation: 'kakkoii' },
        { english: 'No way!', target: 'うそ！', pronunciation: 'uso!' },
        { english: 'I\'m so tired (casual)', target: 'もうだめ', pronunciation: 'mou dame' },
        { english: 'Whatever / It\'s fine', target: '別にいい', pronunciation: 'betsu ni ii' },
        { english: 'Gross / Disgusting', target: 'キモい', pronunciation: 'kimoi' },
        { english: 'Annoying', target: 'うざい', pronunciation: 'uzai' },
      ],
    },
    {
      name: 'Proverbs & Sayings',
      icon: '📜',
      words: [
        { english: 'Practice makes perfect', target: '習うより慣れろ', pronunciation: 'narau yori narero' },
        { english: 'Time is money', target: '時は金なり', pronunciation: 'toki wa kane nari' },
        { english: 'Even monkeys fall from trees', target: '猿も木から落ちる', pronunciation: 'saru mo ki kara ochiru' },
        { english: 'Failure is the mother of success', target: '失敗は成功のもと', pronunciation: 'shippai wa seikou no moto' },
        { english: 'A journey of a thousand miles begins with a single step', target: '千里の道も一歩から', pronunciation: 'senri no michi mo ippo kara' },
        { english: 'Strike while the iron is hot', target: '鉄は熱いうちに打て', pronunciation: 'tetsu wa atsui uchi ni ute' },
        { english: 'The nail that sticks out gets hammered', target: '出る杭は打たれる', pronunciation: 'deru kui wa utareru' },
        { english: 'Seeing is believing', target: '百聞は一見にしかず', pronunciation: 'hyakubun wa ikken ni shikazu' },
        { english: 'Where there\'s a will, there\'s a way', target: '為せば成る', pronunciation: 'naseba naru' },
      ],
    },
    {
      name: 'Social Etiquette',
      icon: '🤝',
      words: [
        { english: 'Nice to meet you', target: 'はじめまして', pronunciation: 'hajimemashite' },
        { english: 'Thank you for the meal (before)', target: 'いただきます', pronunciation: 'itadakimasu' },
        { english: 'Thank you for the meal (after)', target: 'ごちそうさまでした', pronunciation: 'gochisousama deshita' },
        { english: 'Welcome (to a shop)', target: 'いらっしゃいませ', pronunciation: 'irasshaimase' },
        { english: 'I\'ll do my best', target: '頑張ります', pronunciation: 'ganbarimasu' },
        { english: 'Good luck / Do your best', target: '頑張って', pronunciation: 'ganbatte' },
        { english: 'Excuse me for leaving first', target: 'お先に失礼します', pronunciation: 'osaki ni shitsurei shimasu' },
        { english: 'Take care', target: 'お気をつけて', pronunciation: 'oki wo tsukete' },
        { english: 'I\'m home', target: 'ただいま', pronunciation: 'tadaima' },
        { english: 'Welcome home', target: 'おかえり', pronunciation: 'okaeri' },
      ],
    },
    {
      name: 'Abstract Commentary',
      icon: '💡',
      words: [
        { english: 'Freedom', target: '自由', pronunciation: 'jiyuu' },
        { english: 'Peace', target: '平和', pronunciation: 'heiwa' },
        { english: 'Experience', target: '経験', pronunciation: 'keiken' },
        { english: 'Opportunity', target: '機会', pronunciation: 'kikai' },
        { english: 'Responsibility', target: '責任', pronunciation: 'sekinin' },
        { english: 'Culture', target: '文化', pronunciation: 'bunka' },
        { english: 'Environment', target: '環境', pronunciation: 'kankyou' },
        { english: 'Effort', target: '努力', pronunciation: 'doryoku' },
      ],
    },
  ],
};

// Flatten all words with category info for easy access
export const getAllWords = () => {
  const allWords = [];
  japaneseVocabulary.categories.forEach(category => {
    category.words.forEach(word => {
      allWords.push({ ...word, category: category.name });
    });
  });
  return allWords;
};

export const getCategories = () => japaneseVocabulary.categories;

export const getWordsByCategory = (categoryName) => {
  const category = japaneseVocabulary.categories.find(c => c.name === categoryName);
  return category ? category.words : [];
};

export default japaneseVocabulary;
