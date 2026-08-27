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
// LOAD NOTIFICATIONS
// ==========================================

async function loadNotifications() {

    const notificationList =
        document.getElementById(
            "notificationList"
        );


    if (!notificationList) {
        return;
    }


    try {

        // ======================================
        // GET CURRENT CREATOR
        // ======================================

        const creator =
            await getOrCreateCreator();


        if (!creator) {

            notificationList.innerHTML = `
                <div class="notification-item">

                    <strong>
                        🔔 Please login
                    </strong>

                    <p class="muted">
                        Login with Pi to view your notifications.
                    </p>

                </div>
            `;

            return;

        }


        // ======================================
        // LOAD NOTIFICATIONS
        // ======================================

        const {
            data: notifications,
            error
        } =
            await supabaseClient
                .from("notifications")
                .select(`
                    id,
                    recipient_id,
                    sender_id,
                    type,
                    message,
                    video_id,
                    comment_id,
                    is_read,
                    created_at
                `)
                .eq(
                    "recipient_id",
                    creator.id
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        // ======================================
        // NO NOTIFICATIONS
        // ======================================

        if (
            !notifications ||
            notifications.length === 0
        ) {

            notificationList.innerHTML = `
                <div class="notification-item">

                    <strong>
                        🔔 No notifications yet
                    </strong>

                    <p class="muted">
                        We'll let you know when something important happens.
                    </p>

                </div>
            `;

            return;

        }


        // ======================================
        // DISPLAY NOTIFICATIONS
        // ======================================

        notificationList.innerHTML =
            notifications
                .map(
                    function (notification) {

                        const unreadClass =
                            notification.is_read
                                ? ""
                                : " unread";


                        return `
                            <div
                                class="notification-item${unreadClass}"
                                data-notification-id="${notification.id}">

                                ${
                                    notification.is_read
                                        ? ""
                                        : '<span class="notification-unread-dot"></span>'
                                }

                                <strong>
                                    ${notification.message}
                                </strong>

                                <p class="muted">
                                    ${notification.type}
                                </p>

                            </div>
                        `;

                    }
                )
                .join("");


    } catch (error) {

        console.error(
            "Video City: Notification loading error:",
            error
        );


        notificationList.innerHTML = `
            <div class="notification-item">

                <strong>
                    ❌ Unable to load notifications
                </strong>

                <p class="muted">
                    Please try again.
                </p>

            </div>
        `;

    }

}
// ==========================================
// SUPPORT REQUEST
// ==========================================

const supportForm =
    document.getElementById("supportForm");


if (supportForm) {

    supportForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();
            event.stopPropagation();


            const status =
                document.getElementById(
                    "supportStatus"
                );


            const submitButton =
                supportForm.querySelector(
                    'button[type="submit"]'
                );


            const category =
                supportForm.elements[
                    "category"
                ].value;


            const message =
                supportForm.elements[
                    "message"
                ].value.trim();


            // ======================================
            // VALIDATION
            // ======================================

            if (!category) {

                status.textContent =
                    "❌ Please select a support category.";

                return;

            }


            if (!message) {

                status.textContent =
                    "❌ Please describe your problem.";

                return;

            }


            if (!getUsername()) {

                status.textContent =
                    "❌ Please login with Pi first.";

                return;

            }


            try {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    "Sending...";

                status.textContent =
                    "Sending your support request...";


                // ======================================
                // GET / CREATE CREATOR
                // ======================================

                const creator =
                    await getOrCreateCreator();


                if (!creator) {

                    throw new Error(
                        "Unable to identify your Video City account."
                    );

                }


                // ======================================
                // SAVE SUPPORT REQUEST
                // ======================================

                const {
    error
} =
    await supabaseClient
        .from("support_request")
        .insert({

            pi_uid:
                creator.pi_uid,

            username:
                creator.username,

            category:
                category,

            message:
                message,

            status:
                "pending"

        });


                if (error) {

                    throw error;

                }


                console.log(
    "Video City: Support request saved successfully."
);


                // ======================================
                // SUCCESS
                // ======================================

                status.textContent =
                    "✅ Your support request has been sent successfully.";

                supportForm.reset();


            } catch (error) {

                console.error(
                    "Video City: Support request error:",
                    error
                );


                status.textContent =
                    "❌ Unable to send your support request. Please try again.";

            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Send Support Request";

            }

        }
    );

}


        
        
        // ==========================================
