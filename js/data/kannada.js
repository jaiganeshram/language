// Complete Kannada Learning Course for Tamil Speakers
// 100% Focused on Spoken Fluency through Tamil Script - No Kannada script reading required!

const KANNADA_COURSE = {
  language: "Kannada",
  tamilName: "கன்னடம்",
  nativeName: "ಕನ್ನಡ",
  speechCode: "kn-IN",
  accentColor: "#ea580c", // Amber / Orange
  tagline: "தமிழ் எழுத்துக்களைக் கொண்டே கன்னடத்தில் சரளமாகப் பேசலாம்!",

  // 1. SPOKEN ESSENTIAL VOCABULARY (அத்தியாவசிய பேச்சுச் சொற்கள் - தமிழில் மட்டும்!)
  spokenVocab: [
    { tamil: "வணக்கம்", speakInTamil: "நமஸ்கார", phonetic: "Namaskaara", script: "ನಮಸ್ಕಾರ" },
    { tamil: "ஆம் (சரி)", speakInTamil: "ஹௌது (சரி)", phonetic: "Haudu (Sari)", script: "ಹೌದು" },
    { tamil: "இல்லை", speakInTamil: "இல்ல", phonetic: "Illa", script: "ಇಲ್ಲ" },
    { tamil: "வேண்டும்", speakInTamil: "பேக்கு", phonetic: "Beku", script: "ಬೇಕು" },
    { tamil: "வேண்டாம்", speakInTamil: "பேடா", phonetic: "Beda", script: "ಬೇಡ" },
    { tamil: "நல்லது / நன்று", speakInTamil: "சென்னாகிதே", phonetic: "Chennaagide", script: "ಚೆನ್ನಾಗಿದೆ" },
    { tamil: "இங்கே", speakInTamil: "இல்லி", phonetic: "Illi", script: "ಇಲ್ಲಿ" },
    { tamil: "அங்கே", speakInTamil: "அல்லி", phonetic: "Alli", script: "ಅಲ್ಲಿ" },
    { tamil: "எங்கே", speakInTamil: "எல்லி", phonetic: "Elli", script: "ಎಲ್ಲಿ" },
    { tamil: "இப்போது", speakInTamil: "ஈக", phonetic: "Eega", script: "ಈಗ" },
    { tamil: "அப்போது", speakInTamil: "ஆக", phonetic: "Aaga", script: "ಆಗ" },
    { tamil: "எப்போது", speakInTamil: "யாவாக", phonetic: "Yaavaaga", script: "ಯಾವಾಗ" },
    { tamil: "வா (வாருங்கள்)", speakInTamil: "பா (பன்னி)", phonetic: "Baa (Banni)", script: "ಬಾ (ಬನ್ನಿ)" },
    { tamil: "போ (போங்கள்)", speakInTamil: "ஹோகு (ஹோகி)", phonetic: "Hogu (Hogi)", script: "ಹೋಗು (ಹೋಗಿ)" },
    { tamil: "சாப்பிடு (சாப்பிடுங்கள்)", speakInTamil: "தின்னு (தின்னி)", phonetic: "Tinnu (Tinni)", script: "ತಿನ್ನು (ತಿನ್ನಿ)" },
    { tamil: "குடி (குடியுங்கள்)", speakInTamil: "குடி (குடியிரி)", phonetic: "Kudi (Kudiyiri)", script: "ಕುಡಿ (ಕುಡಿಯಿರಿ)" },
    { tamil: "பாருங்கள்", speakInTamil: "நோடி", phonetic: "Nodi", script: "ನೋಡಿ" },
    { tamil: "சொல்லுங்கள்", speakInTamil: "ஹேளி", phonetic: "Heli", script: "ಹೇಳಿ" },
    { tamil: "கொடுங்கள்", speakInTamil: "கொடி", phonetic: "Kodi", script: "ಕೊಡಿ" },
    { tamil: "எடுங்கள்", speakInTamil: "தகொள்ளீ", phonetic: "Tagolli", script: "ತಗೊಳ್ಳಿ" },
    { tamil: "தண்ணீர்", speakInTamil: "நீரு", phonetic: "Neeru", script: "ನೀರು" },
    { tamil: "பால்", speakInTamil: "ஹாலு", phonetic: "Haalu", script: "ಹಾಲು" },
    { tamil: "சாப்பாடு / உணவு", speakInTamil: "ஊட்டா", phonetic: "Oota", script: "ಊಟ" },
    { tamil: "பணம் / காசு", speakInTamil: "ஹண", phonetic: "Hana", script: "ಹಣ" },
    { tamil: "விலை", speakInTamil: "பெலெ", phonetic: "Bele", script: "ಬೆಲೆ" },
    { tamil: "எவ்வளவு", speakInTamil: "எஷ்டு", phonetic: "Eshtu", script: "ಎಷ್ಟು" },
    { tamil: "எப்படி", speakInTamil: "ஹேகே", phonetic: "Hege", script: "ಹೇಗೆ" },
    { tamil: "ஏன்", speakInTamil: "யாக்கே", phonetic: "Yaake", script: "ಯಾಕೆ" },
    { tamil: "பெயர்", speakInTamil: "ஹெஸரு", phonetic: "Hesaru", script: "ಹೆಸರು" },
    { tamil: "வீடு", speakInTamil: "மனெ", phonetic: "Mane", script: "ಮನೆ" },
    { tamil: "ஊர்", speakInTamil: "ஊரு", phonetic: "Ooru", script: "ಊರು" },
    { tamil: "இன்று", speakInTamil: "இவத்து", phonetic: "Ivattu", script: "ಇವತ್ತು" },
    { tamil: "நாளை", speakInTamil: "நாளை", phonetic: "Naale", script: "ನಾಳೆ" },
    { tamil: "நேற்று", speakInTamil: "நின்னெ", phonetic: "Ninne", script: "ನಿನ್ನೆ" }
  ],

  // 2. GRAMMAR BRIDGE (தமிழோடு இலக்கணப் பாலம்)
  grammar: [
    {
      title: "பிரதிப்பெயர்கள் (நான், நீ, நீங்கள்...)",
      desc: "தமிழுக்கும் கன்னடத்திற்கும் உச்சரிப்பில் 90% நேரடித் தொடர்பு உண்டு!",
      table: [
        { tamil: "நான்", speakInTamil: "நானு", phonetic: "Naanu", script: "ನಾನು", tip: "தமிழ்: நான் -> கன்னடம்: நானு" },
        { tamil: "நீ", speakInTamil: "நீனு", phonetic: "Neenu", script: "ನೀನು", tip: "தமிழ்: நீ -> கன்னடம்: நீனு" },
        { tamil: "நீங்கள்", speakInTamil: "நீவு", phonetic: "Neevu", script: "ನೀವು", tip: "மரியாதை விகுதி 'வு'" },
        { tamil: "அவன்", speakInTamil: "அவனு", phonetic: "Avanu", script: "ಅವನು", tip: "அப்படியே தமிழ்தான்!" },
        { tamil: "அவள்", speakInTamil: "அவளு", phonetic: "Avalu", script: "ಅವಳು", tip: "அப்படியே தமிழ்தான்!" },
        { tamil: "அவர் / அவர்கள்", speakInTamil: "அவரு", phonetic: "Avaru", script: "ಅವರು", tip: "மரியாதையான பலர்பால்" },
        { tamil: "நாம் / நாங்கள்", speakInTamil: "நாவு", phonetic: "Naavu", script: "ನಾವು", tip: "நாங்கள்" },
        { tamil: "இது / அது", speakInTamil: "இது / அது", phonetic: "Idu / Adu", script: "ಇದು / ಅದು", tip: "100% தமிழ் சொற்களே!" }
      ]
    },
    {
      title: "தமிழின் 'ப' -> கன்னடத்தின் 'ஹ' ரகசியம் (Pa -> Ha Shift)",
      desc: "இந்த ஒரு விதியைத் தெரிந்து கொண்டாலே 500 கன்னடச் சொற்கள் உடனே புரிந்துவிடும்!",
      table: [
        { tamil: "பால்", speakInTamil: "ஹாலு", phonetic: "Haalu", script: "ಹಾಲು", tip: "ப -> ஹ மாற்றம்" },
        { tamil: "பூ", speakInTamil: "ஹூவு", phonetic: "Hoovu", script: "ಹೂವು", tip: "ப -> ஹ மாற்றம்" },
        { tamil: "பத்து", speakInTamil: "ஹத்து", phonetic: "Hattu", script: "ಹತ್ತು", tip: "ப -> ஹ மாற்றம்" },
        { tamil: "பல்", speakInTamil: "ஹல்லு", phonetic: "Hallu", script: "ಹಲ್ಲು", tip: "ப -> ஹ மாற்றம்" },
        { tamil: "பழைய", speakInTamil: "ஹளெய", phonetic: "Haleya", script: "ಹಳೆಯ", tip: "ப -> ஹ மாற்றம்" },
        { tamil: "பச்சை", speakInTamil: "ஹசிரு", phonetic: "Hasiru", script: "ಹಸಿರು", tip: "ப -> ஹ மாற்றம்" },
        { tamil: "பணம்", speakInTamil: "ஹண", phonetic: "Hana", script: "ಹಣ", tip: "ப -> ஹ மாற்றம்" }
      ]
    },
    {
      title: "வேற்றுமை உருபுகள் (ஐ, கு, இல், இருந்து...)",
      desc: "தமிழின் வேற்றுமை உருபுகள் கன்னடத்தில் பேசும் விதம்:",
      table: [
        { tamil: "என்னை (-ஐ)", speakInTamil: "நன்னன்னு", phonetic: "Nannannu", script: "ನನ್ನನ್ನು", tip: "-அன்னு விகுதி" },
        { tamil: "எனக்கு (-கு)", speakInTamil: "நனகெ", phonetic: "Nanage", script: "ನನಗೆ", tip: "-கெ (-ge) விகுதி" },
        { tamil: "என்னுடன் (-உடன்)", speakInTamil: "நன்ன ஜொதெ", phonetic: "Nanna jothe", script: "ನನ್ನ ಜೊತೆ", tip: "ஜொதெ = கூட / உடன்" },
        { tamil: "வீட்டில் (-இல்)", speakInTamil: "மனெயல்லி", phonetic: "Maneyalli", script: "ಮನೆಯಲ್ಲಿ", tip: "-அல்லி (-alli) = இல் / உள்ளே" },
        { tamil: "ஊரிலிருந்து (-இருந்து)", speakInTamil: "ஊரினிந்த", phonetic: "Oorininda", script: "ಊರಿನಿಂದ", tip: "-இந்த (-inda) = இருந்து" }
      ]
    },
    {
      title: "முக்கிய கட்டளை & மரியாதை வினைச்சொற்கள்",
      desc: "பெங்களூர் அல்லது கர்நாடகாவில் அன்றாடம் புழங்கும் வினைச்சொற்கள்:",
      table: [
        { tamil: "வா -> வாருங்கள்", speakInTamil: "பா -> பன்னி", phonetic: "Baa -> Banni", script: "ಬಾ -> ಬನ್ನಿ", tip: "பன்னி = வாருங்கள்" },
        { tamil: "போ -> போங்கள்", speakInTamil: "ஹோகு -> ஹோகி", phonetic: "Hogu -> Hogi", script: "ಹೋಗು -> ಹೋಗಿ", tip: "ஹோகி = போங்கள்" },
        { tamil: "உட்கார் -> உட்காருங்கள்", speakInTamil: "கூத்கோ -> கூத்கொள்ளி", phonetic: "Kootko -> Kootkolli", script: "ಕೂತ್ಕೋ -> ಕೂತ್ಕೊಳ್ಳಿ", tip: "கூத்கொள்ளி = உட்காருங்கள்" },
        { tamil: "கொடு -> கொடுங்கள்", speakInTamil: "கொடு -> கொடி", phonetic: "Kodu -> Kodi", script: "ಕೊಡು -> ಕೊಡಿ", tip: "கொடி = கொடுங்கள்" },
        { tamil: "சொல் -> சொல்லுங்கள்", speakInTamil: "ஹேளு -> ஹேளி", phonetic: "Helu -> Heli", script: "ಹೇಳು -> ಹೇಳಿ", tip: "ஹேளி = சொல்லுங்கள்" }
      ]
    }
  ],

  // 3. NUMBERS (எண்கள் - தமிழில் உச்சரிப்புடன்)
  numbers: [
    { num: 1, speakInTamil: "ஒந்து", phonetic: "Ondu", script: "ಒಂದು", tamil: "ஒன்று" },
    { num: 2, speakInTamil: "எரடு", phonetic: "Eradu", script: "ಎರಡು", tamil: "இரண்டு" },
    { num: 3, speakInTamil: "மூரு", phonetic: "Mooru", script: "ಮೂರು", tamil: "மூன்று" },
    { num: 4, speakInTamil: "நால்கு", phonetic: "Naalku", script: "ನಾಲ್ಕು", tamil: "நான்கு" },
    { num: 5, speakInTamil: "ஐது", phonetic: "Aidu", script: "ಐದು", tamil: "ஐந்து" },
    { num: 6, speakInTamil: "ஆறு", phonetic: "Aaru", script: "ಆರು", tamil: "ஆறு" },
    { num: 7, speakInTamil: "ஏளு", phonetic: "Elu", script: "ಏಳು", tamil: "ஏழு" },
    { num: 8, speakInTamil: "எண்டு", phonetic: "Entu", script: "ಎಂಟು", tamil: "எட்டு" },
    { num: 9, speakInTamil: "ஒம்பத்து", phonetic: "Ombattu", script: "ಒಂಬತ್ತು", tamil: "ஒன்பது" },
    { num: 10, speakInTamil: "ஹத்து", phonetic: "Hattu", script: "ಹತ್ತು", tamil: "பத்து" },
    { num: 20, speakInTamil: "இப்பத்து", phonetic: "Ippattu", script: "ಇಪ್ಪತ್ತು", tamil: "இருபது" },
    { num: 30, speakInTamil: "மூவத்து", phonetic: "Moovattu", script: "ಮೂವತ್ತು", tamil: "முப்பது" },
    { num: 40, speakInTamil: "நலவத்து", phonetic: "Nalavattu", script: "ನಲವತ್ತು", tamil: "நாற்பது" },
    { num: 50, speakInTamil: "ஐவத்து", phonetic: "Aivattu", script: "ಐವತ್ತು", tamil: "ஐம்பது" },
    { num: 100, speakInTamil: "நூரு", phonetic: "Nooru", script: "ನೂರು", tamil: "நூறு" }
  ],

  // 4. RICH PHRASES DATABASE (வாக்கியங்கள் தமிழில் பேச)
  phrases: [
    {
      id: "kn_1",
      category: "daily",
      tamil: "சாப்பிட்டீர்களா?",
      speakInTamil: "ஊட்டா ஆயித்தா?",
      phonetic: "Oota aaythaa?",
      script: "ಊಟ ಆಯ್ತಾ?",
      tip: "கர்நாடகாவின் மிகச் சிறந்த வாழ்த்து விசாரிப்பு!"
    },
    {
      id: "kn_2",
      category: "daily",
      tamil: "எனக்கு கன்னடம் கொஞ்சம் தெரியும்",
      speakInTamil: "நனகெ ஸ்வல்ப்ப கன்னட கொத்து",
      phonetic: "Nanage svalpa Kannada gottu",
      script: "ನನಗೆ ಸ್ವಲ್ಪ ಕನ್ನಡ ಗೊತ್ತು",
      tip: "நனகெ = எனக்கு; ஸ்வல்ப்ப = கொஞ்சம்; கொத்து = தெரியும்"
    },
    {
      id: "kn_3",
      category: "daily",
      tamil: "வேண்டாம், எனக்கு வேண்டாம்",
      speakInTamil: "பேடா, நனகெ பேடா",
      phonetic: "Beda, nanage beda",
      script: "ಬೇಡ, ನನಗೆ ಬೇಡ",
      tip: "பேக்கு = வேண்டும்; பேடா = வேண்டாம்"
    },
    {
      id: "kn_4",
      category: "shopping",
      tamil: "ஆட்டோக்காரரிடம்: மெஜஸ்டிக் போகுமா?",
      speakInTamil: "மெஜஸ்டிகே ஹோகுத்தா?",
      phonetic: "Majestic-ge hoguttaa?",
      script: "ಮೆಜೆಸ್ಟಿಕ್‌ಗೆ ಹೋಗುತ್ತಾ?",
      tip: "ஹோகுத்தா = போகுமா; -கெ = -க்கு"
    },
    {
      id: "kn_5",
      category: "shopping",
      tamil: "மீட்டர் போடுங்கள் அண்ணா",
      speakInTamil: "மீட்டர் ஹாக்கி அண்ணா",
      phonetic: "Meter haaki anna",
      script: "ಮೀಟರ್ ಹಾಕಿ ಅಣ್ಣ",
      tip: "ஹாக்கி = போடுங்கள் (தமிழ்போலவே 'அண்ணா')"
    },
    {
      id: "kn_6",
      category: "travel",
      tamil: "இங்கே இறங்க வேண்டும்",
      speakInTamil: "இல்லி இளிபேக்கு",
      phonetic: "Illi ilibeku",
      script: "ಇಲ್ಲಿ ಇಳಿಬೇಕು",
      tip: "இல்லி = இங்கே; இளிபேக்கு = இறங்க வேண்டும்"
    },
    {
      id: "kn_7",
      category: "office",
      tamil: "இன்று நான் அலுவலகம் வருகிறேன்",
      speakInTamil: "இவத்து நானு ஆஃபிஸ்கே பர்த்தீனி",
      phonetic: "Ivattu naanu office-ge barteeni",
      script: "ಇವತ್ತು ನಾನು ಆಫೀಸ್‌ಗೆ ಬರ್ತೀನಿ",
      tip: "இவத்து = இன்று; பர்த்தீனி = வருகிறேன்"
    },
    {
      id: "kn_8",
      category: "office",
      tamil: "நாளை பேசலாம்",
      speakInTamil: "நாளை மாதனாடோண",
      phonetic: "Naale maatanaadona",
      script: "ನಾಳೆ ಮಾತನಾಡೋಣ",
      tip: "நாளை = நாளை (அப்படியே தமிழ்தான்!); மாதனாடோண = பேசலாம்"
    },
    {
      id: "kn_9",
      category: "food",
      tamil: "சாம்பார் கொஞ்சம் அதிகமாக ஊற்றுங்கள்",
      speakInTamil: "சாம்பார் ஸ்வல்ப்ப ஜாஸ்தி ஹாக்கி",
      phonetic: "Saambaar svalpa jaasti haaki",
      script: "ಸಾಂಬಾರ್ ಸ್ವಲ್ಪ ಜಾಸ್ತಿ ಹಾಕಿ",
      tip: "ஜாஸ்தி = அதிகம்; ஹாக்கி = போடுங்கள்/ஊற்றுங்கள்"
    },
    {
      id: "kn_10",
      category: "emergency",
      tamil: "உடனடியாக வாருங்கள், அவசரம்",
      speakInTamil: "பேக பன்னி, துர்த்து",
      phonetic: "Bega banni, thurtu",
      script: "ಬೇಗ ಬನ್ನಿ, ತುರ್ತು",
      tip: "பேக = சீக்கிரம்/விரைவாக; பன்னி = வாருங்கள்"
    }
  ],

  // 5. INTERACTIVE QUIZZES (100% தமிழில்)
  quiz: [
    {
      id: "kq_1",
      question: "தமிழின் 'பால்' என்ற சொல் கன்னடத்தில் பேசும்போது எவ்வாறு மாறுகிறது?",
      options: [
        "பாலு (Baalu)",
        "ஹாலு (Haalu)",
        "பாலா (Paala)",
        "நீரு (Neeru)"
      ],
      correctIndex: 1,
      explanation: "தமிழின் முதல் எழுத்து 'ப', கன்னடத்தில் 'ஹ' என்று மாறும் விதியின்படி, பால் -> ஹாலு (Haalu) என்றாகிறது!"
    },
    {
      id: "kq_2",
      question: "கன்னடத்தில் 'ஊட்டா ஆயித்தா?' (Oota aaythaa?) என்று கேட்டால் என்ன பொருள்?",
      options: [
        "எப்போது வருவீர்கள்?",
        "சாப்பிட்டீர்களா?",
        "தூங்கிவிட்டீர்களா?",
        "எங்கு செல்கிறீர்கள்?"
      ],
      correctIndex: 1,
      explanation: "ஊட்டா = சாப்பாடு, ஆயித்தா = ஆகிவிட்டதா. கர்நாடகாவில் 'சாப்பிட்டீர்களா?' என்று கேட்கும் மிக முக்கிய சொல்."
    },
    {
      id: "kq_3",
      question: "கன்னடத்தில் 'எனக்கு வேண்டும்' என்பதை எப்படி சொல்வீர்கள்?",
      options: [
        "நனகெ பேடா (Nanage beda)",
        "நனகெ பேக்கு (Nanage beku)",
        "நனகெ கொத்து (Nanage gottu)",
        "நனகெ பேக (Nanage bega)"
      ],
      correctIndex: 1,
      explanation: "நனகெ பேக்கு (Nanage beku) என்றால் எனக்கு வேண்டும். பேடா (Beda) என்றால் வேண்டாம்."
    },
    {
      id: "kq_4",
      question: "தமிழின் 'வாருங்கள்' என்பதற்கு இணையான கன்னட மரியாதைச் சொல் எது?",
      options: [
        "பா (Baa)",
        "பன்னி (Banni)",
        "ஹோகி (Hogi)",
        "நில்லிசி (Nillisi)"
      ],
      correctIndex: 1,
      explanation: "பா (Baa) என்றால் வா (மரியாதையற்றது). பன்னி (Banni) என்றால் மரியாதையான வாருங்கள்!"
    },
    {
      id: "kq_5",
      question: "பெங்களூர் ஆட்டோவில் செல்லும்போது 'நேராக போங்கள்' என கன்னடத்தில் எப்படிக் கேட்பீர்கள்?",
      options: [
        "பலகடே திருகி (Balagade tirugi)",
        "எடகடே திருகி (Edagade tirugi)",
        "நேரவாகி ஹோகி (Neeravaagi hogi)",
        "இல்லி நில்லிசி (Illi nillisi)"
      ],
      correctIndex: 2,
      explanation: "நேரவாகி ஹோகி (Neeravaagi hogi) = நேராக போங்கள். பலகடே = வலது, எடகடே = இடது, நில்லிசி = நிறுத்துங்கள்."
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = { KANNADA_COURSE };
}
