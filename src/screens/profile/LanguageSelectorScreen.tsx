import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/styles/ThemeProvider';
import { MMKV } from 'react-native-mmkv';

const { width } = Dimensions.get('window');
const storage = new MMKV({ id: 'language-storage' });

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

interface LanguageSelectorScreenProps {
  navigation: any;
}

export function LanguageSelectorScreen({ navigation }: LanguageSelectorScreenProps) {
  const { colors } = useTheme();
  const [selectedCode, setSelectedCode] = useState('en');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const saved = storage.getString('language');
    if (saved) setSelectedCode(saved);
  }, []);

  const filteredLanguages = searchQuery.trim()
    ? languages.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : languages;

  const handleSelect = (code: string) => {
    setSelectedCode(code);
    storage.set('language', code);
  };

  const renderLanguageItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === selectedCode;
    return (
      <TouchableOpacity
        style={[
          styles.languageItem,
          { borderBottomColor: colors.border },
          isSelected && { backgroundColor: colors.primary + '10' },
        ]}
        onPress={() => handleSelect(item.code)}
        accessibilityRole="button"
        accessibilityLabel={`Select ${item.name}`}
        accessibilityState={{ selected: isSelected }}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.languageInfo}>
          <Text style={[styles.languageName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.nativeName, { color: colors.textSecondary }]}>
            {item.nativeName}
          </Text>
        </View>
        {isSelected && (
          <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Language</Text>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[
            styles.searchInput,
            { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
          ]}
          placeholder="Search languages..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Search languages"
        />
      </View>

      <View style={[styles.currentLanguage, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.currentLabel, { color: colors.textSecondary }]}>Current Language</Text>
        <Text style={[styles.currentValue, { color: colors.text }]}>
          {languages.find((l) => l.code === selectedCode)?.flag}{' '}
          {languages.find((l) => l.code === selectedCode)?.name}
        </Text>
      </View>

      <FlatList
        data={filteredLanguages}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: { fontSize: 16, fontWeight: '600', marginRight: 12 },
  title: { fontSize: 20, fontWeight: 'bold' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  currentLanguage: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  currentLabel: { fontSize: 12, marginBottom: 2 },
  currentValue: { fontSize: 16, fontWeight: '600' },
  listContent: { paddingHorizontal: 20 },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  flag: { fontSize: 24 },
  languageInfo: { flex: 1 },
  languageName: { fontSize: 16, fontWeight: '500' },
  nativeName: { fontSize: 13, marginTop: 2 },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});
