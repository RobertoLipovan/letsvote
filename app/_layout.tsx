import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, DefaultTheme } from '@react-navigation/native';
import { Colors } from "../constants";
import FlashMessage from 'react-native-flash-message';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import VersionInfo from "../components/VersionInfo";
import React from "react";

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
                    <Stack.Screen name="test" options={{ title: "Test", headerShown: false }} />
                    <Stack.Screen name="[room]" options={{ title: "Room", headerShown: false }} />
                </Stack>
            </ThemeProvider>

            <FlashMessage
                position="top"
                style={[
                    Platform.OS === 'android' || Platform.OS === 'ios' ? { paddingTop: Constants.statusBarHeight } : { paddingTop: undefined },
                    { zIndex: 9999 }
                ]}
            />

            <VersionInfo version="v1.0.0"/>
        </>


    );
}
