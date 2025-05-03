import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
// import { supabase } from "../db/supabase"; -- su
// import { createRoom } from "../db/rooms";
import { createRoom } from "../firebase/db";
import { useState } from "react";
import { Colors } from "../constants";
import { Hoverable } from 'react-native-web-hover';
import Input from "../components/Input";
import { showMessage } from 'react-native-flash-message';

export default function Index() {

    const [room, setRoom] = useState('');

    const handleCreateRoom = async () => {
        
        const room = await createRoom("room");

        showMessage({
            message: 'Sala creada correctamente',
            type: 'success',
        });

        router.navigate(`/${room.id}`);
    };

    const handleJoinRoom = async (id: number) => {

        console.log("entrando en la sala...")

        showMessage({
            message: 'Funcionalidad no disponible',
            type: 'warning',
        });

        // router.navigate(`/room`)
        
    };



    return (
        <>

            <View style={styles.container}>
                <View style={styles.content}>

                    <Text style={{ fontSize: 24, fontWeight: '900', color: Colors.app.white }}>Unirme a una sala</Text>

                    <View style={styles.joinContainer}>
                        <Input placeholder="ID de la sala" value={room} setValue={setRoom} />
                        <Hoverable style={{ flex: 1 }}>
                            {({ hovered }) => (
                                <Pressable style={[styles.joinButton, hovered && styles.joinButtonHovered]} onPress={() => { handleJoinRoom(parseInt(room)) }}>
                                    <Ionicons name="arrow-forward" size={24} color={hovered ? Colors.button.hovered.content : Colors.button.normal.content} />
                                </Pressable>
                            )}
                        </Hoverable>
                    </View>

                    <View style={{ height: 1, backgroundColor: Colors.app.white, opacity: 0.2 }}></View>

                    <Hoverable style={{ flex: 0 }}>
                        {({ hovered }) => (
                            <Pressable style={[styles.createButton, hovered && styles.createButtonHovered]} onPress={() => { handleCreateRoom() }}>
                                <Text style={[styles.buttonText, hovered && styles.buttonTextHovered]}>Crear una sala</Text>
                            </Pressable>
                        )}
                    </Hoverable>

                </View>
            </View>

        </>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        gap: 10,
    },
    joinContainer: {
        height: 60,
        flexDirection: 'row',
        gap: 10,
    },
    joinButton: {
        flex: 1,
        padding: 10,
        borderRadius: 15,
        backgroundColor: Colors.button.normal.background,
        color: Colors.button.normal.content,
        fontSize: 24,
        fontWeight: '600',
        alignItems: 'center',
        justifyContent: 'center',
    },
    joinButtonHovered: {
        backgroundColor: Colors.button.hovered.background,
    },
    createButton: {
        width: '60%',
        height: 60,
        backgroundColor: Colors.button.normal.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    createButtonHovered: {
        backgroundColor: Colors.button.hovered.background,
    },
    buttonText: {
        color: Colors.button.normal.content,
        fontSize: 24,
        fontWeight: '900',
    },
    buttonTextHovered: {
        color: Colors.button.hovered.content,
    },
});