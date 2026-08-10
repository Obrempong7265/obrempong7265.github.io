// ==========================================
// VIDEO CITY - HOME FEED
// VIDEO + LIKE + COMMENTS + REPLIES
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
// GET CURRENT USERNAME
// ------------------------------------------

function getUsername() {

    const username =
        sessionStorage.getItem(
            "videoCityUsername"
        );


    if (username) {

        return "@" + username;

    }


    return "@Guest";

}


// ------------------------------------------
// CREATE VIDEO CARD
// ------------------------------------------

function createVideo(video, videoIndex) {

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
                    <span>0</span>

                </button>


                <!-- COMMENT -->

                <button
                    class="commentBtn"
                    type="button">

                    💬
                    <span>Comment</span>

                </button>


                <!-- SUPPORT -->

                <button
                    class="supportBtn"
                    type="button">

                    💜 Support

                </button>


            </div>


            <!-- COMMENTS -->

            <div
                class="comments hidden">


                <form
                    class="commentForm">


                    <input
                        type="text"
                        name="text"
                        maxlength="500"
                        placeholder="Write a comment..."
                        autocomplete="off"
                        required>


                    <button
                        class="btn pink"
                        type="submit">

                        Post

                    </button>


                </form>


                <div
                    class="commentList">

                </div>


            </div>

        </div>

    `;


    // --------------------------------------
    // LIKE
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
    // COMMENT BUTTON
    // --------------------------------------

    const commentButton =
        card.querySelector(
            ".commentBtn"
        );


    const commentsBox =
        card.querySelector(
            ".comments"
        );


    const commentForm =
        card.querySelector(
            ".commentForm"
        );


    const commentList =
        card.querySelector(
            ".commentList"
        );


    commentButton.addEventListener(
        "click",
        function () {

            commentsBox.classList.toggle(
                "hidden"
            );


            if (
                !commentsBox.classList.contains(
                    "hidden"
                )
            ) {

                const input =
                    commentForm.querySelector(
                        "input"
                    );

                input.focus();

            }

        }
    );


    // --------------------------------------
    // POST COMMENT
    // --------------------------------------

    commentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const input =
                commentForm.querySelector(
                    "input"
                );


            const text =
                input.value.trim();


            if (!text) {
                return;
            }


            addComment(
                text,
                commentList
            );


            input.value = "";

        }
    );


    // --------------------------------------
    // LOAD CARD
    // --------------------------------------

    feed.appendChild(card);

}


// ------------------------------------------
// ADD COMMENT
// ------------------------------------------

function addComment(
    text,
    commentList
) {

    const comment =
        document.createElement(
            "div"
        );


    comment.className =
        "comment";


    const username =
        getUsername();


    comment.innerHTML = `

        <div>

            <strong>
                ${username}
            </strong>

        </div>


        <p class="commentText">
            ${escapeHTML(text)}
        </p>


        <button
            class="replyBtn"
            type="button">

            ↩ Reply

        </button>


        <div
            class="replyArea hidden">

            <form
                class="replyForm">


                <input
                    type="text"
                    maxlength="500"
                    placeholder="Write a reply..."
                    autocomplete="off"
                    required>


                <button
                    class="btn pink"
                    type="submit">

                    Reply

                </button>


            </form>


            <div
                class="replyList">

            </div>

        </div>

    `;


    commentList.appendChild(
        comment
    );


    // --------------------------------------
    // REPLY BUTTON
    // --------------------------------------

    const replyButton =
        comment.querySelector(
            ".replyBtn"
        );


    const replyArea =
        comment.querySelector(
            ".replyArea"
        );


    replyButton.addEventListener(
        "click",
        function () {

            replyArea.classList.toggle(
                "hidden"
            );


            if (
                !replyArea.classList.contains(
                    "hidden"
                )
            ) {

                const replyInput =
                    replyArea.querySelector(
                        "input"
                    );

                replyInput.focus();

            }

        }
    );


    // --------------------------------------
    // POST REPLY
    // --------------------------------------

    const replyForm =
        comment.querySelector(
            ".replyForm"
        );


    const replyList =
        comment.querySelector(
            ".replyList"
        );


    replyForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const input =
                replyForm.querySelector(
                    "input"
                );


            const text =
                input.value.trim();


            if (!text) {
                return;
            }


            const reply =
                document.createElement(
                    "div"
                );


            reply.className =
                "comment";


            reply.style.marginLeft =
                "20px";


            reply.innerHTML = `

                <strong>
                    ${getUsername()}
                </strong>

                <p>
                    ${escapeHTML(text)}
                </p>

            `;


            replyList.appendChild(
                reply
            );


            input.value = "";

        }
    );

}


// ------------------------------------------
// SAFELY DISPLAY TEXT
// ------------------------------------------

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


// ------------------------------------------
// EXPLORE VIDEOS
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


// ------------------------------------------
// LOAD VIDEOS
// ------------------------------------------

feed.innerHTML = "";


videos.forEach(
    function (video, index) {

        createVideo(
            video,
            index
        );

    }
);


console.log(
    "Video City Home loaded: Video + Like + Comments + Replies"
);

});
