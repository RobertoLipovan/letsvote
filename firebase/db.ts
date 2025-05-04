import { app } from "./init";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";

export const db = getFirestore(app);


interface Room {
    id: string;
    showVotes: boolean;
}

interface Participant {
    id: string;
    alias: string;
    role: string;
    vote: any;
    created_at: string;
    room_id: number;
}

// Lista de palabras cortas y fáciles de pronunciar
const WORDS = [
    'hogsmeade', 'diagon', 'azkaban', 'hogwarts',
    'rivendell', 'mordor', 'shire', 'minas',
    'coruscant', 'tatooine', 'naboo', 'endor',
    'xandar', 'knowhere', 'vormir', 'zenwhoberi',
    'farfaraway', 'duloc', 'swamp', 'onion',
    'pride', 'pumbas', 'timon', 'hyenas',
    'monsters', 'scare', 'scream', 'boo',
    'toy', 'infinity', 'space', 'cowboy',
    'crystal', 'haddon', 'haddonfield', 'haddonfield',
    'hogsmeade', 'rivendell', 'coruscant', 'xandar',
    'farfaraway', 'pride', 'monsters', 'toy',
    'crystal', 'hogsmeade', 'rivendell', 'coruscant',
    'farfaraway', 'pride', 'monsters', 'toy',
    'crystal', 'hogsmeade', 'rivendell', 'coruscant',
    'farfaraway', 'pride', 'monsters', 'toy',
    'crystal',
];

export async function createRoom(id?: string) {
    // Si no se proporciona ID, generamos uno aleatorio
    if (!id) {
        const randomIndex = Math.floor(Math.random() * WORDS.length);
        id = WORDS[randomIndex];
    }

    const roomRef = doc(db, "rooms", id);
    const roomDoc = await getDoc(roomRef);
    
    if (roomDoc.exists()) {
        throw new Error(`The room with ID ${id} already exists`);
    }

    await setDoc(roomRef, {
        showVotes: false,
    });
    return roomRef;
}

export async function createRoomWithAutoId() {
    // Primero creamos una referencia a la colección
    const roomsCollection = collection(db, "rooms");
    
    // Luego usamos addDoc que genera automáticamente un ID único
    const docRef = await addDoc(roomsCollection, {
        showVotes: false,
    });
    
    // Devolvemos la referencia completa del documento creado
    return docRef;
}

export async function updateRoom(roomId: string, showVotes: boolean) {
    const roomRef = doc(db, "rooms", roomId);
    await setDoc(roomRef, {
        showVotes,
    });
}

export async function getRoomById(id: string) {
    const roomRef = doc(db, "rooms", id);
    const roomDoc = await getDoc(roomRef);
    if (roomDoc.exists()) {
        return roomDoc.data() as Room;
    }
    return null;
}

export async function getParticipantsByRoomId(roomId: string) {
    const participantsRef = collection(db, "rooms", roomId, "participants");
    const snapshot = await getDocs(participantsRef);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        alias: doc.data().alias,
        role: doc.data().role,
        room_id: Number(roomId),
        vote: doc.data().vote,
        created_at: doc.data().created_at
    }));
}



export async function createParticipant(roomId: string, alias: string, role: string): Promise<Participant> {
    const participantRef = doc(db, "rooms", roomId, "participants", Math.random().toString(36).substr(2, 9));
    await setDoc(participantRef, {
        alias,
        role,
        vote: null,
        created_at: new Date().toISOString(),
    });
    
    // Obtenemos el documento recién creado
    const docSnapshot = await getDoc(participantRef);
    if (!docSnapshot.exists()) {
        throw new Error("No se pudo crear el participante");
    }
    
    // Devolvemos un objeto que cumple con la interfaz Participant
    return {
        id: docSnapshot.id,
        alias,
        role,
        vote: null,
        created_at: new Date().toISOString(),
        room_id: Number(roomId)
    };
}

export async function updateParticipant(roomId: string, id: string, alias: string, role: string, vote: number | null = null): Promise<any> {
    const participantRef = doc(db, "rooms", roomId, "participants", id);
    await setDoc(participantRef, {
        alias,
        role,
        vote,
        created_at: new Date().toISOString(),
    });
    
    // Obtenemos el documento recién creado
    const docSnapshot = await getDoc(participantRef);
    if (!docSnapshot.exists()) {
        throw new Error("No se pudo actualizar el participante");
    }
    
    return {
        id: docSnapshot.id,
        ...docSnapshot.data()
    };
}

export async function resetVotes(roomId: string) {
    // debe ir a cada uno de los participantes de la sala y poner su voto en null

    const participants = await getParticipantsByRoomId(roomId);
    for (const participant of participants) {
        await updateParticipant(roomId, participant.id, participant.alias, participant.role, null);
    }

}

export async function subscribeToRoom(roomId: string, onRoomUpdate: (room: Room) => void) {
    const roomRef = doc(db, "rooms", roomId);
    return onSnapshot(roomRef, (snapshot) => {
        const room = snapshot.data() as Room;
        if (room) {
            onRoomUpdate(room);
        }
    });
}

export async function subscribeToParticipants(roomId: string, onParticipantsUpdate: (participants: Participant[]) => void) {
    const participantsRef = collection(db, "rooms", roomId, "participants");
    return onSnapshot(participantsRef, (snapshot) => {
        const participants = snapshot.docs.map(doc => ({
            id: doc.id,
            alias: doc.data().alias,
            role: doc.data().role,
            vote: doc.data().vote,
            created_at: doc.data().created_at,
            room_id: Number(roomId)
        }));
        onParticipantsUpdate(participants);
    });
}
