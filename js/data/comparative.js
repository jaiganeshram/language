// Comparative Language Database for Tamil Speakers
// Covers Tamil -> Telugu, Kannada, Hindi side-by-side with Tamil script transliteration

const COMPARATIVE_DATA = [
  // --- GREETINGS & BASICS (முகமன் & அடிப்படை) ---
  {
    id: "comp_1",
    category: "greetings",
    tamil: "வணக்கம்",
    tamilPhonetic: "Vanakkam",
    english: "Hello / Greetings",
    telugu: {
      script: "నమస్కారం",
      tamilTranslit: "நமஸ்காரம்",
      phonetic: "Namaskaaram",
      notes: "மரியாதையான பொதுவான வணக்கம்"
    },
    kannada: {
      script: "ನಮಸ್ಕಾರ",
      tamilTranslit: "நமஸ்கார",
      phonetic: "Namaskaara",
      notes: "கன்னடத்திலும் அதே சமஸ்கிருத சொல்"
    },
    hindi: {
      script: "नमस्ते / नमस्कार",
      tamilTranslit: "நமஸ்தே / நமஸ்கார்",
      phonetic: "Namaste / Namaskaar",
      notes: "மிகவும் பரவலாகப் பயன்படும் சொல்"
    }
  },
  {
    id: "comp_2",
    category: "greetings",
    tamil: "எப்படி இருக்கிறீர்கள்? (நலமா?)",
    tamilPhonetic: "Eppadi irukkireergal?",
    english: "How are you? (Polite)",
    telugu: {
      script: "మీరు ఎలా ఉన్నారు?",
      tamilTranslit: "மீரு எலா உன்னாரு?",
      phonetic: "Meeru ela unnaaru?",
      notes: "மீரு = நீங்கள்; எலா = எப்படி; உன்னாரு = இருக்கிறீர்கள்"
    },
    kannada: {
      script: "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
      tamilTranslit: "நீவு ஹேகித்தீரா / ஹேகித்தீரி?",
      phonetic: "Neevu hegiddiri?",
      notes: "நீவு = நீங்கள்; ஹேகே = எப்படி; இத்தீரா = இருக்கிறீர்களா"
    },
    hindi: {
      script: "आप कैसे हैं?",
      tamilTranslit: "ஆப் கைசே ஹைன்?",
      phonetic: "Aap kaise hain?",
      notes: "ஆப் = நீங்கள்; கைசே = எப்படி (பெண்களிடம் பேசும்போது 'கைஸீ')"
    }
  },
  {
    id: "comp_3",
    category: "greetings",
    tamil: "நான் நன்றாக இருக்கிறேன்",
    tamilPhonetic: "Naan nandraaga irukkiren",
    english: "I am fine / good",
    telugu: {
      script: "నేను బాగున్నాను",
      tamilTranslit: "நேனு பாகுன்னானு",
      phonetic: "Nenu baagunnanu",
      notes: "நேனு = நான்; பாகு = நன்று; உன்னானு = இருக்கிறேன்"
    },
    kannada: {
      script: "ನಾನು ಚೆನ್ನಾಗಿದ್ದೇನೆ",
      tamilTranslit: "நானு சென்னாகித்தேனே",
      phonetic: "Naanu chennaagiddene",
      notes: "நானு = நான்; சென்னாகி = நன்றாக; இத்தேனே = இருக்கிறேன்"
    },
    hindi: {
      script: "मैं ठीक हूँ",
      tamilTranslit: "மைன் டீக் ஹூன்",
      phonetic: "Main theek hoon",
      notes: "மைன் = நான்; டீக் = சரி/நன்று; ஹூன் = இருக்கிறேன்"
    }
  },
  {
    id: "comp_4",
    category: "greetings",
    tamil: "உங்கள் பெயர் என்ன?",
    tamilPhonetic: "Ungal peyar enna?",
    english: "What is your name?",
    telugu: {
      script: "మీ పేరు ఏమిటి?",
      tamilTranslit: "மீ பேரு ஏமிடி?",
      phonetic: "Mee peru emiti?",
      notes: "மீ = உங்கள்; பேரு = பெயர்; ஏமிடி = என்ன"
    },
    kannada: {
      script: "ನಿಮ್ಮ ಹೆಸರು ಏನು?",
      tamilTranslit: "நிம்ம ஹெஸரு ஏனு?",
      phonetic: "Nimma hesaru enu?",
      notes: "நிம்ம = உங்கள்; ஹெஸரு = பெயர்; ஏனு = என்ன"
    },
    hindi: {
      script: "आपका नाम क्या है?",
      tamilTranslit: "ஆப்கா நாம் க்யா ஹை?",
      phonetic: "Aapka naam kya hai?",
      notes: "ஆப்கா = உங்கள்; நாம் = பெயர்; க்யா = என்ன; ஹை = இருக்கிறது"
    }
  },
  {
    id: "comp_5",
    category: "greetings",
    tamil: "என் பெயர் கார்த்திக்",
    tamilPhonetic: "En peyar Karthik",
    english: "My name is Karthik",
    telugu: {
      script: "నా పేరు కార్తీక్",
      tamilTranslit: "நா பேரு கார்த்திக்",
      phonetic: "Naa peru Karthik",
      notes: "நா = என்; பேரு = பெயர்"
    },
    kannada: {
      script: "ನನ್ನ ಹೆಸರು ಕಾರ್ತಿಕ್",
      tamilTranslit: "நன்ன ஹெஸரு கார்த்திக்",
      phonetic: "Nanna hesaru Karthik",
      notes: "நன்ன = என்; ஹெஸரு = பெயர்"
    },
    hindi: {
      script: "मेरा नाम कार्तिक है",
      tamilTranslit: "மேரா நாம் கார்த்திக் ஹை",
      phonetic: "Mera naam Karthik hai",
      notes: "மேரா = என்னுடைய; நாம் = பெயர்"
    }
  },
  {
    id: "comp_6",
    category: "greetings",
    tamil: "மிக்க நன்றி",
    tamilPhonetic: "Mikka nandri",
    english: "Thank you very much",
    telugu: {
      script: "చాలా ధన్యవాదాలు",
      tamilTranslit: "சாலா தன்யவாதாளு",
      phonetic: "Chaala dhanyavaadaalu",
      notes: "சாலா = மிகவும் / ரொம்ப; தன்யவாதாளு = நன்றிகள்"
    },
    kannada: {
      script: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು",
      tamilTranslit: "தும்பா தன்யவாதகளு",
      phonetic: "Tumba dhanyavaadagalu",
      notes: "தும்பா = மிகவும் / நிறைய; தன்யவாதகளு = நன்றிகள்"
    },
    hindi: {
      script: "बहुत बहुत धन्यवाद / शुक्रिया",
      tamilTranslit: "பஹுத் பஹுத் தன்யவாத் / சுக்ரியா",
      phonetic: "Bahut bahut dhanyavaad / Shukriya",
      notes: "பஹுத் = மிகவும் / ரொம்ப"
    }
  },
  {
    id: "comp_7",
    category: "greetings",
    tamil: "மன்னிக்கவும்",
    tamilPhonetic: "Mannikkavum",
    english: "Excuse me / Sorry",
    telugu: {
      script: "క్షమించండి",
      tamilTranslit: "க்ஷமிஞ்சண்டி",
      phonetic: "Kshaminchandi",
      notes: "மரியாதையான சொல் (-அண்டி விகுதி மரியாதை)"
    },
    kannada: {
      script: "ಕ್ಷಮಿಸಿ",
      tamilTranslit: "க்ஷமிசி",
      phonetic: "Kshamisi",
      notes: "மரியாதையான சொல்"
    },
    hindi: {
      script: "माफ़ कीजिए",
      tamilTranslit: "மாஃப் கீஜியே",
      phonetic: "Maaf kijiye",
      notes: "பொதுவான மரியாதைச் சொல்"
    }
  },
  {
    id: "comp_8",
    category: "greetings",
    tamil: "மீண்டும் சந்திப்போம் / போய் வருகிறேன்",
    tamilPhonetic: "Meendum sandhippom / Poi varugiren",
    english: "See you again / Goodbye",
    telugu: {
      script: "మళ్ళీ కలుద్దాం / వస్తానండి",
      tamilTranslit: "மல்லீ கலுத்தாம் / வஸ்தானண்டி",
      phonetic: "Malli kaluddam / Vasthaanandi",
      notes: "மல்லீ = மீண்டும்; கலுத்தாம் = சந்திப்போம்"
    },
    kannada: {
      script: "ಮತ್ತೆ ಸಿಗೋಣ / ಬರ್ತೀನಿ",
      tamilTranslit: "மத்தெ சிகோண / பர்த்தீனி",
      phonetic: "Matte sigona / Barteeni",
      notes: "மத்தெ = மீண்டும்; சிகோண = சந்திப்போம்"
    },
    hindi: {
      script: "फिर मिलेंगे / अलविदा",
      tamilTranslit: "பிர் மிலேங்கே / அல்விதா",
      phonetic: "Phir milenge / Alvida",
      notes: "பிர் = மீண்டும்; மிலேங்கே = சந்திப்போம்"
    }
  },

  // --- QUESTIONS (கேள்விகள் கேட்டல்) ---
  {
    id: "comp_9",
    category: "questions",
    tamil: "இது என்ன?",
    tamilPhonetic: "Idhu enna?",
    english: "What is this?",
    telugu: {
      script: "ఇది ఏమిటి?",
      tamilTranslit: "இதி ஏமிடி?",
      phonetic: "Idi emiti?",
      notes: "இதி = இது; ஏமிடி = என்ன"
    },
    kannada: {
      script: "ಇದು ಏನು?",
      tamilTranslit: "இது ஏனு?",
      phonetic: "Idu enu?",
      notes: "இது = இது; ஏனு = என்ன (தமிழுக்கு மிக நெருக்கம்!)"
    },
    hindi: {
      script: "यह क्या है?",
      tamilTranslit: "யஹ் க்யா ஹை?",
      phonetic: "Yeh kya hai?",
      notes: "யஹ் = இது; க்யா = என்ன"
    }
  },
  {
    id: "comp_10",
    category: "questions",
    tamil: "அங்கு யார்?",
    tamilPhonetic: "Angu yaar?",
    english: "Who is there?",
    telugu: {
      script: "అక్కడ ఎవరు?",
      tamilTranslit: "அக்கட எவரு?",
      phonetic: "Akkada evaru?",
      notes: "அக்கட = அங்கே; எவரு = யார்"
    },
    kannada: {
      script: "ಅಲ್ಲಿ ಯಾರು?",
      tamilTranslit: "அல்லி யாரு?",
      phonetic: "Alli yaaru?",
      notes: "அல்லி = அங்கே; யாரு = யார் (தமிழுக்கு அச்சு அசல்!)"
    },
    hindi: {
      script: "वहाँ कौन है?",
      tamilTranslit: "வஹாம் கோன் ஹை?",
      phonetic: "Vahaan kaun hai?",
      notes: "வஹாம் = அங்கே; கோன் = யார்"
    }
  },
  {
    id: "comp_11",
    category: "questions",
    tamil: "எங்கே போகிறீர்கள்?",
    tamilPhonetic: "Engae pogireergal?",
    english: "Where are you going?",
    telugu: {
      script: "ఎక్కడికి వెళ్తున్నారు?",
      tamilTranslit: "எக்கடிகி வெள்துன்னாரு?",
      phonetic: "Ekkadiki velthunnaaru?",
      notes: "எக்கடிகி = எங்கே/எங்குக்கு; வெள்துன்னாரு = போகிறீர்கள்"
    },
    kannada: {
      script: "ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
      tamilTranslit: "எல்லிகெ ஹோகுத்தித்தீரா?",
      phonetic: "Ellige hoguttiddira?",
      notes: "எல்லிகெ = எங்கே/எங்குக்கு; ஹோகுத்தித்தீரா = போகிறீர்களா"
    },
    hindi: {
      script: "आप कहाँ जा रहे हैं?",
      tamilTranslit: "ஆப் கஹாம் ஜா ரஹே ஹைன்?",
      phonetic: "Aap kahaan jaa rahe hain?",
      notes: "கஹாம் = எங்கே; ஜா ரஹே ஹைன் = போகிறீர்கள்"
    }
  },
  {
    id: "comp_12",
    category: "questions",
    tamil: "எப்போது வருவீர்கள்?",
    tamilPhonetic: "Eppodhu varuveergal?",
    english: "When will you come?",
    telugu: {
      script: "ఎప్పుడు వస్తారు?",
      tamilTranslit: "எப்புடு வஸ்தாரு?",
      phonetic: "Eppudu vastaaru?",
      notes: "எப்புடு = எப்போது; வஸ்தாரு = வருவீர்கள்"
    },
    kannada: {
      script: "ಯಾವಾಗ ಬರ್ತೀರಿ?",
      tamilTranslit: "யாவாக பர்த்தீரா?",
      phonetic: "Yaavaaga barteeri?",
      notes: "யாவாக = எப்போது; பர்த்தீரா = வருவீர்களா"
    },
    hindi: {
      script: "आप कब आएँगे?",
      tamilTranslit: "ஆப் கப் ஆயேங்கே?",
      phonetic: "Aap kab aayenge?",
      notes: "கப் = எப்போது; ஆயேங்கே = வருவீர்கள்"
    }
  },
  {
    id: "comp_13",
    category: "questions",
    tamil: "இதன் விலை எவ்வளவு?",
    tamilPhonetic: "Idhan vilai evvalavu?",
    english: "How much is this?",
    telugu: {
      script: "ఇది ఎంత?",
      tamilTranslit: "இதி எந்த?",
      phonetic: "Idi entha?",
      notes: "இதி = இது; எந்த = எவ்வளவு"
    },
    kannada: {
      script: "ಇದು ಎಷ್ಟು?",
      tamilTranslit: "இது எஷ்டு?",
      phonetic: "Idu eshtu?",
      notes: "இது = இது; எஷ்டு = எவ்வளவு"
    },
    hindi: {
      script: "यह कितने का है?",
      tamilTranslit: "யஹ் கித்னே கா ஹை?",
      phonetic: "Yeh kitne ka hai?",
      notes: "கித்னே = எவ்வளவு; கா ஹை = ஆகிறது"
    }
  },
  {
    id: "comp_14",
    category: "questions",
    tamil: "ஏன் தாமதம்?",
    tamilPhonetic: "Yen thaamatham?",
    english: "Why late?",
    telugu: {
      script: "ఎందుకు ఆలస్యం?",
      tamilTranslit: "எந்துகு ஆலஸ்யம்?",
      phonetic: "Enduku aalasyam?",
      notes: "எந்துகு = ஏன்; ஆலஸ்யம் = தாமதம்"
    },
    kannada: {
      script: "ಯಾಕೆ ತಡ?",
      tamilTranslit: "யாக்கே தட?",
      phonetic: "Yaake tada?",
      notes: "யாக்கே = ஏன்; தட = தாமதம்"
    },
    hindi: {
      script: "देरी क्यों हुई?",
      tamilTranslit: "தேரி க்யூம் ஹுயீ?",
      phonetic: "Deri kyun hui?",
      notes: "தேரி = தாமதம்; க்யூம் = ஏன்"
    }
  },

  // --- ESSENTIAL DAILY CONVERSATION (அன்றாட உரையாடல்) ---
  {
    id: "comp_15",
    category: "daily_phrases",
    tamil: "உங்களுக்கு தமிழ் தெரியுமா?",
    tamilPhonetic: "Ungalukku Tamil theriyuma?",
    english: "Do you know Tamil?",
    telugu: {
      script: "మీకు తమిళ్ వచ్చా?",
      tamilTranslit: "மீகு தமிழ் வச்சா?",
      phonetic: "Meeku Tamil vacchaa?",
      notes: "மீகு = உங்களுக்கு; வச்சா = வருமா / தெரியுமா"
    },
    kannada: {
      script: "ನಿಮಗೆ ತಮಿಳು ಗೊತ್ತಾ?",
      tamilTranslit: "நிமகெ தமிழு கொத்தா?",
      phonetic: "Nimage Tamilu gottaa?",
      notes: "நிமகெ = உங்களுக்கு; கொத்தா = தெரியுமா"
    },
    hindi: {
      script: "क्या आपको तमिल आती है?",
      tamilTranslit: "க்யா ஆப்கோ தமிழ் ஆதீ ஹை?",
      phonetic: "Kya aapko Tamil aati hai?",
      notes: "ஆப்கோ = உங்களுக்கு; ஆதீ ஹை = வருமா/தெரியுமா"
    }
  },
  {
    id: "comp_16",
    category: "daily_phrases",
    tamil: "எனக்கு கொஞ்சம் தெரியும்",
    tamilPhonetic: "Enakku konjam theriyum",
    english: "I know a little bit",
    telugu: {
      script: "నాకు కొంచెం వచ్చు",
      tamilTranslit: "நாகு கொஞ்சம் வச்சு",
      phonetic: "Naaku konchem vacchu",
      notes: "நாகு = எனக்கு; கொஞ்சம் = கொஞ்சம்; வச்சு = தெரியும்"
    },
    kannada: {
      script: "ನನಗೆ ಸ್ವಲ್ಪ ಗೊತ್ತು",
      tamilTranslit: "நனகெ ஸ்வல்ப்ப கொத்து",
      phonetic: "Nanage svalpa gottu",
      notes: "நனகெ = எனக்கு; ஸ்வல்ப்ப = கொஞ்சம்; கொத்து = தெரியும்"
    },
    hindi: {
      script: "मुझे थोड़ा आता है",
      tamilTranslit: "முஜே தோடா ஆதா ஹை",
      phonetic: "Mujhe thoda aata hai",
      notes: "முஜே = எனக்கு; தோடா = கொஞ்சம்; ஆதா ஹை = தெரியும்"
    }
  },
  {
    id: "comp_17",
    category: "daily_phrases",
    tamil: "மெதுவாக பேசுங்கள்",
    tamilPhonetic: "Medhuvaaga pesungal",
    english: "Please speak slowly",
    telugu: {
      script: "నెమ్మదిగా మాట్లాడండి",
      tamilTranslit: "நெம்மதிகா மாட்லாடண்டி",
      phonetic: "Nemmadigaa maatlaadandi",
      notes: "நெம்மதிகா = மெதுவாக; மாட்லாடண்டி = பேசுங்கள்"
    },
    kannada: {
      script: "ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ",
      tamilTranslit: "நிதானவாகி மாதனாடி",
      phonetic: "Nidhaanavaagi maatanaadi",
      notes: "நிதானவாகி = நிதானமாக/மெதுவாக; மாதனாடி = பேசுங்கள்"
    },
    hindi: {
      script: "धीरे बोलिए",
      tamilTranslit: "தீரே போலியே",
      phonetic: "Dheere boliye",
      notes: "தீரே = மெதுவாக; போலியே = பேசுங்கள்"
    }
  },
  {
    id: "comp_18",
    category: "daily_phrases",
    tamil: "உள்ளே வாருங்கள் / உட்காருங்கள்",
    tamilPhonetic: "Ullae vaarungal / Utkaarungal",
    english: "Please come in / Please sit",
    telugu: {
      script: "లోపలికి రండి / కూర్చోండి",
      tamilTranslit: "லோபலிகி ரண்டி / கூர்ச்சோண்டி",
      phonetic: "Lopaliki randi / Koorchondi",
      notes: "லோபலிகி = உள்ளே; ரண்டி = வாருங்கள்; கூர்ச்சோண்டி = அமருங்கள்"
    },
    kannada: {
      script: "ಒಳಗೆ ಬನ್ನಿ / ಕೂತ್ಕೊಳ್ಳಿ",
      tamilTranslit: "ஒளகெ பன்னி / கூத்கொள்ளி",
      phonetic: "Olage banni / Kootkolli",
      notes: "ஒளகெ = உள்ளே; பன்னி = வாருங்கள்; கூத்கொள்ளி = உட்காருங்கள்"
    },
    hindi: {
      script: "अंदर आइए / बैठिए",
      tamilTranslit: "அந்தர் ஆயியே / பைட்டியே",
      phonetic: "Andar aayiye / Baithiye",
      notes: "அந்தர் = உள்ளே; ஆயியே = வாருங்கள்; பைட்டியே = அமருங்கள்"
    }
  },
  {
    id: "comp_19",
    category: "daily_phrases",
    tamil: "சாப்பிட்டீர்களா?",
    tamilPhonetic: "Saapitteergala?",
    english: "Did you eat? / Had food?",
    telugu: {
      script: "భోజనం చేశారా? / తిన్నారా?",
      tamilTranslit: "போஜனம் சேசாரா? / தின்னாரா?",
      phonetic: "Bhojanam chesaaraa? / Tinnaaraa?",
      notes: "போஜனம் சேசாரா = சாப்பிட்டீர்களா; தின்னாரா = உண்டீர்களா"
    },
    kannada: {
      script: "ಊಟ ಆಯ್ತಾ?",
      tamilTranslit: "ஊட்டா ஆயித்தா?",
      phonetic: "Oota aaythaa?",
      notes: "ஊட்டா = உணவு/சாப்பாடு; ஆயித்தா = ஆகிவிட்டதா (மிகப் புகழ்பெற்ற கன்னட வினவல்!)"
    },
    hindi: {
      script: "खाना खा लिया?",
      tamilTranslit: "கானா கா லியா?",
      phonetic: "Khaana khaa liya?",
      notes: "கானா = உணவு; கா லியா = சாப்பிட்டுவிட்டீர்களா"
    }
  },
  {
    id: "comp_20",
    category: "daily_phrases",
    tamil: "தண்ணீர் வேண்டும்",
    tamilPhonetic: "Thanneer vendum",
    english: "I want water",
    telugu: {
      script: "మంచినీళ్ళు కావాలి",
      tamilTranslit: "மஞ்சி நீள்ளு காவாலி",
      phonetic: "Manchi neellu kaavaali",
      notes: "மஞ்சி நீள்ளு = நல்ல தண்ணீர்; காவாலி = வேண்டும்"
    },
    kannada: {
      script: "ನೀರು ಬೇಕು",
      tamilTranslit: "நீரு பேக்கு",
      phonetic: "Neeru beku",
      notes: "நீரு = தண்ணீர்; பேக்கு = வேண்டும் (தமிழின் 'வேண்டும்' போல 'பேக்கு')"
    },
    hindi: {
      script: "पानी चाहिए",
      tamilTranslit: "பானி சாஹியே",
      phonetic: "Paani chaahiye",
      notes: "பானி = தண்ணீர்; சாஹியே = வேண்டும்"
    }
  },

  // --- TRAVEL & DIRECTIONS (பயணம் & வழிகள்) ---
  {
    id: "comp_21",
    category: "travel_directions",
    tamil: "ரயில் நிலையம் எங்கே இருக்கிறது?",
    tamilPhonetic: "Rayil nilayam engae irukkiradhu?",
    english: "Where is the railway station?",
    telugu: {
      script: "రైల్వే స్టేషన్ ఎక్కడ ఉంది?",
      tamilTranslit: "ரயில்வே ஸ்டேஷன் எக்கட உந்தி?",
      phonetic: "Railway station ekkada undi?",
      notes: "எக்கட = எங்கே; உந்தி = இருக்கிறது"
    },
    kannada: {
      script: "ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?",
      tamilTranslit: "ரயில்வே நில்டாண எல்லிதே?",
      phonetic: "Railway nildaana ellide?",
      notes: "எல்லிதே = எங்கே இருக்கிறது (எல்லி + இதே)"
    },
    hindi: {
      script: "रेलवे स्टेशन कहाँ है?",
      tamilTranslit: "ரயில்வே ஸ்டேஷன் கஹாம் ஹை?",
      phonetic: "Railway station kahaan hai?",
      notes: "கஹாம் = எங்கே; ஹை = இருக்கிறது"
    }
  },
  {
    id: "comp_22",
    category: "travel_directions",
    tamil: "வலதுபுறம் திரும்புங்கள்",
    tamilPhonetic: "Valadhupuram thirumbungal",
    english: "Turn right",
    telugu: {
      script: "కుడివైపు తిరగండి",
      tamilTranslit: "குடிவைபு திரகண்டி",
      phonetic: "Kudi vaipu tiragandi",
      notes: "குடி = வலது; வைபு = பக்கம்/புறம்; திரகண்டி = திரும்புங்கள்"
    },
    kannada: {
      script: "ಬಲಗಡೆ ತಿರುಗಿ",
      tamilTranslit: "பலகடே திருகி",
      phonetic: "Balagade tirugi",
      notes: "பலகடே = வலதுபுறம்; திருகி = திரும்புங்கள்"
    },
    hindi: {
      script: "दाएँ मुड़िए",
      tamilTranslit: "தாயேம் முடியே",
      phonetic: "Daayein mudiye",
      notes: "தாயேம் = வலது; முடியே = திரும்புங்கள்"
    }
  },
  {
    id: "comp_23",
    category: "travel_directions",
    tamil: "இடதுபுறம் திரும்புங்கள்",
    tamilPhonetic: "Idadhupuram thirumbungal",
    english: "Turn left",
    telugu: {
      script: "ఎడమవైపు తిరగండి",
      tamilTranslit: "எடமவைபு திரகண்டி",
      phonetic: "Edama vaipu tiragandi",
      notes: "எடம = இடது (தமிழுடன் ஒற்றுமை: இடது -> எடம)"
    },
    kannada: {
      script: "ಎಡಗಡೆ ತಿರುಗಿ",
      tamilTranslit: "எடகடே திருகி",
      phonetic: "Edagade tirugi",
      notes: "எடகடே = இடதுபுறம்; திருகி = திரும்புங்கள்"
    },
    hindi: {
      script: "बाएँ मुड़िए",
      tamilTranslit: "பாயேம் முடியே",
      phonetic: "Baayein mudiye",
      notes: "பாயேம் = இடது; முடியே = திரும்புங்கள்"
    }
  },
  {
    id: "comp_24",
    category: "travel_directions",
    tamil: "நேராக செல்லுங்கள்",
    tamilPhonetic: "Neraaga sellungal",
    english: "Go straight",
    telugu: {
      script: "నేరుగా వెళ్ళండి",
      tamilTranslit: "நேருகா வெள்ளண்டி",
      phonetic: "Neerugaa vellandi",
      notes: "நேருகா = நேராக; வெள்ளண்டி = செல்லுங்கள்"
    },
    kannada: {
      script: "ನೇರವಾಗಿ ಹೋಗಿ",
      tamilTranslit: "நேரவாகி ஹோகி",
      phonetic: "Neeravaagi hogi",
      notes: "நேரவாகி = நேராக; ஹோகி = போங்கள்"
    },
    hindi: {
      script: "सीधे जाइए",
      tamilTranslit: "சீதே ஜாயியே",
      phonetic: "Seedhe jaayiye",
      notes: "சீதே = நேராக; ஜாயியே = செல்லுங்கள்"
    }
  },
  {
    id: "comp_25",
    category: "travel_directions",
    tamil: "இங்கே நிறுத்துங்கள்",
    tamilPhonetic: "Ingae niruthungal",
    english: "Stop here",
    telugu: {
      script: "ఇక్కడ ఆపండి",
      tamilTranslit: "இக்கட ஆபண்டி",
      phonetic: "Ikkada aapandi",
      notes: "இக்கட = இங்கே; ஆபண்டி = நிறுத்துங்கள்"
    },
    kannada: {
      script: "ಇಲ್ಲಿ ನಿಲ್ಲಿಸಿ",
      tamilTranslit: "இல்லி நில்லிசி",
      phonetic: "Illi nillisi",
      notes: "இல்லி = இங்கே; நில்லிசி = நில்லுங்கள்/நிறுத்துங்கள்"
    },
    hindi: {
      script: "यहाँ रोकिए",
      tamilTranslit: "யஹாம் ரோகியே",
      phonetic: "Yahaan rokiye",
      notes: "யஹாம் = இங்கே; ரோகியே = நிறுத்துங்கள்"
    }
  },

  // --- SHOPPING & BARGAINING (கடை & பேரம் பேசுதல்) ---
  {
    id: "comp_26",
    category: "shopping_bargaining",
    tamil: "விலை ரொம்ப அதிகம், கொஞ்சம் குறையுங்கள்",
    tamilPhonetic: "Vilai romba adhigam, konjam kuraiyungal",
    english: "Price is too high, please reduce a bit",
    telugu: {
      script: "ధర చాలా ఎక్కువ, కొంచెం తగ్గించండి",
      tamilTranslit: "தர சாலா எக்குவ, கொஞ்சம் தக்கிஞ்சண்டி",
      phonetic: "Dhara chaala ekkuva, konchem thagginchandi",
      notes: "சாலா எக்குவ = ரொம்ப அதிகம்; தக்கிஞ்சண்டி = குறையுங்கள்"
    },
    kannada: {
      script: "ಬೆಲೆ ತುಂಬಾ ಜಾಸ್ತಿ, ಸ್ವಲ್ಪ ಕಮ್ಮಿ ಮಾಡಿ",
      tamilTranslit: "பெலெ தும்பா ஜாஸ்தி, ஸ்வல்ப்ப கம்மி மாடி",
      phonetic: "Bele tumba jaasti, svalpa kammi maadi",
      notes: "தும்பா ஜாஸ்தி = ரொம்ப அதிகம்; கம்மி மாடி = குறையுங்கள்"
    },
    hindi: {
      script: "दाम बहुत ज़्यादा है, थोड़ा कम कीजिए",
      tamilTranslit: "தாம் பஹுத் ஜ்யாதா ஹை, தோடா கம் கீஜியே",
      phonetic: "Daam bahut zyaada hai, thoda kam kijiye",
      notes: "ஜ்யாதா = அதிகம்; கம் கீஜியே = குறையுங்கள்"
    }
  },
  {
    id: "comp_27",
    category: "shopping_bargaining",
    tamil: "கடைசி விலை என்ன?",
    tamilPhonetic: "Kadaisi vilai enna?",
    english: "What is the final price?",
    telugu: {
      script: "చివరి ధర ఎంత?",
      tamilTranslit: "சிவரி தர எந்த?",
      phonetic: "Chivari dhara entha?",
      notes: "சிவரி = கடைசி; தர = விலை; எந்த = எவ்வளவு"
    },
    kannada: {
      script: "ಕೊನೆಯ ಬೆಲೆ ಎಷ್ಟು?",
      tamilTranslit: "கொனெய பெலெ எஷ்டு?",
      phonetic: "Koneya bele eshtu?",
      notes: "கொனெய = கடைசி; பெலெ = விலை; எஷ்டு = எவ்வளவு"
    },
    hindi: {
      script: "अंतिम दाम क्या है?",
      tamilTranslit: "அந்திம் தாம் க்யா ஹை?",
      phonetic: "Antim daam kya hai?",
      notes: "அந்திம் = கடைசி; தாம் = விலை"
    }
  },

  // --- FOOD & RESTAURANT (உணவு & உணவகம்) ---
  {
    id: "comp_28",
    category: "food_dining",
    tamil: "ஒரு டீ மற்றும் சூடான காபி கொடுங்கள்",
    tamilPhonetic: "Oru tea mattrum soodaana coffee kodungal",
    english: "Give one tea and hot coffee",
    telugu: {
      script: "ఒక టీ మరియు వేడి కాఫీ ఇవ్వండి",
      tamilTranslit: "ஒக டீ மரியு வேடி காஃபி இவ்வாண்டி",
      phonetic: "Oka tea mariyu vedi coffee ivvandi",
      notes: "ஒக = ஒரு; வேடி = சூடான; இவ்வாண்டி = கொடுங்கள்"
    },
    kannada: {
      script: "ಒಂದು ಟೀ ಮತ್ತು ಬಿಸಿ ಕಾಫಿ ಕೊಡಿ",
      tamilTranslit: "ஒந்து டீ மத்து பிசி காஃபி கொடி",
      phonetic: "Ondu tea mattu bisi coffee kodi",
      notes: "ஒந்து = ஒன்று; பிசி = சூடான; கொடி = கொடுங்கள்"
    },
    hindi: {
      script: "एक चाय और गरम कॉफ़ी दीजिए",
      tamilTranslit: "ஏக் சாய் அவுர் கரம் காஃபி தீஜியே",
      phonetic: "Ek chai aur garam coffee dijiye",
      notes: "ஏக் = ஒன்று; கரம் = சூடான; தீஜியே = கொடுங்கள்"
    }
  },
  {
    id: "comp_29",
    category: "food_dining",
    tamil: "உணவு மிகவும் சுவையாக இருந்தது",
    tamilPhonetic: "Unavu migavum suvaiyaaga irundhadhu",
    english: "Food was very delicious",
    telugu: {
      script: "తిండి చాలా రుచిగా ఉంది",
      tamilTranslit: "திண்டி சாலா ருசிகா உந்தி",
      phonetic: "Tindi chaala ruchigaa undi",
      notes: "திண்டி = உணவு/சாப்பாடு; ருசிகா = சுவையாக"
    },
    kannada: {
      script: "ಊಟ ತುಂಬಾ ರುಚಿಯಾಗಿತ್ತು",
      tamilTranslit: "ஊட்டா தும்பா ருசியாகித்து",
      phonetic: "Oota tumba ruchiyaagittu",
      notes: "ஊட்டா = சாப்பாடு; ருசியாகித்து = சுவையாக இருந்தது"
    },
    hindi: {
      script: "खाना बहुत स्वादिष्ट था",
      tamilTranslit: "கானா பஹுத் ஸ்வாதிஷ்ட் தா",
      phonetic: "Khaana bahut swaadisht tha",
      notes: "கானா = உணவு; ஸ்வாதிஷ்ட் = சுவையான; தா = இருந்தது"
    }
  },
  {
    id: "comp_30",
    category: "food_dining",
    tamil: "பில் கொண்டு வாருங்கள்",
    tamilPhonetic: "Bill kondu vaarungal",
    english: "Please bring the bill",
    telugu: {
      script: "బిల్ తీసుకురండి",
      tamilTranslit: "பில் தீசுகுரண்டி",
      phonetic: "Bill teesukurandi",
      notes: "தீசுகுரண்டி = கொண்டு வாருங்கள்"
    },
    kannada: {
      script: "ಬಿಲ್ ತಗೊಂಡು ಬನ್ನಿ",
      tamilTranslit: "பில் தகொண்டு பன்னி",
      phonetic: "Bill tagondu banni",
      notes: "தகொண்டு பன்னி = எடுத்துக்கொண்டு வாருங்கள்"
    },
    hindi: {
      script: "बिल ले आइए",
      tamilTranslit: "பில் லே ஆயியே",
      phonetic: "Bill le aayiye",
      notes: "லே ஆயியே = கொண்டு வாருங்கள்"
    }
  },

  // --- EMERGENCY & HELP (அவசரம் & உதவி) ---
  {
    id: "comp_31",
    category: "emergency_health",
    tamil: "தயவுசெய்து எனக்கு உதவி செய்யுங்கள்",
    tamilPhonetic: "Dhayavuseidhu enakku udhavi seiyungal",
    english: "Please help me",
    telugu: {
      script: "దయచేసి నాకు సహాయం చేయండి",
      tamilTranslit: "தயசேசி நாகு சஹாயம் செய்யண்டி",
      phonetic: "Dayachesi naaku sahaayam cheyandi",
      notes: "தயசேசி = தயவுசெய்து; சஹாயம் செய்யண்டி = உதவி செய்யுங்கள்"
    },
    kannada: {
      script: "ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ",
      tamilTranslit: "தயவிட்டு நனகெ சஹாய மாடி",
      phonetic: "Dayavittu nanage sahaaya maadi",
      notes: "தயவிட்டு = தயவுசெய்து; சஹாய மாடி = உதவி செய்யுங்கள்"
    },
    hindi: {
      script: "कृपया मेरी मदद कीजिए",
      tamilTranslit: "க்ருபயா மேரி மதத் கீஜியே",
      phonetic: "Kripaya meri madad kijiye",
      notes: "க்ருபயா = தயவுசெய்து; மதத் கீஜியே = உதவி செய்யுங்கள்"
    }
  },
  {
    id: "comp_32",
    category: "emergency_health",
    tamil: "மருத்துவர் எங்கே இருக்கிறார்?",
    tamilPhonetic: "Maruthuvar engae irukkiraar?",
    english: "Where is the doctor?",
    telugu: {
      script: "డాక్టర్ ఎక్కడ ఉన్నారు?",
      tamilTranslit: "டாக்டர் எக்கட உன்னாரு?",
      phonetic: "Doctor ekkada unnaaru?",
      notes: "உன்னாரு = இருக்கிறார் (மரியாதை)"
    },
    kannada: {
      script: "ಡಾಕ್ಟರ್ ಎಲ್ಲಿದ್ದಾರೆ?",
      tamilTranslit: "டாக்டர் எல்லித்தாரே?",
      phonetic: "Doctor elliddaare?",
      notes: "எல்லித்தாரே = எங்கே இருக்கிறார்"
    },
    hindi: {
      script: "डॉक्टर कहाँ हैं?",
      tamilTranslit: "டாக்டர் கஹாம் ஹைன்?",
      phonetic: "Doctor kahaan hain?",
      notes: "கஹாம் ஹைன் = எங்கே இருக்கிறார்"
    }
  }
];

