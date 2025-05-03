import { supabase } from "./supabase";

export async function getRoomById(roomId: number) {
    const { data, error } = await supabase
        .from('rooms')
        .select('id')
        .eq('id', roomId)
        .single();
    if (error) {
        console.error('Error getting room:', error);
        return null;
    }
    return data;
}

export async function getRoomByName(name: string) {
    const { data, error } = await supabase
        .from('rooms')
        .select('id')
        .eq('name', name)
        .single();

    if (error) {
        console.error('Error getting room:', error);
        return null;
    }
    return data;
}

export async function createRoom(name?: string) {
    if (name) {
        const room = await getRoomByName(name);
        if (room) {
            return null; // Room already exists
        }
    }
    const { data: room, error } = await supabase
        .from('rooms')
        .insert({ name })
        .select('id')
        .single();
    if (error) {
        console.error('Error creating room:', error);
        return null;
    }
    return room;
}