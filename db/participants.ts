import { supabase } from "./supabase";

export async function createParticipant(roomId: number, alias: string, role: string) {
    const { data: participant, error } = await supabase
        .from('participants')
        .insert({ room_id: roomId, alias, role, vote: null })
        .select('id, alias, role, room_id, vote, created_at')
        .single();
    if (error) {
        console.error('Error creating participant:', error);
        return null;
    }
    return participant;
}

export async function updateParticipant(id: number, alias: string, role: string) {
    const { data: participant, error } = await supabase
        .from('participants')
        .update({ alias, role })
        .eq('id', id)
        .select('id, alias, role, room_id, vote, created_at')
        .single();
    console.log('Participant updated:', participant);
    if (error) {
        console.error('Error updating participant:', error);
        return null;
    }
    return participant;
}

export async function getParticipantsByRoomId(roomId: number) {
    const { data, error } = await supabase
        .from('participants')
        .select('id, alias, role, room_id, vote, created_at')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
    if (error) {
        console.error('Error getting participants:', error);
        return null;
    }
    return data;
}
