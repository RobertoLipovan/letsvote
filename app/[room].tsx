import { View, Text, StyleSheet, TouchableOpacity, TextInput, Pressable, Modal, Platform } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from "react";
import { getParticipantsByRoomId, createParticipant, updateParticipant, resetVotes, subscribeToParticipants, subscribeToRoom, updateRoom } from "../firebase/db";
import { showMessage } from 'react-native-flash-message';
import { Hoverable } from 'react-native-web-hover';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from "expo-blur";
import { Colors } from "../constants";
import Clipboard from "expo-clipboard";

interface Participant {
    id: string;
    alias: string;
    role: string;
    room_id: number;
    vote: number | null;
    created_at: string;
}

interface Room {
    id: string;
    showVotes: boolean;
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
    const [roomData, setRoomData] = useState<Room | null>(null);
    const votingNumbers = [1, 2, 3, 4, 5, 8, 13, 20, 40];

    const copyToClipboard = async () => {
        try {
            await Clipboard.setStringAsync('https://letsvote.expo.app/' + roomParam);
            showMessage({
                message: 'Enlace copiado al portapapeles',
                type: 'success',
            });
        } catch (error) {
            console.error('Error al copiar al portapapeles:', error);
            showMessage({
                message: 'Función no disponible, estamos trabajando en ello',
                type: 'warning',
            });
        }
    };

