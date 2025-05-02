import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
// import { router } from "expo-router";
// import { supabase } from "../supabase";
import { useState } from "react";
import { Colors } from "../constants";
import { Hoverable } from 'react-native-web-hover';
import Input from "../components/Input";
import CommitInfo from "../components/CommitInfo";

export default function Index() {

    const [room, setRoom] = useState('');

    const handleCreateRoom = async () => {

        console.log("creando la sala...")

        // // Create a new room
        // const { data: room, error } = await supabase
        //     .from('rooms')
        //     .insert({})
        //     .select('id')
        //     .single();
        // if (error) {
        //     console.error('Error creating room:', error);
        //     return;
        // }

        // console.log('Room created with ID:', room.id);
        // console.log("entrando en la sala...")

        // router.navigate(`/${room.id}`)

    };

    const handleJoinRoom = async (id: number) => {

        console.log("entrando en la sala...")

        // const { data, error } = await supabase
        //     .from('rooms')
        //     .select('id')
        //     .eq('id', id)
        //     .single();

        // if (error) {
        //     console.error('Error joining room:', error);
        //     return;
        // }

        // console.log('Joined room with ID:', data.id);
        // router.navigate(`/${data.id}`)
    };



    return (
        <>

            <View style={styles.container}>
                <View style={styles.content}>

                    <View style={styles.joinContainer}>
                        <Input room={room} setRoom={setRoom} />
                        <Hoverable style={{ flex: 1 }}>
                            {({ hovered }) => (
                                <Pressable style={[styles.joinButton, hovered && styles.joinButtonHovered]} onPress={() => { handleJoinRoom(parseInt(room)) }}>
                                    <Ionicons name="arrow-forward" size={24} color={hovered ? Colors.button.hovered.content : Colors.button.normal.content} />
                                </Pressable>
                            )}
                        </Hoverable>
                    </View>

                    <Hoverable style={{ flex: 0 }}>
                        {({ hovered }) => (
                            <Pressable style={[styles.createButton, hovered && styles.createButtonHovered]} onPress={() => { handleCreateRoom() }}>
                                <Text style={[styles.buttonText, hovered && styles.buttonTextHovered]}>Crear una sala</Text>
                            </Pressable>
                        )}
                    </Hoverable>

                </View>
            </View>

            <CommitInfo />
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
        gap: 30,
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