import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, Spacing, Typography, Layout } from '../theme';
import { Plus } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_SIZE = (width - Spacing.m * 2 - Spacing.s * (COLUMN_COUNT - 1)) / COLUMN_COUNT;

// Mock data
const PHOTOS = [1, 2, 3, 4, 5, 6];

export default function PhotoLocketScreen() {
  const renderItem = ({ item }: { item: any }) => {
    if (item === 'add') {
      return (
        <TouchableOpacity style={[styles.photoItem, styles.addItem]}>
          <Plus color={Colors.Starlight} size={32} />
        </TouchableOpacity>
      );
    }
    return (
      <View style={[styles.photoItem, { backgroundColor: Colors.DeepNight }]}>
        {/* Placeholder for actual image */}
        <Text style={{ color: Colors.Starlight, opacity: 0.3 }}>IMG_{item}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={['add', ...PHOTOS]}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={{ gap: Spacing.s }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.VoidBlack,
  },
  listContent: {
    padding: Spacing.m,
    gap: Spacing.s,
  },
  photoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: Layout.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItem: {
    borderWidth: 2,
    borderColor: Colors.ShadowPurple,
    borderStyle: 'dashed',
  },
});
