document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // ==========================================
        // VIDEO CITY - MAIN APPLICATION
        // ==========================================

        const feed =
            document.getElementById("feed");

        const supabaseClient =
            window.supabaseClient;


        console.log(
            "Video City: app.js loaded."
        );


        // ==========================================
        // BASIC CHECKS
        // ==========================================

        if (!feed) {

            console.error(
                "Video City: Feed not found."
            );

            return;
        }


        if (!supabaseClient) {

            console.error(
                "Video City: Supabase client not found."
            );

            feed.innerHTML = `
                <div class="panel">
                    <h3>Video City</h3>

                    <p class="muted">
                        Unable to connect to the database.
                    </p>
                </div>
            `;

            return;
        }


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
        // DISPLAY USERNAME
        // ==========================================

        function displayUsername(
            username
        ) {

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
                text == null
                    ? ""
                    : String(text);

            return div.innerHTML;

        }


        // ==========================================
        // GET CURRENT CREATOR
        // ==========================================

        async function getCurrentCreator() {

            const username =
                getUsername();

            if (!username) {
                return null;
            }


            const cleanUsername =
                username.startsWith("@")
                    ? username.substring(1)
                    : username;


            const piUID =
                sessionStorage.getItem(
                    "videoCityPiUID"
                );


            // --------------------------------------
            // FIND BY PI UID
            // --------------------------------------

            if (piUID) {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from("creators")
                        .select("*")
                        .eq(
                            "pi_uid",
                            piUID
                        )
                        .maybeSingle();


                if (error) {

                    console.error(
                        "Creator UID lookup error:",
                        error
                    );

                }


                if (data) {
                    return data;
                }

            }


            // --------------------------------------
            // FIND BY USERNAME
            // --------------------------------------

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
                    "Creator username lookup error:",
                    error
                );

                return null;

            }


            return data || null;

        }


        // ==========================================
        // GET OR CREATE CREATOR
        // ==========================================

        async function getOrCreateCreator() {

            const username =
                getUsername();

            if (!username) {
                return null;
            }


            const cleanUsername =
                username.startsWith("@")
                    ? username.substring(1)
                    : username;


            const piUID =
                sessionStorage.getItem(
                    "videoCityPiUID"
                ) || cleanUsername;


            // --------------------------------------
            // CHECK EXISTING CREATOR
            // --------------------------------------

            const {
                data: existingCreator,
                error: lookupError
            } =
                await supabaseClient
                    .from("creators")
                    .select("*")
                    .eq(
                        "pi_uid",
                        piUID
                    )
                    .maybeSingle();


            if (lookupError) {

                console.error(
                    "Creator lookup error:",
                    lookupError
                );

                return null;

            }


            if (existingCreator) {

                return existingCreator;

            }


            // --------------------------------------
            // CREATE CREATOR
            // --------------------------------------

            const {
                data: newCreator,
                error: insertError
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


            if (insertError) {

                console.error(
                    "Creator creation error:",
                    insertError
                );

                return null;

            }


            return newCreator;

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

                        Your browser does not support
                        HTML5 video.

                    </video>
                `;

            }


            // ======================================
            // CARD CONTENT
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
                            💰
                            ${escapeHTML(
                                String(video.price_pi)
                            )}
                            Pi
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
            // FEATURES
            // ======================================

            setupLike(
                card,
                video
            );


            setupComments(
                card,
                video
            );


            setupSupport(
                card,
                video
            );


            return card;

        }
                // ==========================================
        // LIKE SYSTEM
        // ==========================================

        function setupLike(card, video) {

            const likeButton =
                card.querySelector(".likeBtn");

            const span =
                likeButton.querySelector("span");

            let liked = false;


            likeButton.addEventListener(
                "click",
                async function () {

                    const username =
                        getUsername();

                    if (!username) {

                        alert(
                            "Please login with Pi to like videos."
                        );

                        return;
                    }


                    const creator =
                        await getCurrentCreator();

                    if (!creator) {

                        alert(
                            "Your Video City account could not be found."
                        );

                        return;
                    }


                    try {

                        if (!video.id) {

                            liked = !liked;

                            let count =
                                Number(
                                    span.textContent
                                ) || 0;

                            count =
                                liked
                                    ? count + 1
                                    : Math.max(
                                        0,
                                        count - 1
                                    );

                            likeButton.innerHTML =
                                liked
                                    ? `♥ <span>${count}</span>`
                                    : `♡ <span>${count}</span>`;

                            return;
                        }


                        if (!liked) {

                            const {
                                error
                            } =
                                await supabaseClient
                                    .from(
                                        "video_likes"
                                    )
                                    .insert({

                                        video_id:
                                            video.id,

                                        creator_id:
                                            creator.id

                                    });


                            if (error) {
                                throw error;
                            }


                            liked = true;

                        } else {

                            const {
                                error
                            } =
                                await supabaseClient
                                    .from(
                                        "video_likes"
                                    )
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
                                throw error;
                            }


                            liked = false;

                        }


                        const {
                            count,
                            error: countError
                        } =
                            await supabaseClient
                                .from(
                                    "video_likes"
                                )
                                .select(
                                    "id",
                                    {
                                        count:
                                            "exact",
                                        head:
                                            true
                                    }
                                )
                                .eq(
                                    "video_id",
                                    video.id
                                );


                        if (countError) {
                            throw countError;
                        }


                        const totalLikes =
                            count || 0;


                        likeButton.innerHTML =
                            liked
                                ? `♥ <span>${totalLikes}</span>`
                                : `♡ <span>${totalLikes}</span>`;


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


                    } catch (error) {

                        console.error(
                            "Video City: Like error:",
                            error
                        );

                        alert(
                            "Unable to update like. Please try again."
                        );

                    }

                }
            );

                                }
                // ==========================================
        // COMMENT SYSTEM
        // ==========================================

        function setupComments(card, video) {

            const commentButton =
                card.querySelector(".commentBtn");

            const comments =
                card.querySelector(".comments");

            const form =
                card.querySelector(".commentForm");

            const input =
                form.querySelector("input");

            const commentList =
                card.querySelector(".commentList");


            // ======================================
            // OPEN / CLOSE COMMENTS
            // ======================================

            commentButton.addEventListener(
                "click",
                async function () {

                    comments.style.display =
                        comments.style.display === "none"
                            ? "block"
                            : "none";


                    if (
                        comments.style.display === "block" &&
                        video.id
                    ) {

                        await loadComments();

                    }

                }
            );


            // ======================================
            // LOAD COMMENTS
            // ======================================

            async function loadComments() {

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
                        "Video City: Comment load error:",
                        error
                    );

                    return;

                }


                commentList.innerHTML = "";


                (data || []).forEach(
                    function (comment) {
                        addComment(
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


                    const username =
                        getUsername();


                    if (!username) {

                        alert(
                            "Please login with Pi to comment."
                        );

                        return;

                    }


                    const creator =
                        await getCurrentCreator();


                    if (!creator) {

                        alert(
                            "Your Video City account could not be found."
                        );

                        return;

                    }


                    if (!video.id) {

                        addComment(
                            {
                                text: text,

                                creators: {
                                    username:
                                        creator.username
                                }
                            },
                            commentList
                        );

                        input.value = "";

                        return;

                    }


                    try {

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
                            throw error;
                        }


                        addComment(
                            data,
                            commentList
                        );


                        input.value = "";


                    } catch (error) {

                        console.error(
                            "Video City: Comment error:",
                            error
                        );

                        alert(
                            "Unable to post comment. Please try again."
                        );

                    }

                }
            );
            // ======================================
            // DISPLAY COMMENT
            // ======================================

            function addComment(
                comment,
                list
            ) {

                const commentElement =
                    document.createElement("div");

                commentElement.className =
                    "comment";


                const username =
                    comment.creators &&
                    comment.creators.username
                        ? comment.creators.username
                        : "Guest";


                commentElement.innerHTML = `

                    <strong>
                        @${escapeHTML(username)}
                    </strong>

                    <p>
                        ${escapeHTML(comment.text)}
                    </p>

                `;


                list.appendChild(
                    commentElement
                );

            }

        }
        // ==========================================
        // LOAD REAL VIDEOS
        // ==========================================

        async function loadVideos() {

            feed.innerHTML = "";


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
                        "Video City: Video loading error:",
                        error
                    );


                    feed.innerHTML = `
                        <p class="muted">
                            Unable to load videos.
                        </p>
                    `;

                    return;

                }


                const videos =
                    data || [];
                

            

              
