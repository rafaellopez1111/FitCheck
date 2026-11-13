import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, PRIORITY_LABELS } from '../config/config';

export default function ClothingCard({ clothing, onPress, isWishlist }) {
  const { photo, name, category, brand } = clothing;
  const { price, priority } = clothing && isWishlist ? clothing : {};

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.category}>
          {category}{brand ? ` · ${brand}` : ''}{clothing.size ? ` · ${clothing.size}` : ''}
        </Text>

        <View style={styles.tags}>
          {clothing.style ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{clothing.style}</Text>
            </View>
          ) : null}
          {isWishlist && priority ? (
            <View style={styles.priorityTag}>
              <Text style={styles.priorityText}>{PRIORITY_LABELS[priority]}</Text>
            </View>
          ) : null}
        </View>

        {isWishlist && typeof price === 'number' ? (
          <Text style={styles.price}>R$ {price.toFixed(2)}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 14,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  category: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 3,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    marginRight: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: COLORS.accent,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
  },
});
