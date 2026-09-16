export interface TermsSection {
  heading: string;
  body: string;
}

export interface TermsContent {
  title: string;
  lastUpdated: string;
  sections: TermsSection[];
}

/* ============================================================
   TERMS & CONDITIONS — Multi-language
============================================================ */

export const TERMS: Record<string, TermsContent> = {
  /* ==================== ENGLISH ==================== */
  en: {
    title: 'Terms & Conditions',
    lastUpdated: 'Last updated: January 2026',
    sections: [
      {
        heading: '1. Acceptance',
        body: 'By using Karigar Sathi, you agree to these Terms & Conditions. If you do not agree, please do not use this app.',
      },
      {
        heading: '2. Service',
        body: 'We provide a tool to create professional resumes in English for workers. You are responsible for the accuracy of the information you enter.',
      },
      {
        heading: '3. Payment & Refund',
        body: 'A one-time fee of ₹20 is required to download the resume without watermark. All payments are final. No refunds will be provided.',
      },
      {
        heading: '4. Data Privacy',
        body: 'Your personal data is stored only on your device. We do not upload it to any server. Your information remains private and secure.',
      },
      {
        heading: '5. Limitation of Liability',
        body: 'We are not responsible for any issues arising from the use of the resume. The app is provided "as is" without any warranty.',
      },
      {
        heading: '6. Changes',
        body: 'We may update these terms at any time without prior notice. Continued use of the app means you accept the new terms.',
      },
    ],
  },

  /* ==================== HINDI ==================== */
  hi: {
    title: 'नियम और शर्तें',
    lastUpdated: 'अंतिम अपडेट: जनवरी 2026',
    sections: [
      {
        heading: '1. स्वीकृति',
        body: 'कारीगर साथी का उपयोग करके, आप इन नियमों और शर्तों से सहमत होते हैं। यदि आप सहमत नहीं हैं, तो कृपया इस ऐप का उपयोग न करें।',
      },
      {
        heading: '2. सेवा',
        body: 'हम कारीगरों के लिए अंग्रेजी में प्रोफेशनल रिज्यूमे बनाने का टूल प्रदान करते हैं। आप जो जानकारी दर्ज करते हैं, उसकी सटीकता के लिए आप जिम्मेदार हैं।',
      },
      {
        heading: '3. भुगतान और रिफंड',
        body: 'बिना वॉटरमार्क के रिज्यूमे डाउनलोड करने के लिए ₹20 का एकमुश्त शुल्क आवश्यक है। सभी भुगतान अंतिम हैं। कोई रिफंड नहीं दिया जाएगा।',
      },
      {
        heading: '4. डेटा गोपनीयता',
        body: 'आपका व्यक्तिगत डेटा केवल आपके डिवाइस पर संग्रहीत होता है। हम इसे किसी सर्वर पर अपलोड नहीं करते। आपकी जानकारी निजी और सुरक्षित रहती है।',
      },
      {
        heading: '5. दायित्व की सीमा',
        body: 'रिज्यूमे के उपयोग से उत्पन्न किसी भी समस्या के लिए हम जिम्मेदार नहीं हैं। ऐप "जैसा है" प्रदान किया गया है, बिना किसी वारंटी के।',
      },
      {
        heading: '6. परिवर्तन',
        body: 'हम बिना पूर्व सूचना के इन नियमों को कभी भी अपडेट कर सकते हैं। ऐप का उपयोग जारी रखने का मतलब है कि आप नए नियमों को स्वीकार करते हैं।',
      },
    ],
  },

  /* ==================== BENGALI ==================== */
  bn: {
    title: 'নিয়ম ও শর্তাবলী',
    lastUpdated: 'শেষ আপডেট: জানুয়ারি ২০২৬',
    sections: [
      {
        heading: '১. গ্রহণযোগ্যতা',
        body: 'কারিগর সাথী ব্যবহার করে, আপনি এই নিয়ম ও শর্তাবলীতে সম্মত হচ্ছেন। যদি সম্মত না হন, তাহলে এই অ্যাপ ব্যবহার করবেন না।',
      },
      {
        heading: '২. সেবা',
        body: 'আমরা শ্রমিকদের জন্য ইংরেজিতে পেশাদার রিজিউমে তৈরির একটি টুল প্রদান করি। আপনি যে তথ্য দেন, তার সঠিকতার জন্য আপনি দায়ী।',
      },
      {
        heading: '৩. পেমেন্ট ও রিফান্ড',
        body: 'ওয়াটারমার্ক ছাড়া রিজিউমে ডাউনলোড করতে ₹20 এর এককালীন ফি প্রয়োজন। সমস্ত পেমেন্ট চূড়ান্ত। কোন রিফান্ড দেওয়া হবে না।',
      },
      {
        heading: '৪. ডেটা গোপনীয়তা',
        body: 'আপনার ব্যক্তিগত ডেটা শুধুমাত্র আপনার ডিভাইসে সংরক্ষিত হয়। আমরা কোন সার্ভারে আপলোড করি না। আপনার তথ্য ব্যক্তিগত ও সুরক্ষিত থাকে।',
      },
      {
        heading: '৫. দায়বদ্ধতার সীমা',
        body: 'রিজিউমে ব্যবহার থেকে উদ্ভূত কোন সমস্যার জন্য আমরা দায়ী নই। অ্যাপটি "যেমন আছে" প্রদান করা হয়েছে, কোন ওয়ারেন্টি ছাড়াই।',
      },
      {
        heading: '৬. পরিবর্তন',
        body: 'আমরা পূর্ব নোটিশ ছাড়াই এই শর্তাবলী আপডেট করতে পারি। অ্যাপ ব্যবহার চালিয়ে যাওয়া মানে আপনি নতুন শর্তাবলী মেনে নিচ্ছেন।',
      },
    ],
  },

  /* ==================== PUNJABI ==================== */
  pa: {
    title: 'ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ',
    lastUpdated: 'ਆਖਰੀ ਅੱਪਡੇਟ: ਜਨਵਰੀ 2026',
    sections: [
      {
        heading: '1. ਸਵੀਕ੍ਰਿਤੀ',
        body: 'ਕਾਰੀਗਰ ਸਾਥੀ ਵਰਤ ਕੇ, ਤੁਸੀਂ ਇਹਨਾਂ ਨਿਯਮਾਂ ਅਤੇ ਸ਼ਰਤਾਂ ਨਾਲ ਸਹਿਮਤ ਹੋ। ਜੇ ਸਹਿਮਤ ਨਹੀਂ, ਤਾਂ ਇਸ ਐਪ ਨੂੰ ਨਾ ਵਰਤੋ।',
      },
      {
        heading: '2. ਸੇਵਾ',
        body: 'ਅਸੀਂ ਕਾਮਿਆਂ ਲਈ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪੇਸ਼ੇਵਰ ਰਿਜ਼ਿਊਮੇ ਬਣਾਉਣ ਦਾ ਸਾਧਨ ਦਿੰਦੇ ਹਾਂ। ਤੁਸੀਂ ਜੋ ਜਾਣਕਾਰੀ ਦਿੰਦੇ ਹੋ, ਉਸਦੀ ਸ਼ੁੱਧਤਾ ਲਈ ਤੁਸੀਂ ਜ਼ਿੰਮੇਵਾਰ ਹੋ।',
      },
      {
        heading: '3. ਭੁਗਤਾਨ ਅਤੇ ਰਿਫੰਡ',
        body: 'ਵਾਟਰਮਾਰਕ ਤੋਂ ਬਿਨਾਂ ਰਿਜ਼ਿਊਮੇ ਡਾਊਨਲੋਡ ਕਰਨ ਲਈ ₹20 ਦੀ ਇੱਕ ਵਾਰੀ ਫੀਸ ਲੋੜੀਂਦੀ ਹੈ। ਸਾਰੇ ਭੁਗਤਾਨ ਅੰਤਿਮ ਹਨ। ਕੋਈ ਰਿਫੰਡ ਨਹੀਂ ਮਿਲੇਗਾ।',
      },
      {
        heading: '4. ਡਾਟਾ ਗੋਪਨੀਯਤਾ',
        body: 'ਤੁਹਾਡਾ ਨਿੱਜੀ ਡਾਟਾ ਸਿਰਫ਼ ਤੁਹਾਡੇ ਡਿਵਾਈਸ \'ਤੇ ਸਟੋਰ ਹੁੰਦਾ ਹੈ। ਅਸੀਂ ਕਿਸੇ ਸਰਵਰ \'ਤੇ ਅੱਪਲੋਡ ਨਹੀਂ ਕਰਦੇ। ਤੁਹਾਡੀ ਜਾਣਕਾਰੀ ਨਿੱਜੀ ਅਤੇ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦੀ ਹੈ।',
      },
      {
        heading: '5. ਜ਼ਿੰਮੇਵਾਰੀ ਦੀ ਸੀਮਾ',
        body: 'ਰਿਜ਼ਿਊਮੇ ਦੀ ਵਰਤੋਂ ਤੋਂ ਪੈਦਾ ਹੋਣ ਵਾਲੀਆਂ ਕਿਸੇ ਵੀ ਸਮੱਸਿਆ ਲਈ ਅਸੀਂ ਜ਼ਿੰਮੇਵਾਰ ਨਹੀਂ ਹਾਂ। ਐਪ "ਜਿਵੇਂ ਹੈ" ਬਿਨਾਂ ਕਿਸੇ ਵਾਰੰਟੀ ਦੇ ਦਿੱਤੀ ਗਈ ਹੈ।',
      },
      {
        heading: '6. ਬਦਲਾਅ',
        body: 'ਅਸੀਂ ਬਿਨਾਂ ਪੂਰਵ ਸੂਚਨਾ ਦੇ ਇਹਨਾਂ ਸ਼ਰਤਾਂ ਨੂੰ ਅੱਪਡੇਟ ਕਰ ਸਕਦੇ ਹਾਂ। ਐਪ ਦੀ ਵਰਤੋਂ ਜਾਰੀ ਰੱਖਣ ਦਾ ਮਤਲਬ ਹੈ ਕਿ ਤੁਸੀਂ ਨਵੀਆਂ ਸ਼ਰਤਾਂ ਮੰਨਦੇ ਹੋ।',
      },
    ],
  },

  /* ==================== HARYANVI ==================== */
  hry: {
    title: 'नियम और शर्तां',
    lastUpdated: 'आखिरी अपडेट: जनवरी 2026',
    sections: [
      {
        heading: '1. स्वीकार',
        body: 'कारीगर साथी नै इस्तेमाल करके, तू इन नियमां और शर्तां मैं सहमत हो सै। जे सहमत कोन्या तै, तो ऐप ना इस्तेमाल कर।',
      },
      {
        heading: '2. सेवा',
        body: 'हम कारीगरां खातर अंग्रेजी मैं प्रोफेशनल रिज्यूमे बणाण की टूल देवां सां। तू जो जानकारी भरै सै, उसकी सही होण की जिम्मेदारी तेरी सै।',
      },
      {
        heading: '3. भुगतान अर रिफंड',
        body: 'बिना वॉटरमार्क का रिज्यूमे डाउनलोड करण खातर ₹20 की एक बारी फीस जरूरी सै। सारे भुगतान पक्के सैं। कोई रिफंड ना मिलेगा।',
      },
      {
        heading: '4. डेटा गोपनीयता',
        body: 'तेरा निजी डेटा सिर्फ तेरे फोन मैं रहवै सै। हम किसे सर्वर पै ना भेजां सां। तेरी जाणकारी निजी अर सुरक्षित रहवै सै।',
      },
      {
        heading: '5. जिम्मेदारी की सीमा',
        body: 'रिज्यूमे के इस्तेमाल से कोए भी दिक्कत हो तो हम जिम्मेदार कोन्या सां। ऐप "जसा सै" बिना कोए वारंटी के दिया गया सै।',
      },
      {
        heading: '6. बदलाव',
        body: 'हम बिना बताए इन नियमां नै कदे भी बदल सकां सां। ऐप इस्तेमाल करते रहण का मतलब सै के तू नए नियम मान्नै सै।',
      },
    ],
  },
};

/**
 * Current language ka terms content laao
 * Agar language available nahi hai, toh English fallback
 */
export const getTerms = (lang: string): TermsContent => {
  return TERMS[lang] || TERMS.en;
};

/**
 * Saari supported languages
 */
export const TERMS_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'hry', label: 'हरियाणवी' },
];