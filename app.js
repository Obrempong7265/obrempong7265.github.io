document.addEventListener("DOMContentLoaded", async function () {

    // ==========================================
    // VIDEO CITY - APP START
    // ==========================================

    const feed = document.getElementById("feed");
    const supabaseClient = window.supabaseClient;

    console.log("Video City: app.js loaded.");

    if (!feed) {
        console.error("Video City: Feed not found.");
        return;
    }

    if (!supabaseClient) {
        console.error("Video City: Supabase client not found.");

        feed.innerHTML = `
            <p class="muted">
                Unable to connect to Video City database.
            </p>
        `;

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

        return (
            sessionStorage.getItem(
                "videoCityUsername"
            ) || ""
        );

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text == null
                ? ""
                : String(text);

        return div.innerHTML;

    }


    // ==========================================
    // CREATE VIDEO CARD
    // ==========================================

    function createVideo(video) {

        const card =
            document.createElement("article");

        card.className =
            "video-card";


        let mediaHTML = "";


        if (video.media_type === "image") {

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

                    Your browser does not support HTML5 video.

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
                        video.creator || "@Creator"
                    )}
                </p>

                <p class="description">
                    ${escapeHTML(
                        video.description || ""
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

                    <form class="commentForm">

                        <input
                            type="text"
                            placeholder="Write a comment..."
                            maxlength="500"
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


        // Simple sample-video like
        const likeButton =
            card.querySelector(".likeBtn");

        if (!video.id) {

            likeButton.addEventListener(
                "click",
                function () {

                    const span =
                        likeButton.querySelector("span");

                    let count =
                        Number(span.textContent) || 0;

                    count++;

                    span.textContent = count;

                }
            );

        }


        // Comment open/close
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


        // Support
        const supportButton =
            card.querySelector(".supportBtn");

        supportButton.addEventListener(
            "click",
            function () {

                alert(
                    "Pi Support payments will be added soon."
                );

            }
        );


        return card;

    }
        // ==========================================
    // LOAD VIDEOS FROM SUPABASE
    // ==========================================

    async function loadVideos() {

        console.log(
            "Video City: Loading videos..."
        );


        feed.innerHTML = `
            <p class="muted">
                Loading Video City...
            </p>
        `;


        try {

            const {
                data,
                error
            } = await supabaseClient
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


            // ======================================
            // DATABASE ERROR
            // ======================================

            if (error) {

                console.error(
                    "Video City: Feed error:",
                    error
                );


                feed.innerHTML = `
                    <p class="muted">
                        Unable to load videos.
                    </p>
                `;

                return;

            }


            // ======================================
            // CLEAR LOADING MESSAGE
            // ======================================

            feed.innerHTML = "";


            // ======================================
            // REAL VIDEOS
            // ======================================

            if (data && data.length > 0) {

                console.log(
                    "Video City: Real videos found:",
                    data.length
                );


                data.forEach(
                    function (video) {

                        video.creator =
                            video.creators &&
                            video.creators.username
                            ?
                            "@" +
                            video.creators.username
                            :
                            "@Creator";


                        feed.appendChild(
                            createVideo(video)
                        );

                    }
                );


            } else {

                // ==================================
                // NO REAL VIDEOS
                // ==================================

                console.log(
                    "Video City: No real videos found."
                );


                console.log(
                    "Video City: Loading sample videos."
                );


                sampleVideos.forEach(
                    function (video) {

                        feed.appendChild(
                            createVideo(video)
                        );

                    }
                );

            }


        } catch (error) {

            console.error(
                "Video City: Video loading error:",
                error
            );


            // ======================================
            // FALLBACK TO SAMPLES
            // ======================================

            feed.innerHTML = "";


            sampleVideos.forEach(
                function (video) {

                    feed.appendChild(
                        createVideo(video)
                    );

                }
            );

        }

                }
        // ==========================================
    // UPLOAD SYSTEM
    // ==========================================

    const uploadForm =
        document.getElementById("uploadForm");


    if (uploadForm) {

        uploadForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();
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
                    // MEDIA TYPE
                    // ==================================

                    const mediaType =
                        file.type.startsWith(
                            "image/"
                        )
                        ? "image"
                        : "video";


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
                    // UPLOAD TO STORAGE
                    // ==================================

                    const {
                        error: uploadError
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

                                    upsert:
                                        false,

                                    contentType:
                                        file.type
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
                            .from(
                                "video-city-media"
                            )
                            .getPublicUrl(
                                filePath
                            );


                    const mediaURL =
                        publicData.publicUrl;


                    // ==================================
                    // GET LOGGED-IN USER
                    // ==================================

                    const username =
                        getUsername();


                    if (!username) {

                        throw new Error(
                            "Please login with Pi before uploading."
                        );

                    }


                    const cleanUsername =
                        username.startsWith("@")
                        ? username.substring(1)
                        : username;


                    const piUID =
                        sessionStorage.getItem(
                            "videoCityPiUID"
                        ) || cleanUsername;


                    // ==================================
                    // FIND CREATOR
                    // ==================================

                    let creator;


                    const {
                        data: existingCreator,
                        error: creatorLookupError
                    } =
                        await supabaseClient
                            .from("creators")
                            .select("*")
                            .eq(
                                "pi_uid",
                                piUID
                            )
                            .maybeSingle();


                    if (creatorLookupError) {
                        throw creatorLookupError;
                    }


                    // ==================================
                    // CREATE CREATOR IF NECESSARY
                    // ==================================

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

                                    pi_uid:
                                        piUID,

                                    username:
                                        cleanUsername

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


                    // ==================================
                    // SUCCESS
                    // ==================================

                    status.textContent =
                        "✅ Published successfully!";


                    uploadForm.reset();


                    // Reload videos
                    await loadVideos();


                    // ==================================
                    // RETURN TO HOME
                    // ==================================

                    const uploadSection =
                        document.getElementById(
                            "upload"
                        );


                    if (uploadSection) {

                        uploadSection.classList.add(
                            "hidden"
                        );

                    }


                    if (feed) {

                        feed.classList.remove(
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
