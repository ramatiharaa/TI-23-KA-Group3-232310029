import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, Animated, ScrollView } from "react-native";
import CustomFooter from "../components/CustomFooter";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

const allDistricts = ["Bogor Selatan", "Bogor Utara", "Bogor Timur", "Bogor Barat", "Bogor Tengah", "Tanah Sareal"];

const tanggalHeader = new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

const getStatus = (count) => {
    if (count >= 7) {
        return {
            label: "Tinggi",
            backgroundColor: "#ffc3c3",
            color: "#ff5e5e",
        };
    }
    if (count >= 3 && count <= 6) {
        return {
            label: "Sedang",
            backgroundColor: "#fff1c3",
            color: "#ffc15e",
        };
    }
    return {
        label: "Rendah", backgroundColor: "#c7ffc3", color: "#5eff66"
    };
};

const HomeScreen = () => {
    const [districtStats, setDistrictStats] = useState([]);
    const [totalMonthReports, setTotalMonthReports] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const isFocused = useIsFocused();

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
        loadReports();
    }, [isFocused]);

    const loadReports = async () => {
        try {
            const raw = await AsyncStorage.getItem("reportData");
            const parsed = JSON.parse(raw) || [];

            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            const thisMonthReports = parsed.filter((r) => {
                const reportDate = new Date(r.postDateTime);
                return reportDate.getMonth() === currentMonth && reportDate.getFullYear() === currentYear;
            });

            setTotalMonthReports(thisMonthReports.length);

            const countPerDistrict = {};
            allDistricts.forEach((d) => (countPerDistrict[d] = 0));
            thisMonthReports.forEach((r) => {
                if (countPerDistrict[r.lokasiBencanaAlam] !== undefined) {
                    countPerDistrict[r.lokasiBencanaAlam]++;
                }
            });

            const stats = allDistricts.map((district) => {
                const count = countPerDistrict[district];
                const status = getStatus(count);
                return {
                    district,
                    count,
                    status,
                };
            });

            setDistrictStats(stats);
        } catch (e) {
            console.log("Gagal load data:", e);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "bottom"]}>
            <LinearGradient colors={["#ffffff", "#ffffff", "#52a9ff"]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
                    <View style={{ padding: 15 }}>
                        <View style={{ flexDirection: "row", height: 55,nwidth: 300 }} >
                            <View style={{ width: 55, height: 55, borderRadius: 29, backgroundColor: "#52a9ff", justifyContent: "center", alignItems: "center" }} >
                                <Image source={require("../../assets/pp.jpeg")} style={{ width: 50, height: 50, borderRadius: 25 }} resizeMode="contain" />
                            </View>
                            <View style={{ flex: 1, justifyContent: "space-between", marginLeft: 13, paddingVertical: 8 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 13, color: "#adadad" }} >
                                    {tanggalHeader}
                                </Text>
                                <Text style={{ fontWeight: "bold", fontSize: 18 }}>Hi, Rama</Text>
                            </View>
                        </View>

                        <View style={{ alignItems: "center", height: 300, justifyContent: "center" }} >
                            <Text style={{ fontSize: 80 }}>{totalMonthReports}</Text>
                            <Text style={{ textAlign: "center", fontSize: 15 }}>{"Total\nBencana Alam\nBulan Ini"}</Text>
                        </View>

                        <View style={{ gap: 5 }}>
                            {districtStats.map((item, index) => (
                                <View key={index}
                                    style={{ backgroundColor: "white", borderRadius: 20, flexDirection: "row", paddingHorizontal: 20, paddingVertical: 25, shadowColor: "#000000", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.17, shadowRadius: 2.05, elevation: 4, alignItems: "center", justifyContent: "space-between" }}>
                                    <View style={{ width: "70%" }}>
                                        <Text style={{ fontWeight: "bold",  fontSize: 17 }}>
                                            {item.district}
                                        </Text>
                                        <Text style={{ fontWeight: "bold", fontSize: 14, color: "#adadad", marginTop: 9  }}>
                                            {item.status.label}
                                        </Text>
                                    </View>
                                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                                        <View style={{ backgroundColor: item.status.backgroundColor, paddingHorizontal: 20, paddingVertical: 3, borderRadius: 25 }} >
                                            <Text style={{ color: item.status.color, fontWeight: "bold", fontSize: 14 }}>
                                                {item.count}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>
            <CustomFooter />
        </SafeAreaView>
    );
};

export default HomeScreen;
