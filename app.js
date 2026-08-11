document.addEventListener("DOMContentLoaded", async function () {

    const supabaseClient = window.supabaseClient;

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


                    <div
                        class="commentList">
                    </div>

                </div>

            </div>

        `;


        // ======================================
        
// ======================================
// LIKE
// ======================================

const likeButton =
    card.querySelector(".likeBtn");


const span =
    likeButton.querySelector("span");


let liked = false;


// ======================================
// LOAD LIKE STATUS
// ======================================

async function loadLikeStatus() {

    // Sample videos don't have a database ID
    if (!video.id) {
        return;
    }


    const username =
        sessionStorage.getItem(
            "videoCityUsername"
        );


    if (!username) {
        return;
    }


    const {
        data: creator,
        error: creatorError
    } =
        await supabaseClient
            .from("creators")
            .select("id")
            .eq(
                "username",
                username
            )
            .maybeSingle();


    if (creatorError || !creator) {
        return;
    }


    const {
        data: existingLike
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


    liked =
        !!existingLike;


    updateLikeButton();

}


// ======================================
// UPDATE BUTTON
// ======================================

function updateLikeButton() {

    const currentLikes =
        Number(
            span.textContent
        ) || 0;


    likeButton.innerHTML =
        liked
        ?
        `♥ <span>${currentLikes}</span>`
        :
        `♡ <span>${currentLikes}</span>`;

}


// ======================================
// LIKE / UNLIKE
// ======================================

likeButton.addEventListener(
    "click",
    async function () {

        if (!video.id) {

            // Sample video
            liked = !liked;

            updateLikeButton();

            return;

        }


        const username =
            sessionStorage.getItem(
                "videoCityUsername"
            );


        if (!username) {

            alert(
                "Please login to like videos."
            );

            return;

        }


        const {
            data: creator,
            error: creatorError
        } =
            await supabaseClient
                .from("creators")
                .select("id")
                .eq(
                    "username",
                    username
                )
                .maybeSingle();


        if (creatorError || !creator) {

            console.error(
                "Creator not found:",
                creatorError
            );

            return;

        }


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

                return;

            }


            liked = true;


        } else {

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
        // GET CURRENT LIKE COUNT
        // ==================================

        const {
            count
        } =
            await supabaseClient
                .from("video_likes")
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


        const totalLikes =
            count || 0;


        span.textContent =
            totalLikes;


        // Keep videos.likes synchronized
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


        updateLikeButton();

    }
);


// Load current like status
loadLikeStatus();
        // ======================================
        // ======================================
// COMMENT BUTTON
// ======================================

const commentButton =
    card.querySelector(".commentBtn");

const comments =
    card.querySelector(".comments");

const form =
    card.querySelector(".commentForm");

const input =
    form.querySelector("textarea");

const commentList =
    card.querySelector(".commentList");


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


    data.forEach(
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
            sessionStorage.getItem(
                "videoCityUsername"
            );


        if (!username) {

            alert(
                "Please login to comment."
            );

            return;

        }


        const {
            data: creator,
            error: creatorError
        } =
            await supabaseClient
                .from("creators")
                .select("id, username")
                .eq(
                    "username",
                    username
                )
                .maybeSingle();


        if (
            creatorError ||
            !creator
        ) {

            console.error(
                "Creator lookup failed:",
                creatorError
            );

            return;

        }


        const {
            data: newComment,
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
            );

            return;

        }


        renderComment(
            newComment,
            commentList
        );


        input.value = "";

    }
);


// ======================================
// RENDER COMMENT
// ======================================

function renderComment(
    comment,
    list
) {

    const commentElement =
        document.createElement(
            "div"
        );


    commentElement.className =
        "comment";


    const username =
        comment.creators &&
        comment.creators.username
        ?
        "@" +
        comment.creators.username
        :
        "@User";


    commentElement.innerHTML = `

        <strong>
            ${escapeHTML(username)}
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

            <textarea
                maxlength="500"
                placeholder="Write a reply..."
                rows="2"></textarea>


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


    // ==================================
    // REPLY BUTTON
    // ==================================

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
        async function () {

            replyBox.style.display =
                replyBox.style.display === "none"
                ? "block"
                : "none";


            if (
                replyBox.style.display ===
                "block"
            ) {

                await loadReplies(
                    comment.id,
                    commentElement
                );

            }

        }
    );


    // ==================================
    // REPLY
    // ==================================

    const replyInput =
        replyBox.querySelector(
            "textarea"
        );


    const replySubmit =
        replyBox.querySelector(
            ".replySubmit"
        );


    replySubmit.addEventListener(
        "click",
        async function () {

            const replyText =
                replyInput.value.trim();


            if (!replyText) {
                return;
            }


            const username =
                sessionStorage.getItem(
                    "videoCityUsername"
                );


            if (!username) {

                alert(
                    "Please login to reply."
                );

                return;

            }


            const {
                data: creator,
                error: creatorError
            } =
                await supabaseClient
                    .from("creators")
                    .select("id")
                    .eq(
                        "username",
                        username
                    )
                    .maybeSingle();


            if (
                creatorError ||
                !creator
            ) {

                console.error(
                    "Creator lookup failed:",
                    creatorError
                );

                return;

            }


            const {
                data: newReply,
                error
            } =
                await supabaseClient
                    .from("replies")
                    .insert({

                        comment_id:
                            comment.id,

                        creator_id:
                            creator.id,

                        text:
                            replyText

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
                    "Reply failed:",
                    error
                );

                alert(
                    "Reply failed. Please try again."
                );

                return;

            }


            renderReply(
                newReply,
                commentElement
            );


            replyInput.value = "";

        }
    );

}


// ======================================
// LOAD REPLIES
// ======================================

async function loadReplies(
    commentId,
    commentElement
) {

    const replyList =
        commentElement.querySelector(
            ".replyList"
        );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("replies")
            .select(`
                id,
                text,
                created_at,
                creators (
                    username
                )
            `)
            .eq(
                "comment_id",
                commentId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Replies load failed:",
            error
        );

        return;

    }


    replyList.innerHTML = "";


    data.forEach(
        function (reply) {

            renderReply(
                reply,
                commentElement
            );

        }
    );

}


// ======================================
// RENDER REPLY
// ======================================

function renderReply(
    reply,
    commentElement
) {

    const replyList =
        commentElement.querySelector(
            ".replyList"
        );


    const replyElement =
        document.createElement(
            "div"
        );


    replyElement.className =
        "reply";


    const username =
        reply.creators &&
        reply.creators.username
        ?
        "@" +
        reply.creators.username
        :
        "@User";


    replyElement.innerHTML = `

        <strong>
            ${escapeHTML(username)}
        </strong>

        <p>
            ${escapeHTML(reply.text)}
        </p>

    `;


    replyList.appendChild(
        replyElement
    );

}


// ======================================
// LOAD COMMENTS WHEN CARD IS CREATED
// ======================================

loadComments();


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
// SHOW SAMPLE VIDEOS
// ======================================

sampleVideos.forEach(
    function (video) {

        createVideo(
            video
        );

    }
);


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
