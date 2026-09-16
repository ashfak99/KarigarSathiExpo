import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getLanguage, getDraft, isPaid } from '../src/utils/storage';
import {
  generateResumeHtml,
  ResumeData,
  COLOR_OPTIONS,
  ResumeColor,
  DEFAULT_COLOR,
} from '../src/utils/resumeHtml';

export default function PreviewScreen() {
  const [userLang, setUserLang] = useState<'en' | 'hi'>('hi');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotice, setShowNotice] = useState(true);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [webviewKey, setWebviewKey] = useState(0);
  const [selectedColor, setSelectedColor] =
    useState<ResumeColor>(DEFAULT_COLOR);

  /* ===== Bilingual label helper ===== */
  const label = useCallback(
    (en: string, hi: string) => (userLang === 'hi' ? `${en} (${hi})` : en),
    [userLang]
  );

  /* ===== Load data ===== */
  const loadPreview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const lang = (await getLanguage()) as 'en' | 'hi';
      setUserLang(lang);

      const draft = (await getDraft()) as ResumeData | null;
      if (!draft || !draft.name) {
        setError('no_data');
        setLoading(false);
        return;
      }

      const paid = true;
      setAlreadyPaid(paid);
      setResumeData(draft);

      const previewHtml = generateResumeHtml(draft, {
        showWatermark: !paid,
        color: selectedColor,
      });
      setHtml(previewHtml);
    } catch (e) {
      console.error('Preview load error:', e);
      setError('unknown');
    } finally {
      setLoading(false);
    }
  }, [selectedColor]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  /* ===== Refresh WebView ===== */
  const refreshPreview = () => {
    setWebviewKey((k) => k + 1);
  };

  /* ===== Color change ===== */
  const handleColorChange = (color: ResumeColor) => {
    setSelectedColor(color);
    if (resumeData) {
      const newHtml = generateResumeHtml(resumeData, {
        showWatermark: !alreadyPaid,
        color: color,
      });
      setHtml(newHtml);
      setWebviewKey((k) => k + 1);
    }
  };

  /* ===== Share preview ===== */
  const handleShare = async () => {
    try {
      await Share.share({
        message:
          userLang === 'hi'
            ? 'मैंने कारीगर साथी ऐप से अपना रिज्यूमे बनाया है! आप भी बनाएं।'
            : 'I created my resume with Karigar Sathi app! You can too.',
      });
    } catch (e) {
      // cancelled
    }
  };

  /* ===== Primary action ===== */
  const handlePrimaryAction = () => {
    if (alreadyPaid) {
      router.push('/download');
    } else {
      router.push('/payment');
    }
  };

  const handleEdit = () => {
    router.back();
  };

  /* ===== LOADING ===== */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.centerText}>
          {label('Generating preview...', 'प्रीव्यू बना रहे हैं...')}
        </Text>
      </View>
    );
  }

  /* ===== ERROR — no data ===== */
  if (error === 'no_data') {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="document-outline" size={64} color="#CCC" />
        <Text style={styles.errorTitle}>
          {label('No Resume Data', 'कोई डेटा नहीं मिला')}
        </Text>
        <Text style={styles.errorDesc}>
          {label(
            'Please fill the form first to preview resume.',
            'पहले फॉर्म भरें, फिर प्रीव्यू देखें।'
          )}
        </Text>
        <TouchableOpacity
          style={styles.errorBtn}
          onPress={() => router.replace('/category')}
        >
          <Text style={styles.errorBtnText}>
            {label('Start Over', 'शुरू करें')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ===== ERROR — generic ===== */
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#EF5350" />
        <Text style={styles.errorTitle}>
          {label('Something went wrong', 'कुछ गड़बड़ हो गई')}
        </Text>
        <TouchableOpacity style={styles.errorBtn} onPress={loadPreview}>
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.errorBtnText}>
            {label('Retry', 'दोबारा कोशिश करें')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ===== MAIN UI ===== */
  return (
    <View style={styles.container}>
      {/* ===== Watermark Notice ===== */}
      {!alreadyPaid && showNotice && (
        <View style={styles.notice}>
          <Ionicons name="information-circle" size={20} color="#E65100" />
          <Text style={styles.noticeText}>
            {label(
              'Watermark will be removed after payment',
              'पेमेंट के बाद वॉटरमार्क हट जाएगा'
            )}
          </Text>
          <TouchableOpacity
            onPress={() => setShowNotice(false)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={18} color="#E65100" />
          </TouchableOpacity>
        </View>
      )}

      {/* ===== Paid Banner ===== */}
      {alreadyPaid && (
        <View style={styles.paidBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
          <Text style={styles.paidText}>
            {label(
              'Payment done — Watermark removed',
              'पेमेंट हो गया — वॉटरमार्क हटा दिया गया'
            )}
          </Text>
        </View>
      )}

      {/* ===== Color Picker ===== */}
      <View style={styles.colorBar}>
        <Text style={styles.colorBarLabel}>
          {label('Color:', 'रंग:')}
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorList}
        >
          {COLOR_OPTIONS.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.colorDot,
                { backgroundColor: c.primary },
                selectedColor.id === c.id && styles.colorDotActive,
              ]}
              onPress={() => handleColorChange(c)}
              activeOpacity={0.8}
            >
              {selectedColor.id === c.id && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== WebView Preview ===== */}
      <View style={styles.previewBox}>
        <WebView
          key={webviewKey}
          originWhitelist={['*']}
          source={{ html, baseUrl: 'about:blank' }}
          style={styles.webview}
          scalesPageToFit
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          allowFileAccess
          allowFileAccessFromFileURLs
          allowUniversalAccessFromFileURLs
          renderLoading={() => (
            <View style={styles.webviewLoader}>
              <ActivityIndicator color="#1E88E5" />
              <Text style={styles.webviewLoaderText}>
                {label('Loading...', 'लोड हो रहा है...')}
              </Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={refreshPreview}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color="#1E88E5" />
        </TouchableOpacity>
      </View>

      {/* ===== Bottom Bar ===== */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleEdit}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={22} color="#1E88E5" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleShare}
          activeOpacity={0.8}
        >
          <Ionicons name="share-social-outline" size={22} color="#1E88E5" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryBtn,
            alreadyPaid && styles.primaryBtnGreen,
          ]}
          onPress={handlePrimaryAction}
          activeOpacity={0.85}
        >
          <Ionicons
            name={alreadyPaid ? 'download' : 'lock-closed'}
            size={18}
            color="#fff"
          />
          <Text style={styles.primaryBtnText}>
            {alreadyPaid
              ? label('Download PDF', 'PDF डाउनलोड करें')
              : label('Pay & Download', 'पेमेंट करें और डाउनलोड करें')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 24,
  },
  centerText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  errorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E88E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  errorBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#E65100',
    fontWeight: '500',
  },
  paidBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
  },
  paidText: {
    flex: 1,
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },

  /* ===== Color Bar ===== */
  colorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  colorBarLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  colorList: {
    gap: 10,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 2,
  },
  colorDotActive: {
    borderColor: '#333',
    borderWidth: 3,
  },

  /* ===== Preview Box ===== */
  previewBox: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  webview: { flex: 1, backgroundColor: '#fff' },
  webviewLoader: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  webviewLoaderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  refreshBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  /* ===== Bottom Bar ===== */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FAFF',
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 3,
  },
  primaryBtnGreen: { backgroundColor: '#4CAF50' },
  primaryBtnText: {
    color: '#fff',
    fontSize: 14.5,
    fontWeight: '700',
  },
});