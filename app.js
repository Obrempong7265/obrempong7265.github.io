document.addEventListener("DOMContentLoaded", function () {

const feed = document.getElementById("feed");

if (!feed) {
    console.error("Feed not found");
    return;
}


const videoURL =
    "./7ba2eb8d7397b5b5eef95244c6559301.mp4";


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
            "Discover creators and support them through Pi."
    },

    {
        title: "The Future of Creator Economy",
        creator: "@VideoCity",
        description:
            "A new way for creators to connect with audiences."
    }

];


function getUsername() {

    const username =
        sessionStorage.getItem(
            "videoCityUsername"
        );

    return username
        ? "@" + username
        : "@Guest";
}


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

                <button
                    class="likeBtn"
                    type="button">

                    ♡ <span>0</span>

                </button>


                <button
                    class="commentBtn"
                    type="button">

                    💬 Comment

                </button>


                <button
                    class="supportBtn"
                    type="button">

                    💜 Support

                </button>

            </div>


            <div
                class="comments"
                style="display:none; margin-top:15px;">

                <form class="commentForm">

                    <input
                        type="text"
                        placeholder="Write a comment..."
                        maxlength="500"
                        required
                        style="
                            width:70%;
                            padding:10px;
                        ">

                    <button
                        type="submit"
                        class="btn pink">

                        Post

                    </button>

                </form>


                <div
                    class="commentList"
                    style="margin-top:15px;">

                </div>

            </div>

        </div>
    `;


    // ======================================
    // LIKE
    // ======================================

    const likeButton =
        card.querySelector(".likeBtn");

    let liked = false;

    likeButton.addEventListener(
        "click",
        function () {

            liked = !liked;

            likeButton.innerHTML =
                liked
                    ? "♥ <span>1</span>"
                    : "♡ <span>0</span>";

        }
    );


    // ======================================
    // COMMENT OPEN/CLOSE
    // ======================================

    const commentButton =
        card.querySelector(
            ".commentBtn"
        );

    const comments =
        card.querySelector(
            ".comments"
        );


    commentButton.addEventListener(
        "click",
        function () {

            if (
                comments.style.display ===
                "none"
            ) {

                comments.style.display =
                    "block";

            } else {

                comments.style.display =
                    "none";

            }

        }
    );


    // ======================================
    // POST COMMENT
    // ======================================

    const form =
        card.querySelector(
            ".commentForm"
        );

    const input =
        form.querySelector(
            "input"
        );

    const commentList =
        card.querySelector(
            ".commentList"
        );


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const text =
                input.value.trim();


            if (!text) {
                return;
            }


            const comment =
                document.createElement(
                    "div"
                );


            comment.className =
                "comment";


            comment.innerHTML = `

                <strong>
                    ${getUsername()}
                </strong>

                <p>
                    ${text}
                </p>

                <button
                    class="replyBtn"
                    type="button">

                    ↩ Reply

                </button>

                <div
                    class="replyBox"
                    style="
                        display:none;
                        margin-top:10px;
                        margin-left:20px;
                    ">

                    <input
                        type="text"
                        placeholder="Write a reply..."
                        maxlength="500"
                        style="
                            width:65%;
                            padding:8px;
                        ">

                    <button
                        class="replySubmit btn pink"
                        type="button">

                        Reply

                    </button>

                    <div
                        class="replyList"
                        style="margin-top:8px;">
                    </div>

                </div>

            `;


            commentList.appendChild(
                comment
            );


            input.value = "";


            // ==================================
            // REPLY BUTTON
            // ==================================

            const replyButton =
                comment.querySelector(
                    ".replyBtn"
                );

            const replyBox =
                comment.querySelector(
                    ".replyBox"
                );


            replyButton.addEventListener(
                "click",
                function () {

                    replyBox.style.display =
                        replyBox.style.display ===
                        "none"
                            ? "block"
                            : "none";

                }
            );


            // ==================================
            // POST REPLY
            // ==================================

            const replyInput =
                replyBox.querySelector(
                    "input"
                );

            const replySubmit =
                replyBox.querySelector(
                    ".replySubmit"
                );

            const replyList =
                replyBox.querySelector(
                    ".replyList"
                );


            replySubmit.addEventListener(
                "click",
                function () {

                    const replyText =
                        replyInput.value.trim();


                    if (!replyText) {
                        return;
                    }


                    const reply =
                        document.createElement(
                            "div"
                        );


                    reply.style.marginBottom =
                        "8px";


                    reply.innerHTML = `

                        <strong>
                            ${getUsername()}
                        </strong>

                        <p>
                            ${replyText}
                        </p>

                    `;


                    replyList.appendChild(
                        reply
                    );


                    replyInput.value = "";

                }
            );

        }
    );


    feed.appendChild(card);

}


// ==========================================
// LOAD VIDEOS
// ==========================================

feed.innerHTML = "";


videos.forEach(
    function (video) {

        createVideo(video);

    }
);


console.log(
    "Video City: Home + Like + Comment + Reply ready."
);

});
