import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  Modal,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import {
  saveLanguage,
  getLanguage,
  clearAll,
  saveTermsAccepted,
  isTermsAccepted,
} from '../src/utils/storage';
import { LANGUAGES } from '../src/utils/i18n';
import { getTerms, TermsContent } from '../src/utils/terms';

export default function Home() {
  const { t, i18n } = useTranslation();

  const [selectedLang, setSelectedLang] = useState('hi');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [terms, setTerms] = useState<TermsContent>(getTerms('en'));

  // ✅ First-time terms flow
  const [loading, setLoading] = useState(true);
  const [termsChecked, setTermsChecked] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  /* ===== Initial Load ===== */
  useEffect(() => {
    const init = async () => {
      try {
        const saved = await getLanguage();
        if (saved) {
          await i18n.changeLanguage(saved);
          setSelectedLang(saved);
          setTerms(getTerms(saved));
        }

        // Check if user has accepted terms before
        const accepted = await isTermsAccepted();
        if (!accepted) {
          setIsFirstTime(true);
          setShowTerms(true);
        }
      } catch (error) {
        console.error('Init error:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [i18n]);

  /* ===== Language Change ===== */
  const handleLanguageChange = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      await saveLanguage(code);
      setSelectedLang(code);
      setShowLangPicker(false);
      setTerms(getTerms(code));
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  /* ===== Create Resume ===== */
  const handleCreateResume = async () => {
    try {
      await clearAll();
      router.push('/category');
    } catch (error) {
      console.error('Failed to clear old data:', error);
      router.push('/category');
    }
  };

  /* ===== Open Terms (read-only) ===== */
  const handleOpenTerms = () => {
    setTerms(getTerms(selectedLang));
    setIsFirstTime(false);
    setTermsChecked(true);
    setShowTerms(true);
  };

  /* ===== Close Terms ===== */
  const handleCloseTerms = () => {
    setShowTerms(false);
    setTermsChecked(false);
    setHasScrolledToBottom(false);
  };

  /* ===== Accept Terms (first-time) ===== */
  const handleAcceptTerms = async () => {
    try {
      await saveTermsAccepted();
      setShowTerms(false);
      setIsFirstTime(false);
      setTermsChecked(false);
      setHasScrolledToBottom(false);
    } catch (error) {
      console.error('Failed to save terms acceptance:', error);
    }
  };

  /* ===== Scroll Detection ===== */
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 30;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="construct" size={48} color="#1E88E5" />
        <Text style={styles.loadingText}>{t('app_name')}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Ionicons name="construct" size={36} color="#1E88E5" />
            <Text style={styles.appName}>{t('app_name')}</Text>
          </View>

          <TouchableOpacity
            style={styles.langBtn}
            onPress={() => setShowLangPicker(!showLangPicker)}
          >
            <Ionicons name="language" size={18} color="#1E88E5" />
            <Text style={styles.langBtnText}>
              {LANGUAGES.find((l) => l.code === selectedLang)?.native ||
                selectedLang.toUpperCase()}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#1E88E5" />
          </TouchableOpacity>
        </View>

        {/* Language Picker */}
        {showLangPicker && (
          <View style={styles.langPicker}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  selectedLang === lang.code && styles.langOptionActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text
                  style={[
                    styles.langOptionText,
                    selectedLang === lang.code && styles.langOptionTextActive,
                  ]}
                >
                  {lang.native}
                </Text>
                {selectedLang === lang.code && (
                  <Ionicons name="checkmark" size={20} color="#1E88E5" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tagline */}
        <Text style={styles.tagline}>{t('tagline')}</Text>

        {/* Main Card */}
        <TouchableOpacity
          style={styles.mainCard}
          onPress={handleCreateResume}
          activeOpacity={0.85}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="document-text" size={48} color="#fff" />
          </View>
          <Text style={styles.cardTitle}>{t('create_resume')}</Text>
          <Text style={styles.cardDesc}>
            Fill the form and get your professional resume in PDF
          </Text>
          <View style={styles.arrowBtn}>
            <Ionicons name="arrow-forward" size={22} color="#1E88E5" />
          </View>
        </TouchableOpacity>

        {/* Features */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={26} color="#FF9800" />
            <Text style={styles.featureText}>Fast</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="cloud-offline" size={26} color="#4CAF50" />
            <Text style={styles.featureText}>Offline</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={26} color="#9C27B0" />
            <Text style={styles.featureText}>Secure</Text>
          </View>
        </View>

        {/* Terms & Conditions Link */}
        <TouchableOpacity
          style={styles.termsBtn}
          onPress={handleOpenTerms}
          activeOpacity={0.7}
        >
          <Ionicons name="document-text-outline" size={16} color="#666" />
          <Text style={styles.termsBtnText}>
            {selectedLang === 'hi'
              ? 'नियम और शर्तें'
              : selectedLang === 'bn'
              ? 'নিয়ম ও শর্তাবলী'
              : selectedLang === 'pa'
              ? 'ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ'
              : selectedLang === 'hry'
              ? 'नियम और शर्तां'
              : 'Terms & Conditions'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ==================== TERMS MODAL ==================== */}
      <Modal
        visible={showTerms}
        animationType="slide"
        transparent
        onRequestClose={() => {
          if (!isFirstTime) {
            handleCloseTerms();
          }
        }}
      >
        <View style={styles.modalOverlay}>
          {/* Tap outside to close (only if not first time) */}
          <TouchableWithoutFeedback
            onPress={() => {
              if (!isFirstTime) {
                handleCloseTerms();
              }
            }}
          >
            <View style={{ flex: 1 }} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>{terms.title}</Text>
                <Text style={styles.modalSubtitle}>{terms.lastUpdated}</Text>
              </View>
              {!isFirstTime && (
                <TouchableOpacity
                  onPress={handleCloseTerms}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.modalDivider} />

            {/* Modal Body — Scrollable */}
            <ScrollView
              style={styles.modalBody}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={true}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {terms.sections.map((section, idx) => (
                <View key={idx} style={styles.termSection}>
                  <Text style={styles.termHeading}>{section.heading}</Text>
                  <Text style={styles.termBody}>{section.body}</Text>
                </View>
              ))}

              <View style={styles.termFooterBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={16}
                  color="#1E88E5"
                />
                <Text style={styles.termFooterText}>
                  {selectedLang === 'hi'
                    ? 'किसी भी प्रश्न के लिए: support@karigarsathi.com'
                    : selectedLang === 'bn'
                    ? 'যেকোনো প্রশ্নের জন্য: support@karigarsathi.com'
                    : selectedLang === 'pa'
                    ? 'ਕਿਸੇ ਵੀ ਸਵਾਲ ਲਈ: support@karigarsathi.com'
                    : selectedLang === 'hry'
                    ? 'किसी भी सवाल खातर: support@karigarsathi.com'
                    : 'For any questions: support@karigarsathi.com'}
                </Text>
              </View>
            </ScrollView>

            {/* ==================== FIRST TIME FOOTER ==================== */}
            {isFirstTime ? (
              <View style={styles.firstTimeFooter}>
                {!hasScrolledToBottom && (
                  <View style={styles.scrollHint}>
                    <Ionicons
                      name="arrow-down-circle"
                      size={16}
                      color="#E65100"
                    />
                    <Text style={styles.scrollHintText}>
                      {selectedLang === 'hi'
                        ? 'कृपया नीचे तक पढ़ें'
                        : selectedLang === 'bn'
                        ? 'অনুগ্রহ করে নিচে পর্যন্ত পড়ুন'
                        : selectedLang === 'pa'
                        ? 'ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਤੱਕ ਪੜ੍ਹੋ'
                        : selectedLang === 'hry'
                        ? 'कृपया नीचे तक पढ़ो'
                        : 'Please scroll to read all'}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setTermsChecked(!termsChecked)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      termsChecked && styles.checkboxActive,
                    ]}
                  >
                    {termsChecked && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    {selectedLang === 'hi'
                      ? 'मैंने सभी नियम और शर्तें पढ़ लीं और सहमत हूँ'
                      : selectedLang === 'bn'
                      ? 'আমি সমস্ত নিয়ম ও শর্তাবলী পড়েছি এবং সম্মত'
                      : selectedLang === 'pa'
                      ? 'ਮੈਂ ਸਾਰੇ ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ ਪੜ੍ਹ ਲਈਆਂ ਅਤੇ ਸਹਿਮਤ ਹਾਂ'
                      : selectedLang === 'hry'
                      ? 'मैंने सारे नियम अर शर्तां पढ़ लीं अर सहमत सां'
                      : 'I have read and agree to all Terms & Conditions'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.continueBtn,
                    (!termsChecked || !hasScrolledToBottom) &&
                      styles.continueBtnDisabled,
                  ]}
                  onPress={handleAcceptTerms}
                  disabled={!termsChecked || !hasScrolledToBottom}
                  activeOpacity={0.85}
                >
                  <Text style={styles.continueBtnText}>
                    {selectedLang === 'hi'
                      ? 'सहमत हूँ और आगे बढ़ें'
                      : selectedLang === 'bn'
                      ? 'সম্মত এবং এগিয়ে যান'
                      : selectedLang === 'pa'
                      ? 'ਸਹਿਮਤ ਅਤੇ ਅੱਗੇ ਵਧੋ'
                      : selectedLang === 'hry'
                      ? 'सहमत सां अर आगे बढ़ो'
                      : 'Agree & Continue'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              /* ==================== NORMAL FOOTER ==================== */
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={handleCloseTerms}
                activeOpacity={0.85}
              >
                <Text style={styles.modalCloseBtnText}>
                  {selectedLang === 'hi'
                    ? 'समझ गया'
                    : selectedLang === 'bn'
                    ? 'বুঝেছি'
                    : selectedLang === 'pa'
                    ? 'ਸਮਝ ਗਿਆ'
                    : selectedLang === 'hry'
                    ? 'समझ गया'
                    : 'I Understand'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  /* ===== Loading ===== */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    gap: 12,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
  },

  /* ===== Container ===== */
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#F5F5F5',
    minHeight: '100%',
  },

  /* ===== Header ===== */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  langBtnText: {
    color: '#1E88E5',
    fontWeight: '600',
    fontSize: 13,
  },

  /* ===== Language Picker ===== */
  langPicker: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    elevation: 3,
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  langOptionActive: {
    backgroundColor: '#E3F2FD',
  },
  langOptionText: {
    fontSize: 16,
    color: '#333',
  },
  langOptionTextActive: {
    color: '#1E88E5',
    fontWeight: '600',
  },

  /* ===== Tagline ===== */
  tagline: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },

  /* ===== Main Card ===== */
  mainCard: {
    backgroundColor: '#1E88E5',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 24,
  },
  cardIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 18,
    borderRadius: 100,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 16,
  },
  arrowBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },

  /* ===== Features ===== */
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  featureItem: {
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },

  /* ===== Terms Link ===== */
  termsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 30,
    paddingVertical: 12,
  },
  termsBtnText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  /* ===== Modal ===== */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginBottom: 12,
  },
  modalBody: {
    flex: 1,
  },
  termSection: {
    marginBottom: 14,
  },
  termHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E88E5',
    marginBottom: 4,
  },
  termBody: {
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  termFooterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  termFooterText: {
    flex: 1,
    fontSize: 12,
    color: '#1E88E5',
    fontWeight: '500',
  },
  modalCloseBtn: {
    backgroundColor: '#1E88E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  /* ===== First Time Footer ===== */
  firstTimeFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 14,
    marginTop: 8,
  },
  scrollHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  scrollHintText: {
    fontSize: 12,
    color: '#E65100',
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    backgroundColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: '#1E88E5',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 19,
    fontWeight: '500',
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 12,
    elevation: 3,
  },
  continueBtnDisabled: {
    backgroundColor: '#B0BEC5',
    elevation: 0,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});