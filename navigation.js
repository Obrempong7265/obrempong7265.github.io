// ==========================================
// VIDEO CITY - NAVIGATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const navButtons =
    document.querySelectorAll(".nav");


const feed =
    document.getElementById("feed");


const upload =
    document.getElementById("upload");


const studio =
    document.getElementById("studio");


const profile =
    document.getElementById("profile");
    const settings =
    document.getElementById("settings");


const profileUsername =
    document.getElementById("profileUsername");


const profileStatus =
    document.getElementById("profileStatus");



// ==========================================
// SHOW PAGE
// ==========================================

function showPage(page) {


    // Hide all pages

    if (feed) {
        feed.classList.add("hidden");
    }


    if (upload) {
        upload.classList.add("hidden");
    }


    if (studio) {
        studio.classList.add("hidden");
    }


    if (profile) {
        profile.classList.add("hidden");
    }



    // ======================================
    // HOME
    // ======================================

    if (page === "home") {

        if (feed) {

            feed.classList.remove(
                "hidden"
            );

        }

    }



    // ======================================
    // UPLOAD
    // ======================================

    if (page === "upload") {

        if (upload) {

            upload.classList.remove(
                "hidden"
            );

        }

    }



    // ======================================
    // STUDIO
    // ======================================

    if (page === "studio") {

    if (studio) {

        studio.classList.remove(
            "hidden"
        );

    }


    if (
        typeof loadCreatorStudio ===
        "function"
    ) {

        loadCreatorStudio();

    }

    }



    // ======================================
    // PROFILE
    // ======================================

    if (page === "profile") {

        if (profile) {

            profile.classList.remove(
                "hidden"
            );

        }

        updateProfile();

    }
    // ======================================
// SETTINGS
// ======================================

if (page === "settings") {

    if (settings) {

        settings.classList.remove(
            "hidden"
        );

    }

}



    // ======================================
    // ACTIVE NAVIGATION BUTTON
    // ======================================

    navButtons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.view === page
            ) {

                button.classList.add(
                    "active"
                );

            }

        }
    );

}



// ==========================================
// UPDATE PROFILE
// ==========================================

function updateProfile() {


    const username =
        sessionStorage.getItem(
            "videoCityUsername"
        );


    if (username) {


        if (profileUsername) {

            profileUsername.textContent =
                "@" + username;

        }


        if (profileStatus) {

            profileStatus.textContent =
                "Connected ✓";

        }


    } else {


        if (profileUsername) {

            profileUsername.textContent =
                "Not connected";

        }


        if (profileStatus) {

            profileStatus.textContent =
                "Not connected";

        }

    }

}



// ==========================================
// NAVIGATION BUTTONS
// ==========================================

navButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const page =
                    button.dataset.view;


                showPage(page);

            }
        );

    }
);
// ==========================================
// SETTINGS BUTTON
// ==========================================

const settingsBtn =
    document.getElementById(
        "settingsBtn"
    );


if (settingsBtn) {

    settingsBtn.addEventListener(
        "click",
        function () {

            showPage("settings");

        }
    );

}


// ==========================================
// START ON HOME
// ==========================================

showPage("home");

});
