import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'
import { DarkBlue, LightBlue } from '../constants/Colors'

const SplitCard = ({ icon, iconColor, iconBackground, list, title, subTitle }) => {
    return (
        <View style={styles.container}>
            {list ? (<View style={[styles.iconBackground, { backgroundColor: iconBackground }]}>
                <MaterialCommunityIcons name={list} size={24} color={iconColor} />
            </View>) : <View style={[styles.iconBackground, { backgroundColor: iconBackground }]}>
                <Ionicons name={icon} size={24} color={iconColor} />
            </View>}
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subTitle}</Text>
        </View>
    )
}

export default SplitCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#ccc',
        elevation: 2,
        borderRadius: 7,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 10
    },
    iconBackground: {
        // backgroundColor: "#D5DBE2",
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: DarkBlue,
        marginVertical: 5
    },
    subtitle: {
        fontSize: 14,
        color: LightBlue,
    }
})