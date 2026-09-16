import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  LANGUAGE: 'user_language',
  DRAFT_RESUME: 'draft_resume',
  IS_PAID: 'is_paid',
  TERMS_ACCEPTED: 'terms_accepted', // ✅ NAYA
};

/* ============================================================
   LANGUAGE
============================================================ */

export const saveLanguage = async (lang: string): Promise<void> => {
  await AsyncStorage.setItem(StorageKeys.LANGUAGE, lang);
};

export const getLanguage = async (): Promise<string> => {
  const language = await AsyncStorage.getItem(StorageKeys.LANGUAGE);
  return language || 'hi';
};

/* ============================================================
   DRAFT RESUME
============================================================ */

export const saveDraft = async (data: object): Promise<void> => {
  await AsyncStorage.setItem(
    StorageKeys.DRAFT_RESUME,
    JSON.stringify(data)
  );
};

export const getDraft = async (): Promise<any> => {
  const raw = await AsyncStorage.getItem(StorageKeys.DRAFT_RESUME);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to parse saved draft:', error);
    return null;
  }
};

export const clearDraft = async (): Promise<void> => {
  await AsyncStorage.removeItem(StorageKeys.DRAFT_RESUME);
};

/* ============================================================
   PAID STATUS
============================================================ */

export const setPaid = async (paid: boolean): Promise<void> => {
  await AsyncStorage.setItem(
    StorageKeys.IS_PAID,
    JSON.stringify(paid)
  );
};

export const isPaid = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(StorageKeys.IS_PAID);
  return value === 'true';
};

export const clearPaid = async (): Promise<void> => {
  await AsyncStorage.removeItem(StorageKeys.IS_PAID);
};

/* ============================================================
   TERMS ACCEPTANCE ✅ NAYA
============================================================ */

export const saveTermsAccepted = async (): Promise<void> => {
  await AsyncStorage.setItem(StorageKeys.TERMS_ACCEPTED, 'true');
};

export const isTermsAccepted = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(StorageKeys.TERMS_ACCEPTED);
  return value === 'true';
};

export const clearTermsAccepted = async (): Promise<void> => {
  await AsyncStorage.removeItem(StorageKeys.TERMS_ACCEPTED);
};

/* ============================================================
   CLEAR ALL
============================================================ */

export const clearAll = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    StorageKeys.DRAFT_RESUME,
    StorageKeys.IS_PAID,
  ]);
  // ⚠️ Terms acceptance ko clear nahi karte — woh permanent hai
};