export const SKILLS_BY_SUBCATEGORY: Record<
  string,
  { en: string; hi: string }[]
> = {
  electrician: [
    { en: 'Wiring', hi: 'वायरिंग' },
    { en: 'Motor Repair', hi: 'मोटर रिपेयर' },
    { en: 'Switch Board Installation', hi: 'स्विच बोर्ड इंस्टॉलेशन' },
    { en: 'Fan Installation', hi: 'पंखा इंस्टॉलेशन' },
    { en: 'Inverter Setup', hi: 'इन्वर्टर सेटअप' },
    { en: 'Light Fitting', hi: 'लाइट फिटिंग' },
    { en: 'Fault Finding', hi: 'फॉल्ट फाइंडिंग' },
  ],
  ac_technician: [
    { en: 'AC Installation', hi: 'AC इंस्टॉलेशन' },
    { en: 'AC Repair', hi: 'AC रिपेयर' },
    { en: 'Gas Refilling', hi: 'गैस रिफिलिंग' },
    { en: 'Refrigerator Repair', hi: 'फ्रिज रिपेयर' },
    { en: 'Cooler Repair', hi: 'कूलर रिपेयर' },
    { en: 'AC Servicing', hi: 'AC सर्विसिंग' },
  ],
  plumber: [
    { en: 'Pipe Fitting', hi: 'पाइप फिटिंग' },
    { en: 'Leak Repair', hi: 'लीक रिपेयर' },
    { en: 'Bathroom Fitting', hi: 'बाथरूम फिटिंग' },
    { en: 'Tap Installation', hi: 'नल इंस्टॉलेशन' },
    { en: 'Water Tank Fitting', hi: 'पानी की टंकी फिटिंग' },
    { en: 'Drainage Cleaning', hi: 'ड्रेनेज सफाई' },
  ],
  pipe_fitter: [
    { en: 'Industrial Piping', hi: 'इंडस्ट्रियल पाइपिंग' },
    { en: 'Welding Pipes', hi: 'पाइप वेल्डिंग' },
    { en: 'Pipe Measurement', hi: 'पाइप माप' },
    { en: 'Valve Fitting', hi: 'वाल्व फिटिंग' },
  ],
  welder: [
    { en: 'Arc Welding', hi: 'आर्क वेल्डिंग' },
    { en: 'Gas Welding', hi: 'गैस वेल्डिंग' },
    { en: 'MIG Welding', hi: 'MIG वेल्डिंग' },
    { en: 'TIG Welding', hi: 'TIG वेल्डिंग' },
    { en: 'Metal Cutting', hi: 'मेटल कटिंग' },
    { en: 'Grinding', hi: 'ग्राइंडिंग' },
  ],
  auto_mechanic: [
    { en: 'Engine Repair', hi: 'इंजन रिपेयर' },
    { en: 'Brake Service', hi: 'ब्रेक सर्विस' },
    { en: 'Oil Change', hi: 'ऑयल चेंज' },
    { en: 'Electrical Work', hi: 'इलेक्ट्रिकल वर्क' },
    { en: 'Tyre Puncture', hi: 'टायर पंचर' },
    { en: 'Bike Repair', hi: 'बाइक रिपेयर' },
    { en: 'Car Repair', hi: 'कार रिपेयर' },
  ],
  mason: [
    { en: 'Brick Work', hi: 'ईंट का काम' },
    { en: 'Plastering', hi: 'प्लास्टर' },
    { en: 'Tile Work', hi: 'टाइल का काम' },
    { en: 'Concrete Mixing', hi: 'कंक्रीट मिक्सिंग' },
    { en: 'Wall Construction', hi: 'दीवार निर्माण' },
    { en: 'Flooring', hi: 'फर्श बनाना' },
  ],
  carpenter: [
    { en: 'Furniture Making', hi: 'फर्नीचर बनाना' },
    { en: 'Door Fitting', hi: 'दरवाजा फिटिंग' },
    { en: 'Window Fitting', hi: 'खिड़की फिटिंग' },
    { en: 'Wood Polishing', hi: 'लकड़ी पॉलिश' },
    { en: 'Modular Kitchen', hi: 'मॉड्यूलर किचन' },
    { en: 'Wardrobe Making', hi: 'अलमारी बनाना' },
  ],
  painter: [
    { en: 'Wall Painting', hi: 'दीवार पेंटिंग' },
    { en: 'Spray Painting', hi: 'स्प्रे पेंटिंग' },
    { en: 'Texture Work', hi: 'टेक्सचर वर्क' },
    { en: 'Putty Work', hi: 'पुट्टी वर्क' },
    { en: 'Waterproofing', hi: 'वॉटरप्रूफिंग' },
  ],
  helper: [
    { en: 'Material Loading', hi: 'मटेरियल लोडिंग' },
    { en: 'Mixing Cement', hi: 'सीमेंट मिक्सिंग' },
    { en: 'Lifting Support', hi: 'सामान उठाना' },
    { en: 'Site Cleaning', hi: 'साइट सफाई' },
  ],
  cook: [
    { en: 'North Indian Cooking', hi: 'नॉर्थ इंडियन कुकिंग' },
    { en: 'South Indian Cooking', hi: 'साउथ इंडियन कुकिंग' },
    { en: 'Tandoor', hi: 'तंदूर' },
    { en: 'Chinese Cooking', hi: 'चाइनीज़ कुकिंग' },
    { en: 'Snacks & Chaat', hi: 'नाश्ता और चाट' },
    { en: 'Tiffin Service', hi: 'टिफिन सर्विस' },
  ],
  driver: [
    { en: 'LMV Driving', hi: 'LMV ड्राइविंग' },
    { en: 'HMV Driving', hi: 'HMV ड्राइविंग' },
    { en: 'Auto Rickshaw', hi: 'ऑटो रिक्शा' },
    { en: 'Taxi Driving', hi: 'टैक्सी ड्राइविंग' },
    { en: 'Truck Driving', hi: 'ट्रक ड्राइविंग' },
    { en: 'Long Route', hi: 'लंबे रूट' },
  ],
};

export const getSkillsForSubcategory = (subcategoryId: string) => {
  return SKILLS_BY_SUBCATEGORY[subcategoryId] || [];
};

export const EDUCATION_OPTIONS = [
  { id: 'below_10', en: 'Below 10th', hi: '10वीं से कम' },
  { id: '10th', en: '10th Pass', hi: '10वीं पास' },
  { id: '12th', en: '12th Pass', hi: '12वीं पास' },
  { id: 'iti', en: 'ITI / Diploma', hi: 'ITI / डिप्लोमा' },
  { id: 'graduate', en: 'Graduate', hi: 'स्नातक' },
  { id: 'other', en: 'Other', hi: 'अन्य' },
];

export const LANGUAGE_OPTIONS = [
  { id: 'hindi', en: 'Hindi', hi: 'हिंदी' },
  { id: 'english', en: 'English', hi: 'अंग्रेज़ी' },
  { id: 'marathi', en: 'Marathi', hi: 'मराठी' },
  { id: 'tamil', en: 'Tamil', hi: 'तमिल' },
  { id: 'telugu', en: 'Telugu', hi: 'तेलुगु' },
  { id: 'bengali', en: 'Bengali', hi: 'बंगाली' },
  { id: 'gujarati', en: 'Gujarati', hi: 'गुजराती' },
  { id: 'punjabi', en: 'Punjabi', hi: 'पंजाबी' },
];