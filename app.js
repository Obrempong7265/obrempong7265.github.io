document.addEventListener("DOMContentLoaded", async function () {

    // ==========================================
    // sb_publishable_jnR4OJZTppqkeezebYc3PQ_KQyQxusH
    // ==========================================
    const SUPABASE_URL = 'https:// sb_publishable_jnR4OJZTppqkeezebYc3PQ_KQyQxusHsupabase.co' 
    const SUPABASE_ANON_KEY = 'sb_publishable_jnR4OJZTppqkeezebYc3PQ_KQyQxusH
    
    // 
    const supabaseClient = sb_publishable_jnR4OJZTppqkeezebYc3PQ_KQyQxusH
    
    const feed = document.getElementById("feed");
    console.log("Video City: app.js loaded v12");

    if (!feed) return;

    // ==========================================
    // SAMPLE VIDEOS - FALLBACK
    // ==========================================
    const sampleVideos = [
        {id: 'sample1', title: "Welcome to Video City", creator: "@VideoCity", description: "Welcome to Video City! Pi-powered videos and shopping.", price_pi: 0, media_url: "./7ba2eb8d7397b5b5eef95244c6559301.mp4", media_type: "video", likes: 0},
        {id: 'sample2', title: "Creator Spotlight", creator: "@VideoCity", description: "Discover creators and support them with Pi.", price_pi: 0, media_url: "./7ba2eb8d7397b5b5eef95244c6559301.mp4", media_type: "video", likes: 0},
        {id: 'sample3', title: "Sample Product Showcase", creator: "@VideoCity", description: "This is an example of a shoppable video.", price_pi: 5, media_url: "./7ba2eb8d7397b5b5eef95244c6559301.mp4", media_type: "video", likes: 0}
    ];

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    function getStoredUsername() {
        return localStorage.getItem("videocity_username");
    }

    function displayUsername() {
        const usernameEl = document.getElementById("usernameDisplay");
        const username = getStoredUsername();
        if (usernameEl) {
            usernameEl.textContent = username ? `@${username}` : "Guest";
        }
    }

    function escapeHTML(str) {
        return str
