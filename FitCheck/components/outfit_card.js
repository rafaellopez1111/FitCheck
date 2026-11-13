import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../config/config';

export default function OutfitCard({ outfit, onPress }) {
    const { name, occasion, item_ids } = outfit;
    const count = item_ids.length;
    const label = count === 1 ? 'peça' : 'peças';

    return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
        </View>
        <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>
            <Text style={styles.count}>{count} {label}</Text>
            {occasion ? (
                <View style={styles.tag}>
                    <Text style={styles.tagText}>{occasion}</Text>
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
        padding: 14,
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
    badge: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.white,
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
    count: {
        fontSize: 13,
        color: COLORS.mutedText,
        marginTop: 3,
    },
    tag: {
        alignSelf: 'flex-start',
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 10,
        backgroundColor: COLORS.primarySoft,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },
});
