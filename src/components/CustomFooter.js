import { View, TouchableOpacity, StyleSheet, Dimensions, Image } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const CustomFooter = () => {
    const height = 100;
    const notchDepth = 20;
    const notchWidth = 200;
    const centerX = width / 2;

    const path = `
      M0 0
      H${centerX - notchWidth / 2}
      C${centerX - notchWidth / 4} 0, ${centerX - notchWidth / 4} ${notchDepth}, ${centerX} ${notchDepth}
      C${centerX + notchWidth / 4} ${notchDepth}, ${centerX + notchWidth / 4} 0, ${centerX + notchWidth / 2} 0
      H${width}
      V${height}
      H0
      Z
  `;



    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Svg width={width} height={height} style={styles.svgStyle}>
                <Path d={path} fill="#fff" />
            </Svg>

            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Image source={require("../../assets/home.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </TouchableOpacity>

            <View style={styles.centerButtonWrapper}>
                <TouchableOpacity onPress={() => navigation.navigate("AddReport")} style={styles.centerButton}>
                    <Ionicons name="add" size={40} color="white" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Report")}>
                <Image source={require("../../assets/megaphone.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 10,
        paddingHorizontal: 30,
        gap: 130,
        paddingBottom: 50,
    },
    svgStyle: {
        position: "absolute",
        bottom: 0,
    },
    centerButtonWrapper: {
        position: "absolute",
        top: -35,
        left: width / 2 - 35,
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 11,
    },
    centerButton: {
        backgroundColor: "#52a9ff",
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
    },
});

export default CustomFooter;
