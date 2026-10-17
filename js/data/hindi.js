// Complete Hindi Learning Course for Tamil Speakers
// 100% Focused on Spoken Fluency through Tamil Script - No Devanagari script reading required!

const HINDI_COURSE = {
  language: "Hindi",
  tamilName: "இந்தி",
  nativeName: "हिन्दी",
  speechCode: "hi-IN",
  accentColor: "#3b82f6", // Royal Blue
  tagline: "தமிழ் எழுத்துக்களைக் கொண்டே இந்தியில் சரளமாகப் பேசலாம்!",

  // 1. SPOKEN ESSENTIAL VOCABULARY (அத்தியாவசிய பேச்சுச் சொற்கள் - தமிழில் மட்டும்!)
  spokenVocab: [
    { tamil: "வணக்கம்", speakInTamil: "நமஸ்தே / நமஸ்கார்", phonetic: "Namaste / Namaskaar", script: "नमस्ते" },
    { tamil: "ஆம் (சரி)", speakInTamil: "ஹாம் / அச்சா", phonetic: "Haan / Achha", script: "हाँ / अच्छा" },
    { tamil: "இல்லை", speakInTamil: "நஹீம்", phonetic: "Nahi", script: "नहीं" },
    { tamil: "வேண்டும்", speakInTamil: "சாஹியே", phonetic: "Chaahiye", script: "चाहिए" },
    { tamil: "வேண்டாம்", speakInTamil: "நஹீம் சாஹியே", phonetic: "Nahi chaahiye", script: "नहीं चाहिए" },
    { tamil: "நல்லது / நன்று", speakInTamil: "பஹுத் அச்சா", phonetic: "Bahut achha", script: "बहुत अच्छा" },
    { tamil: "இங்கே", speakInTamil: "யஹாம்", phonetic: "Yahaan", script: "यहाँ" },
    { tamil: "அங்கே", speakInTamil: "வஹாம்", phonetic: "Vahaan", script: "वहाँ" },
    { tamil: "எங்கே", speakInTamil: "கஹாம்", phonetic: "Kahaan", script: "कहाँ" },
    { tamil: "இப்போது", speakInTamil: "அப்", phonetic: "Ab", script: "अब" },
    { tamil: "அப்போது", speakInTamil: "தப்", phonetic: "Tab", script: "तब" },
    { tamil: "எப்போது", speakInTamil: "கப்", phonetic: "Kab", script: "कब" },
    { tamil: "வா (வாருங்கள்)", speakInTamil: "ஆவோ (ஆயியே)", phonetic: "Aao (Aayiye)", script: "आओ (आइए)" },
    { tamil: "போ (போங்கள்)", speakInTamil: "ஜாவோ (ஜாயியே)", phonetic: "Jaao (Jaayiye)", script: "जाओ (जाइए)" },
    { tamil: "சாப்பிடு (சாப்பிடுங்கள்)", speakInTamil: "காவோ (காயியே)", phonetic: "Khaao (Khaayiye)", script: "खाओ (खाइए)" },
    { tamil: "குடி (குடியுங்கள்)", speakInTamil: "பீவோ (பீஜியே)", phonetic: "Peevo (Peejiye)", script: "पीओ (पीजिए)" },
    { tamil: "பாருங்கள்", speakInTamil: "தேகியே", phonetic: "Dekhiye", script: "देखिए" },
    { tamil: "சொல்லுங்கள்", speakInTamil: "போலியே / கஹியே", phonetic: "Boliye / Kahiye", script: "बोलिए" },
    { tamil: "கொடுங்கள்", speakInTamil: "தீஜியே", phonetic: "Dijiye", script: "दीजिए" },
    { tamil: "எடுங்கள்", speakInTamil: "லீஜியே", phonetic: "Leejiye", script: "लीजिए" },
    { tamil: "தண்ணீர்", speakInTamil: "பானி", phonetic: "Paani", script: "पानी" },
    { tamil: "பால்", speakInTamil: "தூத்", phonetic: "Doodh", script: "दूध" },
    { tamil: "சாப்பாடு / உணவு", speakInTamil: "கானா", phonetic: "Khaana", script: "खाना" },
    { tamil: "பணம் / காசு", speakInTamil: "பைஸா / ருபயா", phonetic: "Paisa / Rupaya", script: "पैसा / रुपया" },
    { tamil: "விலை", speakInTamil: "தாம் / பாவ்", phonetic: "Daam / Bhaav", script: "दाम" },
    { tamil: "எவ்வளவு", speakInTamil: "கித்னா", phonetic: "Kitna", script: "कितना" },
    { tamil: "எப்படி", speakInTamil: "கைஸே", phonetic: "Kaise", script: "कैसे" },
    { tamil: "ஏன்", speakInTamil: "க்யூம்", phonetic: "Kyun", script: "क्यों" },
    { tamil: "பெயர்", speakInTamil: "நாம்", phonetic: "Naam", script: "नाम" },
    { tamil: "வீடு", speakInTamil: "கர்", phonetic: "Ghar", script: "घर" },
    { tamil: "ஊர் / நகரம்", speakInTamil: "ஷஹர் / காவ்", phonetic: "Shahar / Gaon", script: "शहर / गाँव" },
    { tamil: "இன்று", speakInTamil: "ஆஜ்", phonetic: "Aaj", script: "आज" },
    { tamil: "நாளை / நேற்று", speakInTamil: "கல் (நாளைக்கும் நேற்றுக்கும்)", phonetic: "Kal (same word in Hindi!)", script: "कल" }
  ],

  // 2. GRAMMAR BRIDGE (தமிழோடு இலக்கணப் பாலம்)
  grammar: [
    {
      title: "பிரதிப்பெயர்கள் & மரியாதை நிலைகள் (Pronouns)",
      desc: "இந்தியில் 'நீ' என்பதற்கு மூன்று மரியாதைப் படிகள் உள்ளன:",
      table: [
        { tamil: "நான்", speakInTamil: "மைன்", phonetic: "Main", script: "मैं", tip: "தன்னை குறிக்க" },
        { tamil: "நீ (இளையோர்/அன்பானவர்)", speakInTamil: "தூ / தும்", phonetic: "Tu / Tum", script: "तू / तुम", tip: "தும் = சம வயதினரிடம்" },
        { tamil: "நீங்கள் (மரியாதை)", speakInTamil: "ஆப்", phonetic: "Aap", script: "आप", tip: "எப்போதும் 'ஆப்' பயன்படுத்துவது நற்பெயர் தரும்!" },
        { tamil: "அவன் / அவள் / அது", speakInTamil: "வஹ் (பேச்சில்: வோ)", phonetic: "Vah (Vo)", script: "वह", tip: "ஆண்பால்/பெண்பால் இரண்டிற்கும் பொதுவானது" },
        { tamil: "அவர்கள் / இவை", speakInTamil: "வே / யே", phonetic: "Ve / Ye", script: "वे / ये", tip: "பலர்பால்" },
        { tamil: "நாம் / நாங்கள்", speakInTamil: "ஹம்", phonetic: "Hum", script: "हम", tip: "நாங்கள்" }
      ]
    },
    {
      title: "பால் பாகுபாடு ரகசியம் (Gender Rules)",
      desc: "தமிழில் உயிரற்ற பொருட்களுக்கு பால் கிடையாது. ஆனால் இந்தியில் மேஜை, புத்தகம் என எல்லாவற்றிற்கும் ஆண்/பெண் உண்டு!",
      table: [
        { tamil: "நான் போகிறேன் (ஆண் பேசினால்)", speakInTamil: "மைன் ஜாதா ஹூன்", phonetic: "Main jaata hoon", script: "मैं जाता हूँ", tip: "-ஆ (-aa) விகுதி ஆண்பால்" },
        { tamil: "நான் போகிறேன் (பெண் பேசினால்)", speakInTamil: "மைன் ஜாதீ ஹூன்", phonetic: "Main jaati hoon", script: "मैं जाती हूँ", tip: "-ஈ (-ee) விகுதி பெண்பால்" },
        { tamil: "அவர் சாப்பிடுகிறார் (ஆண்)", speakInTamil: "வஹ் காதா ஹை", phonetic: "Vah khaata hai", script: "वह खाता है", tip: "காதா = சாப்பிடுகிறான்" },
        { tamil: "அவள் சாப்பிடுகிறாள் (பெண்)", speakInTamil: "வஹ் காதீ ஹை", phonetic: "Vah khaati hai", script: "वह खाती है", tip: "காதீ = சாப்பிடுகிறாள்" }
      ]
    },
    {
      title: "முக்கிய உருபுகள் (காரக் உருபுகள்)",
      desc: "தமிழில் பெயர்ச்சொல்லுடன் இணையும் உருபுகள் இந்தியில் தனிச் சொல்லாக வரும்:",
      table: [
        { tamil: "எனக்கு / ராமனுக்கு (-க்கு / -ஐ)", speakInTamil: "முஜே / ராம் கோ", phonetic: "Mujhe / Ram ko", script: "मुझे / राम को", tip: "'கோ' (Ko) = -க்கு / -ஐ" },
        { tamil: "ராமனோடு / சென்னையிலிருந்து", speakInTamil: "ராம் சே / சென்னை சே", phonetic: "Ram se / Chennai se", script: "राम से / चेन्नई से", tip: "'சே' (Se) = -உடன் / -இருந்து / -ஆல்" },
        { tamil: "வீட்டில் (-இல்)", speakInTamil: "கர் மேம்", phonetic: "Ghar mein", script: "घर में", tip: "'மேம்' (Mein) = -இல் / உள்ளே" },
        { tamil: "மேஜை மீது (-மீது)", speakInTamil: "மேஜ் பர்", phonetic: "Mez par", script: "मेज पर", tip: "'பர்' (Par) = மீது / மேல்" },
        { tamil: "என்னுடைய (ஆண்/பெண்)", speakInTamil: "மேரா / மேரி", phonetic: "Mera / Meri", script: "मेरा / मेरी", tip: "மேரா பையன், மேரி பெண்" }
      ]
    },
    {
      title: "மரியாதை வினைச்சொற்கள் (-இயே)",
      desc: "இந்தியில் மரியாதையாக பேச 'இயே' விகுதி சேருங்கள்:",
      table: [
        { tamil: "வாருங்கள்", speakInTamil: "ஆயியே", phonetic: "Aayiye", script: "आइए", tip: "ஆனா (வருதல்) -> ஆயியே" },
        { tamil: "போங்கள்", speakInTamil: "ஜாயியே", phonetic: "Jaayiye", script: "जाइए", tip: "ஜானா (போதல்) -> ஜாயியே" },
        { tamil: "உட்காருங்கள்", speakInTamil: "பைட்டியே", phonetic: "Baithiye", script: "बैठिए", tip: "பைட்னா (அமர்தல்) -> பைட்டியே" },
        { tamil: "கொடுங்கள்", speakInTamil: "தீஜியே", phonetic: "Dijiye", script: "दीजिए", tip: "தேனா (கொடுத்தல்) -> தீஜியே" },
        { tamil: "சொல்லுங்கள்", speakInTamil: "போலியே / கஹியே", phonetic: "Boliye / Kahiye", script: "बोलिए / कहिए", tip: "போலியே = சொல்லுங்கள்" }
      ]
    }
  ],

  // 3. NUMBERS (எண்கள் - தமிழில் உச்சரிப்புடன்)
  numbers: [
    { num: 1, speakInTamil: "ஏக்", phonetic: "Ek", script: "एक", tamil: "ஒன்று" },
    { num: 2, speakInTamil: "தோ", phonetic: "Do", script: "दो", tamil: "இரண்டு" },
    { num: 3, speakInTamil: "தீன்", phonetic: "Teen", script: "तीन", tamil: "மூன்று" },
    { num: 4, speakInTamil: "சார்", phonetic: "Chaar", script: "चार", tamil: "நான்கு" },
    { num: 5, speakInTamil: "பாஞ்ச்", phonetic: "Paanch", script: "पाँच", tamil: "ஐந்து" },
    { num: 6, speakInTamil: "சே", phonetic: "Chhah", script: "छह", tamil: "ஆறு" },
    { num: 7, speakInTamil: "சாத்", phonetic: "Saat", script: "सात", tamil: "ஏழு" },
    { num: 8, speakInTamil: "ஆட்", phonetic: "Aath", script: "आठ", tamil: "எட்டு" },
    { num: 9, speakInTamil: "நௌ", phonetic: "Nau", script: "नौ", tamil: "ஒன்பது" },
    { num: 10, speakInTamil: "தஸ்", phonetic: "Das", script: "दस", tamil: "பத்து" },
    { num: 20, speakInTamil: "பீஸ்", phonetic: "Bees", script: "बीस", tamil: "இருபது" },
    { num: 30, speakInTamil: "தீஸ்", phonetic: "Tees", script: "तीस", tamil: "முப்பது" },
    { num: 40, speakInTamil: "சாலீஸ்", phonetic: "Chaalees", script: "चालीस", tamil: "நாற்பது" },
    { num: 50, speakInTamil: "பசாஸ்", phonetic: "Pachaas", script: "पचास", tamil: "ஐம்பது" },
    { num: 100, speakInTamil: "சௌ", phonetic: "Sau", script: "सौ", tamil: "நூறு" }
  ],

  // 4. RICH PHRASES DATABASE (வாக்கியங்கள் தமிழில் பேச)
  phrases: [
    {
      id: "hi_1",
      category: "daily",
      tamil: "நீங்கள் என்ன செய்கிறீர்கள்?",
      speakInTamil: "ஆப் க்யா கர் ரஹே ஹைன்?",
      phonetic: "Aap kya kar rahe hain?",
      script: "आप क्या कर रहे हैं?",
      tip: "ஆப் = நீங்கள்; க்யா = என்ன; கர் ரஹே ஹைன் = செய்து கொண்டிருக்கிறீர்கள்"
    },
    {
      id: "hi_2",
      category: "daily",
      tamil: "எனக்கு புரியவில்லை",
      speakInTamil: "முஜே சமஜ் நஹீம் ஆயா",
      phonetic: "Mujhe samajh nahi aaya",
      script: "मुझे समझ नहीं आया",
      tip: "சமஜ் = புரிதல்; நஹீம் ஆயா = வரவில்லை/புரியவில்லை"
    },
    {
      id: "hi_3",
      category: "daily",
      tamil: "எனக்கு இந்தி பேச தெரியாது",
      speakInTamil: "முஜே ஹிந்தி போல்னா நஹீம் ஆதா",
      phonetic: "Mujhe Hindi bolna nahi aata",
      script: "मुझे हिन्दी बोलना नहीं आता",
      tip: "போல்னா = பேசுவது; நஹீம் ஆதா = வராது/தெரியாது"
    },
    {
      id: "hi_4",
      category: "shopping",
      tamil: "இது மிகவும் விலை அதிகம்",
      speakInTamil: "யஹ் பஹுத் மஹங்கா ஹை",
      phonetic: "Yeh bahut mehanga hai",
      script: "यह बहुत महँगा है",
      tip: "மஹங்கா = விலை அதிகம்; சஸ்தா = மலிவானது"
    },
    {
      id: "hi_5",
      category: "shopping",
      tamil: "கொஞ்சம் கம்மி செய்யுங்கள்",
      speakInTamil: "தோடா கம் கீஜியே",
      phonetic: "Thoda kam kijiye",
      script: "थोड़ा कम कीजिए",
      tip: "தோடா = கொஞ்சம்; கம் கீஜியே = குறைக்கவும்"
    },
    {
      id: "hi_6",
      category: "travel",
      tamil: "டெல்லி விமான நிலையம் போக வேண்டும்",
      speakInTamil: "முஜே தில்லி ஏர்போர்ட் ஜானா ஹை",
      phonetic: "Mujhe Delhi airport jaana hai",
      script: "मुझे दिल्ली एयरपोर्ट जाना है",
      tip: "ஜானா ஹை = போக வேண்டும்"
    },
    {
      id: "hi_7",
      category: "food",
      tamil: "காரமில்லாத உணவு கொடுங்கள்",
      speakInTamil: "பினா மிர்ச் வாலா கானா தீஜியே",
      phonetic: "Bina mirch waala khaana dijiye",
      script: "बिना मिर्च वाला खाना दीजिए",
      tip: "பினா = இல்லாமல்; மிர்ச் = மிளகாய்/காரம்"
    },
    {
      id: "hi_8",
      category: "office",
      tamil: "நான் பிறகு அழைக்கிறேன்",
      speakInTamil: "மைன் பாத் மேம் கால் கருங்கா",
      phonetic: "Main baad mein call karoonga",
      script: "मैं बाद में कॉल करूँगा",
      tip: "பாத் மேம் = பிறகு; கருங்கா = செய்வேன்"
    },
    {
      id: "hi_9",
      category: "daily",
      tamil: "எந்த பிரச்சினையும் இல்லை / பரவாயில்லை",
      speakInTamil: "கோயி பாத் நஹீம்",
      phonetic: "Koi baat nahi",
      script: "कोई बात नहीं",
      tip: "மிகப் பரவலாக பயன்படும் 'பரவாயில்லை' என்ற சொல்"
    },
    {
      id: "hi_10",
      category: "emergency",
      tamil: "தயவுசெய்து ஆம்புலன்ஸை அழையுங்கள்",
      speakInTamil: "க்ருபயா ஆம்புலன்ஸ் புலாயியே",
      phonetic: "Kripaya ambulance bulaiye",
      script: "कृपया एम्बुलेंस बुलाइए",
      tip: "புலாயியே = அழையுங்கள்/கூப்பிடுங்கள்"
    }
  ],

  // 5. INTERACTIVE QUIZZES (100% தமிழில்)
  quiz: [
    {
      id: "hq_1",
      question: "இந்தியில் 'ஆப்கா நாம் க்யா ஹை?' (Aapka naam kya hai?) என்பதன் தமிழ் பொருள் என்ன?",
      options: [
        "நீங்கள் எங்கே இருக்கிறீர்கள்?",
        "உங்கள் பெயர் என்ன?",
        "நீங்கள் என்ன செய்கிறீர்கள்?",
        "சாப்பிட்டீர்களா?"
      ],
      correctIndex: 1,
      explanation: "ஆப்கா = உங்கள், நாம் = பெயர், க்யா = என்ன, ஹை = இருக்கிறது. தமிழில் 'உங்கள் பெயர் என்ன?' என்பது இதன் பொருள்."
    },
    {
      id: "hq_2",
      question: "இந்தியில் ஒரு பெண் 'நான் போகிறேன்' என்று கூறும்போது எதைப் பயன்படுத்த வேண்டும்?",
      options: [
        "மைன் ஜாதா ஹூன் (Main jaata hoon)",
        "மைன் ஜாதீ ஹூன் (Main jaati hoon)",
        "மைன் ஜாதே ஹைன் (Main jaate hain)",
        "மைன் கயா (Main gaya)"
      ],
      correctIndex: 1,
      explanation: "இந்தியில் பெண்பால் வினைச்சொற்களுக்கு '-ஈ' (Jaati / ஜாதீ) விகுதி வரும். ஆண்பால் என்றால் 'ஜாத்தா' (Jaata)."
    },
    {
      id: "hq_3",
      question: "ஹிந்தியில் 'தண்ணீர் வேண்டும்' என்பதை எப்படி கேட்பீர்கள்?",
      options: [
        "பானி தீஜியே / சாஹியே (Paani dijiye / chaahiye)",
        "சாய் தீஜியே (Chai dijiye)",
        "தூத் தீஜியே (Doodh dijiye)",
        "கானா தீஜியே (Khaana dijiye)"
      ],
      correctIndex: 0,
      explanation: "பானி (Paani) = தண்ணீர். சாஹியே = வேண்டும். தீஜியே = கொடுங்கள்."
    },
    {
      id: "hq_4",
      question: "தமிழின் 'சரி / பரவாயில்லை / பிரச்சனை இல்லை' என்பதற்கு இணையான ஹிந்தி சொல் எது?",
      options: [
        "கோயி பாத் நஹீம் (Koi baat nahi)",
        "பஹுத் அச்சா (Bahut achha)",
        "கஹாம் ஹை (Kahaan hai)",
        "க்யூம் நஹீம் (Kyun nahi)"
      ],
      correctIndex: 0,
      explanation: "'கோயி பாத் நஹீம்' (Koi baat nahi) என்பது தினசரிப் பேச்சில் 'பரவாயில்லை / It's okay' என்று சொல்ல பயன்படும்."
    },
    {
      id: "hq_5",
      question: "இந்தியில் 'சீதே ஜாயியே' (Seedhe jaayiye) என்று வழிகாட்டினால் அதற்கு என்ன பொருள்?",
      options: [
        "வலதுபுறம் திரும்புங்கள்",
        "இடதுபுறம் திரும்புங்கள்",
        "நேராக செல்லுங்கள்",
        "நிறுத்துங்கள்"
      ],
      correctIndex: 2,
      explanation: "சீதே (Seedhe) என்றால் நேராக, ஜாயியே (Jaayiye) என்றால் செல்லுங்கள்."
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = { HINDI_COURSE };
}
