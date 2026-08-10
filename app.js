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
    // GET PI USERNAME
    // ==========================================

    function getUsername() {

        const username =
            sessionStorage.getItem("videoCityUsername");

        if (username) {
            return "@" + username;
        }

        return "@Guest";
    }


    // ==========================================
    // ESCAPE USER TEXT
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text || "";

        return div.innerHTML;
    }


    // ==========================================
    // CREATE VIDEO CARD
    // ==========================================

    function createVideo(video) {

        const card =
            document.createElement("article");

        card.className = "video-card";


        const mediaType =
            video.media_type || "video";


        let mediaHTML = "";


        // ======================================
        // VIDEO
        // ======================================

        if (mediaType === "video") {

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


        // ======================================
        // IMAGE
        // ======================================

        else {

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

                    ${escapeHTML(video.creator || "@Creator")}

                </p>


                <p class="description">

                    ${escapeHTML(video.description)}

                </p>


                ${
                    Number(video.price_pi) > 0
                    ?
                    `
                    <p class="price">

                        💰 ${escapeHTML(
                            video.price_pi
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

                        ♡ <span>${video.likes || 0}</span>

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


                    <div class="commentList"></div>

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
            async function () {

                liked = !liked;


                const currentLikes =
                    Number(
                        likeButton
                            .querySelector("span")
                            .textContent
                    );


                const newLikes =
                    liked
                    ? currentLikes + 1
                    : Math.max(
                        0,
                        currentLikes - 1
                    );


                likeButton.innerHTML =
                    liked
                    ? `♥ <span>${newLikes}</span>`
                    : `♡ <span>${newLikes}</span>`;


                // Save like count to Supabase

                if (video.id) {

                    await supabaseClient
                        .from("videos")
                        .update({
                            likes: newLikes
                        })
                        .eq("id", video.id);

                }

            }
        );


        // ======================================
        // COMMENT BUTTON
        // ======================================

        const commentButton =
            card.querySelector(".commentBtn");


        const comments =
            card.querySelector(".comments");


        commentButton.addEventListener(
            "click",
            function () {

                comments.style.display =
                    comments.style.display === "none"
                    ? "block"
                    : "none";

            }
        );


        // ======================================
        // COMMENT FORM
        // ======================================

        const form =
            card.querySelector(".commentForm");


        const input =
            form.querySelector("input");


        const commentList =
            card.querySelector(".commentList");


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
                document.createElement("div");


            comment.className =
                "comment";


            comment.innerHTML = `

                <strong>

                    ${escapeHTML(getUsername())}

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


                    <div class="replyList"></div>

                </div>

            `;


            list.appendChild(comment);


            // ==================================
            // REPLY BUTTON
            // ==================================

            const replyButton =
                comment.querySelector(".replyBtn");


            const replyBox =
                comment.querySelector(".replyBox");


            replyButton.addEventListener(
                "click",
                function () {

                    replyBox.style.display =
                        replyBox.style.display === "none"
                        ? "block"
                        : "none";

                }
            );


            // ==================================
            // POST REPLY
            // ==================================

            const replyInput =
                replyBox.querySelector("input");


            const replySubmit =
                replyBox.querySelector(".replySubmit");


            const replyList =
                replyBox.querySelector(".replyList");


            replySubmit.addEventListener(
                "click",
                function () {

                    const replyText =
                        replyInput.value.trim();


                    if (!replyText) {
                        return;
                    }


                    const reply =
                        document.createElement("div");


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


                    replyList.appendChild(reply);


                    replyInput.value = "";

                }
            );

        }


        feed.appendChild(card);

    }


    // ==========================================
    // LOAD VIDEOS FROM SUPABASE
    // ==========================================

    async function loadVideos() {

        feed.innerHTML = "";


        try {

            const {
                data,
                error
            } = await supabaseClient

                .from("videos")

                .select(`
                    id,
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
                    "Video City: Could not load videos.",
                    error
                );

                return;

            }


            if (!data || data.length === 0) {

                showEmptyFeed();

                return;

            }


            data.forEach(
                function (video) {

                    video.creator =
                        video.creators
                        ? "@" +
                          video.creators.username
                        : "@Creator";


                    createVideo(video);

                }
            );


            console.log(
                "Video City: Videos loaded from Supabase."
            );


        } catch (error) {

            console.error(
                "Video City feed error:",
                error
            );

        }

    }


    // ==========================================
    // EMPTY FEED
    // ==========================================

    function showEmptyFeed() {

        feed.innerHTML = `

            <div
                class="upload-box"
                style="text-align:center;">

                <h2>
                    🎬 Welcome to Video City
                </h2>

                <p class="muted">

                    No videos have been published yet.

                </p>

                <p class="muted">

                    Be the first creator to
                    publish content.

                </p>

            </div>

        `;

    }


    // ==========================================
    // UPLOAD FORM
    // ==========================================

    const uploadForm =
        document.getElementById("uploadForm");


    if (uploadForm) {

        uploadForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const status =
                    document.getElementById(
                        "uploadStatus"
                    );


                const submitButton =
                    uploadForm.querySelector(
                        'button[type="submit"]'
                    );


                const title =
                    uploadForm.elements["title"]
                    .value
                    .trim();


                const description =
                    uploadForm.elements["description"]
                    .value
                    .trim();


                const category =
                    uploadForm.elements["category"]
                    ? uploadForm.elements["category"]
                        .value
                        .trim()
                    : "";


                const price =
                    uploadForm.elements["price"]
                    ? Number(
                        uploadForm.elements["price"]
                            .value || 0
                    )
                    : 0;


                const file =
                    uploadForm.elements["video"]
                    .files[0];


                if (!file) {

                    status.textContent =
                        "Please select a video or image.";

                    return;

                }


                try {

                    submitButton.disabled = true;

                    submitButton.textContent =
                        "Publishing...";


                    status.textContent =
                        "Uploading your content...";


                    // ==================================
                    // FILE TYPE
                    // ==================================

                    const mediaType =
                        file.type.startsWith("image/")
                        ? "image"
                        : "video";


                    // ==================================
                    // FILE NAME
                    // ==================================

                    const extension =
                        file.name
                            .split(".")
                            .pop()
                            .toLowerCase();


                    const safeName =
                        title
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            )
                            .replace(
                                /^-+|-+$/g,
                                ""
                            );


                    const uniqueName =
                        `${Date.now()}-${safeName}.${extension}`;


                    const filePath =
                        `uploads/${uniqueName}`;


                    // ==================================
                    // UPLOAD FILE
                    // ==================================

                    const {
                        error:
                        uploadError
                    } =
                        await supabaseClient
                            .storage
                            .from(
                                "video-city-media"
                            )
                            .upload(
                                filePath,
                                file,
                                {
                                    cacheControl:
                                        "3600",
                                    upsert: false,
                                    contentType:
                                        file.type
                                }
                            );


                    if (uploadError) {

                        throw uploadError;

                    }


                    status.textContent =
                        "File uploaded. Saving post...";


                    // ==================================
                    // GET PUBLIC URL
                    // ==================================

                    const {
                        data:
                        publicURLData
                    } =
                        supabaseClient
                            .storage
                            .from(
                                "video-city-media"
                            )
                            .getPublicUrl(
                                filePath
                            );


                    const mediaURL =
                        publicURLData.publicUrl;


                    // ==================================
                    // CREATOR
                    // ==================================

                    const username =
                        sessionStorage.getItem(
                            "videoCityUsername"
                        ) || "Creator";


                    const piUID =
                        sessionStorage.getItem(
                            "videoCityPiUID"
                        ) || username;


                    // ==================================
                    // FIND / CREATE CREATOR
                    // ==================================

                    let creator;


                    const {
                        data:
                        existingCreator
                    } =
                        await supabaseClient
                            .from("creators")
                            .select("*")
                            .eq(
                                "pi_uid",
                                piUID
                            )
                            .maybeSingle();


                    if (existingCreator) {

                        creator =
                            existingCreator;

                    } else {

                        const {
                            data:
                            newCreator,
                            error:
                            creatorError
                        } =
                            await
