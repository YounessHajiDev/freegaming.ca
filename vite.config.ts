import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Fallback values so Vercel builds succeed without env vars configured
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(
      process.env.VITE_SUPABASE_URL ?? 'https://abcpnoldfloyfcrlmcns.supabase.co'
    ),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(
      process.env.VITE_SUPABASE_ANON_KEY ??
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY3Bub2xkZmxveWZjcmxtY25zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNDE3NzksImV4cCI6MjA5ODkxNzc3OX0.nf6oIE_bt8AuVVIFGOjNHzbw6Lblr_K9evQBcVKD5cU'
    ),
  },
})
