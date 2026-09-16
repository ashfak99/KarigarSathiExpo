import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getLanguage, getDraft, saveDraft } from '../src/utils/storage';
import { ResumeData } from '../src/utils/resumeHtml';

const RESUME_PRICE = 20; // ₹20

export default function PaymentScreen() {
  const { t } = useTranslation();
  const [userLang, setUserLang] = useState<'en' | 'hi'>('hi');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('upi');

  const label = useCallback(
    (en: string, hi: string) => (userLang === 'hi' ? `${en} (${hi})` : en),
    [userLang]
  );

  useEffect(() => {
    const init = async () => {
      const lang = (await getLanguage()) as 'en' | 'hi';
      setUserLang(lang);

      const draft = (await getDraft()) as ResumeData | null;
      if (!draft || !draft.name) {
        Alert.alert(
          label('Error', 'त्रुटि'),
          label('No resume data found', 'कोई डेटा नहीं मिला')
        );
        router.replace('/category');
        return;
      }
      setResumeData(draft);
    };
    init();
  }, []);

  /* =========================================================
     DUMMY PAYMENT — Later replace with Razorpay
  ========================================================= */
  const handlePayment = async () => {
    if (!resumeData) return;

    try {
      setProcessing(true);

      /* ========================================================
         🔜 YAHAN RAZORPAY AAYEGA (Dev Build ke baad):

         const options = {
           description: 'Karigar Sathi Resume',
           currency: 'INR',
           key: 'rzp_test_XXXXXXXXXXXX',
           amount: RESUME_PRICE * 100,
           name: 'Karigar Sathi',
           order_id: '',
           prefill: {
             name: resumeData.name,
             contact: resumeData.mobile,
             email: resumeData.email || '',
           },
           theme: { color: '#1E88E5' },
         };

         const data = await RazorpayCheckout.open(options);
         // success: data.razorpay_payment_id
      ======================================================== */

      // ⏳ DUMMY: 2 second delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // ✅ Draft ke andar paid: true save karo
      const updatedResume: ResumeData = { ...resumeData, paid: true };
      await saveDraft(updatedResume);

      Alert.alert(
        label('✅ Payment Successful!', '✅ पेमेंट सफल!'),
        label(
          `You paid ₹${RESUME_PRICE}. Watermark will be removed.`,
          `आपने ₹${RESUME_PRICE} का भुगतान किया। वॉटरमार्क हटा दिया जाएगा।`
        ),
        [
          {
            text: label('View Resume', 'रिज्यूमे देखें'),
            onPress: () => router.replace('/download'),
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      Alert.alert(
        label('Payment Failed', 'पेमेंट विफल'),
        label(
          'Something went wrong. Please try again.',
          'कुछ गलत हो गया। दोबारा कोशिश करें।'
        )
      );
    } finally {
      setProcessing(false);
    }
  };

  /* ===== Cancel ===== */
  const handleCancel = () => {
    router.back();
  };

  /* ===== Payment Methods Data ===== */
  const methods = [
    {
      id: 'upi',
      icon: 'phone-portrait-outline' as const,
      title: 'UPI',
      subtitle: 'GPay, PhonePe, Paytm, BHIM',
      recommended: true,
    },
    {
      id: 'card',
      icon: 'card-outline' as const,
      title: 'Credit / Debit Card',
      subtitle: 'Visa, Mastercard, RuPay',
      recommended: false,
    },
    {
      id: 'netbanking',
      icon: 'business-outline' as const,
      title: 'Net Banking',
      subtitle: 'All major banks',
      recommended: false,
    },
    {
      id: 'wallet',
      icon: 'wallet-outline' as const,
      title: 'Wallet',
      subtitle: 'Paytm, Amazon Pay, etc.',
      recommended: false,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerIcon}>
          <Ionicons name="shield-checkmark" size={32} color="#fff" />
        </View>
        <Text style={styles.bannerTitle}>
          {label('Secure Payment', 'सुरक्षित पेमेंट')}
        </Text>
        <Text style={styles.bannerSubtitle}>
          {label(
            '100% safe & encrypted by Razorpay',
            'Razorpay द्वारा 100% सुरक्षित'
          )}
        </Text>
      </View>

      {/* Order Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>
          {label('ORDER SUMMARY', 'ऑर्डर सारांश')}
        </Text>
        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="document-text" size={20} color="#1E88E5" />
            <Text style={styles.rowLabel}>
              {label('Resume PDF', 'रिज्यूमे PDF')}
            </Text>
          </View>
          <Text style={styles.rowValue}>₹{RESUME_PRICE}</Text>
        </View>

        {resumeData && (
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="person-outline" size={20} color="#1E88E5" />
              <Text style={styles.rowLabel}>
                {label('For', 'के लिए')}
              </Text>
            </View>
            <Text style={styles.rowValue} numberOfLines={1}>
              {resumeData.name}
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>
            {label('Total Payable', 'कुल देय')}
          </Text>
          <Text style={styles.totalValue}>₹{RESUME_PRICE}</Text>
        </View>
      </View>

      {/* Benefits */}
      <View style={styles.benefitsBox}>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
          <Text style={styles.benefitText}>
            {label('Watermark removed', 'वॉटरमार्क हट जाएगा')}
          </Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
          <Text style={styles.benefitText}>
            {label('Unlimited downloads', 'असीमित डाउनलोड')}
          </Text>
        </View>
        <View style={styles.benefitItem}>
          <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
          <Text style={styles.benefitText}>
            {label('Share on WhatsApp', 'WhatsApp पर शेयर')}
          </Text>
        </View>
      </View>

      {/* Payment Methods */}
      <Text style={styles.sectionTitle}>
        {label('SELECT PAYMENT METHOD', 'पेमेंट तरीका चुनें')}
      </Text>

      {methods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodCard,
            selectedMethod === method.id && styles.methodCardActive,
          ]}
          onPress={() => setSelectedMethod(method.id)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.radio,
              selectedMethod === method.id && styles.radioActive,
            ]}
          >
            {selectedMethod === method.id && <View style={styles.radioDot} />}
          </View>
          <View style={styles.methodIcon}>
            <Ionicons name={method.icon} size={24} color="#1E88E5" />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.methodTitleRow}>
              <Text style={styles.methodTitle}>{method.title}</Text>
              {method.recommended && (
                <View style={styles.recommendBadge}>
                  <Text style={styles.recommendText}>
                    {label('Fastest', 'सबसे तेज़')}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Pay Button */}
      <TouchableOpacity
        style={[styles.payBtn, processing && styles.payBtnDisabled]}
        onPress={handlePayment}
        disabled={processing}
        activeOpacity={0.85}
      >
        {processing ? (
          <>
            <ActivityIndicator color="#fff" />
            <Text style={styles.payBtnText}>
              {label('Processing...', 'प्रोसेसिंग...')}
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="lock-closed" size={22} color="#fff" />
            <Text style={styles.payBtnText}>
              {label(
                `Pay ₹${RESUME_PRICE} Now`,
                `अभी ₹${RESUME_PRICE} दें`
              )}
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Cancel */}
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={handleCancel}
        disabled={processing}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelBtnText}>
          {label('Cancel', 'रद्द करें')}
        </Text>
      </TouchableOpacity>

      {/* Footer Note */}
      <View style={styles.footerNote}>
        <Ionicons name="information-circle-outline" size={16} color="#888" />
        <Text style={styles.footerNoteText}>
          {label(
            'By paying, you agree to our terms. No refunds.',
            'भुगतान करके, आप हमारी शर्तों से सहमत हैं। कोई रिफंड नहीं।'
          )}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F5F5F5',
    minHeight: '100%',
  },

  /* ===== Banner ===== */
  banner: {
    backgroundColor: '#1E88E5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  bannerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },

  /* ===== Card ===== */
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    color: '#555',
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    maxWidth: '55%',
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E65100',
  },

  /* ===== Benefits ===== */
  benefitsBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '500',
  },

  /* ===== Section Title ===== */
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },

  /* ===== Payment Methods ===== */
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
  },
  methodCardActive: {
    borderColor: '#1E88E5',
    backgroundColor: '#F0F8FF',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#BBB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#1E88E5',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E88E5',
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  methodSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  recommendBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  recommendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },

  /* ===== Pay Button ===== */
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 14,
    marginTop: 12,
    elevation: 4,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  payBtnDisabled: {
    backgroundColor: '#A5D6A7',
  },
  payBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  /* ===== Cancel ===== */
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 4,
  },
  cancelBtnText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },

  /* ===== Footer Note ===== */
  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  footerNoteText: {
    flex: 1,
    fontSize: 11,
    color: '#888',
    lineHeight: 16,
  },
});