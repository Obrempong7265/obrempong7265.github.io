document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // ==========================================
        // VIDEO CITY APP
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
                title:
                    "Welcome to Video City",

                creator:
                    "@VideoCity",

                description:
                    "Welcome to Video City — a platform where creators can share videos, promote their products and connect with audiences through the Pi ecosystem.",

                price_pi:
                    0,

                media_url:
                    "./7ba2eb8d7397b5b5eef95244c6559301.mp4",

                media_type:
                    "video",

                likes:
                    0

            },


            {
                title:
                    "Creator Spotlight",

                creator:
                    "@VideoCity",

                description:
                    "Discover creators, explore their content and support the people behind the videos you enjoy.",

                price_pi:
                    0,

                media_url:
                    "./7ba2eb8d7397b5b5eef95244c6559301.mp4",

                media_type:
                    "video",

                likes:
                    0

            },


            {
                title:
                    "Sample Product Showcase",

                creator:
                    "@VideoCity",

                description:
                    "This is an example of how a creator can introduce a product or service directly below their video.",

                price_pi:
                    5,

                media_url:
                    "./7ba2eb8d7397b5b5eef95244c6559301.mp4",

                media_type:
                    "video",

                likes:
                    0

            }

        ];


        // ==========================================
        // USER
        // ==========================================

        function getUsername() {

            return (
                sessionStorage.getItem(
                    "videoCityUsername"
                ) || ""
            );

        }


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
        // GET CURRENT CREATOR
        // ==========================================

        async function getCurrentCreator() {

            const username =
                getUsername();


            if (!username) {

                return null;

            }


            const piUID =
                sessionStorage.getItem(
                    "videoCityPiUID"
                );


            // --------------------------------------
            // Prefer Pi UID
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
                        "Creator UID lookup failed:",
                        error
                    );

                }


                if (data) {

                    return data;

                }

            }


            // --------------------------------------
            // Fallback to username
            // --------------------------------------

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
                    "Creator username lookup failed:",
                    error
                );

                return null;

            }


            return data || null;

        }


        // ==========================================
        // CREATE / GET CREATOR
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
            // Look up by Pi UID
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

                return null;

            }


            if (existingCreator) {

                return existingCreator;

            }


            // --------------------------------------
            // Create creator
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

                return null;

            }


            return newCreator;

        }


        // ==========================================
        // CREATE VIDEO CARD
        // ==========================================

        function createVideo(
            video
        ) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "video-card";


            // --------------------------------------
            // MEDIA
            // --------------------------------------

            let mediaHTML = "";


            if (
                video.media_type ===
                "image"
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


            // --------------------------------------
            // CARD
            // --------------------------------------

            card.innerHTML = `

                <div class="video-wrap">

                    ${mediaHTML}

                </div>


                <div class="video-info">

                    <h3 class="title">

                        ${escapeHTML(
                            video.title
                        )}

                    </h3>


                    <p class="creator">

                        ${escapeHTML(
                            video.creator ||
                            "@Creator"
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
            // LIKE
            // ======================================

            setupLike(
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

        function setupLike(
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


            let liked =
                false;


            // --------------------------------------
            // Update button
            // --------------------------------------

            function updateButton(
                count
            ) {

                likeButton.innerHTML =
                    liked
                    ?
                    `♥ <span>${count}</span>`
                    :
                    `♡ <span>${count}</span>`;

            }


            // --------------------------------------
            // Sample video
            // --------------------------------------

            if (!video.id) {

                likeButton.addEventListener(
                    "click",
                    function () {

                        liked =
                            !liked;


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


                        updateButton(
                            count
                        );

                    }
                );


                return;

            }


            // --------------------------------------
            // Real video
            // --------------------------------------

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


                            liked =
                                true;

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


                            liked =
                                false;

                        }


                        const {
                            count,
                            error:
                                countError
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
                                    video.i
