import { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  View,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { getLanguage } from '../src/utils/storage';
import {
  getCategories,
  getCategoryLabel,
  Category,
} from '../src/utils/categories';

export default function CategoryScreen() {
  const { t } = useTranslation();
  const [userLang, setUserLang] = useState('hi');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => {
      const lang = await getLanguage();
      setUserLang(lang);
      setCategories(getCategories());
    };
    load();
  }, []);

  const handleSelect = (cat: Category) => {
    router.push({
      pathname: '/subcategory',
      params: { categoryId: cat.id },
    });
  };

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSelect(item)}
      activeOpacity={0.8}
    >
      <View style={styles.iconBox}>
        <Ionicons name={item.icon as any} size={28} color="#1E88E5" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {getCategoryLabel(item, userLang)}
        </Text>
        <Text style={styles.cardSubtitle}>
          {item.subcategories.length} professions
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{t('select_category')}</Text>
      <Text style={styles.subheading}>Choose the field you work in</Text>

      <FlatList
        data={categories}
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
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#888',
  },
});