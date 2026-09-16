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
import { getLanguage, getDraft } from '../src/utils/storage';
import { ResumeData, DEFAULT_COLOR } from '../src/utils/resumeHtml';
import {
  generateResumePdf,
  shareResumePdf,
  savePdfToDevice,
} from '../src/utils/pdf';

export default function DownloadScreen() {
  const { t } = useTranslation();
  const [userLang, setUserLang] = useState<'en' | 'hi'>('hi');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [generating, setGenerating] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alreadyPaid, setAlreadyPaid] = useState(false);

  const label = useCallback(
    (en: string, hi: string) => (userLang === 'hi' ? `${en} (${hi})` : en),
    [userLang]
  );

  /* ===== Load + Generate PDF ===== */
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

        // ✅ Draft ke andar ka paid status check karo
        const paid = draft.paid === true;
        setAlreadyPaid(paid);
        setResumeData(draft);

        // Generate PDF — no watermark if paid
        const uri = await generateResumePdf(draft, {
          showWatermark: !paid,
          color: DEFAULT_COLOR,
        });

        if (uri) {
          setPdfUri(uri);
        } else {
          Alert.alert(
            label('Error', 'त्रुटि'),
            label(
              'Could not generate PDF. Please try again.',
              'PDF नहीं बन सकी। दोबारा कोशिश करें।'
            )
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setGenerating(false);
      }
    };
    init();
  }, []);

  /* ===== Share ===== */
  const handleShare = async () => {
    if (!pdfUri || !resumeData) return;
    try {
      setSharing(true);
      await shareResumePdf(pdfUri, resumeData);
    } finally {
      setSharing(false);
    }
  };

  /* ===== Save to Device ===== */
  const handleSave = async () => {
    if (!pdfUri || !resumeData) return;
    try {
      setSaving(true);
      const saved = await savePdfToDevice(pdfUri, resumeData);
      if (saved) {
        Alert.alert(
          label('Success', 'सफल'),
          label(
            'PDF saved to your device!',
            'PDF आपके डिवाइस में सेव हो गई!'
          )
        );
      }
    } finally {
      setSaving(false);
    }
  };

  /* ===== Pay Now ===== */
  const handlePay = () => {
    router.push('/payment');
  };

  /* ===== Go Home ===== */
  const handleHome = () => {
    router.replace('/');
  };

  /* ===== LOADING ===== */
  if (generating) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>
          {label('Generating your PDF...', 'PDF बना रहे हैं...')}
        </Text>
        <Text style={styles.loadingSubtext}>
          {label('This may take a moment', 'थोड़ा समय लगेगा')}
        </Text>
      </View>
    );
  }

  /* ===== MAIN UI ===== */
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={48} color="#fff" />
        </View>
      </View>

      <Text style={styles.title}>
        {label('Resume Ready! 🎉', 'रिज्यूमे तैयार! 🎉')}
      </Text>
      <Text style={styles.subtitle}>
        {label(
          'Your professional resume PDF is ready to download',
          'आपकी प्रोफेशनल रिज्यूमे PDF डाउनलोड के लिए तैयार है'
        )}
      </Text>

      {/* PDF Info Card */}
      {resumeData && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={28} color="#1E88E5" />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>
                {resumeData.name || 'Resume'}
              </Text>
              <Text style={styles.cardSub}>
                {resumeData.subcategoryName || 'Karigar'}
              </Text>
            </View>
            {alreadyPaid && (
              <View style={styles.paidBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#2E7D32" />
                <Text style={styles.paidBadgeText}>
                  {label('Paid', 'पेड')}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.cardDivider} />
          <View style={styles.cardRow}>
            <Ionicons name="document-outline" size={16} color="#666" />
            <Text style={styles.cardRowText}>
              {label('Format:', 'फॉर्मेट:')} PDF (A4)
            </Text>
          </View>
          <View style={styles.cardRow}>
            <Ionicons
              name={alreadyPaid ? 'shield-checkmark' : 'water-outline'}
              size={16}
              color={alreadyPaid ? '#4CAF50' : '#FF9800'}
            />
            <Text style={styles.cardRowText}>
              {alreadyPaid
                ? label(
                    'No watermark — Full version',
                    'वॉटरमार्क नहीं — पूरा वर्जन'
                  )
                : label(
                    'Watermark included (not paid)',
                    'वॉटरमार्क लगा है (पेमेंट नहीं हुई)'
                  )}
            </Text>
          </View>
        </View>
      )}

      {/* Payment Banner (if NOT paid) */}
      {!alreadyPaid && (
        <TouchableOpacity
          style={styles.payBanner}
          onPress={handlePay}
          activeOpacity={0.85}
        >
          <View style={styles.payBannerIcon}>
            <Ionicons name="lock-open" size={26} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.payBannerTitle}>
              {label('Remove Watermark', 'वॉटरमार्क हटाएं')}
            </Text>
            <Text style={styles.payBannerSub}>
              {label(
                'Pay ₹20 and get clean PDF instantly',
                '₹20 देकर साफ PDF पाएं'
              )}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Action Buttons */}
      <TouchableOpacity
        style={styles.shareBtn}
        onPress={handleShare}
        disabled={sharing || !pdfUri}
        activeOpacity={0.85}
      >
        {sharing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="share-social" size={22} color="#fff" />
            <Text style={styles.shareBtnText}>
              {label('Share on WhatsApp', 'WhatsApp पर भेजें')}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={saving || !pdfUri}
        activeOpacity={0.85}
      >
        {saving ? (
          <ActivityIndicator color="#4CAF50" />
        ) : (
          <>
            <Ionicons name="download" size={22} color="#4CAF50" />
            <Text style={styles.saveBtnText}>
              {label('Save to Device', 'डिवाइस में सेव करें')}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.homeBtn}
        onPress={handleHome}
        activeOpacity={0.7}
      >
        <Ionicons name="home-outline" size={20} color="#666" />
        <Text style={styles.homeBtnText}>
          {label('Back to Home', 'होम पर वापस')}
        </Text>
      </TouchableOpacity>

      {/* Tip */}
      <View style={styles.tipBox}>
        <Ionicons name="bulb-outline" size={18} color="#F57C00" />
        <Text style={styles.tipText}>
          {label(
            'Tip: Share your resume on WhatsApp directly with employers!',
            'टिप: WhatsApp पर सीधे नियोक्ताओं को रिज्यूमे भेजें!'
          )}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 6,
    fontSize: 13,
    color: '#888',
  },

  /* ===== Success Icon ===== */
  iconBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E88E5',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },

  /* ===== Card ===== */
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
  },
  cardSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardRowText: {
    fontSize: 13,
    color: '#555',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  paidBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },

  /* ===== Payment Banner ===== */
  payBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#E65100',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#E65100',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  payBannerIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  payBannerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  payBannerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },

  /* ===== Buttons ===== */
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#25D366',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  saveBtnText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '700',
  },
  homeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 8,
  },
  homeBtnText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },

  /* ===== Tip ===== */
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
    lineHeight: 18,
  },
});