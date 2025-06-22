import { useEffect, useState } from "react";
import SplashScreen from "./src/splash/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddReportScreen from "./src/screens/AddReportScreen";
import ReportScreen from "./src/screens/ReportScreen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform, Alert } from "react-native";

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const [isSplashFinished, setIsSplashFinished] = useState(false);

    useEffect(() => {
        const setupNotifications = async () => {
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== "granted") {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus !== "granted") {
                    alert("Izin notifikasi ditolak");
                    return;
                }
            } else {
                alert("Notifikasi hanya bisa di perangkat fisik");
            }
        };

        setupNotifications();

        const subscription = Notifications.addNotificationReceivedListener((notification) => {
            Alert.alert(notification.request.content.title, notification.request.content.body);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    if (!isSplashFinished) {
        return <SplashScreen onFinish={() => setIsSplashFinished(true)} />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} options={{ animation: "none" }} />
                <Stack.Screen name="AddReport" component={AddReportScreen} options={{ animation: "slide_from_bottom" }} />
                <Stack.Screen name="Report" component={ReportScreen} options={{ animation: "none" }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
