import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { saveLanguage, getLanguage } from '../src/utils/storage';
import { LANGUAGES } from '../src/utils/i18n';

export default function Home() {
  const { t, i18n } = useTranslation();

  const [selectedLang, setSelectedLang] = useState('hi');
  const [showLangPicker, setShowLangPicker] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const saved = await getLanguage();

        if (saved) {
          await i18n.changeLanguage(saved);
          setSelectedLang(saved);
        }
      } catch (error) {
        console.error('Failed to load language:', error);
      }
    };

    loadLanguage();
  }, [i18n]);

  const handleLanguageChange = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      await saveLanguage(code);

      setSelectedLang(code);
      setShowLangPicker(false);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Ionicons
            name="construct"
            size={36}
            color="#1E88E5"
          />

          <Text style={styles.appName}>
            {t('app_name')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.langBtn}
          onPress={() => setShowLangPicker(!showLangPicker)}
        >
          <Ionicons
            name="language"
            size={18}
            color="#1E88E5"
          />

          <Text style={styles.langBtnText}>
            {LANGUAGES.find(
              (l) => l.code === selectedLang
            )?.native}
          </Text>

          <Ionicons
            name="chevron-down"
            size={14}
            color="#1E88E5"
          />
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
                selectedLang === lang.code &&
                  styles.langOptionActive,
              ]}
              onPress={() =>
                handleLanguageChange(lang.code)
              }
            >
              <Text
                style={[
                  styles.langOptionText,
                  selectedLang === lang.code &&
                    styles.langOptionTextActive,
                ]}
              >
                {lang.native}
              </Text>

              {selectedLang === lang.code && (
                <Ionicons
                  name="checkmark"
                  size={20}
                  color="#1E88E5"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Tagline */}
      <Text style={styles.tagline}>
        {t('tagline')}
      </Text>

      {/* Main Card */}
      <TouchableOpacity
        style={styles.mainCard}
        onPress={() => router.push('/category')}
        activeOpacity={0.85}
      >
        <View style={styles.cardIcon}>
          <Ionicons
            name="document-text"
            size={48}
            color="#fff"
          />
        </View>

        <Text style={styles.cardTitle}>
          {t('create_resume')}
        </Text>

        <Text style={styles.cardDesc}>
          Fill the form and get your professional resume in PDF
        </Text>

        <View style={styles.arrowBtn}>
          <Ionicons
            name="arrow-forward"
            size={22}
            color="#1E88E5"
          />
        </View>
      </TouchableOpacity>

      {/* Features */}
      <View style={styles.featuresRow}>
        <View style={styles.featureItem}>
          <Ionicons
            name="flash"
            size={26}
            color="#FF9800"
          />
          <Text style={styles.featureText}>
            Fast
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons
            name="cloud-offline"
            size={26}
            color="#4CAF50"
          />
          <Text style={styles.featureText}>
            Offline
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Ionicons
            name="shield-checkmark"
            size={26}
            color="#9C27B0"
          />
          <Text style={styles.featureText}>
            Secure
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F5F5F5',
    minHeight: '100%',
  },

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

  tagline: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },

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
});