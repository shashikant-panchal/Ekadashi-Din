import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NextEkadashiCard from "../components/NextEkadashiCard";
import PanchangCard from "../components/PanchangCard";
import SplitCard from "../components/SplitCard";
import { BackgroundGrey, DarkBlue } from "../constants/Colors";
import { dh, dw } from "../constants/Dimensions";
import { logo } from "../constants/Images";

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Feather
          name="bell"
          size={24}
          color="#4A5568"
          style={{ alignSelf: "flex-end", margin: 20 }}
        />
        <View>
          <Image resizeMode="contain" source={logo} style={styles.logo} />
          <Text style={styles.title}>Ekadashi Din</Text>
          <Text></Text>
          <Text style={styles.description}>
            हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे{" "}
          </Text>
          <Text style={styles.description}>
            हरे राम हरे राम राम राम हरे हरे{" "}
          </Text>
        </View>
        <StatusBar style="auto" backgroundColor="grey" />
        <NextEkadashiCard />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <SplitCard
            width={dw / 2.25}
            icon={"book-outline"}
            iconColor={DarkBlue}
            iconBackground={BackgroundGrey}
            title={"All Ekadashi"}
            subTitle={"Spiritual Guidance"}
          />
          <SplitCard
            icon={"calendar-outline"}
            iconColor={"#FAE013"}
            iconBackground={"#FEFCEB"}
            title={"Calendar"}
            subTitle={"Monthly View"}
          />
        </View>
        <SplitCard
          width={dw}
          list={"format-list-bulleted"}
          iconBackground={BackgroundGrey}
          iconColor={DarkBlue}
          title={"All Ekadashi"}
          subTitle={"Complete List"}
        />
        <PanchangCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  logo: {
    width: dw / 4,
    height: dh / 12,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: DarkBlue,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#4675C2",
    marginBottom: 10,
  },
});
