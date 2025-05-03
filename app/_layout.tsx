import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Colors } from "../constants";
import FlashMessage from 'react-native-flash-message';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import VersionInfo from "../components/VersionInfo";

export default function Layout() {

    const MyTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: Colors.app.background,
        },
    };

    return (
        <>
            <StatusBar style="light" />

            <ThemeProvider value={MyTheme}>
                <Stack>
                    <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
                </Stack>
            </ThemeProvider>

            <FlashMessage
                position="top"
                style={Platform.OS === 'android' || Platform.OS === 'ios' ? {
                    paddingTop: Constants.statusBarHeight
                } : undefined}
            />

            <VersionInfo version="1.2.0" />

        </>


    );
}
