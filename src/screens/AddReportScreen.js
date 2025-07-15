import { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import Feather from "@expo/vector-icons/Feather";

const jenisBencanaAlam = [
    { label: "Gempa Bumi", value: "1" },
    { label: "Tanah Longsor", value: "2" },
    { label: "Banjir", value: "3" },
    { label: "Tsunami", value: "4" },
    { label: "Gunung Meletus", value: "5" },
    { label: "Kekeringan", value: "6" },
    { label: "Angin Puting Beliung", value: "7" },
    { label: "Topan", value: "8" },
    { label: "Hujan Es", value: "9" },
    { label: "Kebakaran", value: "10" },
    { label: "Abrasi", value: "11" },
    { label: "Erosi", value: "12" },
    { label: "Gelombang Panas", value: "13" },
];

const lokasiBencanaAlam = [
    { label: "Bogor Selatan", value: "1" },
    { label: "Bogor Utara", value: "2" },
    { label: "Bogor Timur", value: "3" },
    { label: "Bogor Barat", value: "4" },
    { label: "Bogor Tengah", value: "5" },
    { label: "Tanah Sareal", value: "6" },
];

const AddReportScreen = () => {
    const [isEditable, setIsEditable] = useState(true);

    const navigation = useNavigation();

    const [report, setReport] = useState({
        jenisBencanaAlam: "",
        lokasiBencanaAlam: "",
        alamatLengkap: "",
        longitude: "",
        latitude: "",
        waktuKejadian: new Date(),
        deskripsi: "",
        image: "",
        postDateTime: "",
    });

    const resetData = async () => {
        await AsyncStorage.removeItem("reportData");
        Alert.alert("Data dihapus");
    };

    const lihatData = async () => {
        const data = await AsyncStorage.getItem("reportData");
        try {
            console.log("Data Laporan:", JSON.parse(data));
        } catch {
            console.log("Data rusak atau kosong");
        }
    };

    const simpanData = async () => {
        if (report.jenisBencanaAlam === "" || report.lokasiBencanaAlam === "" || report.alamatLengkap === "" || report.waktuKejadian === "" || report.deskripsi === "") {
            alert("Mohon input semua kolom (image optional)");
            return;
        }

        try {
            const existingData = await AsyncStorage.getItem("reportData");
            let parsed = [];

            try {
                const json = JSON.parse(existingData);
                parsed = Array.isArray(json) ? json : [];
            } catch (e) {
                parsed = [];
            }

            const newReport = {
                ...report,
                postDateTime: Date.now(),
                waktuKejadian: new Date(report.waktuKejadian).toISOString(),
            };

            const updatedData = [...parsed, newReport];
            await AsyncStorage.setItem("reportData", JSON.stringify(updatedData));

            console.log("Data report berhasil ditambahkan:", newReport);
            navigation.navigate('Report');
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Laporan Baru",
                    body: `Jenis: ${report.jenisBencanaAlam} | Lokasi: ${report.lokasiBencanaAlam}`,
                    sound: 'default'
                },
                trigger: { seconds: 1 },
            });
        } catch (e) {
            console.log("Gagal simpan:", e);
        }
    };

    const handleChange = (field, value) => {
        setReport((prev) => ({ ...prev, [field]: value }));
    };

    const onChange = (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
            handleChange("waktuKejadian", selectedDate);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            handleChange("image", result.assets[0].uri);
        }
    };

    const handleGetLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Izin lokasi ditolak");
                return;
            }

            const lokasi = await Location.getCurrentPositionAsync({});
            const address = await Location.reverseGeocodeAsync({
                latitude: lokasi.coords.latitude,
                longitude: lokasi.coords.longitude,
            });

            if (address.length > 0) {
                const a = address[0];
                const fullAlamat = `${a.name ?? ""}, ${a.district ?? ""}, ${a.city ?? ""}`;
                handleChange("alamatLengkap", fullAlamat);
                handleChange("longitude", lokasi.coords.longitude);
                handleChange("latitude", lokasi.coords.latitude);
                setIsEditable(false);
            } else {
                Alert.alert("Alamat tidak ditemukan");
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Terjadi kesalahan saat mengambil lokasi");
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top", "bottom"]}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 15 }}>
                        <View style={{ marginTop: 20, flexDirection: "row", width: "100%", position: "relative" }}>
                            <View style={{ width: "20%" }}>
                                <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 0, bottom: 30, left: 0, right: 30 }}>
                                    <Feather name="x" size={35} color="black" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "80%" }} />
                            <Text style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontSize: 18, fontWeight: "bold", marginTop: 7 }}>Tambah Laporan</Text>
                        </View>

                        <View style={{ flexDirection: "row", height: 55, width: 300, marginTop: 30 }}>
                            <View style={{ width: 55, height: 55, borderRadius: 29, backgroundColor: "#52a9ff", justifyContent: "center", alignItems: "center" }}>
                                <Image source={require("../../assets/pp.jpeg")} style={{ width: 50, height: 50, borderRadius: 25 }} resizeMode="contain" />
                            </View>
                            <View style={{ flex: 1, justifyContent: "center", marginLeft: 13 }}>
                                <Text style={{ fontWeight: "bold", fontSize: 18 }}>Community Member</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 40 }}>
                            <Text style={{ fontWeight: "bold" }}>Jenis Bencana Alam</Text>
                            <View style={{ marginTop: 6 }}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={jenisBencanaAlam}
                                    maxHeight="auto"
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih"
                                    onChange={(item) => handleChange("jenisBencanaAlam", item.label)}
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>Lokasi Bencana Alam</Text>
                            <View style={{ marginTop: 6 }}>
                                <Dropdown
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={lokasiBencanaAlam}
                                    maxHeight="auto"
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Pilih"
                                    onChange={(item) => handleChange("lokasiBencanaAlam", item.label)}
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>Alamat Lengkap</Text>
                            <View style={{ marginTop: 6 }}>
                                <TextInput
                                    editable={isEditable}
                                    value={report.alamatLengkap}
                                    onChangeText={(text) => handleChange("alamatLengkap", text)}
                                    placeholder="Masukkan alamat lengkap..."
                                    style={[isEditable ? styles.input : styles.readOnlyInput, { marginBottom: 5 }]}
                                />
                                <TouchableOpacity onPress={handleGetLocation}>
                                    <Text style={{ color: "#52a9ff" }}>Gunakan lokasi saat ini</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>Waktu Kejadian</Text>
                            <View style={{ marginTop: 6 }}>
                                <DateTimePicker testID="dateTimePicker" value={new Date(report.waktuKejadian)} mode="datetime" is24Hour={true} onChange={onChange} />
                            </View>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontWeight: "bold" }}>Deskripsi</Text>
                            <View style={{ marginTop: 6 }}>
                                <TextInput
                                    value={report.deskripsi}
                                    onChangeText={(text) => handleChange("deskripsi", text)}
                                    placeholder="Masukkan deskripsi..."
                                    style={[styles.input, { height: 150, textAlignVertical: "top", paddingVertical: 10 }]}
                                    multiline={true}
                                />
                            </View>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <TouchableOpacity onPress={pickImage}>
                                <View
                                    style={{
                                        paddingVertical: 15,
                                        borderRadius: 20,
                                        borderWidth: 2,
                                        borderColor: "#4877d6",
                                        borderStyle: "dotted",
                                        backgroundColor: "#e8f0fb",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Image source={require("../../assets/upload-big-arrow.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
                                    <Text style={{ color: "#969696", fontWeight: "bold" }}>Upload Foto</Text>
                                </View>
                            </TouchableOpacity>
                            {report.image && (
                                <View style={{ alignItems: "center", marginTop: 20 }}>
                                    <Image source={{ uri: report.image }} style={{ width: 200, height: 200, borderRadius: 15 }} resizeMode="contain" />
                                </View>
                            )}
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <TouchableOpacity onPress={simpanData}>
                                <View style={{ backgroundColor: "#67b3ff", justifyContent: "center", alignItems: "center", paddingVertical: 5, borderRadius: 15, flexDirection: "row" }}>
                                    <Image source={require("../../assets/pesawat.png")} style={{ width: 50, height: 50, borderRadius: 25 }} resizeMode="contain" />
                                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>Posting</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Tombol testing */}
                        {/* <TouchableOpacity onPress={lihatData} style={[styles.button, { backgroundColor: "gray" }]}>
                            <Text style={styles.buttonText}>Lihat Data di Console</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={resetData} style={[styles.button, { backgroundColor: "red" }]}>
                            <Text style={styles.buttonText}>Reset Semua Data</Text>
                        </TouchableOpacity> */}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        paddingHorizontal: 15,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: "absolute",
        backgroundColor: "white",
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    input: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    image: {
        width: 500,
        height: "auto",
        marginTop: 10,
        borderRadius: 10,
    },
    readOnlyInput: {
        height: 50,
        borderColor: "gray",
        borderWidth: 0.5,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f0f0f0',
        color: '#888'
    },
});

export default AddReportScreen;
