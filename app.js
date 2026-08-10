document.addEventListener("DOMContentLoaded", function () {

const feed = document.getElementById("feed");

if (!feed) {
    console.error("Video City: Feed not found.");
    return;
}


// ==========================================
// VIDEO FILE
// ==========================================

const videoURL =
    "./7ba2eb8d7397b5b5eef95244c6559301.mp4";


// ==========================================
// SAMPLE VIDEO POSTS
// ==========================================

const videos = [

    {
        title: "Welcome to Video City",

        creator: "@VideoCity",

        description:
            "Welcome to Video City — a platform where creators can share videos, promote their products and connect with audiences through the Pi ecosystem.",

        price: ""
    },


    {
        title: "Creator Spotlight",

        creator: "@VideoCity",

        description:
            "Discover creators, explore their content and support the people behind the videos you enjoy.",

        price: ""
    },


    {
        title: "Sample Product Showcase",

        creator: "@VideoCity",

        description:
            "This is an example of how a creator can introduce a product or service directly below their video.",

        price: "5 Pi"
    }

];


// ==========================================
// GET PI USERNAME
// ==========================================

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


// ==========================================
// CREATE POST
// ==========================================

function createVideo(video) {

    const card =
        document.createElement("article");


    card.className =
        "video-card";


    card.innerHTML = `

        <!-- VIDEO -->

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


        <!-- POST INFORMATION -->

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


            ${
                video.price
                ?
                `
                <p class="price">

                    💰 ${video.price}

                </p>
                `
                :
                ""
            }


            <!-- ACTIONS -->

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


            <!-- COMMENTS -->

            <div
                class="comments"
                style="display:none;">


                <form
                    class="commentForm">


                    <input
                        type="text"
                        placeholder="Write a comment..."
                        maxlength="500"
                        autocomplete="off"
                        required>


                    <button
                        type="submit"
                        class="btn pink">

                        Post

                    </button>


                </form>


                <div
                    class="commentList">
                </div>


            </div>


        </div>

    `;


    // ======================================
    // LIKE
    // ======================================

    const likeButton =
        card.querySelector(
            ".likeBtn"
        );


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
    // COMMENT BUTTON
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


            addComment(
                text,
                commentList
            );


            input.value = "";

        }
    );


    // ======================================
    // ADD COMMENT
    // ======================================

    function addComment(
        text,
        list
    ) {

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

                ${escapeHTML(text)}

            </p>


            <button
                class="replyBtn"
                type="button">

                ↩ Reply

            </button>


            <div
                class="replyBox"
                style="display:none;">


                <input
                    type="text"
                    maxlength="500"
                    placeholder="Write a reply..."
                    autocomplete="off">


                <button
                    class="replySubmit btn pink"
                    type="button">

                    Reply

                </button>


                <div
                    class="replyList">
                </div>


            </div>

        `;


        list.appendChild(
            comment
        );


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


                reply.innerHTML = `

                    <strong>

                        ${getUsername()}

                    </strong>


                    <p>

                        ${escapeHTML(replyText)}

                    </p>

                `;


                replyList.appendChild(
                    reply
                );


                replyInput.value = "";

            }
        );

    }


    // ======================================
    // ESCAPE USER TEXT
    // ======================================

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text;


        return div.innerHTML;

    }


    // ======================================
    // ADD POST TO FEED
    // ======================================

    feed.appendChild(
        card
    );

}


// ==========================================
// LOAD FEED
// ==========================================

feed.innerHTML = "";


videos.forEach(
    function (video) {

        createVideo(video);

    }
);


console.log(
    "Video City: Posts loaded successfully."
);

});
