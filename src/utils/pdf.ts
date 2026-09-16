import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import {
  generateResumeHtml,
  ResumeData,
  ResumeColor,
  DEFAULT_COLOR,
} from './resumeHtml';

const buildFileName = (data: ResumeData): string => {
  const name = (data.name || 'Resume').trim().replace(/\s+/g, '_');
  const profession = (data.subcategoryName || 'Karigar')
    .trim()
    .replace(/\s+/g, '_');
  const year = new Date().getFullYear();
  return `${name}_${profession}_${year}.pdf`;
};

export const generateResumePdf = async (
  data: ResumeData,
  options: {
    showWatermark?: boolean;
    color?: ResumeColor;
  } = {}
): Promise<string | null> => {
  try {
    const showWatermark = options.showWatermark ?? true;
    const color = options.color ?? DEFAULT_COLOR;

    const html = generateResumeHtml(data, {
      showWatermark,
      color,
    });

    console.log('📄 HTML length:', (html.length / 1024).toFixed(1), 'KB');

    const { uri, base64 } = await Print.printToFileAsync({
      html,
      base64: true,
      useMarkupFormatter: false, // ← Android fix for base64 images
    });

    console.log('📄 Print URI:', uri);
    console.log('📄 PDF base64 length:', base64?.length || 0);

    if (!base64) {
      console.warn('⚠️ No base64 from Print, using original URI');
      return uri;
    }

    const fileName = buildFileName(data);
    const dir = FileSystem.documentDirectory + 'resumes/';

    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }

    const newUri = dir + fileName;
    await FileSystem.writeAsStringAsync(newUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('✅ PDF written to:', newUri);
    return newUri;
  } catch (error) {
    console.error('❌ PDF generation error:', error);
    Alert.alert('PDF Error', 'Could not generate PDF. Please try again.');
    return null;
  }
};

export const shareResumePdf = async (
  pdfUri: string,
  data: ResumeData
): Promise<void> => {
  try {
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      Alert.alert('Sharing not available', 'Not supported on this device.');
      return;
    }

    await Sharing.shareAsync(pdfUri, {
      mimeType: 'application/pdf',
      dialogTitle: `Share ${data.name || 'Resume'}'s Resume`,
      UTI: 'com.adobe.pdf',
    });
  } catch (error) {
    console.error('❌ Share error:', error);
    Alert.alert('Share failed', 'Could not share PDF.');
  }
};

export const savePdfToDevice = async (
  pdfUri: string,
  data: ResumeData
): Promise<string | null> => {
  try {
    const fileName = buildFileName(data);

    if (Platform.OS === 'android') {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

      if (!permissions.granted) {
        Alert.alert('Permission needed', 'Please select a folder.');
        return null;
      }

      const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        'application/pdf'
      );

      const fileContent = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(newUri, fileContent, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('✅ PDF saved to:', newUri);
      return newUri;
    } else {
      const docsDir = FileSystem.documentDirectory;
      if (!docsDir) return null;

      const destination = docsDir + fileName;
      const fileContent = await FileSystem.readAsStringAsync(pdfUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.writeAsStringAsync(destination, fileContent, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return destination;
    }
  } catch (error) {
    console.error('❌ Save error:', error);
    Alert.alert('Error', 'Could not save PDF.');
    return null;
  }
};

export const pdfExists = async (uri: string): Promise<boolean> => {
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info.exists;
  } catch {
    return false;
  }
};