// High-confidence Dravidian Cognates Table
// Words that are virtually identical between Tamil, Telugu, and Kannada!
const DRAVIDIAN_COGNATES = [
  {
    tamil: "கண் (Kann)",
    telugu: "కన్ను (Kannu / கன்னு)",
    kannada: "ಕಣ್ಣು (Kannu / கண்ணு)",
    hindi: "आँख (Aankh / ஆங்க்)",
    meaning: "Eye"
  },
  {
    tamil: "கை (Kai)",
    telugu: "చేయి (Cheyi / செய்யி)",
    kannada: "ಕೈ (Kai / கை)",
    hindi: "हाथ (Haath / ஹாத்)",
    meaning: "Hand"
  },
  {
    tamil: "தலை (Thalai)",
    telugu: "తల (Thala / தல)",
    kannada: "ತಲೆ (Thale / தலெ)",
    hindi: "सिर (Sir / சிர்)",
    meaning: "Head"
  },
  {
    tamil: "நீர் / தண்ணீர் (Neer)",
    telugu: "నీళ్ళు (Neellu / நீள்ளு)",
    kannada: "ನೀರು (Neeru / நீரு)",
    hindi: "पानी (Paani / பானி)",
    meaning: "Water"
  },
  {
    tamil: "பால் (Paal)",
    telugu: "పాలు (Paalu / பாலு)",
    kannada: "ಹಾಲು (Haalu / ஹாலு - ப->ஹ மாற்றமாகும்)",
    hindi: "दूध (Doodh / தூத்)",
    meaning: "Milk"
  },
  {
    tamil: "ஊர் (Oor)",
    telugu: "ఊరు (Ooru / ஊரு)",
    kannada: "ಊರು (Ooru / ஊரு)",
    hindi: "गाँव / शहर (Gaon/Shahar)",
    meaning: "Town / Village"
  },
  {
    tamil: "பெயர் (Peyar)",
    telugu: "పేరు (Peru / பேரு)",
    kannada: "ಹೆಸರು (Hesaru / ஹெஸரு)",
    hindi: "नाम (Naam / நாம்)",
    meaning: "Name"
  },
  {
    tamil: "பல் (Pal)",
    telugu: "పన్ను / పళ్ళు (Pannu / பன்னு)",
    kannada: "ಹಲ್ಲು (Hallu / ஹல்லு)",
    hindi: "दाँत (Daant / தாந்த்)",
    meaning: "Tooth / Teeth"
  },
  {
    tamil: "மீன் (Meen)",
    telugu: "చేప (Chepa) / మీను (Meenu)",
    kannada: "ಮೀನು (Meenu / மீனு)",
    hindi: "मछली (Machhli / மச்சிலி)",
    meaning: "Fish"
  },
  {
    tamil: "பூ (Poo)",
    telugu: "పువ్వు (Puvvu / புவ்வு)",
    kannada: "ಹೂವು (Hoovu / ஹூவு)",
    hindi: "फूल (Phool / பூல்)",
    meaning: "Flower"
  }
];

if (typeof module !== 'undefined') {
  module.exports = { COMPARATIVE_DATA, DRAVIDIAN_COGNATES };
}
