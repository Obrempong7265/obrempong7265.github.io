// ==========================================
// VIDEO CITY - SEARCH MODULE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ==========================================
        // SEARCH ELEMENTS
        // ==========================================

        const searchBtn =
            document.getElementById(
                "searchBtn"
            );

        const searchPage =
            document.getElementById(
                "search"
            );

        const searchInput =
            document.getElementById(
                "searchInput"
            );

        const searchResults =
            document.getElementById(
                "searchResults"
            );

        const searchFilters =
            document.querySelectorAll(
                ".search-filter"
            );


        // ==========================================
        // SEARCH BUTTON
        // ==========================================

        if (searchBtn) {

            searchBtn.addEventListener(
                "click",
                function () {

                    if (searchPage) {

                        searchPage.classList.remove(
                            "hidden"
                        );

                    }

                    if (searchInput) {

                        searchInput.focus();

                    }

                }
            );

        }


        // ==========================================
        // SEARCH FILTERS
        // ==========================================

        searchFilters.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        searchFilters.forEach(
                            function (filter) {

                                filter.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        // Re-run current search
                        if (
                            searchInput &&
                            searchInput.value.trim()
                        ) {

                            searchInput.dispatchEvent(
                                new Event("input")
                            );

                        }

                    }
                );

            }
        );


        // ==========================================
        // SEARCH INPUT
        // ==========================================

        if (
            searchInput &&
            searchResults
        ) {

            searchInput.addEventListener(
                "input",
                async function () {

                    const query =
                        searchInput.value.trim();


                    // ==========================================
                    // EMPTY SEARCH
                    // ==========================================

                    if (!query) {

                        searchResults.innerHTML =
                            "";

                        return;

                    }


                    // ==========================================
                    // GET ACTIVE FILTER
                    // ==========================================

                    const activeFilter =
                        document.querySelector(
                            ".search-filter.active"
                        );


                    const searchType =
                        activeFilter
                            ? activeFilter.dataset.searchType
                            : "all";


                    // ==========================================
                    // CURRENTLY SEARCH VIDEOS
                    // ==========================================

                    if (
                        searchType !== "all" &&
                        searchType !== "videos"
                    ) {

                        searchResults.innerHTML = `

                            <div class="search-empty">

                                Search for
                                <strong>
                                    ${searchType}
                                </strong>
                                is coming soon.

                            </div>

                        `;

                        return;

                    }


                    // ==========================================
                    // SEARCHING
                    // ==========================================

                    searchResults.innerHTML = `

                        <div class="search-empty">

                            Searching...

                        </div>

                    `;


                    // ==========================================
                    // SUPABASE
                    // ==========================================

                    const supabaseClient =
                        window.supabaseClient;


                    if (!supabaseClient) {

                        searchResults.innerHTML = `

                            <div class="search-empty">

                                Unable to connect to Video City.

                            </div>

                        `;

                        return;

                    }


                    // ==========================================
                    // SEARCH DATABASE
                    // ==========================================

                    try {

                        const {
                            data: videos,
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
                                    cover_url,
                                    media_type,
                                    views,
                                    likes,
                                    created_at,
                                    creators (
                                        username
                                    )
                                `)
                                .or(
                                    `title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`
                                )
                                .order(
                                    "created_at",
                                    {
                                        ascending: false
                                    }
                                );


                        // ==========================================
                        // DATABASE ERROR
                        // ==========================================

                        if (error) {

                            console.error(
                                "Video City: Search error:",
                                error
                            );

                            searchResults.innerHTML = `

                                <div class="search-empty">

                                    Unable to complete search.

                                </div>

                            `;

                            return;

                        }


                        // ==========================================
                        // NO RESULTS
                        // ==========================================

                        if (
                            !videos ||
                            videos.length === 0
                        ) {

                            searchResults.innerHTML = `

                                <div class="search-empty">

                                    No videos found for
                                    "<strong>
                                        ${query}
                                    </strong>"

                                </div>

                            `;

                            return;

                        }


                        // ==========================================
                        // DISPLAY RESULTS
                        // ==========================================

                        searchResults.innerHTML =
                            videos
                                .map(
                                    function (video) {

                                        const creatorUsername =
                                            video.creators &&
                                            video.creators.username
                                                ? video.creators.username
                                                : "Unknown creator";


                                        const cover =
                                            video.cover_url ||
                                            "";


                                        const price =
                                            Number(
                                                video.price_pi
                                            ) || 0;


                                        return `

                                            <div
                                                class="search-result-card"
                                                data-video-id="${video.id}">

                                                ${
                                                    cover
                                                        ? `
                                                            <img
                                                                class="search-result-image"
                                                                src="${cover}"
                                                                alt="Video cover"
                                                            >
                                                        `
                                                        :
                                                        `
                                                            <div
                                                                class="search-result-image search-result-placeholder">

                                                                🎬

                                                            </div>
                                                        `
                                                }


                                                <div
                                                    class="search-result-info">

                                                    <p
                                                        class="search-result-title">

                                                        ${video.title || "Untitled video"}

                                                    </p>


                                                    <p
                                                        class="search-result-meta">

                                                        @${creatorUsername}

                                                    </p>


                                                    <span
                                                        class="search-result-type">

                                                        🎬 Video

                                                    </span>

                                                </div>


                                                ${
                                                    price > 0
                                                        ? `
                                                            <span
                                                                class="search-result-price">

                                                                ${price} Pi

                                                            </span>
                                                        `
                                                        :
                                                        ""
                                                }

                                            </div>

                                        `;

                                    }
                                )
                                .join("");


                    } catch (error) {

                        console.error(
                            "Video City: Search exception:",
                            error
                        );


                        searchResults.innerHTML = `

                            <div class="search-empty">

                                Something went wrong while searching.

                            </div>

                        `;

                    }

                }
            );

        }


        // ==========================================
        // SEARCH MODULE READY
        // ==========================================

        console.log(
            "Video City: Search module ready."
        );

    }
);
