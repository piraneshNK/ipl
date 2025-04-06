
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nqvzspmfnsdhhtdwpgqb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdnpzcG1mbnNkaGh0ZHdwZ3FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjkwMjUsImV4cCI6MjA1OTM0NTAyNX0.HYf29SkfxlH5DqF4yK4-lLLngknW35_RfIRNCs-J9M0'

export const supabase = createClient(supabaseUrl, supabaseKey)
