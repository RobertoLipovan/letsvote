import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://drfjhoblltatuzqqckik.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZmpob2JsbHRhdHV6cXFja2lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3Njc0ODIsImV4cCI6MjA2MTM0MzQ4Mn0.xTqkdOSZ7o4frUdcxR4zYp20L9j5eh8ML1zJIZ3_O7o'

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})

