import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TextInput, Animated, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomFooter from "../components/CustomFooter";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const ReportScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [reports, setReports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            const fetchReports = async () => {
            try {
                const data = await AsyncStorage.getItem("reportData");
                if (data !== null) {
                const parsedData = JSON.parse(data);
                const sorted = parsedData.sort((a, b) => b.id - a.id);
                setReports(sorted);
                } else {
                setReports([]);
                }
            } catch (e) {
                console.log("Gagal ambil data:", e);
            }
            };

            fetchReports();
        }
        }, [isFocused]);

    const filteredReports = reports.filter((item) => {
        const search = searchTerm.toLowerCase();
        return (
            item.lokasiBencanaAlam?.toLowerCase().includes(search) ||
            item.jenisBencanaAlam?.toLowerCase().includes(search) ||
            item.alamatLengkap?.toLowerCase().includes(search) ||
            item.deskripsi?.toLowerCase().includes(search)
        );
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <LinearGradient colors={["#ffffff", "#ffffff", "#52a9ff"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
                    <View style={{ padding: 15 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 15 }}>
                            <View>
                                <View style={{ width: 55, height: 55, borderRadius: 29, backgroundColor: "#52a9ff", justifyContent: "center", alignItems: "center" }}>
                                    <Image source={require("../../assets/pp.jpeg")} style={{ width: 50, height: 50, borderRadius: 25, }} resizeMode="contain" />
                                </View>
                            </View>
                            <View style={{ marginLeft: 13, justifyContent: "center" }} >
                                <TextInput style={styles.input} placeholder="Cari report..." placeholderTextColor="#aaa" value={searchTerm} onChangeText={(text) => setSearchTerm(text)} />
                                <Ionicons name="search" size={30} color="#888" style={styles.icon} />
                            </View>
                        </View>

                        {filteredReports.map((item, index) => (
                            <View key={index} style={{ marginBottom: 3 }}>
                                <View style={styles.card}>
                                    <View style={{ flexDirection: "row", gap: 10 }}>
                                        <View>
                                            <View style={styles.avatarContainer}>
                                                <Image source={require("../../assets/pp.jpeg")} style={styles.avatar} resizeMode="contain" />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontWeight: "bold" }}>Rama Tihara</Text>
                                            <View style={styles.metaContainer}>
                                                <Text style={styles.linetwo}>{item.jenisBencanaAlam}</Text>
                                                <View style={styles.dotStyle} />
                                                <Text style={styles.linetwo}>{item.lokasiBencanaAlam}</Text>
                                                <View style={styles.dotStyle} />
                                                <Text style={styles.linetwo}>{new Date(item.waktuKejadian).toLocaleString("id-ID")}</Text>
                                            </View>

                                            {item.alamatLengkap !== "" && (
                                                <TouchableOpacity
                                                    disabled={item.latitude === "" || item.longitude === ""}
                                                    onPress={() => {
                                                        if (item.latitude !== "" && item.longitude !== "") {
                                                            const url = `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`;
                                                            Linking.openURL(url);
                                                        }
                                                    }}
                                                >
                                                    <Text style={[ styles.linethree, {
                                                        color: item.latitude !== "" && item.longitude !== "" ? "blue" : "black",
                                                        textDecorationLine: item.latitude !== "" && item.longitude !== "" ? "underline" : "none",
                                                    },]}>
                                                        {item.alamatLengkap}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>

                                    <Text style={{ marginTop: 10, fontSize: 14 }}>{item.deskripsi}</Text>

                                    {item.image ? (
                                        <View style={{ marginTop: 10 }}>
                                            <Image source={{ uri: item.image }} style={styles.reportImage} resizeMode="cover" />
                                        </View>
                                    ) : null}

                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ fontSize: 10, color: "gray" }}>
                                            {new Date(item.id).toLocaleString("id-ID")}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </Animated.View>
            <CustomFooter />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    input: {
        borderRadius: 10,
        height: 40,
        borderColor: "gray",
        borderWidth: 0.5,
        paddingHorizontal: 15,
        fontSize: 16,
        width: 270,
    },
    icon: {
        position: "absolute",
        right: 10,
        top: "22%",
    },
    dotStyle: {
        width: 5,
        height: 5,
        borderRadius: 5,
        backgroundColor: "gray",
    },
    linetwo: {
        fontSize: 9,
        color: "gray",
        fontWeight: "bold",
    },
    linethree: {
        fontSize: 10,
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.17,
        shadowRadius: 2.05,
        elevation: 4,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 29,
        backgroundColor: "#52a9ff",
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 25,
    },
    reportImage: {
        width: "100%",
        height: 200,
        borderRadius: 10,
    },
    metaContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        flexWrap: "wrap",
    },
});

export default ReportScreen;
