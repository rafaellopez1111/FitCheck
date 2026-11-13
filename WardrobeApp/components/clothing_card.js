import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../config/config';

export default function ClothingCard({ clothing, onPress }) {
  const { photo, name, category, brand } = clothing;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>{name.charAt(0).toUpperCase()}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
        {brand ? <Text style={styles.brand}>{brand}</Text> : null}
        {clothing.style ? (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{clothing.style}</Text>
          </View>
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
    marginBottom: 10,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  placeholder: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.mutedText,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  category: {
    fontSize: 14,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  brand: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: 2,
  },
  tag: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.card,
  },
});