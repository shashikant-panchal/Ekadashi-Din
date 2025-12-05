import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const SplitCard = ({ icon, iconColor, iconBackground, list, title, subTitle, onPress }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onPress}>
            {list ? (<View style={[styles.iconBackground, { backgroundColor: iconBackground }]}>
                <MaterialCommunityIcons name={list} size={24} color={iconColor} />
            </View>) : <View style={[styles.iconBackground, { backgroundColor: iconBackground }]}>
                <Ionicons name={icon} size={24} color={iconColor} />
            </View>}
            <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subTitle}</Text>
        </TouchableOpacity>
    )
}

export default SplitCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 0.5,
        elevation: 2,
        borderRadius: 7,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    iconBackground: {
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5
    },
    subtitle: {
        fontSize: 14,
    }
})