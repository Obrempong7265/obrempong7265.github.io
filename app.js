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
// YOUR UPLOADED VIDEO
// ------------------------------------------

const videoURL =
    "./7ba2eb8d7397b5b5eef95244c6559301.mp4";


// ------------------------------------------
// VIDEO DATA
// ------------------------------------------

const videos = [

    {
        title: "Welcome to Video City",

        creator: "@VideoCity",

        description:
            "Welcome to Video City — a Pi-powered platform for creators and viewers."
    },

    {
        title: "Creator Spotlight",

        creator: "@VideoCity",

        description:
            "Discover creators, watch their content and support them through the Pi ecosystem."
    },

    {
        title: "The Future of Creator Economy",

        creator: "@VideoCity",

        description:
            "A new way for creators to connect with audiences and earn from their content."
    }

];


// ------------------------------------------
// CREATE VIDEO CARD
// ------------------------------------------

function createVideo(video) {

    const card =
        document.createElement("article");

    card.className =
        "video-card";


    card.innerHTML = `

        <div class="video-wrap">

            <video
                class="video"
                controls
                playsinline
                preload="metadata">

                <source
                    src="${videoURL}"
                    type="video/mp4">

                Your browser does not support
                HTML5 video.

            </video>

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


                <!-- LIKE -->

                <button
                    class="likeBtn"
                    type="button">

                    ♡

                    <span>
                        0
                    </span>

                </button>


                <!-- COMMENT -->

                <button
                    class="commentBtn"
                    type="button">

                    💬

                    <span>
                        Comment
                    </span>

                </button>


                <!-- SUPPORT -->

                <button
                    class="supportBtn"
                    type="button">

                    💜 Support

                </button>


            </div>

        </div>

    `;


    // --------------------------------------
    // LIKE BUTTON
    // --------------------------------------

    const likeButton =
        card.querySelector(".likeBtn");


    const likeCount =
        likeButton.querySelector("span");


    let liked = false;


    likeButton.addEventListener(
        "click",
        function () {

            if (!liked) {

                liked = true;

                likeCount.textContent = "1";

                likeButton.firstChild.textContent =
                    "♥ ";

            } else {

                liked = false;

                likeCount.textContent = "0";

                likeButton.firstChild.textContent =
                    "♡ ";

            }

        }
    );


    // --------------------------------------
    // ADD VIDEO CARD
    // --------------------------------------

    feed.appendChild(card);

}


// ------------------------------------------
// LOAD HOME
// ------------------------------------------

feed.innerHTML = "";


videos.forEach(function (video) {

    createVideo(video);

});


// ------------------------------------------
// EXPLORE VIDEOS BUTTON
// ------------------------------------------

const exploreButton =
    document.getElementById(
        "homeTestButton"
    );


if (exploreButton) {

    exploreButton.addEventListener(
        "click",
        function () {

            const firstVideo =
                feed.querySelector(
                    ".video-card"
                );


            if (firstVideo) {

                firstVideo.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


console.log(
    "Video City Home loaded successfully."
);

});