    // Setup de la sala
    useEffect(() => {
        async function setupRoom() {

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

            } else {

                // Invitado
                const participant = await createParticipant(roomParam, '', 'guest');
                if (participant) { setMyId(participant.id); setRole('guest') }

                // Lo agregamos al array de participantes
                if (participant) {
                    setParticipants(prev => [...prev, participant]);
                }

            }

            // Suscripción a cambios en la sala
            const unsubscribeRoom = await subscribeToRoom(roomParam, (room) => {
                setRoomData(room);
                setShowingVotes(room.showVotes);
            });

            // Suscripción a cambios en los participantes
            const unsubscribeParticipants = await subscribeToParticipants(roomParam, (participants) => {
                setParticipants(participants);
                // Buscar el participante actual y verificar si su voto es null
                const currentParticipant = participants.find(p => p.id === myId);
                if (currentParticipant?.vote === null) {
                    setSelectedOption(null);
                    setHasVoted(false);
                }
            });

            // Limpiar las suscripciones cuando el componente se desmonte
            return () => {
                unsubscribeRoom();
                unsubscribeParticipants();
            };
        }

        if (myId === "") {
            setupRoom();
        }
    }, [roomParam, myId]);

    // Petición del alias
    const handleAliasAssign = async () => {

        const updatedParticipant = await updateParticipant(roomParam, myId, alias, role, null);
        if (updatedParticipant) {

            setParticipants(prev =>
                prev.map(p => (p.id === updatedParticipant.id ? updatedParticipant : p))
            );
            setModalVisible(false);

        }
    }

    // handleReset: debe ir a cada uno de los participantes de la sala y poner su voto en null
    const handleReset = async () => {
        await resetVotes(roomParam);
        setHasVoted(false);
        setSelectedOption(null);
        handleShowVotes();
    }

    const handleVote = async (num: number) => {

        // Si ya ha votado y no ha seleccionado una opción nueva, no permitir desmarcar
        if (hasVoted && selectedOption === num) {
            return;
        }

        // Actualizar el estado de si ha votado
        if (num) {
            setHasVoted(true);
        }

        setSelectedOption(num);

        // Actualización optimista: actualizamos el estado local inmediatamente
        if (myId) {

            setParticipants(prev => (
                prev.map(p =>
                    p.id === myId ? { ...p, vote: num } : p)
            )
            );

            await updateParticipant(roomParam, myId, alias, role, num);

        }

    }

    const handleShowVotes = async () => {
        await updateRoom(roomParam, !showingVotes);
        setShowingVotes(!showingVotes);
    }

    useEffect(() => {
        // Buscar el participante actual y verificar si su voto es null
        const currentParticipant = participants.find(p => p.id === myId);
        if (currentParticipant?.vote === null) {
            setSelectedOption(null);
            setHasVoted(false);
        }
    }, [participants, myId]);


    return (
        <>
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.roomData}>
                        <Text style={styles.roomLabel}>ID de la sala</Text>
                        <View style={styles.idContainer}>
                            <Text style={styles.id}>{room}</Text>
                            {/* <TouchableOpacity
                                style={styles.shareButton}
                                onPress={() => { copyToClipboard(); }}>
                                <Ionicons name="share-social" size={50} color="grey" />
                            </TouchableOpacity> */}
                        </View>
                    </View>
                    <View style={styles.votingBoard}>
                        <View style={styles.headerBoard}>
                            <Text style={styles.headerBoardText}>Nombre</Text>
                            <Text style={styles.headerBoardText}>Voto</Text>
                        </View>
                        <View style={styles.voteList}>
                            {participants.map(participant => (
                                <Hoverable key={participant.id}>
                                    {({ hovered }) => (
                                        <View style={[styles.vote, hovered && styles.voteHovered]}>
                                            <View style={styles.identification}>
                                                {/* <Text style={[styles.voteText, styles.aliasText]}>{participant.id}</Text> */}
                                                <Text style={[styles.voteText, styles.aliasText]}>{participant.alias}</Text>
                                                <Text
                                                    style={[
                                                        styles.roleText,
                                                        participant.role === 'owner' && styles.ownerRole,
                                                        participant.role === 'guest' && styles.guestRole,
                                                    ]}
                                                >
                                                    {participant.role === 'owner' ? 'ADMIN' : 'INVITADO'}
                                                </Text>
                                                {participant.id === myId && (
                                                    <Text
                                                        style={[
                                                            styles.roleText,
                                                            styles.meRole
                                                        ]}
                                                    >
                                                        YO
                                                    </Text>
                                                )}
                                            </View>
                                            {showingVotes || participant.id === myId
                                                ? (participant.vote !== null && participant.vote !== undefined ?
                                                    <Text style={styles.voteText}>{participant.vote}</Text> :
                                                    <Text style={styles.voteText}>—</Text>)
                                                : <Ionicons name="eye-off" size={24} color="#fff" />}
                                        </View>
                                    )}
                                </Hoverable>
                            ))}
                        </View>

                        {role === 'owner' && (

                            <View style={styles.actionsBoard}>
                                <Hoverable style={styles.hoverable}>
                                    {({ hovered }) => (
                                        <Pressable style={[styles.action, hovered && styles.actionHovered]}
                                            onPress={handleReset}
                                        >
                                            <Ionicons name="reload-circle" size={26} color="white" />
                                        </Pressable>
                                    )}
                                </Hoverable>
                                <Hoverable style={styles.hoverable}>
                                    {({ hovered }) => (
                                        <Pressable
                                            style={[styles.action, hovered && styles.actionHovered]}
                                            onPress={handleShowVotes}
                                        >
                                            <Ionicons name={showingVotes ? "eye" : "eye-off"} size={26} color="white" />
                                        </Pressable>
                                    )}
                                </Hoverable>
                            </View>

                        )}
                    </View>
                    <View style={styles.votingOptions}>
                        {votingNumbers.map(num => (
                            <Hoverable key={num}>
                                {({ hovered }) => (
                                    <TouchableOpacity
                                        key={num}
                                        style={[
                                            styles.votingOption,
                                            selectedOption === num && styles.votingOptionSelected,
                                            hovered && (selectedOption === num ? styles.votingOptionSelectedHovered : styles.votingOptionHovered)
                                        ]}
                                        onPress={() => handleVote(num)}
                                        activeOpacity={0.7}
                                    >
                                        <Text
                                            key={num}
                                            style={[
                                                styles.votingOptionText,
                                                selectedOption === num && styles.votingOptionTextSelected,
                                            ]}
                                        >
                                            {num}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </Hoverable>
                        ))}
                    </View>
                </View>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                style={{ zIndex: 10 }}
            >

                <BlurView experimentalBlurMethod="dimezisBlurView" intensity={Platform.OS === 'android' ? 0 : 20} tint="dark" style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>¿Cómo te llamas?</Text>
                        <TextInput
                            style={styles.aliasInput}
                            placeholder="Alias"
                            placeholderTextColor={'grey'}
                            value={alias}
                            onChangeText={setAlias}
                        />
                        <Pressable
                            style={styles.button}
                            onPress={handleAliasAssign}>
                            <Text style={styles.textStyle}>¡Votemos!</Text>
                        </Pressable>
                    </View>
                </BlurView>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    shareButton: {
        padding: 10,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        gap: 25,
    },
    roomData: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    roomLabel: {
        color: 'grey',
        fontSize: 24,
        fontWeight: '900',
    },
    idContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    id: {
        color: '#FFFFFF',
        fontSize: 64,
        fontWeight: '900',
    },
    votingBoard: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    headerBoard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#393939',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    actionsBoard: {
        flexDirection: 'row',
        backgroundColor: '#393939',
    },
    headerBoardText: {
        color: '#B6B6B6',
        fontSize: 16,
        fontWeight: '900',
    },
    voteList: {
        backgroundColor: '#464646',
        paddingVertical: 5,
    },
    vote: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    voteHovered: {
        backgroundColor: '#565656',
    },
    voteText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
    },
    aliasText: {
        // backgroundColor: '#393939',
        borderRadius: 7,
        // paddingHorizontal: 8,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: '#3b3b3b',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        gap: 10,
    },
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        backgroundColor: '#212121'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
    aliasInput: {
        height: 40,
        width: 200,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#2f2f2f',
        fontWeight: 'bold',
        color: Colors.input.normal.content,
    },
    votingOptions: {
        width: '100%',
        borderRadius: 20,
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        padding: 10,
    },
    votingOption: {
        backgroundColor: '#212121',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    votingOptionSelected: {
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
    },
    votingOptionText: {
        color: '#464646',
        fontSize: 24,
        fontWeight: 'bold',
    },
    votingOptionTextSelected: {
        color: 'white',
    },
    votingOptionHovered: {
        backgroundColor: '#2B2B2B',
        borderColor: '#464646',
    },
    votingOptionSelectedHovered: {
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
    },
    hoverable: {
        flex: 1,
    },
    action: {
        backgroundColor: '#212121',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    actionHovered: {
        backgroundColor: '#4caf50',
        borderColor: '#388e3c',
    },
    roleText: {
        marginTop: 5,
        borderRadius: 5,
        paddingHorizontal: 5,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        backgroundColor: 'grey',
        color: 'white',
        fontSize: 12,
        fontWeight: '900',
        // opacity: 0.7,
    },
    ownerRole: {
        backgroundColor: '#F9B600',
        color: '#A77A00',
    },
    guestRole: {
        backgroundColor: '#0070F9',
        color: '#004AA4',
    },
    meRole: {
        backgroundColor: '#4caf50',
        color: '#306C32',
    },
    identification: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
});
