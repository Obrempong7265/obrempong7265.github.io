// ==========================================
// VIDEO CITY - SEARCH
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
        // CHECK SEARCH ELEMENTS
        // ==========================================

        console.log(
            "Video City: Search module loaded."
        );


        // ==========================================
        // SEARCH BUTTON
        // ==========================================

        if (searchBtn) {

            searchBtn.addEventListener(
                "click",
                function () {

                    const searchPage =
                        document.getElementById(
                            "search"
                        );

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
                function () {

                    const query =
                        searchInput.value.trim();


                    if (!query) {

                        searchResults.innerHTML =
                            "";

                        return;

                    }


                    searchResults.innerHTML = `

                        <div class="search-empty">

                            Searching for
                            "<strong>
                                ${query}
                            </strong>"

                        </div>

                    `;

                }
            );

        }

    }
);
