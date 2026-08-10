// ==========================================
// VIDEO CITY - HOME / VIDEO FEED
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const feed =
    document.getElementById("feed");

const videoTemplate =
    document.getElementById("videoTemplate");


// ------------------------------------------
// SAMPLE VIDEOS
// ------------------------------------------
// These are temporary videos for testing
// the Home screen.
//
// Later we will replace these with videos
// uploaded by real creators.
// ------------------------------------------

const videos = [

    {
        title: "Welcome to Video City",
        creator: "@VideoCity",
        description:
            "Welcome to Video City — a Pi-powered video platform where creators can share content and earn Pi.",
        price: 0
    },

    {
        title: "Creator Spotlight",
        creator: "@VideoCity",
        description:
            "Creators will be able to upload videos and build their audience on Video City.",
        price: 0
    },

    {
        title: "Support Creators with Pi",
        creator: "@VideoCity",
        description:
            "Viewers will eventually be able to support creators and unlock premium videos using Pi.",
        price: 0
    }

];


// ------------------------------------------
// CREATE VIDEO CARD
// ------------------------------------------

function createVideoCard(video) {

    if (!feed || !videoTemplate) {
        return;
    }


    const clone =
        videoTemplate.content.cloneNode(true);


    const title =
        clone.querySelector(".title");

    const creator =
        clone.querySelector(".creator");

    const description =
        clone.querySelector(".description");

    const videoElement =
        clone.querySelector(".video");

    const lockOverlay =
        clone.querySelector(".lock-overlay");

    const priceElement =
        clone.querySelector(".price");


    // Video information

    if (title) {
        title.textContent =
            video.title;
    }


    if (creator) {
        creator.textContent =
            video.creator;
    }


    if (description) {
        description.textContent =
            video.description;
    }


    // ------------------------------------------
    // FREE VIDEO
    // ------------------------------------------

    if (video.price === 0) {

        if (lockOverlay) {
            lockOverlay.classList.add("hidden");
        }

    }


    // ------------------------------------------
    // PREMIUM VIDEO
    // ------------------------------------------

    if (video.price > 0) {

        if (lockOverlay) {

            lockOverlay.classList.remove(
                "hidden"
            );

        }


        if (priceElement) {

            priceElement.textContent =
                video.price + " Pi";

        }

    }


    // ------------------------------------------
    // VIDEO PLACEHOLDER
    // ------------------------------------------

    if (videoElement) {

        videoElement.removeAttribute(
            "src"
        );

    }


    feed.appendChild(clone);

}


// ------------------------------------------
// LOAD HOME FEED
// ------------------------------------------

function loadHomeFeed() {

    if (!feed) {
        return;
    }


    feed.innerHTML = "";


    videos.forEach(function (video) {

        createVideoCard(video);

    });

}


// ------------------------------------------
// INITIALIZE HOME
// ------------------------------------------

loadHomeFeed();


console.log(
    "Video City Home loaded successfully."
);

});
