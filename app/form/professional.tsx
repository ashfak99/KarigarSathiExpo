import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getLanguage, saveDraft, getDraft } from '../../src/utils/storage';
import {
  getSkillsForSubcategory,
  EDUCATION_OPTIONS,
  LANGUAGE_OPTIONS,
} from '../../src/utils/skills';

/* ===== Month/Year auto-format: MM/YYYY ===== */
const formatMonthYear = (text: string): string => {
  const digits = text.replace(/\D/g, '').slice(0, 6);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

/* ===== Country suggestions ===== */
const COUNTRY_SUGGESTIONS = [
  { en: 'India', hi: 'भारत' },
  { en: 'Saudi Arabia', hi: 'सऊदी अरब' },
  { en: 'UAE', hi: 'यूएई' },
  { en: 'Qatar', hi: 'कतर' },
  { en: 'Kuwait', hi: 'कुवैत' },
  { en: 'Oman', hi: 'ओमान' },
  { en: 'Bahrain', hi: 'बहरीन' },
  { en: 'Malaysia', hi: 'मलेशिया' },
  { en: 'Singapore', hi: 'सिंगापुर' },
  { en: 'Other', hi: 'अन्य' },
];

interface ExperienceEntry {
  company: string;
  country: string;
  position: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
}

interface EducationEntry {
  qualification: string;
  board: string;
  institute: string;
  year: string;
}

const emptyExperience = (): ExperienceEntry => ({
  company: '',
  country: '',
  position: '',
  startDate: '',
  endDate: '',
  isPresent: false,
});

const emptyEducation = (): EducationEntry => ({
  qualification: '',
  board: '',
  institute: '',
  year: '',
});

export default function ProfessionalForm() {
  const { t } = useTranslation();
  const [userLang, setUserLang] = useState('hi');
  const [saving, setSaving] = useState(false);

  /* ===== State ===== */
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([
    emptyExperience(),
  ]);
  const [educations, setEducations] = useState<EducationEntry[]>([
    emptyEducation(),
  ]);
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [customLanguages, setCustomLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [availableSkills, setAvailableSkills] = useState<
    { en: string; hi: string }[]
  >([]);

  /* ===== Load draft ===== */
  useEffect(() => {
    const load = async () => {
      const lang = await getLanguage();
      setUserLang(lang);

      const draft: any = await getDraft();
      if (draft) {
        if (draft.experiences && draft.experiences.length > 0) {
          setExperiences(draft.experiences);
        }
        if (draft.educations && draft.educations.length > 0) {
          setEducations(draft.educations);
        }
        setSkills(draft.skills || []);
        setCustomSkills(draft.customSkills || []);
        setLanguages(draft.languages || []);
        setCustomLanguages(draft.customLanguages || []);
        setAboutMe(draft.aboutMe || '');

        if (draft.subcategoryId) {
          setAvailableSkills(getSkillsForSubcategory(draft.subcategoryId));
        }
      }
    };
    load();
  }, []);

  const label = (en: string, hi: string) =>
    userLang === 'hi' ? `${en} (${hi})` : en;

  const skillLabel = (skill: { en: string; hi: string }) =>
    userLang === 'hi' ? `${skill.en} (${skill.hi})` : skill.en;

  /* ===== Experience handlers ===== */
  const updateExp = (
    idx: number,
    key: keyof ExperienceEntry,
    value: any
  ) => {
    if (key === 'startDate' || key === 'endDate') {
      value = formatMonthYear(value);
    }
    setExperiences((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, [key]: value } : e))
    );
  };

  const togglePresent = (idx: number) => {
    setExperiences((prev) =>
      prev.map((e, i) =>
        i === idx
          ? {
              ...e,
              isPresent: !e.isPresent,
              endDate: !e.isPresent ? 'Present' : '',
            }
          : e
      )
    );
  };

  const selectCountry = (idx: number, country: string) => {
    setExperiences((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, country } : e))
    );
  };

  const addExperience = () => {
    setExperiences((prev) => [...prev, emptyExperience()]);
  };

  const removeExperience = (idx: number) => {
    if (experiences.length === 1) return;
    setExperiences((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ===== Education handlers ===== */
  const updateEdu = (
    idx: number,
    key: keyof EducationEntry,
    value: string
  ) => {
    if (key === 'year') {
      value = value.replace(/[^0-9]/g, '').slice(0, 4);
    }
    setEducations((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, [key]: value } : e))
    );
  };

  const addEducation = () => {
    setEducations((prev) => [...prev, emptyEducation()]);
  };

  const removeEducation = (idx: number) => {
    if (educations.length === 1) return;
    setEducations((prev) => prev.filter((_, i) => i !== idx));
  };

  /* ===== Skills handlers ===== */
  const toggleSkill = (skillEn: string) => {
    setSkills((prev) =>
      prev.includes(skillEn)
        ? prev.filter((s) => s !== skillEn)
        : [...prev, skillEn]
    );
  };

  const addCustomSkill = () => {
    const v = newSkill.trim();
    if (!v) return;
    if (customSkills.includes(v) || skills.includes(v)) {
      setNewSkill('');
      return;
    }
    setCustomSkills((prev) => [...prev, v]);
    setNewSkill('');
  };

  const removeCustomSkill = (val: string) => {
    setCustomSkills((prev) => prev.filter((s) => s !== val));
  };

  /* ===== Language handlers ===== */
  const toggleLanguage = (langId: string) => {
    setLanguages((prev) =>
      prev.includes(langId)
        ? prev.filter((l) => l !== langId)
        : [...prev, langId]
    );
  };

  const addCustomLanguage = () => {
    const v = newLanguage.trim();
    if (!v) return;
    if (customLanguages.includes(v) || languages.includes(v)) {
      setNewLanguage('');
      return;
    }
    setCustomLanguages((prev) => [...prev, v]);
    setNewLanguage('');
  };

  const removeCustomLanguage = (val: string) => {
    setCustomLanguages((prev) => prev.filter((l) => l !== val));
  };

  /* ===== Save & Next ===== */
  const handleNext = async () => {
    Keyboard.dismiss();

    const validExps = experiences.filter(
      (e) => e.company.trim() || e.position.trim()
    );
    if (validExps.length === 0) {
      Alert.alert(
        label('Required', 'आवश्यक'),
        label(
          'Please add at least one work experience',
          'कृपया कम से कम एक काम का अनुभव भरें'
        )
      );
      return;
    }

    if (skills.length + customSkills.length === 0) {
      Alert.alert(
        label('Required', 'आवश्यक'),
        label(
          'Please select or add at least one skill',
          'कृपया कम से कम एक कौशल चुनें या जोड़ें'
        )
      );
      return;
    }

    try {
      setSaving(true);
      const draft = (await getDraft()) || {};
      const validEdus = educations.filter(
        (e) => e.qualification || e.board || e.institute
      );
      await saveDraft({
        ...draft,
        experiences: validExps,
        educations: validEdus,
        skills,
        customSkills,
        languages,
        customLanguages,
        aboutMe,
      });
      router.push('/preview');
    } catch (e) {
      console.error(e);
      Alert.alert(
        label('Error', 'त्रुटि'),
        label('Could not save', 'सेव नहीं हो सका')
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#F5F5F5' }}
      contentContainerStyle={styles.container}
      enableOnAndroid
      extraScrollHeight={120}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* ============ WORK EXPERIENCE ============ */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons name="briefcase" size={18} color="#1E88E5" />
          <Text style={styles.sectionTitle}>
            {label('Work Experience', 'काम का अनुभव')}
          </Text>
        </View>

        <Text style={styles.sectionNote}>
          {label(
            'Add company name, country and duration',
            'कंपनी का नाम, देश और समय भरें'
          )}
        </Text>

        {experiences.map((exp, idx) => (
          <View key={idx} style={styles.expCard}>
            <View style={styles.expCardHeader}>
              <Text style={styles.expCardTitle}>
                {label('Experience', 'अनुभव')} #{idx + 1}
              </Text>
              {experiences.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeExperience(idx)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={20} color="#E53935" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.fieldLabel}>
              {label('Company Name', 'कंपनी का नाम')}{' '}
              <Text style={styles.requiredStar}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={exp.company}
              onChangeText={(v) => updateExp(idx, 'company', v)}
              placeholder="e.g. Al-Rashid Contracting"
              placeholderTextColor="#AAA"
            />

            <Text style={styles.fieldLabel}>
              {label('Position / Role', 'पद / काम')}
            </Text>
            <TextInput
              style={styles.input}
              value={exp.position}
              onChangeText={(v) => updateExp(idx, 'position', v)}
              placeholder="e.g. Senior Electrician"
              placeholderTextColor="#AAA"
            />

            <Text style={styles.fieldLabel}>
              {label('Country', 'देश')}
            </Text>
            <TextInput
              style={styles.input}
              value={exp.country}
              onChangeText={(v) => updateExp(idx, 'country', v)}
              placeholder="e.g. Saudi Arabia"
              placeholderTextColor="#AAA"
            />
            <View style={styles.countryChips}>
              {COUNTRY_SUGGESTIONS.slice(0, 6).map((c) => (
                <TouchableOpacity
                  key={c.en}
                  style={[
                    styles.miniChip,
                    exp.country === c.en && styles.miniChipActive,
                  ]}
                  onPress={() => selectCountry(idx, c.en)}
                >
                  <Text
                    style={[
                      styles.miniChipText,
                      exp.country === c.en && styles.miniChipTextActive,
                    ]}
                  >
                    {userLang === 'hi' ? c.hi : c.en}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>
                  {label('Start Date', 'शुरू तिथि')}
                </Text>
                <TextInput
                  style={styles.input}
                  value={exp.startDate}
                  onChangeText={(v) => updateExp(idx, 'startDate', v)}
                  placeholder="MM/YYYY"
                  placeholderTextColor="#AAA"
                  keyboardType="number-pad"
                  maxLength={7}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>
                  {label('End Date', 'अंत तिथि')}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    exp.isPresent && styles.inputDisabled,
                  ]}
                  value={exp.isPresent ? 'Present' : exp.endDate}
                  onChangeText={(v) => updateExp(idx, 'endDate', v)}
                  placeholder="MM/YYYY"
                  placeholderTextColor="#AAA"
                  keyboardType="number-pad"
                  maxLength={7}
                  editable={!exp.isPresent}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.presentRow}
              onPress={() => togglePresent(idx)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={exp.isPresent ? 'checkbox' : 'square-outline'}
                size={22}
                color={exp.isPresent ? '#43A047' : '#888'}
              />
              <Text style={styles.presentText}>
                {label('Currently working here', 'अभी यहाँ काम कर रहे हैं')}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addBtn}
          onPress={addExperience}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={20} color="#1E88E5" />
          <Text style={styles.addBtnText}>
            {label('Add Another Company', 'और कंपनी जोड़ें')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ============ EDUCATION ============ */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons name="school" size={18} color="#1E88E5" />
          <Text style={styles.sectionTitle}>
            {label('Education', 'शिक्षा')}
          </Text>
        </View>

        <Text style={styles.sectionNote}>
          {label(
            'Add each qualification (10th, 12th, ITI, etc.)',
            'हर योग्यता जोड़ें (10वीं, 12वीं, ITI आदि)'
          )}
        </Text>

        {educations.map((edu, idx) => (
          <View key={idx} style={styles.expCard}>
            <View style={styles.expCardHeader}>
              <Text style={styles.expCardTitle}>
                {label('Qualification', 'योग्यता')} #{idx + 1}
              </Text>
              {educations.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeEducation(idx)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={20} color="#E53935" />
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.fieldLabel}>
              {label('Qualification', 'योग्यता')}
            </Text>
            <View style={styles.chipsContainer}>
              {EDUCATION_OPTIONS.map((opt) => {
                const isSelected = edu.qualification === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => updateEdu(idx, 'qualification', opt.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}
                    >
                      {userLang === 'hi' ? `${opt.en} (${opt.hi})` : opt.en}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>
              {label('Board / University', 'बोर्ड / यूनिवर्सिटी')}
            </Text>
            <TextInput
              style={styles.input}
              value={edu.board}
              onChangeText={(v) => updateEdu(idx, 'board', v)}
              placeholder="e.g. Bihar School Examination Board"
              placeholderTextColor="#AAA"
            />

            <Text style={styles.fieldLabel}>
              {label('School / Institute Name', 'स्कूल / संस्थान का नाम')}
            </Text>
            <TextInput
              style={styles.input}
              value={edu.institute}
              onChangeText={(v) => updateEdu(idx, 'institute', v)}
              placeholder="e.g. ITI Hathwa, Bihar"
              placeholderTextColor="#AAA"
            />

            <Text style={styles.fieldLabel}>
              {label('Year of Passing', 'पास होने का साल')}
            </Text>
            <TextInput
              style={styles.input}
              value={edu.year}
              onChangeText={(v) => updateEdu(idx, 'year', v)}
              placeholder="e.g. 2015"
              placeholderTextColor="#AAA"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
        ))}

        <TouchableOpacity
          style={styles.addBtn}
          onPress={addEducation}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={20} color="#1E88E5" />
          <Text style={styles.addBtnText}>
            {label('Add Another Qualification', 'और योग्यता जोड़ें')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ============ SKILLS ============ */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons name="construct" size={18} color="#1E88E5" />
          <Text style={styles.sectionTitle}>
            {label('Skills', 'कौशल')}
          </Text>
        </View>

        {availableSkills.length > 0 && (
          <>
            <Text style={styles.sectionNote}>
              {label('Select from below', 'नीचे से चुनें')}
            </Text>
            <View style={styles.chipsContainer}>
              {availableSkills.map((skill) => {
                const isSelected = skills.includes(skill.en);
                return (
                  <TouchableOpacity
                    key={skill.en}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleSkill(skill.en)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextActive,
                      ]}
                    >
                      {skillLabel(skill)}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#fff"
                        style={{ marginLeft: 4 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
          {label('Add your own skill', 'अपना कौशल जोड़ें')}
        </Text>
        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={newSkill}
            onChangeText={setNewSkill}
            placeholder={label('Type skill in English', 'कौशल English में लिखें')}
            placeholderTextColor="#AAA"
            onSubmitEditing={addCustomSkill}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.addIconBtn}
            onPress={addCustomSkill}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {customSkills.length > 0 && (
          <View style={[styles.chipsContainer, { marginTop: 10 }]}>
            {customSkills.map((s) => (
              <View key={s} style={styles.customChip}>
                <Text style={styles.customChipText}>{s}</Text>
                <TouchableOpacity
                  onPress={() => removeCustomSkill(s)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ============ LANGUAGES ============ */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons name="language" size={18} color="#1E88E5" />
          <Text style={styles.sectionTitle}>
            {label('Languages Known', 'ज्ञात भाषाएं')}
          </Text>
        </View>

        <View style={styles.chipsContainer}>
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = languages.includes(lang.id);
            return (
              <TouchableOpacity
                key={lang.id}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => toggleLanguage(lang.id)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    isSelected && styles.chipTextActive,
                  ]}
                >
                  {userLang === 'hi' ? `${lang.en} (${lang.hi})` : lang.en}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
          {label('Add another language', 'और भाषा जोड़ें')}
        </Text>
        <View style={styles.addRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={newLanguage}
            onChangeText={setNewLanguage}
            placeholder={label(
              'Type language in English',
              'भाषा English में लिखें'
            )}
            placeholderTextColor="#AAA"
            onSubmitEditing={addCustomLanguage}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.addIconBtn}
            onPress={addCustomLanguage}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {customLanguages.length > 0 && (
          <View style={[styles.chipsContainer, { marginTop: 10 }]}>
            {customLanguages.map((l) => (
              <View key={l} style={styles.customChip}>
                <Text style={styles.customChipText}>{l}</Text>
                <TouchableOpacity
                  onPress={() => removeCustomLanguage(l)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close-circle" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ============ ABOUT ME ============ */}
      <View style={styles.sectionBox}>
        <View style={styles.sectionHeader}>
          <Ionicons name="document-text" size={18} color="#1E88E5" />
          <Text style={styles.sectionTitle}>
            {label('About Me', 'मेरे बारे में')}
          </Text>
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>
              {label('Optional', 'वैकल्पिक')}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionNote}>
          {label(
            'Leave blank to use auto-generated text',
            'खाली छोड़ें तो डिफ़ॉल्ट text आएगा'
          )}
        </Text>

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write in English (short description)"
          placeholderTextColor="#AAA"
          multiline
          numberOfLines={4}
          maxLength={300}
          value={aboutMe}
          onChangeText={setAboutMe}
        />
        <Text style={styles.charCount}>{aboutMe.length} / 300</Text>
      </View>

      {/* ============ NEXT BUTTON ============ */}
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
            <Text style={styles.nextBtnText}>
              {label('Preview Resume', 'रिज्यूमे देखें')}
            </Text>
            <Ionicons name="eye" size={22} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </KeyboardAwareScrollView>
  );
}

/* ============================================================
   STYLES
============================================================ */
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
    backgroundColor: '#F5F5F5',
  },
  sectionBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  sectionTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#1E88E5',
  },
  sectionNote: {
    fontSize: 11.5,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 10,
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
  expCard: {
    backgroundColor: '#FAFBFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  expCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  expCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E88E5',
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 8,
  },
  requiredStar: { color: '#EF5350', fontWeight: '700' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14.5,
    color: '#222',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  inputDisabled: {
    backgroundColor: '#E8F5E9',
    color: '#2E7D32',
    fontWeight: '700',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  charCount: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  countryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  miniChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  miniChipActive: {
    backgroundColor: '#1E88E5',
    borderColor: '#1E88E5',
  },
  miniChipText: {
    fontSize: 11.5,
    color: '#555',
    fontWeight: '600',
  },
  miniChipTextActive: { color: '#fff' },
  presentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingVertical: 4,
  },
  presentText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#1E88E5',
    borderStyle: 'dashed',
    marginTop: 4,
  },
  addBtnText: {
    color: '#1E88E5',
    fontSize: 13,
    fontWeight: '700',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
  },
  chipActive: {
    backgroundColor: '#1E88E5',
    borderColor: '#1E88E5',
  },
  chipText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  customChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#43A047',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  customChipText: {
    color: '#fff',
    fontSize: 12.5,
    fontWeight: '600',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addIconBtn: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: '#1E88E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  nextBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    elevation: 3,
  },
  nextBtnDisabled: { opacity: 0.7 },
  nextBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});