document.addEventListener("DOMContentLoaded", async function () {

    const feed = document.getElementById("feed");

    if (!feed) {
        console.error("Video City: Feed not found.");
        return;
    }

    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (typeof supabaseClient === "undefined") {
        console.error("Video City: Supabase is not connected.");
        return;
    }


    // ==========================================
    // SAMPLE VIDEOS
    // ==========================================

    const sampleVideos = [

        {
            title: "Welcome to Video City",
            creator: "@VideoCity",
            description:
                "Welcome to Video City — a platform where creators can share videos, promote their products and connect with audiences through the Pi ecosystem.",
            price_pi: 0,
            media_url:
                "./7ba2eb8d7397b5b5eef95244c6559301.mp4",
            media_type: "video",
            likes: 0
        },

        {
            title: "Creator Spotlight",
            creator: "@VideoCity",
            description:
                "Discover creators, explore their content and support the people behind the videos you enjoy.",
            price_pi: 0,
            media_url:
                "./7ba2eb8d7397b5b5eef95244c6559301.mp4",
            media_type: "video",
            likes: 0
        },

        {
            title: "Sample Product Showcase",
            creator: "@VideoCity",
            description:
                "This is an example of how a creator can introduce a product or service directly below their video.",
            price_pi: 5,
            media_url:
                "./7ba2eb8d7397b5b5eef95244c6559301.mp4",
            media_type: "video",
            likes: 0
        }

    ];
    // ==========================================
    // USERNAME
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
    // ESCAPE TEXT
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text || "";

        return div.innerHTML;
    }// ==========================================
    // CREATE VIDEO CARD
    // ==========================================

    function createVideo(video) {

        const card =
            document.createElement("article");

        card.className =
            "video-card";


        let mediaHTML = "";


        if (
            video.media_type === "image"
        ) {

            mediaHTML = `

                <img
                    class="video"
                    src="${escapeHTML(video.media_url)}"
                    alt="${escapeHTML(video.title)}"
                    style="
                        width:100%;
                        height:100%;
                        object-fit:contain;
                    ">

            `;

        } else {

            mediaHTML = `

                <video
                    class="video"
                    controls
                    playsinline
                    preload="metadata">

                    <source
                        src="${escapeHTML(video.media_url)}"
                        type="video/mp4">

                    Your browser does not support
                    HTML5 video.

                </video>

            `;

        }


        card.innerHTML = `

            <div class="video-wrap">

                ${mediaHTML}

            </div>


            <div class="video-info">

                <h3 class="title">

                    ${escapeHTML(video.title)}

                </h3>


                <p class="creator">

                    ${escapeHTML(
                        video.creator ||
                        "@Creator"
                    )}

                </p>


                <p class="description">

                    ${escapeHTML(
                        video.description
                    )}

                </p>


                ${
                    Number(video.price_pi) > 0
                    ?
                    `
                    <p class="price">

                        💰 ${escapeHTML(
                            String(video.price_pi)
                        )} Pi

                    </p>
                    `
                    :
                    ""
                }


                <div class="actions">

                    <button
                        class="likeBtn"
                        type="button">

                        ♡
                        <span>
                            ${Number(video.likes) || 0}
                        </span>

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
            async function () {

                liked =
                    !liked;


                const span =
                    likeButton.querySelector(
                        "span"
                    );


                let currentLikes =
                    Number(
                        span.textContent
                    ) || 0;


                if (liked) {

                    currentLikes++;

                } else {

                    currentLikes =
                        Math.max(
                            0,
                            currentLikes - 1
                        );

                }


                likeButton.innerHTML =
                    liked
                    ?
                    `♥ <span>${currentLikes}</span>`
                    :
                    `♡ <span>${currentLikes}</span>`;


                // Save real posts only

                if (video.id) {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from("videos")
                            .update({
                                likes:
                                    currentLikes
                            })
                            .eq(
                                "id",
                                video.id
                            );


                    if (error) {

                        console.error(
                            "Like update failed:",
                            error
                        );

                    }

                }

            }
        );
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

                comments.style.display =
                    comments.style.display ===
                    "none"
                    ?
                    "block"
                    :
                    "none";

            }
        );


        // ======================================
        // COMMENT FORM
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

                    ${escapeHTML(
                        getUsername()
                    )}

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
                        ?
                        "block"
                        :
                        "none";

                }
            );


            // ==================================
            // REPLY
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


                    reply.className =
                        "reply";


                    reply.innerHTML = `

                        <strong>

                            ${escapeHTML(
                                getUsername()
                            )}

                        </strong>


                        <p>

                            ${escapeHTML(
                                replyText
                            )}

                        </p>

                    `;


                    replyList.appendChild(
                        reply
                    );


                    replyInput.value = "";

                }
            );

        }


        feed.appendChild(
            card
        );

                        }
    // ==========================================
    // LOAD REAL VIDEOS
    // ==========================================

    async function loadVideos() {

        feed.innerHTML = "";


        let realVideos = [];


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("videos")
                    .select(`
                        id,
                        creator_id,
                        title,
                        description,
                        category,
                        price_pi,
                        media_url,
                        media_type,
                        views,
                        likes,
                        created_at,
                        creators (
                            username
                        )
                    `)
                    .order(
                        "created_at",
                        {
                            ascending: false
                        }
                    );


            if (error) {

                console.error(
                    "Video City: Feed error:",
                    error
                );

            } else {

                realVideos =
                    data || [];

            }

        } catch (error) {

            console.error(
                "Video City: Supabase error:",
                error
            );

        }


        // ======================================
        // SHOW REAL VIDEOS FIRST
        // ======================================

        realVideos.forEach(
            function (video) {

                video.creator =
                    video.creators
                    ?
                    "@" +
                    video.creators.username
                    :
                    "@Creator";


                createVideo(
                    video
                );

            }
        );
        // ======================================
        // SHOW SAMPLE VIDEOS IF NECESSARY
        // ======================================

        if (
            realVideos.length === 0
        ) {

            sampleVideos.forEach(
                function (video) {

                    createVideo(
                        video
                    );

                }
            );

        }


        console.log(
            "Video City: Feed loaded."
        );

    }


    // ==========================================
    // UPLOAD FORM
    // ==========================================

    const uploadForm =
        document.getElementById(
            "uploadForm"
        );


    if (uploadForm) {

        uploadForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                // IMPORTANT:
                // Stop other scripts from handling
                // this form submission.

                event.stopPropagation();


                const status =
                    document.getElementById(
                        "uploadStatus"
                    );


                const submitButton =
                    uploadForm.querySelector(
                        'button[type="submit"]'
                    );


                const title =
                    uploadForm.elements[
                        "title"
                    ].value.trim();


                const description =
                    uploadForm.elements[
                        "description"
                    ].value.trim();


                const category =
                    uploadForm.elements[
                        "category"
                    ].value.trim();


                const price =
                    Number(
                        uploadForm.elements[
                            "price"
                        ].value || 0
                    );


                const file =
                    uploadForm.elements[
                        "video"
                    ].files[0];


                if (!file) {

                    status.textContent =
                        "❌ Please select a video or image.";

                    return;

                }


                try {

                    submitButton.disabled =
                        true;


                    submitButton.textContent =
                        "Uploading...";


                    status.textContent =
                        "Uploading your content...";
                    // ==================================
                    // FILE TYPE
                    // ==================================

                    const mediaType =
                        file.type.startsWith(
                            "image/"
                        )
                        ?
                        "image"
                        :
                        "video";


                    // ==================================
                    // FILE EXTENSION
                    // ==================================

                    const extension =
                        file.name
                            .split(".")
                            .pop()
                            .toLowerCase();


                    // ==================================
                    // SAFE FILE NAME
                    // ==================================

                    const safeTitle =
                        title
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            )
                            .replace(
                                /^-+|-+$/g,
                                "");


                    const fileName =
                        Date.now() +
                        "-" +
                        safeTitle +
                        "." +
                        extension;


                    const filePath =
    "uploads/" +
    fileName;


// ==================================
// UPLOAD FILE TO SUPABASE STORAGE
// ==================================

const {
    error: uploadError
} = await supabaseClient
    .storage
    .from("video-city-media")
    .upload(
        filePath,
        file,
        {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type
        }
    );


if (uploadError) {

    throw uploadError;

}


status.textContent =
    "File uploaded. Saving information...";


// ==================================
// GET PUBLIC URL
// ==================================

const {
    data: publicData
} =
    supabaseClient
        .storage
        .from("video-city-media")
        .getPublicUrl(
            filePath
        );


const mediaURL =
    publicData.publicUrl;


// ==================================
// GET CREATOR
// ==================================

const username =
    sessionStorage.getItem(
        "videoCityUsername"
    ) || "Creator";


const piUID =
    sessionStorage.getItem(
        "videoCityPiUID"
    ) || username;


let creator;


const {
    data: existingCreator,
    error: creatorLookupError
} =
    await supabaseClient
        .from("creators")
        .select("*")
        .eq("pi_uid", piUID)
        .maybeSingle();


if (creatorLookupError) {

    throw creatorLookupError;

}


if (existingCreator) {

    creator =
        existingCreator;

} else {

    const {
        data: newCreator,
        error: creatorInsertError
    } =
        await supabaseClient
            .from("creators")
            .insert({
                pi_uid: piUID,
                username: username
            })
            .select()
            .single();


    if (creatorInsertError) {

        throw creatorInsertError;

    }


    creator =
        newCreator;

                        }
                    // ==================================
// SAVE VIDEO RECORD
// ==================================

const {
    error: videoInsertError
} =
    await supabaseClient
        .from("videos")
        .insert({

            creator_id:
                creator.id,

            title:
                title,

            description:
                description,

            category:
                category,

            price_pi:
                price,

            media_url:
                mediaURL,

            media_type:
                mediaType,

            views:
                0,

            likes:
                0

        });


if (videoInsertError) {

    throw videoInsertError;

}


status.textContent =
    "✅ Published successfully!";


uploadForm.reset();


await loadVideos();


const uploadSection =
    document.getElementById(
        "upload"
    );


const homeFeed =
    document.getElementById(
        "feed"
    );


if (uploadSection) {

    uploadSection.classList.add(
        "hidden"
    );

}


if (homeFeed) {

    homeFeed.classList.remove(
        "hidden"
    );

}


document
    .querySelectorAll(".nav")
    .forEach(
        function (button) {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.view ===
                "home"
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );


} catch (error) {

    console.error(
        "Video City upload error:",
        error
    );


    status.textContent =
        "❌ Upload failed: " +
        (
            error.message ||
            "Unknown error"
        );

} finally {

    submitButton.disabled =
        false;


    submitButton.textContent =
        "Publish to Video City";

}

            }
        );

}
    // ==========================================
// START APPLICATION
// ==========================================

await loadVideos();


console.log(
    "Video City: Application ready."
);

});
