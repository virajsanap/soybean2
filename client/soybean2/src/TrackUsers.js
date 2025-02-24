export const TrackUsers = async () => {
    try {
        const res = await fetch("https://api.ipify.org?format=json");  // This is to get the user's IP address
        const { ip } = await res.json();
        
        await fetch("http://3.16.192.151:8000/api/track_visit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ip })
        });
    } catch (error) {
        console.error("Error tracking visit:", error);
    }
};