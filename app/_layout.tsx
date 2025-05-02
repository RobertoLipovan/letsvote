import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Colors } from "../constants";

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
        </>
    );
}
