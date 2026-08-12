document.addEventListener("DOMContentLoaded", async function () {

    // ==========================================
    // VIDEO CITY APP
    // ==========================================

    const supabaseClient = window.supabaseClient;
    const feed = document.getElementById("feed");

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

    function getStoredUsername() {

        return (
            sessionStorage.getItem(
                "videoCityUsername"
            ) || ""
        );

    }


    function displayUsername(username) {

        if (!username) {
            return "@Guest";
        }

        return username.startsWith("@")
            ? username
            : "@" + username;

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text || "";

        return div.innerHTML;

    }


    // ==========================================
    // GET CREATOR
    // ==========================================

    async function getCurrentCreator() {

        const username =
            getStoredUsername();

        if (!username) {
            return null;
        }

        const cleanUsername =
            username.startsWith("@")
                ? username.substring(1)
                : username;

        const {
            data,
            error
        } =
            await supabaseClient
                .from("creators")
                .select("*")
                .eq(
                    "username",
                    cleanUsername
                )
                .maybeSingle();

        if (error) {

            console.error(
                "Creator lookup failed:",
                error
            );

            return null;

        }

        return data || null;

    }


    // ==========================================
    // CREATE VIDEO CARD
    // ==========================================

    function createVideo(video) {

        const card =
            document.createElement("article");

        card.className =
            "video-card";


        // ======================================
        // MEDIA
        // ======================================

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

                    Your browser does not support HTML5 video.

                </video>
            `;

        }


        // ======================================
        // CARD HTML
        // ======================================

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

                    <form
                        class="commentForm">

                        <textarea
                            name="comment"
                            placeholder="Write a comment..."
                            maxlength="500"
                            rows="2"
                            required></textarea>


                        <button
                            type="submit"
                            class="btn pink">

                            Post

                        </button>

                    </form>


                    <div class="commentList">
                    </div>

                </div>

            </div>

        `;


        // ======================================
        // LIKE
        // ======================================

        setupLikes(
            card,
            video
        );


        // ======================================
        // COMMENTS
        // ======================================

        setupComments(
            card,
            video
        );


        // ======================================
        // SUPPORT
        // ======================================

        const supportButton =
            card.querySelector(
                ".supportBtn"
            );

        if (supportButton) {

            supportButton.addEventListener(
                "click",
                function () {

                    alert(
                        "Pi Support payments will be added soon."
                    );

                }
            );

        }


        return card;

    }


    // ==========================================
    // LIKE SYSTEM
    // ==========================================

    function setupLikes(
        card,
        video
    ) {

        const likeButton =
            card.querySelector(
                ".likeBtn"
            );

        const span =
            likeButton.querySelector(
                "span"
            );

        let liked = false;


        function updateLikeButton() {

            const count =
                Number(
                    span.textContent
                ) || 0;

            likeButton.innerHTML =
                liked
                ?
                `♥ <span>${count}</span>`
                :
                `♡ <span>${count}</span>`;

        }


        async function loadLikeStatus() {

            if (!video.id) {
                return;
            }

            const creator =
                await getCurrentCreator();

            if (!creator) {
                return;
            }

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("video_likes")
                    .select("id")
                    .eq(
                        "video_id",
                        video.id
                    )
                    .eq(
                        "creator_id",
                        creator.id
                    )
                    .maybeSingle();

            if (error) {

                console.error(
                    "Like status error:",
                    error
                );

                return;

            }

            liked =
                !!data;

            updateLikeButton();

        }


        likeButton.addEventListener(
            "click",
            async function () {

                const username =
                    getStoredUsername();


                // Sample video
                if (!video.id) {

                    liked =
                        !liked;

                    const current =
                        Number(
                            span.textContent
                        ) || 0;

                    span.textContent =
                        liked
                        ?
                        current + 1
                        :
                        Math.max(
                            0,
                            current - 1
                        );

                    updateLikeButton();

                    return;

                }


                if (!username) {

                    alert(
                        "Please login to like videos."
                    );

                    return;

                }


                const creator =
                    await getCurrentCreator();

                if (!creator) {

                    alert(
                        "Your creator account could not be found."
                    );

                    return;

                }


                // ==================================
                // LIKE
                // ==================================

                if (!liked) {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from("video_likes")
                            .insert({

                                video_id:
                                    video.id,

                                creator_id:
                                    creator.id

                            });


                    if (error) {

                        console.error(
                            "Like failed:",
                            error
                        );

                        alert(
                            "Unable to like this video."
                        );

                        return;

                    }

                    liked = true;

                }


                // ==================================
                // UNLIKE
                // ==================================

                else {

                    const {
                        error
                    } =
                        await supabaseClient
                            .from("video_likes")
                            .delete()
                            .eq(
                                "video_id",
                                video.id
                            )
                            .eq(
                                "creator_id",
                                creator.id
                            );


                    if (error) {

                        console.error(
                            "Unlike failed:",
                            error
                        );

                        return;

                    }

                    liked = false;

                }


                // ==================================
                // UPDATE COUNT
                // ==================================

                const {
                    count,
                    error: countError
                } =
                    await supabaseClient
                        .from("video_likes")
                        .select(
                            "id",
                            {
                                count: "exact",
                                head: true
                            }
                        )
                        .eq(
                            "video_id",
                            video.id
                        );


                if (!countError) {

                    const totalLikes =
                        count || 0;

                    span.textContent =
                        totalLikes;


                    await supabaseClient
                        .from("videos")
                        .update({
                            likes:
                                totalLikes
                        })
                        .eq(
                            "id",
                            video.id
                        );

                }


                updateLikeButton();

            }
        );


        loadLikeStatus();

    }


    // ==========================================
    // COMMENT SYSTEM
    // ==========================================

    function setupComments(
        card,
        video
    ) {

        const commentButton =
            card.querySelector(
                ".commentBtn"
            );

        const comments =
            card.querySelector(
                ".comments"
            );

        const form =
            card.querySelector(
                ".commentForm"
            );

        const input =
            form.querySelector(
                "textarea"
            );

        const commentList =
            card.querySelector(
                ".commentList"
            );


        // ======================================
        // OPEN COMMENTS
        // ======================================

        commentButton.addEventListener(
            "click",
            async function () {

                comments.style.display =
                    comments.style.display === "none"
                    ?
                    "block"
                    :
                    "none";


                if (
                    comments.style.display ===
                    "block"
                ) {

                    await loadComments();

                }

            }
        );


        // ======================================
        // LOAD COMMENTS
        // ======================================

        async function loadComments() {

            if (!video.id) {
                return;
            }


            const {
                data,
                error
            } =
                await supabaseClient
                    .from("comments")
                    .select(`
                        id,
                        text,
                        created_at,
                        creators (
                            username
                        )
                    `)
                    .eq(
                        "video_id",
                        video.id
                    )
                    .order(
                        "created_at",
                        {
                            ascending: true
                        }
                    );


            if (error) {

                console.error(
                    "Comments load failed:",
                    error
                );

                return;

            }


            commentList.innerHTML = "";


            (data || []).forEach(
                function (comment) {

                    renderComment(
                        comment,
                        commentList
                    );

                }
            );

        }


        // ======================================
        // POST COMMENT
        // ======================================

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const text =
                    input.value.trim();


                if (!text) {
                    return;
                }


                if (!video.id) {

                    alert(
                        "Comments are available on uploaded videos."
                    );

                    return;

                }


                const username =
                    getStoredUsername();


                if (!username) {

                    alert(
                        "Please login to comment."
                    );

                    return;

                }


                const creator =
                    await getCurrentCreator();


                if (!creator) {

                    alert(
                        "Your creator account could not be found."
                    );

                    return;

                }


                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("comments")
                        .insert({

                            video_id:
                                video.id,

                            creator_id:
                                creator.id,

                            text:
                                text

                        })
                        .select(`
                            id,
                            text,
                            created_at,
                            creators (
                                username
                            )
                        `)
                        .single();


                if (error) {

                    console.error(
                        "Comment failed:",
                        error
                    );

                    alert(
                        "Comment failed. Please try again."
