import { View, Text } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from "react";
import { createRoom, getParticipantsByRoomId, createParticipant } from "../firebase/db";
import { showMessage } from 'react-native-flash-message';

interface Participant {
    id: string;
    alias: string;
    role: string;
    room_id: number;
    vote: string | null;
    created_at: string;
}

export default function Room() {

    const { room } = useLocalSearchParams();
    const roomParam = Array.isArray(room) ? room[0] : room;
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [myId, setMyId] = useState("")
    const [alias, setAlias] = useState("")
    const [role, setRole] = useState("")
    const [modalVisible, setModalVisible] = useState(true);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [showingVotes, setShowingVotes] = useState(false);
    const votingNumbers = [1, 2, 3, 4, 5, 8, 13, 20, 40];

    // Setup de la sala
    useEffect(() => {
        async function setupRoom() {

            // CREADOR DE SALA AUTOMÁTICO //////////////////////////////////////////////////////

            const roomData = await createRoom(roomParam); // Si la sala no existe, la crea

            // if (!roomData) {
            //     await createRoom(roomParam);
            //     // Establecer showing_votes a false por defecto
            //     await supabase
            //         .from('rooms')
            //         .update({ showing_votes: false })
            //         .eq('id', Number(roomParam));
            //     const participant = await createParticipant(Number(roomParam), '', 'owner');
            //     if (participant) { setMyId(participant.id); setRole('owner') }
            // }

            // GESTIÓN DE PARTICIPANTES ////////////////////////////////////////////////////////

            // 1. Obtenemos los participantes
            const participantsData = await getParticipantsByRoomId(roomParam);

            // 2. Almacenamos los participantes para poder ir renderizándolos
            setParticipants(participantsData || []);

            // 3. Si no hay participantes, creamos uno, pero hay que ver si es dueño o invitado
            if (participantsData?.length === 0) {

                // Dueño
                const participant = await createParticipant(roomParam, '', 'owner');
                if (participant) { setMyId(participant.id); setRole('owner') }

                // Lo agregamos al array de participantes
                if (participant) {
                    setParticipants(prev => [...prev, participant]);
                }

                showMessage({
                    message: 'Bienvenido, propietario',
                    type: 'success',
                });

            } else {

                // Invitado
                const participant = await createParticipant(roomParam, '', 'guest');
                if (participant) { setMyId(participant.id); setRole('guest') }

                // Lo agregamos al array de participantes
                if (participant) {
                    setParticipants(prev => [...prev, participant]);
                }

                showMessage({
                    message: 'Bienvenido, invitado',
                    type: 'info',
                });

            }

        }
        if (myId === "") {
            setupRoom();
        }
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{room}</Text>
        </View>
    );
}