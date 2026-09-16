import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getLanguage, saveDraft, getDraft } from '../src/utils/storage';
import {
  getCategoryById,
  getSubcategoryLabel,
  Category,
  Subcategory,
} from '../src/utils/categories';

export default function SubcategoryScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const categoryId = params.categoryId as string;

  const [userLang, setUserLang] = useState('hi');
  const [category, setCategory] = useState<Category | null>(null);

  useEffect(() => {
    const load = async () => {
      const lang = await getLanguage();
      setUserLang(lang);

      if (categoryId) {
        const cat = getCategoryById(categoryId);
        setCategory(cat || null);
      }
    };
    load();
  }, [categoryId]);

  const handleSelect = async (sub: Subcategory) => {
    // Draft mein category + subcategory save karein
    const existingDraft = (await getDraft()) || {};
    await saveDraft({
      ...existingDraft,
      categoryId: category?.id,
      categoryName: category?.en,
      subcategoryId: sub.id,
      subcategoryName: sub.en,
    });

    router.push('/form/personal');
  };

  const renderItem = ({ item }: { item: Subcategory }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelect(item)}
      activeOpacity={0.8}
    >
      <View style={styles.iconBox}>
        <Ionicons name={item.icon as any} size={26} color="#1E88E5" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {getSubcategoryLabel(item, userLang)}
        </Text>
      </View>
      <Ionicons name="arrow-forward-circle" size={24} color="#1E88E5" />
    </TouchableOpacity>
  );

  if (!category) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Category not found</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Ionicons name="grid-outline" size={16} color="#666" />
        <Text style={styles.breadcrumbText}>
          {category.en}
        </Text>
      </View>

      <Text style={styles.heading}>{t('select_subcategory')}</Text>
      <Text style={styles.subheading}>
        Choose your exact profession
      </Text>

      <FlatList
        data={category.subcategories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    minHeight: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  breadcrumbText: {
    fontSize: 13,
    color: '#1E88E5',
    fontWeight: '600',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
});