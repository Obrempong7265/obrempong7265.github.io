// ==========================================
// VIDEO CITY - HOME TEST
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const feed = document.getElementById("feed");

if (!feed) {
    console.error("Video City: Home feed not found.");
    return;
}

feed.innerHTML = `
    <div style="
        padding: 40px 20px;
        text-align: center;
    ">

        <h1 style="
            font-size: 32px;
            margin-bottom: 15px;
        ">
            🎬 Video City
        </h1>

        <h2 style="
            color: #ff0055;
            margin-bottom: 15px;
        ">
            Welcome to Video City
        </h2>

        <p style="
            color: #ccc;
            line-height: 1.6;
            max-width: 500px;
            margin: auto;
        ">
            Discover videos, support creators with Pi,
            and enjoy a new creator economy built on
            the Pi ecosystem.
        </p>

        <button
            id="homeTestButton"
            style="
                margin-top: 25px;
                background: #ff0055;
                color: white;
                border: none;
                padding: 13px 24px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
            "
        >
            Explore Videos
        </button>

    </div>
`;

console.log(
    "Video City Home loaded successfully."
);

});
