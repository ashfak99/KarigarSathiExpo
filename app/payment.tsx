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
import {
  payForResume,
  recoverPendingPayment,
  warmUpServer,
} from '../src/utils/razorpay';

const RESUME_PRICE = 20; // ₹20

/* =========================================================
   Generate unique resumeId (ek baar per resume)
========================================================= */
const generateResumeId = (): string => {
  return `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export default function PaymentScreen() {
  const { t } = useTranslation();
  const [userLang, setUserLang] = useState<'en' | 'hi'>('hi');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [resumeId, setResumeId] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [checkingPending, setCheckingPending] = useState(true);

  const label = useCallback(
    (en: string, hi: string) => (userLang === 'hi' ? `${en} (${hi})` : en),
    [userLang]
  );

  /* =========================================================
     INIT — Load data + warmup + recover pending
  ========================================================= */
  useEffect(() => {
    const init = async () => {
      try {
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

        // ✅ Get or create resumeId
        let rid = (draft as any).resumeId as string | undefined;
        if (!rid) {
          rid = generateResumeId();
          const updated = { ...draft, resumeId: rid };
          await saveDraft(updated);
          setResumeData(updated);
        } else {
          setResumeData(draft);
        }
        setResumeId(rid);

        // ✅ Wake up server (Render cold start)
        warmUpServer();

        // ✅ Check if a previous payment was pending
        const recovered = await recoverPendingPayment(rid);
        if (recovered) {
          const updated = { ...draft, resumeId: rid, paid: true };
          await saveDraft(updated);
          Alert.alert(
            label('✅ Payment Recovered!', '✅ पेमेंट मिल गई!'),
            label(
              'Your previous payment was successful. Watermark removed.',
              'आपकी पिछली पेमेंट सफल थी। वॉटरमार्क हटा दिया गया।'
            ),
            [
              {
                text: label('View Resume', 'रिज्यूमे देखें'),
                onPress: () => router.replace('/download'),
              },
            ]
          );
        }
      } catch (e) {
        console.error('Init error:', e);
      } finally {
        setCheckingPending(false);
      }
    };
    init();
  }, []);

  /* =========================================================
     PAYMENT HANDLER
  ========================================================= */
  const handlePayment = async () => {
    if (!resumeData || !resumeId) return;

    try {
      setProcessing(true);

      const result = await payForResume(resumeId);

      /* ===== PAID ===== */
      if (result.status === 'paid') {
        const updated: ResumeData = { ...resumeData, paid: true };
        await saveDraft(updated);

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
        return;
      }

      /* ===== CANCELLED ===== */
      if (result.status === 'cancelled') {
        Alert.alert(
          label('Payment Cancelled', 'पेमेंट रद्द'),
          label(
            'You closed the payment window. You can try again.',
            'आपने पेमेंट विंडो बंद कर दी। दोबारा कोशिश करें।'
          )
        );
        return;
      }

      /* ===== PENDING ===== */
      if (result.status === 'pending') {
        Alert.alert(
          label('⏳ Payment Pending', '⏳ पेमेंट पेंडिंग'),
          label(
            'We could not confirm your payment. If money was deducted, it will be auto-recovered within a minute. Please wait or reopen this screen.',
            'हम पेमेंट कन्फर्म नहीं कर पाए। अगर पैसे कट गए हैं, तो 1 मिनट में ऑटो-रिकवर हो जाएगा। कृपया प्रतीक्षा करें या यह स्क्रीन दोबारा खोलें।'
          ),
          [
            {
              text: label('Check Again', 'दोबारा चेक करें'),
              onPress: () => router.replace('/download'),
            },
          ]
        );
        return;
      }

      /* ===== ERROR ===== */
      Alert.alert(
        label('Payment Failed', 'पेमेंट विफल'),
        result.message ||
          label('Something went wrong.', 'कुछ गलत हो गया।')
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

  /* ===== LOADING (checking pending) ===== */
  if (checkingPending) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>
          {label('Preparing payment...', 'पेमेंट तैयार कर रहे हैं...')}
        </Text>
      </View>
    );
  }

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

      {/* Order Summary */}
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

      {/* ===== Payment Method — UPI only ===== */}
      <Text style={styles.sectionTitle}>
        {label('PAYMENT METHOD', 'पेमेंट तरीका')}
      </Text>

      <View style={styles.methodCard}>
        <View style={styles.methodIcon}>
          <Ionicons name="phone-portrait-outline" size={26} color="#1E88E5" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.methodTitleRow}>
            <Text style={styles.methodTitle}>UPI</Text>
            <View style={styles.recommendBadge}>
              <Text style={styles.recommendText}>
                {label('Recommended', 'अनुशंसित')}
              </Text>
            </View>
          </View>
          <Text style={styles.methodSubtitle}>
            GPay, PhonePe, Paytm, BHIM, UPI Apps
          </Text>
        </View>
        <Ionicons name="checkmark-circle" size={22} color="#4CAF50" />
      </View>

      {/* ===== Pay Button ===== */}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
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
  rowLabel: { fontSize: 14, color: '#555' },
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
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#222' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#E65100' },

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

  /* ===== Payment Method ===== */
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#1E88E5',
    elevation: 1,
  },
  methodIcon: {
    width: 48,
    height: 48,
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
    fontSize: 16,
    fontWeight: '700',
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
  payBtnDisabled: { backgroundColor: '#A5D6A7' },
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