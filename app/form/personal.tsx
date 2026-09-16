import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getLanguage, getDraft, saveDraft } from '../../src/utils/storage';
import { ResumeData } from '../../src/utils/resumeHtml';

/* ===== Date auto-format: DD/MM/YYYY ===== */
const formatDateInput = (text: string): string => {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export default function PersonalFormScreen() {
  const { t } = useTranslation();
  const [userLang, setUserLang] = useState<'en' | 'hi'>('hi');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ResumeData>({
    name: '',
    fatherName: '',
    mobile: '',
    email: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    photo: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssuePlace: '',
  });

  useEffect(() => {
    const load = async () => {
      const lang = (await getLanguage()) as 'en' | 'hi';
      setUserLang(lang);
      const draft = await getDraft();
      if (draft) {
        setForm((prev) => ({ ...prev, ...draft }));
      }
    };
    load();
  }, []);

  const update = (key: keyof ResumeData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const label = (en: string, hi: string) =>
    userLang === 'hi' ? `${en} (${hi})` : en;

  /* ===== Image process: resize 200x200 + compress 50% + base64 ===== */
  const processImage = async (uri: string) => {
    try {
      const manip = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 200, height: 200 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      if (manip.base64) {
        const sizeKB = (manip.base64.length / 1024).toFixed(1);
        console.log('📷 Photo size (KB):', sizeKB);

        if (manip.base64.length > 200000) {
          console.warn('⚠️ Photo still large:', sizeKB, 'KB');
        }

        update('photo', `data:image/jpeg;base64,${manip.base64}`);
      }
    } catch (err) {
      console.error('Image process error:', err);
      Alert.alert(
        label('Error', 'त्रुटि'),
        label('Could not process photo', 'फोटो प्रोसेस नहीं हो सकी')
      );
    }
  };

  /* ===== Photo picker ===== */
  const pickPhoto = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        label('Permission needed', 'अनुमति चाहिए'),
        label('Please allow photo access', 'कृपया फोटो की अनुमति दें')
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets[0].uri) {
      await processImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        label('Permission needed', 'अनुमति चाहिए'),
        label('Please allow camera access', 'कृपया कैमरा की अनुमति दें')
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets[0].uri) {
      await processImage(result.assets[0].uri);
    }
  };

  const showPhotoOptions = () => {
    Keyboard.dismiss();
    Alert.alert(
      label('Add Photo', 'फोटो जोड़ें'),
      label('Choose an option', 'विकल्प चुनें'),
      [
        { text: label('Camera', 'कैमरा'), onPress: takePhoto },
        { text: label('Gallery', 'गैलरी'), onPress: pickPhoto },
        ...(form.photo
          ? [
              {
                text: label('Remove', 'हटाएं'),
                onPress: () => update('photo', ''),
                style: 'destructive' as const,
              },
            ]
          : []),
        { text: label('Cancel', 'रद्द करें'), style: 'cancel' as const },
      ]
    );
  };

  const validate = (): boolean => {
    if (!form.name?.trim()) {
      Alert.alert(
        label('Required', 'आवश्यक'),
        label('Please enter your name', 'कृपया अपना नाम लिखें')
      );
      return false;
    }
    if (!form.fatherName?.trim()) {
      Alert.alert(
        label('Required', 'आवश्यक'),
        label("Please enter father's name", 'कृपया पिता का नाम लिखें')
      );
      return false;
    }
    if (!form.mobile?.trim() || form.mobile.length !== 10) {
      Alert.alert(
        label('Invalid', 'अमान्य'),
        label(
          'Please enter valid 10-digit mobile number',
          'कृपया सही 10 अंकों का मोबाइल नंबर लिखें'
        )
      );
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    Keyboard.dismiss();
    if (!validate()) return;

    /* ===== Debug log for photo ===== */
    console.log(
      '💾 Saving photo:',
      form.photo
        ? `YES (${(form.photo.length / 1024).toFixed(1)} KB, prefix: ${form.photo.substring(0, 30)})`
        : 'NO'
    );

    try {
      setSaving(true);
      const existing = (await getDraft()) || {};
      await saveDraft({ ...existing, ...form });
      router.push('/form/professional');
    } catch (e) {
      console.error('Save error:', e);
      Alert.alert(
        label('Error', 'त्रुटि'),
        label('Could not save data', 'डेटा सेव नहीं हो सका')
      );
    } finally {
      setSaving(false);
    }
  };

  /* ===== Field Renderer ===== */
  const renderField = (
    key: keyof ResumeData,
    enLabel: string,
    hiLabel: string,
    opts: {
      placeholder?: string;
      keyboard?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
      maxLength?: number;
      required?: boolean;
      multiline?: boolean;
      uppercase?: boolean;
      isDate?: boolean;
    } = {}
  ) => (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>
        {label(enLabel, hiLabel)}
        {opts.required && <Text style={styles.requiredStar}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          opts.multiline && styles.inputMultiline,
          opts.uppercase && styles.inputUppercase,
        ]}
        value={(form[key] as string) || ''}
        onChangeText={(v) => {
          if (opts.isDate) v = formatDateInput(v);
          if (opts.uppercase) v = v.toUpperCase();
          update(key, v);
        }}
        placeholder={opts.placeholder || t('enter_in_english')}
        placeholderTextColor="#AAA"
        keyboardType={opts.isDate ? 'numeric' : opts.keyboard || 'default'}
        maxLength={opts.maxLength}
        multiline={opts.multiline}
        numberOfLines={opts.multiline ? 3 : 1}
        autoCapitalize={opts.uppercase ? 'characters' : 'words'}
        returnKeyType="done"
      />
    </View>
  );

  return (
    <KeyboardAwareScrollView
      style={styles.scrollStyle}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={120}
      showsVerticalScrollIndicator={false}
    >
      {/* English Notice */}
      <View style={styles.noticeBox}>
        <Ionicons name="information-circle" size={18} color="#1565C0" />
        <Text style={styles.noticeText}>
          {label(
            'Fill all details in English only',
            'सभी जानकारी English में भरें'
          )}
        </Text>
      </View>

      {/* Photo Upload */}
      <View style={styles.photoSection}>
        <TouchableOpacity
          style={styles.photoBox}
          onPress={showPhotoOptions}
          activeOpacity={0.8}
        >
          {form.photo ? (
            <Image source={{ uri: form.photo }} style={styles.photoImg} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={32} color="#1E88E5" />
              <Text style={styles.photoText}>{t('upload_photo')}</Text>
            </View>
          )}
        </TouchableOpacity>
        {form.photo && (
          <TouchableOpacity
            style={styles.changePhotoBtn}
            onPress={showPhotoOptions}
          >
            <Ionicons name="refresh" size={16} color="#1E88E5" />
            <Text style={styles.changePhotoText}>{t('change_photo')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Personal Section */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person" size={18} color="#1E88E5" />
          <Text style={styles.sectionTitle}>{t('personal_details')}</Text>
        </View>

        {renderField('name', 'Name', 'नाम', {
          required: true,
          placeholder: t('enter_name'),
        })}

        {renderField('fatherName', "Father's Name", 'पिता का नाम', {
          required: true,
          placeholder: t('enter_father_name'),
        })}

        {renderField('dob', 'Date of Birth', 'जन्म तिथि', {
          placeholder: 'DD/MM/YYYY',
          isDate: true,
          maxLength: 10,
        })}

        {renderField('mobile', 'Mobile Number', 'मोबाइल नंबर', {
          required: true,
          placeholder: t('enter_mobile'),
          keyboard: 'phone-pad',
          maxLength: 10,
        })}

        {renderField('email', 'Email', 'ईमेल', {
          placeholder: t('enter_email'),
          keyboard: 'email-address',
        })}

        {renderField('address', 'Address', 'पता', {
          placeholder: t('enter_address'),
          multiline: true,
        })}

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            {renderField('city', 'City', 'शहर', {
              placeholder: t('enter_city'),
            })}
          </View>
          <View style={{ flex: 1 }}>
            {renderField('state', 'State', 'राज्य', {
              placeholder: t('enter_state'),
            })}
          </View>
        </View>

        {renderField('pincode', 'Pincode', 'पिन कोड', {
          placeholder: t('enter_pincode'),
          keyboard: 'numeric',
          maxLength: 6,
        })}
      </View>

      {/* Passport Section */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons name="airplane" size={18} color="#1E88E5" />
          <Text style={styles.sectionTitle}>{t('passport_section')}</Text>
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>{t('optional')}</Text>
          </View>
        </View>

        <Text style={styles.sectionNote}>{t('passport_section_note')}</Text>

        {renderField('passportNumber', 'Passport Number', 'पासपोर्ट नंबर', {
          placeholder: t('enter_passport'),
          uppercase: true,
          maxLength: 12,
        })}

        {renderField('passportIssueDate', 'Issue Date', 'जारी तिथि', {
          placeholder: 'DD/MM/YYYY',
          isDate: true,
          maxLength: 10,
        })}

        {renderField('passportExpiryDate', 'Expiry Date', 'समाप्ति तिथि', {
          placeholder: 'DD/MM/YYYY',
          isDate: true,
          maxLength: 10,
        })}

        {renderField('passportIssuePlace', 'Issue Place', 'जारी स्थान', {
          placeholder: t('enter_issue_place'),
        })}
      </View>

      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextBtn, saving && styles.nextBtnDisabled]}
        onPress={handleNext}
        disabled={saving}
        activeOpacity={0.85}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.nextBtnText}>{t('next')}</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 80 }} />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollStyle: { flex: 1, backgroundColor: '#F5F5F5' },
  container: { padding: 16, backgroundColor: '#F5F5F5' },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  noticeText: {
    flex: 1,
    fontSize: 12.5,
    color: '#1565C0',
    fontWeight: '500',
  },
  photoSection: { alignItems: 'center', marginBottom: 20 },
  photoBox: {
    width: 110,
    height: 110,
    borderRadius: 55,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#1E88E5',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoImg: { width: '100%', height: '100%' },
  photoPlaceholder: { justifyContent: 'center', alignItems: 'center', gap: 4 },
  photoText: { fontSize: 11, color: '#1E88E5', fontWeight: '600' },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changePhotoText: { color: '#1E88E5', fontSize: 13, fontWeight: '600' },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E88E5',
  },
  optionalBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  optionalText: {
    fontSize: 10,
    color: '#E65100',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sectionNote: {
    fontSize: 11.5,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 12,
    marginTop: 4,
  },
  fieldWrapper: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  requiredStar: { color: '#EF5350', fontWeight: '700' },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14.5,
    color: '#222',
  },
  inputMultiline: { minHeight: 70, textAlignVertical: 'top' },
  inputUppercase: { letterSpacing: 1 },
  row: { flexDirection: 'row', gap: 12 },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#1E88E5',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    elevation: 3,
  },
  nextBtnDisabled: { opacity: 0.7 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});