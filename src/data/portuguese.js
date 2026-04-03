// Brazilian Portuguese vocabulary database — 100 flashcards
// Organized into 4 difficulty tiers: Novice, Beginner, Advanced, Expert

const portugueseVocabulary = {
  languageCode: 'pt-BR',
  languageName: 'Portuguese',
  nativeName: 'Português',
  country: 'Brazil',
  countryCode: 'BR',
  coordinates: { lat: -14.235, lng: -51.9253 },

  description: 'Brazilian Portuguese is spoken by over 210 million people in Brazil, making it the largest Portuguese-speaking country in the world. It differs from European Portuguese in pronunciation, vocabulary, and grammar — often described as warmer and more melodic. Brazil\'s cultural exports — from bossa nova and samba to telenovelas and football — have made Brazilian Portuguese one of the most widely studied languages globally. Learning it opens the door to South America\'s largest economy and one of the world\'s most diverse and vibrant cultures.',

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
      description: 'Sound like a local \u2014 slang, expressions, social etiquette, and abstract commentary.',
      categories: ['Slang & Expressions', 'Common Idioms', 'Social Etiquette', 'Abstract Commentary'],
    },
  ],

  categories: [
    // =====================================================
    // NOVICE — 25 Cards: "I Can Survive"
    // =====================================================
    {
      name: 'Polite Phrases',
      icon: '👋',
      words: [
        { english: 'Hello / Hi', target: 'Oi', pronunciation: 'oy' },
        { english: 'Good morning', target: 'Bom dia', pronunciation: 'bong JEE-ah' },
        { english: 'Good afternoon', target: 'Boa tarde', pronunciation: 'BOH-ah TAR-jee' },
        { english: 'Good evening / Good night', target: 'Boa noite', pronunciation: 'BOH-ah NOY-chee' },
        { english: 'Goodbye / Bye', target: 'Tchau', pronunciation: 'chow' },
        { english: 'Please', target: 'Por favor', pronunciation: 'por fah-VOR' },
        { english: 'Thank you (male speaker)', target: 'Obrigado', pronunciation: 'oh-bree-GAH-doo' },
        { english: 'Thank you (female speaker)', target: 'Obrigada', pronunciation: 'oh-bree-GAH-dah' },
        { english: "You're welcome", target: 'De nada', pronunciation: 'jee NAH-dah' },
        { english: 'Sorry / Excuse me', target: 'Desculpa', pronunciation: 'jees-KOOL-pah' },
      ],
    },
    {
      name: 'Numbers & Essential Time',
      icon: '🔢',
      words: [
        { english: 'One', target: 'Um', pronunciation: 'oong' },
        { english: 'Two', target: 'Dois', pronunciation: 'doysh' },
        { english: 'Three', target: 'Três', pronunciation: 'trehsh' },
        { english: 'Four', target: 'Quatro', pronunciation: 'KWAH-troo' },
        { english: 'Five', target: 'Cinco', pronunciation: 'SEEN-koo' },
        { english: 'Six', target: 'Seis', pronunciation: 'saysh' },
        { english: 'Seven', target: 'Sete', pronunciation: 'SEH-chee' },
        { english: 'Eight', target: 'Oito', pronunciation: 'OY-too' },
        { english: 'Nine', target: 'Nove', pronunciation: 'NOH-vee' },
        { english: 'Ten', target: 'Dez', pronunciation: 'dehz' },
      ],
    },
    {
      name: 'Essential Food & Drink',
      icon: '🍽️',
      words: [
        { english: 'Water', target: 'Água', pronunciation: 'AH-gwah' },
        { english: 'Coffee', target: 'Café', pronunciation: 'kah-FEH' },
        { english: 'Beer', target: 'Cerveja', pronunciation: 'ser-VEH-zhah' },
        { english: 'Rice', target: 'Arroz', pronunciation: 'ah-HOHZ' },
        { english: 'Beans', target: 'Feijão', pronunciation: 'fay-ZHOWNG' },
        { english: 'Meat', target: 'Carne', pronunciation: 'KAR-nee' },
        { english: 'Chicken', target: 'Frango', pronunciation: 'FRAN-goo' },
        { english: 'Bread', target: 'Pão', pronunciation: 'powng' },
        { english: 'Cheese', target: 'Queijo', pronunciation: 'KAY-zhoo' },
        { english: 'Delicious', target: 'Gostoso', pronunciation: 'gos-TOH-zoo' },
      ],
    },
    {
      name: 'Core Pronouns & People',
      icon: '👨‍👩‍👧‍👦',
      words: [
        { english: 'I', target: 'Eu', pronunciation: 'eh-oo' },
        { english: 'You (informal)', target: 'Você', pronunciation: 'voh-SEH' },
        { english: 'He', target: 'Ele', pronunciation: 'EH-lee' },
        { english: 'She', target: 'Ela', pronunciation: 'EH-lah' },
        { english: 'We', target: 'Nós', pronunciation: 'nohsh' },
        { english: 'They (male/mixed)', target: 'Eles', pronunciation: 'EH-leez' },
        { english: 'They (female)', target: 'Elas', pronunciation: 'EH-lahz' },
        { english: 'Father / Dad', target: 'Pai', pronunciation: 'pie' },
        { english: 'Mother / Mom', target: 'Mãe', pronunciation: 'myng' },
        { english: 'Friend (male)', target: 'Amigo', pronunciation: 'ah-MEE-goo' },
      ],
    },

    // =====================================================
    // BEGINNER — 25 Cards: "I Can Get Around"
    // =====================================================
    {
      name: 'Navigation & Places',
      icon: '🗺️',
      words: [
        { english: 'Left', target: 'Esquerda', pronunciation: 'esh-KEHR-dah' },
        { english: 'Right', target: 'Direita', pronunciation: 'jee-RAY-tah' },
        { english: 'Straight ahead', target: 'Em frente', pronunciation: 'eng FREN-chee' },
        { english: 'Bus', target: 'Ônibus', pronunciation: 'OH-nee-boosh' },
        { english: 'Airport', target: 'Aeroporto', pronunciation: 'ah-eh-roh-POR-too' },
        { english: 'Hotel', target: 'Hotel', pronunciation: 'oh-TEW' },
        { english: 'Restaurant', target: 'Restaurante', pronunciation: 'hes-tow-RAN-chee' },
        { english: 'Bathroom', target: 'Banheiro', pronunciation: 'bah-NYAY-roo' },
        { english: 'Hospital', target: 'Hospital', pronunciation: 'ohs-pee-TAW' },
        { english: 'Where is...?', target: 'Onde fica...?', pronunciation: 'OHN-jee FEE-kah?' },
      ],
    },
    {
      name: 'Shopping & Money',
      icon: '🛒',
      words: [
        { english: 'How much does it cost?', target: 'Quanto custa?', pronunciation: 'KWAN-too KOOS-tah?' },
        { english: 'Money', target: 'Dinheiro', pronunciation: 'jeen-YAY-roo' },
        { english: 'Expensive', target: 'Caro', pronunciation: 'KAH-roo' },
        { english: 'Cheap', target: 'Barato', pronunciation: 'bah-RAH-too' },
        { english: 'To buy', target: 'Comprar', pronunciation: 'kohm-PRAR' },
        { english: 'I want this', target: 'Eu quero isso', pronunciation: 'eh-oo KEH-roo EE-soo' },
      ],
    },
    {
      name: 'Common Actions',
      icon: '🏃',
      words: [
        { english: 'To go', target: 'Ir', pronunciation: 'eer' },
        { english: 'To eat', target: 'Comer', pronunciation: 'koh-MEHR' },
        { english: 'To drink', target: 'Beber', pronunciation: 'beh-BEHR' },
        { english: 'To sleep', target: 'Dormir', pronunciation: 'dor-MEER' },
        { english: 'To speak', target: 'Falar', pronunciation: 'fah-LAR' },
        { english: 'To walk', target: 'Andar', pronunciation: 'an-DAR' },
      ],
    },
    {
      name: 'Basic Descriptors',
      icon: '🎨',
      words: [
        { english: 'Big', target: 'Grande', pronunciation: 'GRAN-jee' },
        { english: 'Small', target: 'Pequeno', pronunciation: 'peh-KEH-noo' },
        { english: 'Hot', target: 'Quente', pronunciation: 'KEN-chee' },
        { english: 'Cold', target: 'Frio', pronunciation: 'FREE-oo' },
        { english: 'Good', target: 'Bom', pronunciation: 'bohng' },
        { english: 'Bad', target: 'Ruim', pronunciation: 'hoo-EENG' },
        { english: 'Beautiful', target: 'Bonito', pronunciation: 'boh-NEE-too' },
      ],
    },

    // =====================================================
    // ADVANCED — 25 Cards: "I Can Converse"
    // =====================================================
    {
      name: 'Feelings & Health',
      icon: '❤️‍🩹',
      words: [
        { english: 'Happy', target: 'Feliz', pronunciation: 'feh-LEEZ' },
        { english: 'Sad', target: 'Triste', pronunciation: 'TREES-chee' },
        { english: 'Tired', target: 'Cansado', pronunciation: 'kan-SAH-doo' },
        { english: 'Sick', target: 'Doente', pronunciation: 'doo-EN-chee' },
        { english: 'Headache', target: 'Dor de cabeça', pronunciation: 'dor jee kah-BEH-sah' },
        { english: 'Medicine', target: 'Remédio', pronunciation: 'heh-MEH-jee-oo' },
        { english: 'Doctor', target: 'Médico', pronunciation: 'MEH-jee-koo' },
      ],
    },
    {
      name: 'Work & Tech',
      icon: '💻',
      words: [
        { english: 'Computer', target: 'Computador', pronunciation: 'kohm-poo-tah-DOR' },
        { english: 'Phone', target: 'Celular', pronunciation: 'seh-loo-LAR' },
        { english: 'Meeting', target: 'Reunião', pronunciation: 'heh-oo-nee-OWNG' },
        { english: 'Boss', target: 'Chefe', pronunciation: 'SHEH-fee' },
        { english: 'To work', target: 'Trabalhar', pronunciation: 'trah-bah-LYAR' },
        { english: 'Office', target: 'Escritório', pronunciation: 'esh-kree-TOR-ee-oo' },
      ],
    },
    {
      name: 'Connecting Words',
      icon: '🔗',
      words: [
        { english: 'Because', target: 'Porque', pronunciation: 'por-KEH' },
        { english: 'But', target: 'Mas', pronunciation: 'mahsh' },
        { english: 'Although', target: 'Embora', pronunciation: 'em-BOH-rah' },
        { english: 'So / Therefore', target: 'Então', pronunciation: 'en-TOWNG' },
        { english: 'If', target: 'Se', pronunciation: 'see' },
        { english: 'Also / Too', target: 'Também', pronunciation: 'tahm-BENG' },
      ],
    },
    {
      name: 'Time Nuances',
      icon: '⏳',
      words: [
        { english: 'Already', target: 'Já', pronunciation: 'zhah' },
        { english: 'Not yet', target: 'Ainda não', pronunciation: 'ah-EEN-dah nowng' },
        { english: 'Sometimes', target: 'Às vezes', pronunciation: 'ahz VEH-zeez' },
        { english: 'Yesterday', target: 'Ontem', pronunciation: 'OHN-teng' },
        { english: 'Tomorrow', target: 'Amanhã', pronunciation: 'ah-mah-NYAH' },
        { english: 'Today', target: 'Hoje', pronunciation: 'OH-zhee' },
      ],
    },

    // =====================================================
    // EXPERT — 25 Cards: "I Can Sound Native"
    // =====================================================
    {
      name: 'Slang & Expressions',
      icon: '🗣️',
      words: [
        { english: 'Cool / Awesome', target: 'Legal', pronunciation: 'leh-GOW' },
        { english: 'Dude / Bro', target: 'Cara', pronunciation: 'KAH-rah' },
        { english: 'No way!', target: 'Caramba!', pronunciation: 'kah-RAM-bah!' },
        { english: 'To hang out', target: 'Curtir', pronunciation: 'koor-CHEER' },
        { english: 'Annoying', target: 'Chato', pronunciation: 'SHAH-too' },
        { english: 'Awesome / Incredible', target: 'Massa', pronunciation: 'MAH-sah' },
        { english: 'Whatever / I don\'t care', target: 'Tanto faz', pronunciation: 'TAN-too fahz' },
      ],
    },
    {
      name: 'Common Idioms',
      icon: '📜',
      words: [
        { english: 'To cost an arm and a leg', target: 'Custar os olhos da cara', pronunciation: 'koos-TAR ooz OL-yooz dah KAH-rah' },
        { english: 'To be on cloud nine', target: 'Estar nas nuvens', pronunciation: 'es-TAR nahz NOO-venz' },
        { english: 'To kill two birds with one stone', target: 'Matar dois coelhos com uma cajadada', pronunciation: 'mah-TAR doyz koo-EL-yooz kohng OO-mah kah-zhah-DAH-dah' },
        { english: 'Better late than never', target: 'Antes tarde do que nunca', pronunciation: 'AN-cheez TAR-jee doo kee NOON-kah' },
        { english: 'Actions speak louder than words', target: 'Ações falam mais alto que palavras', pronunciation: 'ah-SOYNGZ FAH-lang myze AHL-too kee pah-LAH-vrahz' },
        { english: 'Practice makes perfect', target: 'A prática leva à perfeição', pronunciation: 'ah PRAH-chee-kah LEH-vah ah per-fay-SOWNG' },
      ],
    },
    {
      name: 'Social Etiquette',
      icon: '🤝',
      words: [
        { english: 'Nice to meet you', target: 'Prazer em conhecer', pronunciation: 'prah-ZEHR eng koh-nyeh-SEHR' },
        { english: 'Cheers! (toast)', target: 'Saúde!', pronunciation: 'sah-OO-jee!' },
        { english: 'Welcome', target: 'Bem-vindo', pronunciation: 'beng-VEEN-doo' },
        { english: 'Congratulations', target: 'Parabéns', pronunciation: 'pah-rah-BENZ' },
        { english: "It's my treat", target: 'É por minha conta', pronunciation: 'eh por MEE-nyah KON-tah' },
        { english: 'Have a good trip', target: 'Boa viagem', pronunciation: 'BOH-ah vee-AH-zheng' },
      ],
    },
    {
      name: 'Abstract Commentary',
      icon: '💡',
      words: [
        { english: 'Freedom', target: 'Liberdade', pronunciation: 'lee-ber-DAH-jee' },
        { english: 'Environment', target: 'Meio ambiente', pronunciation: 'MAY-oo am-bee-EN-chee' },
        { english: 'Opportunity', target: 'Oportunidade', pronunciation: 'oh-por-too-nee-DAH-jee' },
        { english: 'Challenge', target: 'Desafio', pronunciation: 'deh-zah-FEE-oo' },
        { english: 'Culture', target: 'Cultura', pronunciation: 'kool-TOO-rah' },
        { english: 'Education', target: 'Educação', pronunciation: 'eh-doo-kah-SOWNG' },
      ],
    },
  ],
};

// Flatten all words with category info for easy access
export const getAllWords = () => {
  const allWords = [];
  portugueseVocabulary.categories.forEach(category => {
    category.words.forEach(word => {
      allWords.push({ ...word, category: category.name });
    });
  });
  return allWords;
};

export const getCategories = () => portugueseVocabulary.categories;

export const getWordsByCategory = (categoryName) => {
  const category = portugueseVocabulary.categories.find(c => c.name === categoryName);
  return category ? category.words : [];
};

export default portugueseVocabulary;