// MARK ACTIVE CREATOR SUBSCRIPTION CARD
// ==========================================

async function markActiveSubscriptionCard() {

    try {

        const creator =
            await getOrCreateCreator();

        if (!creator) {
            return;
        }


        // ==========================================
        // GET ACTIVE SUBSCRIPTION
        // ==========================================

        const {
            data: subscription,
            error
        } =
            await supabaseClient
                .from("creator_subscriptions")
                .select("*")
                .eq(
                    "creator_id",
                    creator.id
                )
                .eq(
                    "status",
                    "active"
                )
                .gt(
                    "expires_at",
                    new Date().toISOString()
                )
                .order(
                    "expires_at",
                    {
                        ascending: false
                    }
                )
                .limit(1)
                .maybeSingle();


        if (error) {

            console.error(
                "Video City: Active subscription lookup error:",
                error
            );

            return;
        }


        // ==========================================
        // GET ALL SUBSCRIPTION CARDS
        // ==========================================

        const cards =
            document.querySelectorAll(
                ".subscription-card"
            );


        // ==========================================
        // RESET ALL CARDS FIRST
        // ==========================================

        cards.forEach(
            function (card) {

                const plan =
                    card.dataset.subscription;

                const details =
                    subscriptionPlans[plan];

                if (!details) {
                    return;
                }


                card.classList.remove(
                    "active-subscription"
                );


                const oldBadge =
                    card.querySelector(
                        ".active-subscription-badge"
                    );

                if (oldBadge) {
                    oldBadge.remove();
                }


                const oldExpiry =
                    card.querySelector(
                        ".subscription-expiry"
                    );

                if (oldExpiry) {
                    oldExpiry.remove();
                }


                const action =
                    card.querySelector(
                        ".subscription-action"
                    );

                if (action) {

                    action.textContent =
                        "Subscribe with Pi";

                }

            }
        );


        // ==========================================
        // NO ACTIVE SUBSCRIPTION
        // ==========================================

        if (!subscription) {

            console.log(
                "Video City: No active subscription."
            );

            return;
        }


        // ==========================================
        // ACTIVE PLAN
        // ==========================================

        const activePlan =
            subscription.plan;


        const expireAt =
            new Date(
                subscription.expires_at
            );


        cards.forEach(
            function (card) {

                const plan =
                    card.dataset.subscription;


                if (
                    plan !== activePlan
                ) {
                    return;
                }


                card.classList.add(
                    "active-subscription"
                );


                // ==================================
                // ACTIVE BADGE
                // ==================================

                const badge =
                    document.createElement(
                        "span"
                    );

                badge.className =
                    "active-subscription-badge";

                badge.textContent =
                    "🟢 ACTIVE ✓";

                card.appendChild(
                    badge
                );


                // ==================================
                // EXPIRY DATE
                // ==================================

                const expiry =
                    document.createElement(
                        "span"
                    );

                expiry.className =
                    "subscription-expiry";

                expiry.textContent =
                    "Expires: " +
                    expireAt.toLocaleDateString(
                        undefined,
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    );

                card.appendChild(
                    expiry
                );


                // ==================================
                // CHANGE CARD ACTION
                // ==================================

                const action =
                    card.querySelector(
                        ".subscription-action"
                    );

                if (action) {

                    action.textContent =
                        "View subscription details →";

                }

            }
        );


        console.log(
            "Video City: Active subscription card:",
            activePlan
        );


    } catch (error) {

        console.error(
            "Video City: Subscription card error:",
            error
        );

    }

}


