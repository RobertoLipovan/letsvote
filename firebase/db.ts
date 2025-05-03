import { app } from "./init";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

export const db = getFirestore(app);

export async function createRoom(id: string) {
    const roomRef = doc(db, "rooms", id);
    await setDoc(roomRef, {
        showVotes: false,
    });
    return roomRef;
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

export async function createParticipant(roomId: string, alias: string, role: string): Promise<any> {
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
    
    return {
        id: docSnapshot.id,
        ...docSnapshot.data()
    };
}
