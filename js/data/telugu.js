// Complete Telugu Learning Course for Tamil Speakers
// 100% Focused on Spoken Fluency through Tamil Script - No foreign script reading required!

const TELUGU_COURSE = {
  language: "Telugu",
  tamilName: "தெலுங்கு",
  nativeName: "తెలుగు",
  speechCode: "te-IN",
  accentColor: "#059669", // Emerald
  tagline: "தமிழ் எழுத்துக்களைக் கொண்டே தெலுங்கில் சரளமாகப் பேசலாம்!",

  // 1. SPOKEN ESSENTIAL VOCABULARY (அத்தியாவசிய பேச்சுச் சொற்கள் - தமிழில் மட்டும்!)
  spokenVocab: [
    { tamil: "வணக்கம்", speakInTamil: "நமஸ்காரம்", phonetic: "Namaskaaram", script: "నమస్కారం" },
    { tamil: "ஆம் (சரி)", speakInTamil: "அவுனு", phonetic: "Avunu", script: "అవును" },
    { tamil: "இல்லை", speakInTamil: "காது / லேது", phonetic: "Kaadu / Ledu", script: "కాదు / లేదు" },
    { tamil: "வேண்டும்", speakInTamil: "காவாலி", phonetic: "Kaavaali", script: "కావాలి" },
    { tamil: "வேண்டாம்", speakInTamil: "வத்து", phonetic: "Vaddu", script: "వద్దు" },
    { tamil: "நல்லது / நன்று", speakInTamil: "மஞ்சிதி", phonetic: "Manchidi", script: "మంచిది" },
    { tamil: "இங்கே", speakInTamil: "இக்கட", phonetic: "Ikkada", script: "ఇక్కడ" },
    { tamil: "அங்கே", speakInTamil: "அக்கட", phonetic: "Akkada", script: "అక్కడ" },
    { tamil: "எங்கே", speakInTamil: "எக்கட", phonetic: "Ekkada", script: "ఎక్కడ" },
    { tamil: "இப்போது", speakInTamil: "இப்புடு", phonetic: "Ippudu", script: "ఇప్పుడు" },
    { tamil: "அப்போது", speakInTamil: "அப்புடு", phonetic: "Appudu", script: "అప్పుడు" },
    { tamil: "எப்போது", speakInTamil: "எப்புடு", phonetic: "Eppudu", script: "ఎప్పుడు" },
    { tamil: "வா (வாருங்கள்)", speakInTamil: "ரா (ரண்டி)", phonetic: "Raa (Randi)", script: "రా (రండి)" },
    { tamil: "போ (போங்கள்)", speakInTamil: "வெள்ளு (வெள்ளண்டி)", phonetic: "Vellu (Vellandi)", script: "వెళ్ళు (వెళ్ళండి)" },
    { tamil: "சாப்பிடு (சாப்பிடுங்கள்)", speakInTamil: "தினு (தினண்டி)", phonetic: "Tinu (Tinandi)", script: "తిను (తినండి)" },
    { tamil: "குடி (குடியுங்கள்)", speakInTamil: "தாகு (தாகண்டி)", phonetic: "Taagu (Taagandi)", script: "తాగు (తాగండి)" },
    { tamil: "பாருங்கள்", speakInTamil: "சூடண்டி", phonetic: "Choodandi", script: "చూడండి" },
    { tamil: "சொல்லுங்கள்", speakInTamil: "செப்பண்டி", phonetic: "Cheppandi", script: "చెప్పండి" },
    { tamil: "கொடுங்கள்", speakInTamil: "இவ்வாண்டி", phonetic: "Ivvandi", script: "ఇవ్వండి" },
    { tamil: "எடுங்கள்", speakInTamil: "தீசுகோண்டி", phonetic: "Theesukondi", script: "తీసుకోండి" },
    { tamil: "தண்ணீர்", speakInTamil: "மஞ்சி நீள்ளு", phonetic: "Manchi neellu", script: "మంచినీళ్ళు" },
    { tamil: "பால்", speakInTamil: "பாலு", phonetic: "Paalu", script: "పాలు" },
    { tamil: "சாப்பாடு / உணவு", speakInTamil: "போஜனம் / அன்னம்", phonetic: "Bhojanam / Annam", script: "భోజనం / అన్నం" },
    { tamil: "பணம் / காசு", speakInTamil: "டப்பு", phonetic: "Dabbu", script: "డబ్బు" },
    { tamil: "விலை", speakInTamil: "தர", phonetic: "Dhara", script: "ధర" },
    { tamil: "எவ்வளவு", speakInTamil: "எந்த", phonetic: "Entha", script: "ఎంత" },
    { tamil: "எப்படி", speakInTamil: "எலா", phonetic: "Ela", script: "ఎలా" },
    { tamil: "ஏன்", speakInTamil: "எந்துகு", phonetic: "Endhuku", script: "ఎందుకు" },
    { tamil: "பெயர்", speakInTamil: "பேரு", phonetic: "Peru", script: "పేరు" },
    { tamil: "வீடு", speakInTamil: "இல்லு", phonetic: "Illu", script: "ఇల్లు" },
    { tamil: "ஊர்", speakInTamil: "ஊரு", phonetic: "Ooru", script: "ఊరు" },
    { tamil: "வழி / பாதை", speakInTamil: "தாரி", phonetic: "Daari", script: "దారి" },
    { tamil: "இன்று", speakInTamil: "ஈரோஜு", phonetic: "Eeroju", script: "ఈరోజు" },
    { tamil: "நாளை", speakInTamil: "ரேபு", phonetic: "Repu", script: "రేపు" },
    { tamil: "நேற்று", speakInTamil: "நின்ன", phonetic: "Ninna", script: "నిన్న" }
  ],

  // 2. GRAMMAR BRIDGE (தமிழோடு இலக்கண ஒப்பீடு)
  grammar: [
    {
      title: "பிரதிப்பெயர்கள் (நான், நீ, நீங்கள்...)",
      desc: "தமிழின் வேற்றுமை உருபுகளைப் போன்றே தெலுங்கிலும் நேரடியாகப் பொருந்தும்",
      table: [
        { tamil: "நான்", speakInTamil: "நேனு", phonetic: "Nenu", script: "నేను", tip: "தன்னை குறிக்க" },
        { tamil: "நீ", speakInTamil: "நுவ்வு", phonetic: "Nuvvu", script: "నువ్వు", tip: "நண்பர்கள்/இளையோர்" },
        { tamil: "நீங்கள்", speakInTamil: "மீரு", phonetic: "Meeru", script: "మీరు", tip: "மரியாதை விகுதி" },
        { tamil: "அவன்", speakInTamil: "அதனு / வாடு", phonetic: "Athanu / Vaadu", script: "అతను / వాడు", tip: "அவன்" },
        { tamil: "அவள்", speakInTamil: "ஆமெ", phonetic: "Aame", script: "ఆమె", tip: "அவள்" },
        { tamil: "அவர் / அவர்கள்", speakInTamil: "வாரு", phonetic: "Vaaru", script: "వారు", tip: "மரியாதையான பலர்பால்" },
        { tamil: "நாம் (அனைவரும்)", speakInTamil: "மனமு", phonetic: "Manamu", script: "మనము", tip: "கேட்போரையும் சேர்த்து (Inclusive)" },
        { tamil: "நாங்கள் (மட்டும்)", speakInTamil: "மேமு", phonetic: "Memu", script: "మేము", tip: "கேட்போரைத் தவிர்த்து (Exclusive)" }
      ]
    },
    {
      title: "வேற்றுமை உருபுகள் (ஐ, ஆல், கு, இல்...)",
      desc: "தமிழின் உருபுகள் தெலுங்கில் எவ்வாறு பேசப்படுகின்றன:",
      table: [
        { tamil: "என்னை (-ஐ)", speakInTamil: "நன்னு", phonetic: "Nannu", script: "నన్ను", tip: "-நி / -னு விகுதி" },
        { tamil: "என்னுடன் (-உடன்)", speakInTamil: "நாதோ", phonetic: "Naatho", script: "నాతో", tip: "-தோ (-tho) விகுதி" },
        { tamil: "எனக்கு (-கு)", speakInTamil: "நாகு", phonetic: "Naaku", script: "నాకు", tip: "-கு (-ku) விகுதி (தமிழைப் போலவே!)" },
        { tamil: "வீட்டில் (-இல்)", speakInTamil: "இண்ட்லோ", phonetic: "Intlo", script: "ఇంట్లో", tip: "-லோ (-lo) விகுதி" },
        { tamil: "ஊரிலிருந்து (-இருந்து)", speakInTamil: "ஊரி நுண்டி", phonetic: "Oori nundi", script: "ఊరి నుండి", tip: "-நுண்டி விகுதி" }
      ]
    },
    {
      title: "முக்கிய வினைச்சொற்கள் & காலங்கள்",
      desc: "சாப்பிடு (தின்) என்ற சொல் மூன்று காலங்களில்:",
      table: [
        { tamil: "நான் சாப்பிடுகிறேன் (நிகழ்காலம்)", speakInTamil: "நேனு திண்டுன்னானு", phonetic: "Nenu thintunnaanu", script: "నేను తింటున్నాను", tip: "-துன்னானு = -கிறேன்" },
        { tamil: "நான் சாப்பிட்டேன் (இறந்தகாலம்)", speakInTamil: "நேனு தின்னானு", phonetic: "Nenu thinnaanu", script: "నేను తిన్నాను", tip: "தமிழைப் போல 'ன்' வருகிறது!" },
        { tamil: "நான் சாப்பிடுவேன் (எதிர்காலம்)", speakInTamil: "நேனு திண்டானு", phonetic: "Nenu thintaanu", script: "నేను తింటాను", tip: "-டானு = -வேன்" }
      ]
    },
    {
      title: "மரியாதைச் சொல் '-அண்டி' (-andi)",
      desc: "தெலுங்குப் பேச்சில் மிக மிக முக்கியமான அம்சம். வினைச்சொல்லின் இறுதியில் 'அண்டி' சேர்த்தால் மிகுந்த மரியாதை கிடைக்கும்!",
      table: [
        { tamil: "வா -> வாருங்கள்", speakInTamil: "ரா -> ரண்டி", phonetic: "Raa -> Randi", script: "రా -> రండి", tip: "ரண்டி = வாருங்கள்" },
        { tamil: "போ -> போங்கள்", speakInTamil: "வெள்ளு -> வெள்ளண்டி", phonetic: "Vellu -> Vellandi", script: "వెళ్ళు -> వెళ్ళండి", tip: "வெள்ளண்டி = போங்கள்" },
        { tamil: "உட்கார் -> உட்காருங்கள்", speakInTamil: "கூர்ச்சோ -> கூர்ச்சோண்டி", phonetic: "Koorcho -> Koorchondi", script: "కూర్చో -> కూర్చోండి", tip: "கூர்ச்சோண்டி = உட்காருங்கள்" },
        { tamil: "சொல் -> சொல்லுங்கள்", speakInTamil: "செப்பு -> செப்பண்டி", phonetic: "Cheppu -> Cheppandi", script: "చెప్పు -> చెప్పండి", tip: "செப்பண்டி = சொல்லுங்கள்" }
      ]
    }
  ],

  // 3. NUMBERS (எண்கள் - தமிழில் உச்சரிப்புடன்)
  numbers: [
    { num: 1, speakInTamil: "ஒகடி", phonetic: "Okati", script: "ఒకటి", tamil: "ஒன்று" },
    { num: 2, speakInTamil: "ரெண்டு", phonetic: "Rendu", script: "రెండు", tamil: "இரண்டு" },
    { num: 3, speakInTamil: "மூடு", phonetic: "Moodu", script: "మూడు", tamil: "மூன்று" },
    { num: 4, speakInTamil: "நாலுகு", phonetic: "Naalugu", script: "నాలుగు", tamil: "நான்கு" },
    { num: 5, speakInTamil: "ஐது", phonetic: "Aidu", script: "ఐదు", tamil: "ஐந்து" },
    { num: 6, speakInTamil: "ஆறு", phonetic: "Aaru", script: "ఆరు", tamil: "ஆறு" },
    { num: 7, speakInTamil: "ஏடு", phonetic: "Edu", script: "ఏడు", tamil: "ஏழு" },
    { num: 8, speakInTamil: "எனிமிதி", phonetic: "Enimidi", script: "ఎనిమిది", tamil: "எட்டு" },
    { num: 9, speakInTamil: "தொம்மதி", phonetic: "Tommidi", script: "తొమ్మిది", tamil: "ஒன்பது" },
    { num: 10, speakInTamil: "பதி", phonetic: "Padi", script: "పది", tamil: "பத்து" },
    { num: 20, speakInTamil: "இரவை", phonetic: "Iravai", script: "ఇరవై", tamil: "இருபது" },
    { num: 30, speakInTamil: "முப்பை", phonetic: "Muppai", script: "ముప్పై", tamil: "முப்பது" },
    { num: 40, speakInTamil: "நலபை", phonetic: "Nalabhai", script: "నలభై", tamil: "நாற்பது" },
    { num: 50, speakInTamil: "யாபை", phonetic: "Yaabhai", script: "యాభై", tamil: "ஐம்பது" },
    { num: 100, speakInTamil: "வந்தா / நூறு", phonetic: "Vanda / Nooru", script: "వంద", tamil: "நூறு" }
  ],

  // 4. RICH PHRASES DATABASE (வாக்கியங்கள் தமிழில் பேச)
  phrases: [
    {
      id: "te_1",
      category: "daily",
      tamil: "நீங்கள் என்ன செய்கிறீர்கள்?",
      speakInTamil: "மீரு ஏமி சேஸ்துன்னாரு?",
      phonetic: "Meeru emi chesthunnaaru?",
      script: "మీరు ఏమి చేస్తున్నారు?",
      tip: "மீரு = நீங்கள்; ஏமி = என்ன; சேஸ்துன்னாரு = செய்கிறீர்கள்"
    },
    {
      id: "te_2",
      category: "daily",
      tamil: "எனக்கு மிகவும் பசிக்கிறது",
      speakInTamil: "நாகு சாலா ஆகலிகா உந்தி",
      phonetic: "Naaku chaala aakaligaa undi",
      script: "నాకు చాలా ఆకలిగా ఉంది",
      tip: "ஆகலி = பசி; உந்தி = இருக்கிறது"
    },
    {
      id: "te_3",
      category: "daily",
      tamil: "நேரம் என்ன ஆகிறது?",
      speakInTamil: "சமயம் எந்த ஆயிந்தி?",
      phonetic: "Samayam entha ayindi?",
      script: "సమయం ఎంత అయింది?",
      tip: "சமயம் = நேரம்; எந்த = எவ்வளவு; ஆயிந்தி = ஆனது"
    },
    {
      id: "te_4",
      category: "shopping",
      tamil: "எனக்கு இது வேண்டாம், அது வேண்டும்",
      speakInTamil: "நாகு இதி வத்து, அதி காவாலி",
      phonetic: "Naaku idi vaddu, adi kaavaali",
      script: "నాకు ఇది వద్దు, అది కావాలి",
      tip: "வத்து = வேண்டாம்; காவாலி = வேண்டும்"
    },
    {
      id: "te_5",
      category: "shopping",
      tamil: "கொஞ்சம் கம்மியாக கொடுங்கள் அண்ணா",
      speakInTamil: "கொஞ்சம் தக்குவ சேசி இவ்வாண்டி அண்ணா",
      phonetic: "Konchem thakkuva chesi ivvandi anna",
      script: "కొంచెం తక్కువ చేసి ఇవ్వండి అన్నా",
      tip: "தக்குவ = குறைவு; இவ்வாண்டி = கொடுங்கள்"
    },
    {
      id: "te_6",
      category: "travel",
      tamil: "பேருந்து எப்போது வரும்?",
      speakInTamil: "பஸ்ஸு எப்புடு வஸ்துந்தி?",
      phonetic: "Bus eppudu vasthundi?",
      script: "బస్సు ఎప్పుడు వస్తుంది?",
      tip: "எப்புடு = எப்போது; வஸ்துந்தி = வரும்"
    },
    {
      id: "te_7",
      category: "travel",
      tamil: "இந்த வழி எங்கு செல்கிறது?",
      speakInTamil: "ஈ தாரி எக்கடிகி வெள்துந்தி?",
      phonetic: "Ee daari ekkadiki velthundi?",
      script: "ఈ దారి ఎక్కడికి వెళ్తుంది?",
      tip: "ஈ தாரி = இந்த வழி; எக்கடிகி = எங்கே"
    },
    {
      id: "te_8",
      category: "office",
      tamil: "நான் நாளை வருகிறேன்",
      speakInTamil: "நேனு ரேபு வஸ்தானு",
      phonetic: "Nenu repu vasthaanu",
      script: "నేను రేపు వస్తాను",
      tip: "ரேபு = நாளை; வஸ்தானு = வருவேன்"
    },
    {
      id: "te_9",
      category: "office",
      tamil: "நேற்று நான் வரவில்லை",
      speakInTamil: "நின்ன நேனு ராலேது",
      phonetic: "Ninna nenu raaledu",
      script: "నిన్న నేను రాలేదు",
      tip: "நின்ன = நேற்று (தமிழுடன் அச்சு அசல்!); ராலேது = வரவில்லை"
    },
    {
      id: "te_10",
      category: "daily",
      tamil: "சரி, எனக்கு புரிகிறது",
      speakInTamil: "சரே, நாகு அர்த்தமைந்தி",
      phonetic: "Sare, naaku arthamaindi",
      script: "సరే, నాకు అర్థమైంది",
      tip: "அர்த்தமைந்தி = அர்த்தமானது / புரிந்தது"
    }
  ],

  // 5. INTERACTIVE QUIZZES (100% தமிழில்)
  quiz: [
    {
      id: "tq_1",
      question: "தெலுங்கில் 'மீரு எலா உன்னாரு?' (Meeru ela unnaaru?) என்பதன் தமிழ் பொருள் என்ன?",
      options: [
        "நீங்கள் எங்கே போகிறீர்கள்?",
        "நீங்கள் எப்படி இருக்கிறீர்கள்?",
        "உங்கள் பெயர் என்ன?",
        "சாப்பிட்டீர்களா?"
      ],
      correctIndex: 1,
      explanation: "மீரு = நீங்கள், எலா = எப்படி, உன்னாரு = இருக்கிறீர்கள். தமிழில் 'நீங்கள் எப்படி இருக்கிறீர்கள்?' என்று பொருள்."
    },
    {
      id: "tq_2",
      question: "தெலுங்கில் 'எனக்கு வேண்டும்' என்பதை எப்படி சொல்வீர்கள்?",
      options: [
        "நாகு வத்து (Naaku vaddu)",
        "நாகு காவாலி (Naaku kaavaali)",
        "நாகு தெலுசு (Naaku thelusu)",
        "நாகு ராது (Naaku raadu)"
      ],
      correctIndex: 1,
      explanation: "காவாலி (Kaavaali) என்றால் 'வேண்டும்'. வத்து (Vaddu) என்றால் 'வேண்டாம்'."
    },
    {
      id: "tq_3",
      question: "தெலுங்குப் பேச்சில் மரியாதையாக 'வாருங்கள்' என்று அழைக்க எதைச் சொல்ல வேண்டும்?",
      options: [
        "ரா (Raa)",
        "ரண்டி (Randi)",
        "வெள்ளு (Vellu)",
        "சூடண்டி (Choodandi)"
      ],
      correctIndex: 1,
      explanation: "தெலுங்கில் மரியாதைக்கு '-அண்டி' விகுதி சேரும். ரா + அண்டி = ரண்டி (Randi) = வாருங்கள்!"
    },
    {
      id: "tq_4",
      question: "தெலுங்கில் 'எக்கட' (Ekkada) என்பதன் பொருள் என்ன?",
      options: [
        "எப்போது",
        "எப்படி",
        "எங்கே",
        "எதற்கு"
      ],
      correctIndex: 2,
      explanation: "எக்கட (Ekkada) = எங்கே. இக்கட (Ikkada) = இங்கே. அக்கட (Akkada) = அங்கே."
    },
    {
      id: "tq_5",
      question: "தமிழின் 'நேற்று' என்ற சொல் தெலுங்கில் எவ்வாறு அழைக்கப்படுகிறது?",
      options: [
        "ரேபு (Repu)",
        "நின்ன (Ninna)",
        "ஈரோஜு (Eeroju)",
        "மல்லீ (Malli)"
      ],
      correctIndex: 1,
      explanation: "தமிழுக்கும் தெலுங்குக்கும் பொதுவான திராவிடச் சொல் 'நின்ன' (Ninna) = நேற்று! ரேபு = நாளை, ஈரோஜு = இன்று."
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = { TELUGU_COURSE };
}
