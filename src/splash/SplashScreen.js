import { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onFinish }) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const maxRadius = Math.sqrt(width * width + height * height);
        const scaleTarget = maxRadius / 50;

        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: scaleTarget,
                duration: 1600,
                useNativeDriver: true,
            }),
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setTimeout(() => {
                if (onFinish) onFinish();
            }, 2000);
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]} />
            <Animated.Image source={require("../../assets/siaga-bogor.png")} style={[styles.logo, { opacity: logoOpacity }]} resizeMode="contain" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#3fbcff",
        justifyContent: "center",
        alignItems: "center",
    },
    circle: {
        position: "absolute",
        width: 100,
        height: 100,
        borderRadius: 100,
        backgroundColor: "#fff",
    },
    logo: {
        width: 150,
        height: 150,
    },
});
