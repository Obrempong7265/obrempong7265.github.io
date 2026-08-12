// ==========================================
// VIDEO CITY - PRODUCTION APP
// PART 1 OF 5
// APP SETUP + SUPABASE + HELPERS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "Video City: Production app starting..."
        );


        // ==========================================
        // GET PAGE ELEMENTS
        // ==========================================

        const feed =
            document.getElementById("feed");

        const uploadForm =
            document.getElementById("uploadForm");

        const uploadStatus =
            document.getElementById("uploadStatus");


        // ==========================================
        // GET SUPABASE CLIENT
        // ==========================================

        const supabaseClient =
            window.supabaseClient;


        // ==========================================
        // BASIC CHECK - FEED
        // ==========================================

        if (!feed) {

            console.error(
                "Video City: Feed element not found."
            );

            return;

        }


        // ==========================================
        // BASIC CHECK - SUPABASE
        // ==========================================

        if (!supabaseClient) {

            console.error(
                "Video City: Supabase client not found."
            );


            feed.innerHTML = `

                <div class="upload-box">

                    <h3>
                        Video City is temporarily unavailable
                    </h3>

                    <p class="muted">

                        We are performing maintenance.
                        Please try again shortly.

                    </p>

                </div>

            `;

            return;

        }


        console.log(
            "Video City: Supabase client detected."
        );


        // ==========================================
        // GET LOGGED-IN USERNAME
        // ==========================================

        function getUsername() {

            return (
                sessionStorage.getItem(
                    "videoCityUsername"
                ) || ""
            );

        }


        // ==========================================
        // GET PI UID
        // ==========================================

        function getPiUID() {

            return (
                sessionStorage.getItem(
                    "videoCityPiUID"
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

        function escapeHTML(
            text
        ) {

            const div =
                document.createElement(
                    "div"
                );


            div.textContent =
                text == null
                    ? ""
                    : String(text);


            return div.innerHTML;

        }


        // ==========================================
        // SHOW FEED MESSAGE
        // ==========================================

        function showFeedMessage(
            title,
            message
        ) {

            feed.innerHTML = `

                <div class="upload-box">

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                    <p class="muted">

                        ${escapeHTML(message)}

                    </p>

                </div>

            `;

        }


        // ==========================================
        // SHOW ERROR
        // ==========================================

        function showFeedError(
            message
        ) {

            console.error(
                "Video City:",
                message
            );


            showFeedMessage(
                "Video City is under maintenance",
                message
            );

        }


        // ==========================================
        // GET CURRENT CREATOR
        // ==========================================

        async function getCurrentCreator() {

            const username =
                getUsername();


            const piUID =
                getPiUID();


            if (!username && !piUID) {

                return null;

            }


            // --------------------------------------
            // TRY PI UID FIRST
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
            // TRY USERNAME
            // --------------------------------------

            if (username) {

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
                        "Creator username lookup error:",
                        error
                    );

                }


                if (data) {

                    return data;

                }

            }


            return null;

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
                getPiUID() ||
                cleanUsername;


            // --------------------------------------
            // LOOK FOR EXISTING CREATOR
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
                    "Creator lookup failed:",
                    lookupError
                );

                throw lookupError;

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
                    "Creator creation failed:",
                    insertError
                );

                throw insertError;

            }


            return newCreator;

        }


        console.log(
            "Video City: Part 1 loaded successfully."
        );
                // ==========================================
        // VIDEO CITY - PART 2
        // VIDEO DISPLAY + FEED
        // ==========================================


        // ==========================================
        // CREATE VIDEO CARD
        // ==========================================

        function createVideoCard(
            video
        ) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "video-card";


            // ======================================
            // CREATOR NAME
            // ======================================

            let creatorName =
                "@Creator";


            if (
                video.creators &&
                video.creators.username
            ) {

                creatorName =
                    displayUsername(
                        video.creators.username
                    );

            } else if (
                video.creator
            ) {

                creatorName =
                    displayUsername(
                        video.creator
                    );

            }


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
                        src="${escapeHTML(
                            video.media_url
                        )}"
                        alt="${escapeHTML(
                            video.title
                        )}"
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
                            src="${escapeHTML(
                                video.media_url
                            )}"
                            type="video/mp4">

                        Your browser does not support
                        HTML5 video.

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

                        ${escapeHTML(
                            video.title ||
                            "Untitled"
                        )}

                    </h3>


                    <p class="creator">

                        ${escapeHTML(
                            creatorName
                        )}

                    </p>


                    <p class="description">

                        ${escapeHTML(
                            video.description ||
                            ""
                        )}

                    </p>


                    ${
                        Number(
                            video.price_pi
                        ) > 0
                        ?
                        `
                        <p class="price">

                            💰
                            ${escapeHTML(
                                String(
                                    video.price_pi
                                )
                            )}
                            Pi

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

                                ${
                                    Number(
                                        video.likes
                                    ) || 0
                                }

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
            // BASIC LIKE BUTTON
            // ======================================

            const likeButton =
                card.querySelector(
                    ".likeBtn"
                );


            if (likeButton) {

                likeButton.addEventListener(
                    "click",
                    function () {

                        let count =
                            Number(
                                likeButton
                                    .querySelector(
                                        "span"
                                    )
                                    .textContent
                            ) || 0;


                        count++;


                        likeButton.innerHTML =
                            `♥ <span>${count}</span>`;

                    }
                );

            }


            // ======================================
            // COMMENT TOGGLE
            // ======================================

            const commentButton =
                card.querySelector(
                    ".commentBtn"
                );


            const comments =
                card.querySelector(
                    ".comments"
                );


            if (
                commentButton &&
                comments
            ) {

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

            }


            // ======================================
            // LOCAL COMMENT DISPLAY
            // ======================================

            const commentForm =
                card.querySelector(
                    ".commentForm"
                );


            const commentInput =
                card.querySelector(
                    ".commentForm input"
                );


            const commentList =
                card.querySelector(
                    ".commentList"
                );


            if (
                commentForm &&
                commentInput &&
                commentList
            ) {

                commentForm.addEventListener(
                    "submit",
                    function (event) {

                        event.preventDefault();


                        const text =
                            commentInput.value.trim();


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

                                ${escapeHTML(
                                    displayUsername(
                                        getUsername()
                                    )
                                )}

                            </strong>

                            <p>

                                ${escapeHTML(
                                    text
                                )}

                            </p>

                        `;


                        commentList.appendChild(
                            comment
                        );


                        commentInput.value =
                            "";

                    }
                );

            }


            // ======================================
            // SUPPORT BUTTON
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
                            "Pi Support will be enabled after the core Video City platform is stable."
                        );

                    }
                );

            }


            return card;

        }


        // ==========================================
        // LOAD REAL VIDEOS FROM SUPABASE
        // ==========================================

        async function loadVideos() {

            console.log(
                "Video City: Loading videos..."
            );


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


                // ==================================
                // DATABASE ERROR
                // ==================================

                if (error) {

                    console.error(
                        "Video City: Video query failed:",
                        error
                    );


                    showFeedError(
                        "We could not retrieve videos from the Video City database."
                    );


                    return;

                }


                console.log(
                    "Video City: Videos retrieved:",
                    data
                );


                // ==================================
                // NO VIDEOS
                // ==================================

                if (
                    !data ||
                    data.length === 0
                ) {

                    showFeedMessage(
                        "No videos available yet.",
                        "Be the first creator to upload content to Video City."
                    );


                    return;

                }


                // ==================================
                // DISPLAY VIDEOS
                // ==================================

                data.forEach(
                    function (video) {

                        const card =
                            createVideoCard(
                                video
                            );


                        feed.appendChild(
                            card
                        );

                    }
                );


                console.log(
                    "Video City: Feed loaded successfully."
                );

            } catch (error) {

                console.error(
                    "Video City: Unexpected feed error:",
                    error
                );


                showFeedError(
                    "An unexpected error occurred while loading the Video City feed."
                );

            }

        }


        console.log(
            "Video City: Part 2 loaded successfully."
        );
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

                    if (!video.id) {

                        liked = !liked;

                        let count =
                            Number(span.textContent) || 0;

                        count = liked
                            ? count + 1
                            : Math.max(0, count - 1);

                        likeButton.innerHTML =
                            liked
                                ? `♥ <span>${count}</span>`
                                : `♡ <span>${count}</span>`;

                        return;
                    }

                    try {

                        if (!liked) {

                            const { error } =
                                await supabaseClient
                                    .from("video_likes")
                                    .insert({
                                        video_id: video.id,
                                        creator_id: creator.id
                                    });

                            if (error) {
                                throw error;
                            }

                            liked = true;

                        } else {

                            const { error } =
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
                                throw error;
                            }

                            liked = false;
                        }

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
                                likes: totalLikes
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


            // --------------------------------------
            // OPEN / CLOSE COMMENTS
            // --------------------------------------

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


            // --------------------------------------
            // LOAD COMMENTS
            // --------------------------------------

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


            // --------------------------------------
            // POST COMMENT
            // --------------------------------------

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

                    // ----------------------------------
                    // SAMPLE VIDEO
                    // ----------------------------------

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

                    // ----------------------------------
                    // REAL VIDEO
                    // ----------------------------------

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


            // --------------------------------------
            // ADD COMMENT TO SCREEN
            // --------------------------------------

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
                    commentElement
                );


                // ----------------------------------
                // REPLY BUTTON
                // ----------------------------------

                const replyButton =
                    commentElement.querySelector(
                        ".replyBtn"
                    );

                const replyBox =
                    commentElement.querySelector(
                        ".replyBox"
                    );


                replyButton.addEventListener(
                    "click",
                    function () {

                        replyBox.style.display =
                            replyBox.style.display === "none"
                                ? "block"
                                : "none";

                    }
                );


                // ----------------------------------
                // REPLY
                // ----------------------------------

                const replyInput =
                    replyBox.querySelector("input");

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
                            document.createElement("div");

                        reply.className =
                            "reply";

                        reply.innerHTML = `

                            <strong>
                                ${escapeHTML(
                                    displayUsername(
                                        getUsername()
                                    )
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

                    }
                // ==========================================
        // SUPPORT SYSTEM
        // ==========================================

        function setupSupport(card, video) {

            const supportButton =
                card.querySelector(".supportBtn");

            if (!supportButton) {
                return;
            }

            supportButton.addEventListener(
                "click",
                function () {

                    const username =
                        getUsername();

                    if (!username) {

                        alert(
                            "Please login with Pi to support this creator."
                        );

                        return;
                    }

                    alert(
                        "Pi Support payments will be added soon."
                    );

                }
            );

        }


        // ==========================================
        // LOAD VIDEOS
        // ==========================================

        async function loadVideos() {

            feed.innerHTML = "";

            try {

                console.log(
                    "Video City: Loading videos..."
                );

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

                    feed.innerHTML = `
                        <div class="panel">
                            <h3>
                                Video City is under maintenance
                            </h3>

                            <p class="muted">
                                We are restoring the video feed.
                                Please try again shortly.
                            </p>
                        </div>
                    `;

                    return;

                }


                const videos =
                    data || [];


                console.log(
                    "Video City: Videos found:",
                    videos.length
                );


                // --------------------------------------
                // NO SAMPLE VIDEOS
                // --------------------------------------

                if (videos.length === 0) {

                    feed.innerHTML = `
                        <div class="panel">
                            <h3>
                                Video City is under maintenance
                            </h3>

                            <p class="muted">
                                No videos are currently available.
                                New content will appear here when published.
                            </p>
                        </div>
                    `;

                    return;

                }


                // --------------------------------------
                // CREATE VIDEO CARDS
                // --------------------------------------

                videos.forEach(
                    function (video) {

                        video.creator =
                            video.creators &&
                            video.creators.username
                                ? "@" +
                                  video.creators.username
                                : "@Creator";


                        const card =
                            createVideo(video);


                        feed.appendChild(
                            card
                        );

                    }
                );


                console.log(
                    "Video City: Feed loaded successfully."
                );

            } catch (error) {

                console.error(
                    "Video City: Unexpected feed error:",
                    error
                );

                feed.innerHTML = `
                    <div class="panel">
                        <h3>
                            Video City is under maintenance
                        </h3>

                        <p class="muted">
                            We are temporarily
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

                    try {

                        const username =
                            getUsername();

                        if (!username) {

                            alert(
                                "Please login with Pi before uploading."
                            );

                            return;
                        }

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


                        if (!title) {

                            status.textContent =
                                "❌ Please enter a title.";

                            return;
                        }


                        if (!description) {

                            status.textContent =
                                "❌ Please enter a description.";

                            return;
                        }


                        if (!file) {

                            status.textContent =
                                "❌ Please select a video or image.";

                            return;
                        }


                        submitButton.disabled =
                            true;

                        submitButton.textContent =
                            "Uploading...";

                        status.textContent =
                            "Uploading your content...";


                        // --------------------------------------
                        // FILE TYPE
                        // --------------------------------------

                        const mediaType =
                            file.type.startsWith(
                                "image/"
                            )
                            ? "image"
                            : "video";


                        // --------------------------------------
                        // SAFE FILE NAME
                        // --------------------------------------

                        const extension =
                            file.name
                                .split(".")
                                .pop()
                                .toLowerCase();


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


                        // --------------------------------------
                        // STORAGE UPLOAD
                        // --------------------------------------

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
                            "File uploaded. Saving video information...";


                        // --------------------------------------
                        // PUBLIC URL
                        // --------------------------------------

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
                            publicData &&
                            publicData.publicUrl
                                ? publicData.publicUrl
                                : "";


                        if (!mediaURL) {

                            throw new Error(
                                "Unable to create media URL."
                            );
                        }


                        // --------------------------------------
                        // GET / CREATE CREATOR
                        // --------------------------------------

                        const creator =
                            await getOrCreateCreator();


                        if (!creator) {

                            throw new Error(
                                "Unable to create or find your Video City creator account."
                            );
                        }


                        // --------------------------------------
                        // SAVE VIDEO RECORD
                        // --------------------------------------

                        const {
                            error: videoError
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


                        if (videoError) {

                            throw videoError;
                        }


                        // --------------------------------------
                        // SUCCESS
                        // --------------------------------------

                        status.textContent =
                            "✅ Published successfully!";


                        uploadForm.reset();


                        await loadVideos();


                        // --------------------------------------
                        // RETURN TO HOME
                        // --------------------------------------

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
                            "Video City: Upload error:",
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
        // START VIDEO CITY APPLICATION
        // ==========================================

        await loadVideos();


        console.log(
            "Video City: Application ready."
        );

    }
);
    

