// ==========================================
// VIDEO CITY - HOME FEED
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const feed = document.getElementById("feed");

if (!feed) {
    console.error("Video City: Feed not found.");
    return;
}


// ------------------------------------------
// SAMPLE VIDEO DATA
// ------------------------------------------

const videos = [

    {
        title: "Welcome to Video City",
        creator: "@VideoCity",
        description:
            "Welcome to Video City — a Pi-powered platform created to help creators share content and earn.",
        thumbnail:
            "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80"
    },

    {
        title: "Creator Spotlight",
        creator: "@VideoCity",
        description:
            "Discover creators, watch their content and support them through the Pi ecosystem.",
        thumbnail:
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80"
    },

    {
        title: "The Future of Creator Economy",
        creator: "@VideoCity",
        description:
            "Video City is designed to give creators new ways to build audiences and earn from their work.",
        thumbnail:
            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80"
    }

];


// ------------------------------------------
// CREATE HOME FEED
// ------------------------------------------

function loadVideos() {

    feed.innerHTML = "";


    videos.forEach(function (video) {

        const card =
            document.createElement("article");

        card.className =
            "video-card";


        card.innerHTML = `

            <div class="video-wrap">

                <img
                    src="${video.thumbnail}"
                    alt="${video.title}"
                    class="video"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:cover;
                    "
                >

            </div>


            <div class="video-info">

                <h3 class="title">
                    ${video.title}
                </h3>


                <p class="creator">
                    ${video.creator}
                </p>


                <p class="description">
                    ${video.description}
                </p>


                <div class="actions">

                    <button class="likeBtn">

                        ♡
                        <span>0</span>

                    </button>


                    <button class="commentBtn">

                        💬
                        <span>Comment</span>

                    </button>


                    <button class="supportBtn">

                        💜 Support

                    </button>

                </div>

            </div>

        `;


        feed.appendChild(card);

    });


    console.log(
        "Video City Home feed loaded:",
        videos.length,
        "videos"
    );

}


// ------------------------------------------
// START HOME
// ------------------------------------------

loadVideos();

});
