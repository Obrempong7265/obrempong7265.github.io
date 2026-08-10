// ==========================================
// VIDEO CITY - SUPABASE CONNECTION
// ==========================================

const SUPABASE_URL =
    "https://fkcyhqaxsfsnukbeebwu.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_jnR4OJZTppqkeezebYc3PQ_KQyQxusH


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

console.log("Video City Supabase connected.");