window.markActiveSubscriptionCard =
    markActiveSubscriptionCard;

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


                        <button
                            class="reportBtn"
                            type="button">

                            🚨 Report

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

            alert(
                "Pi Support payments will be added soon."
            );

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
    // INITIAL COMMENT COUNT
    // ======================================

    commentButton.textContent =
        "💬 Comments 0";


    // ======================================
    // LOAD COMMENT COUNT
    // ======================================

    async function loadCommentCount() {

        if (!video.id) {
            return;
        }


        const {
            count,
            error
        } =
            await supabaseClient
                .from("comments")
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


        if (error) {

            console.error(
                "Video City: Comment count error:",
                error
            );

            return;

        }


        commentButton.textContent =
            "💬 Comments " +
            (count || 0);

    }


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

            commentList.innerHTML = `
                <p class="muted">
                    Unable to load comments.
                </p>
            `;

            return;

        }


        commentList.innerHTML = "";


if (data && data.length > 0) {

    data.forEach(
        function (comment) {

            addComment(
                comment,
                commentList
            );

        }
    );

}
        commentButton.textContent =
            "💬 Comments " +
            (data ? data.length : 0);

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


                await loadCommentCount();


                comments.style.display =
                    "block";


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


    // ======================================
    // GET INITIAL COUNT
    // ======================================

    loadCommentCount();

}
        // ==========================================
// LOAD REAL VIDEOS
// ==========================================

