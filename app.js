// ==========================================
// VIDEO CITY - HOME
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const feed =
    document.getElementById("feed");


if (!feed) {

    console.error(
        "Video City: Feed not found."
    );

    return;

}


// ------------------------------------------
// VIDEO DATA
// ------------------------------------------

const videos = [

    {
        title:
            "Welcome to Video City",

        creator:
            "@VideoCity",

        description:
            "Welcome to Video City — a Pi-powered platform for creators and viewers.",

        thumbnail:
            "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80"

    },


    {
        title:
            "Creator Spotlight",

        creator:
            "@VideoCity",

        description:
            "Discover creators, watch their content and support them through the Pi ecosystem.",

        thumbnail:
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80"

    },


    {
        title:
            "The Future of Creator Economy",

        creator:
            "@VideoCity",

        description:
            "A new way for creators to connect with audiences and earn from their content.",

        thumbnail:
            "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=900&q=80"

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

            <img
                src="${video.thumbnail}"
                alt="${video.title}"
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
                    ♡ <span>0</span>
                </button>


                <button class="commentBtn">
                    💬 Comment
                </button>


                <button class="supportBtn">
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


    if (likeButton) {

        likeButton.addEventListener(
            "click",
            function () {

                const count =
                    likeButton.querySelector("span");

                let likes =
                    Number(count.textContent);


                likes++;

                count.textContent =
                    likes;

            }
        );

    }


    feed.appendChild(card);

}


// ------------------------------------------
// LOAD VIDEOS
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