async function loadVideos() {

    feed.innerHTML = `
        <div class="panel">
            <p class="muted">
                Loading videos...
            </p>
        </div>
    `;


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
                <div class="panel">

                    <h3>
                        Video City Database Error
                    </h3>

                    <p>
                        ${escapeHTML(
                            error.message ||
                            "Unknown database error"
                        )}
                    </p>

                    <p class="muted">
                        Code:
                        ${escapeHTML(
                            error.code ||
                            "No code"
                        )}
                    </p>

                </div>
            `;

            return;
        }


        const videos =
            data || [];


        if (videos.length === 0) {

            feed.innerHTML = `
                <div class="panel">

                    <h2>
                        Video City is ready
                    </h2>

                    <p class="muted">
                        No videos have been published yet.
                    </p>

                </div>
            `;

            return;
        }


        feed.innerHTML = "";


        videos.forEach(
    function (video) {

        video.creator =
            video.creators &&
            video.creators.username
                ? "@" + video.creators.username
                : "@Creator";


        const card =
            createVideo(video);

                feed.appendChild(
                    card
                );

            }
        );


        console.log(
            "Video City: Loaded " +
            videos.length +
            " video(s)."
        );


    } catch (error) {

        console.error(
            "Video City: Feed error:",
            error
        );


        feed.innerHTML = `
            <div class="panel">

                <h3>
                    Video City Error
                </h3>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Unable to load videos."
                    )}
                </p>

            </div>
        `;

    }

}
        // ==========================================
// CREATOR STUDIO - EARNINGS & TRANSACTIONS
// ==========================================

async function loadCreatorStudio() {

    const creator =
        await getCurrentCreator();

    if (!creator) {
        console.log(
            "Video City: Creator not found."
        );
        return;
    }


    // ======================================
    // LOAD TRANSACTIONS
    // ======================================

    const {
        data: transactions,
        error
    } =
        await supabaseClient
            .from("transactions")
            .select("*")
            .or(
                "creator_id.eq." +
                creator.id +
                ",payer_id.eq." +
                creator.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Video City: Transaction loading error:",
            error
        );

        return;
    }


    const records =
        transactions || [];


    // ======================================
    // CALCULATE EARNINGS
    // ======================================

    let totalEarnings = 0;
    let totalTips = 0;
    let totalSales = 0;


    records.forEach(
        function (transaction) {

            if (
                transaction.status !==
                "completed"
            ) {
                return;
            }


            const amount =
                Number(
                    transaction.creator_earning_pi
                ) || 0;


            totalEarnings += amount;


            if (
                transaction.transaction_type ===
                "tip"
            ) {

                totalTips += amount;

            }


            if (
                transaction.transaction_type ===
                "video_purchase"
            ) {

                totalSales += amount;

            }

        }
    );


    // ======================================
    // UPDATE STUDIO
    // ======================================

    const earnings =
        document.getElementById(
            "totalEarnings"
        );


    const tips =
        document.getElementById(
            "totalTips"
        );


    const sales =
        document.getElementById(
            "totalSales"
        );


    if (earnings) {

        earnings.textContent =
            totalEarnings.toFixed(2) +
            " Pi";

    }


    if (tips) {

        tips.textContent =
            totalTips.toFixed(2) +
            " Pi";

    }


    if (sales) {

        sales.textContent =
            totalSales.toFixed(2) +
            " Pi";

    }


    // ======================================
    // TRANSACTION LIST
    // ======================================

    const transactionList =
        document.getElementById(
            "transactionsList"
        );


    if (!transactionList) {
        return;
    }


    if (records.length === 0) {

        transactionList.innerHTML = `
            <p class="muted">
                No transactions yet.
            </p>
        `;

        return;

    }


    transactionList.innerHTML = "";


    records.forEach(
        function (transaction) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "comment";


            item.innerHTML = `

                <strong>
                    ${escapeHTML(
                        transaction.transaction_type
                    )}
                </strong>

                <p>
                    ${Number(
                        transaction.amount_pi
                    ).toFixed(2)}
                    Pi
                </p>

                <small class="muted">
                    Status:
                    ${escapeHTML(
                        transaction.status
                    )}
                </small>

            `;


            transactionList.appendChild(
                item
            );

        }
    );


    console.log(
        "Video City: Creator Studio updated."
    );

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
                uploadForm.elements["title"]
                    .value.trim();


            const description =
                uploadForm.elements["description"]
                    .value.trim();


            const category =
                uploadForm.elements["category"]
                    .value.trim();


            const price =
                Number(
                    uploadForm.elements["price"]
                        .value || 0
                );


            const file =
                uploadForm.elements["video"]
                    .files[0];


            if (!file) {

                status.textContent =
                    "❌ Please select a video or image.";

                return;

            }


            if (!getUsername()) {

                status.textContent =
                    "❌ Please login with Pi first.";

                return;

            }


            try {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Uploading...";

                status.textContent =
                    "Uploading your content...";


                // ======================================
                // GET / CREATE CREATOR
                // ======================================

                const creator =
                    await getOrCreateCreator();


                if (!creator) {

                    throw new Error(
                        "Unable to identify your creator account."
                    );

                }


                // ======================================
                // FILE TYPE
                // ======================================

                const mediaType =
                    file.type.startsWith("image/")
                        ? "image"
                        : "video";


                // ======================================
                // FILE EXTENSION
                // ======================================

                const extension =
                    file.name
                        .split(".")
                        .pop()
                        .toLowerCase();


                // ======================================
                // SAFE FILE NAME
                // ======================================

                const safeTitle =
                    (
                        title ||
                        "video"
                    )
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


                // ======================================
                // UPLOAD FILE
                // ======================================

                status.textContent =
                    "Uploading file...";


                const {
                    error: uploadError
                } =
                    await supabaseClient
                        .storage
                        .from("video-city-media")
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


                // ======================================
                // GET PUBLIC URL
                // ======================================

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
                    publicData &&
                    publicData.publicUrl;


                if (!mediaURL) {

                    throw new Error(
                        "Unable to create media URL."
                    );

                }


                // ======================================
                // SAVE VIDEO RECORD
                // ======================================

                status.textContent =
                    "Saving video information...";


                const {
                    data: savedVideo,
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

                        })
                        .select()
                        .single();


                if (videoError) {

                    throw videoError;

                }


                console.log(
                    "Video City: Video saved:",
                    savedVideo
                );


                // ======================================
                // SUCCESS
                // ======================================

                status.textContent =
                    "✅ Published successfully!";


                uploadForm.reset();


                // ======================================
                // RELOAD FEED
                // ======================================

                await loadVideos();


                // ======================================
                // RETURN HOME
                // ======================================

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
// START VIDEO CITY
// ==========================================

await loadVideos();


console.log(
    "Video City: Application ready."
);


// ==========================================
// CREATOR SUBSCRIPTION BUTTONS
// ==========================================
const subscriptionButtons =
    document.querySelectorAll(
        '#subscribeDetailBtn'
    

    );


subscriptionButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            async function () {

                const plan =
                    selectedSubscriptionPlan;

                let amount = 0;


                if (plan === "weekly") {
                    amount = 10;
                }


                if (plan === "monthly") {
                    amount = 40;
                }


                if (plan === "yearly") {
                    amount = 480;
                }
                if (!plan || amount <= 0) {

    console.error(
        "Video City: Invalid subscription plan:",
        plan,
        amount
    );

    return;
                }


                const status =
                    document.getElementById(
                        "subscriptionStatus"
                    );


                if (status) {

                    status.textContent =
                        "Starting Pi payment...";

                }


                if (
                    typeof Pi === "undefined"
                ) {

                    if (status) {

                        status.textContent =
                            "Pi SDK is not available.";

                    }

                    return;

                }


                console.log(
                    "Video City: Starting Pi payment:",
                    plan,
                    amount + " Pi"
                );


                const paymentData = {

                    amount: amount,

                    memo:
                        "Video City " +
                        plan +
                        " Creator Subscription",

                    metadata: {

                        plan: plan,

                        subscription:
                            "creator"

                    }

                };


                const paymentCallbacks = {

                    onReadyForServerApproval:
                        async function (paymentId) {

                            console.log(
                                "Video City: Payment ready for approval:",
                                paymentId
                            );


                            try {

                                const response =
                                    await fetch(
                                        "https://fkcyhqaxsfsnukbeebwu.supabase.co/functions/v1/pi-payment",
                                        {
                                            method: "POST",

                                            headers: {
                                                "Content-Type":
                                                    "application/json"
                                            },

                                            body:
                            JSON.stringify({

                                action:
                                    "approve",

                                paymentId:
                                    paymentId,

                                piAccessToken:
                                    sessionStorage.getItem(
                                        "videoCityPiAccessToken"
                                    )

                            })
                    }
                );


            

                                const result =
                                    await response.json();


                                console.log(
                                    "Video City: Approval response:",
                                    result
                                );


                                if (!response.ok) {

                                    console.error(
                                        "Video City: Payment approval failed:",
                                        result
                                    );

                                }

                            } catch (error) {

                                console.error(
                                    "Video City: Approval error:",
                                    error
                                );

                            }

                        },


                    onReadyForServerCompletion:
    async function (
        paymentId,
        txid
    ) {

        console.log(
            "Video City: Payment ready for completion:",
            paymentId,
            txid
        );
        const debugBox =
    document.createElement("div");

debugBox.style.position = "fixed";
debugBox.style.top = "10px";
debugBox.style.left = "10px";
debugBox.style.right = "10px";
debugBox.style.zIndex = "99999";
debugBox.style.background = "white";
debugBox.style.color = "black";
debugBox.style.padding = "15px";
debugBox.style.border = "2px solid black";
debugBox.style.fontSize = "12px";
debugBox.style.wordBreak = "break-all";

debugBox.innerHTML =
    "<strong>PI PAYMENT DEBUG</strong><br><br>" +
    "Payment ID:<br>" +
    paymentId +
    "<br><br>" +
    "Transaction ID:<br>" +
    txid;

document.body.appendChild(debugBox);


        try {

            const response =
                await fetch(
                    "https://fkcyhqaxsfsnukbeebwu.supabase.co/functions/v1/pi-payment",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                action:
                                    "complete",

                                paymentId:
                                    paymentId,

                                txid:
                                    txid,

                                piAccessToken:
                                    sessionStorage.getItem(
                                        "videoCityPiAccessToken"
                                    ),

                                plan:
                                    plan,

                                amount:
                                    amount

                            })
                    }
                );


            const result =
                await response.json();


            console.log(
                "Video City: Completion response:",
                result
            );


            if (
                response.ok &&
                status
            ) {

                status.textContent =
                    "Payment completed successfully.";

            }


        } catch (error) {

            console.error(
                "Video City: Completion error:",
                error
            );


            if (status) {

                status.textContent =
                    "Payment completion error.";

            }

        }

    },

                    onCancel:
                        function (paymentId) {

                            console.log(
                                "Video City: Payment cancelled:",
                                paymentId
                            );


                            if (status) {

                                status.textContent =
                                    "Payment cancelled.";

                            }

                        },


                    onError:
                        function (
                            error,
                            payment
                        ) {

                            console.error(
                                "Video City: Payment error:",
                                error,
                                payment
                            );


                            if (status) {

                                status.textContent =
                                    "Payment failed.";

                            }

                        }

                };


                try {

                    const payment =
                        await Pi.createPayment(
                            paymentData,
                            paymentCallbacks
                        );


                    console.log(
                        "Video City: Pi payment created:",
                        payment
                    );


                } catch (error) {

                    console.error(
                        "Video City: Pi payment creation error:",
                        error
                    );


                    if (status) {

                        status.textContent =
                            "Unable to start Pi payment.";

                    }

                }

            }
        );

    }
);
// ==========================================
// SUBSCRIPTION CARD DETAILS
// ==========================================

const subscriptionCards =
    document.querySelectorAll(
        ".subscription-card"
    );
console.log(
    "VIDEO CITY: subscription cards found:",
    subscriptionCards.length
);
const subscriptionDetails =
    document.getElementById(
        "subscriptionDetails"
    );

const closeSubscriptionDetails =
    document.getElementById(
        "closeSubscriptionDetails"
    );

const subscriptionDetailIcon =
    document.getElementById(
        "subscriptionDetailIcon"
    );

const subscriptionDetailTitle =
    document.getElementById(
        "subscriptionDetailTitle"
    );

const subscriptionDetailPrice =
    document.getElementById(
        "subscriptionDetailPrice"
    );

const subscriptionDetailDescription =
    document.getElementById(
        "subscriptionDetailDescription"
    );

const subscribeDetailBtn =
    document.getElementById(
        "subscribeDetailBtn"
    );


const subscriptionPlans = {

    weekly: {

        icon: "📅",

        title:
            "Weekly Creator Subscription",

        price:
            "10 Pi",

        description:
            "Get access to Video City creator features for one week."

    },

    monthly: {

        icon: "⭐",

        title:
            "Monthly Creator Subscription",

        price:
            "40 Pi",

        description:
            "Unlock creator features and start earning from your content."

    },

    yearly: {

        icon: "👑",

        title:
            "Yearly Creator Subscription",

        price:
            "480 Pi",

        description:
            "Get the full Video City creator experience for one year."

    }

};


let selectedSubscriptionPlan = null;

// ==========================================
// OPEN SUBSCRIPTION DETAILS
// ==========================================

subscriptionCards.forEach(
    function (card) {

        card.addEventListener(
            "click",
            async function () {

                const plan =
                    card.dataset.subscription;

                const details =
                    subscriptionPlans[plan];

                if (!details) {
                    return;
                }


                selectedSubscriptionPlan =
                    plan;


                // ==================================
                // BASIC PLAN DETAILS
                // ==================================

                if (subscriptionDetailIcon) {

                    subscriptionDetailIcon.textContent =
                        details.icon;

                }


                if (subscriptionDetailTitle) {

                    subscriptionDetailTitle.textContent =
                        details.title;

                }


                if (subscriptionDetailPrice) {

                    subscriptionDetailPrice.textContent =
                        details.price;

                }


                if (subscriptionDetailDescription) {

                    subscriptionDetailDescription.textContent =
                        details.description;

                }


                // ==================================
                // CHECK ACTIVE STATE
                // ==================================

                const isActive =
                    card.classList.contains(
                        "active-subscription"
                    );


                if (isActive) {

                    try {

                        const creator =
                            await getOrCreateCreator();


                        if (creator) {

                            const {
                                data: subscription,
                                error
                            } =
                                await supabaseClient
                                    .from(
                                        "creator_subscriptions"
                                    )
                                    .select("*")
                                    .eq(
                                        "creator_id",
                                        creator.id
                                    )
                                    .eq(
                                        "plan",
                                        plan
                                    )
                                    .eq(
                                        "status",
                                        "active"
                                    )
                                    .gt(
                                        "expires_at",
                                        new Date().toISOString()
                                    )
                                    .order(
                                        "expires_at",
                                        {
                                            ascending: false
                                        }
                                    )
                                    .limit(1)
                                    .maybeSingle();


                            if (error) {

                                console.error(
                                    "Video City: Active subscription details error:",
                                    error
                                );

                            }


                            if (subscription) {

                                const startedAt =
                                    new Date(
                                        subscription.started_at
                                    );

                                const expiresAt =
                                    new Date(
                                        subscription.expires_at
                                    );


                                if (
                                    subscriptionDetailDescription
                                ) {

                                    subscriptionDetailDescription.innerHTML =
                                        `
                                        <strong>
                                            🟢 Active Subscription
                                        </strong>
                                        <br><br>
                                        Started:
                                        ${startedAt.toLocaleDateString(
                                            undefined,
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )}
                                        <br>
                                        Expires:
                                        ${expiresAt.toLocaleDateString(
                                            undefined,
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )}
                                    `;

                                }


                                // ==================================
                                // HIDE SUBSCRIBE BUTTON
                                // ==================================

                                if (
                                    subscribeDetailBtn
                                ) {

                                    subscribeDetailBtn.style.display =
                                        "none";

                                }

                            }

                        }

                    } catch (error) {

                        console.error(
                            "Video City: Unable to load active subscription details:",
                            error
                        );

                    }

                } else {

                    // ==================================
                    // AVAILABLE PLAN
                    // ==================================

                    if (
                        subscribeDetailBtn
                    ) {

                        subscribeDetailBtn.style.display =
                            "";

                        subscribeDetailBtn.disabled =
                            false;

                        subscribeDetailBtn.textContent =
                            "Subscribe with Pi";

                        subscribeDetailBtn.dataset.plan =
                            plan;

                    }

                }


                // ==================================
                // SHOW DETAILS PANEL
                // ==================================

                if (
                    subscriptionDetails
                ) {

                    subscriptionDetails.classList.remove(
                        "hidden"
                    );

                }

            }
        );

    }
);


// ==========================================
// CLOSE SUBSCRIPTION DETAILS
// ==========================================

if (
    closeSubscriptionDetails
) {

    closeSubscriptionDetails.addEventListener(
        "click",
        function () {

            if (
                subscriptionDetails
            ) {

                subscriptionDetails.classList.add(
                    "hidden"
                );

            }


            if (
                subscribeDetailBtn
            ) {

                subscribeDetailBtn.style.display =
                    "";

                subscribeDetailBtn.disabled =
                    false;

                subscribeDetailBtn.textContent =
                    "Subscribe with Pi";

            }


            selectedSubscriptionPlan =
                null;

        }
    );

}


// ==========================================
// SUBSCRIBE FROM DETAILS
// ==========================================

if (
    subscribeDetailBtn
) {

    subscribeDetailBtn.addEventListener(
        "click",
        function () {

            if (
                !selectedSubscriptionPlan
            ) {

                return;

            }


            const plan =
                selectedSubscriptionPlan;


            console.log(
                "Video City: Selected subscription:",
                plan
            );


            subscribeDetailBtn.dataset.plan =
                plan;

        }
    );

}


// ==========================================
// END SUBSCRIPTION CARD DETAILS
// ==========================================

console.log(
    "MARK ACTIVE FUNCTION TYPE:",
    typeof markActiveSubscriptionCard
);
            }
);



