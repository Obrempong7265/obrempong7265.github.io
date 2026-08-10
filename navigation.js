// ==========================================
// VIDEO CITY - NAVIGATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const navButtons =
    document.querySelectorAll(".nav");

const feed =
    document.getElementById("feed");

const studio =
    document.getElementById("studio");

const profile =
    document.getElementById("profile");

// IMPORTANT:
// This matches the ID used in index.html
const profileUsername =
    document.getElementById("profileUsername");

const profileStatus =
    document.getElementById("profileStatus");


// ------------------------------------------
// SHOW PAGE
// ------------------------------------------

function showPage(page) {

    if (feed) {
        feed.classList.add("hidden");
    }

    if (studio) {
        studio.classList.add("hidden");
    }

    if (profile) {
        profile.classList.add("hidden");
    }


    // HOME

    if (page === "home") {

        if (feed) {
            feed.classList.remove("hidden");
        }

    }


    // STUDIO

    if (page === "studio") {

        if (studio) {
            studio.classList.remove("hidden");
        }

    }


    // PROFILE

    if (page === "profile") {

        if (profile) {
            profile.classList.remove("hidden");
        }

        updateProfile();

    }


    // ACTIVE BUTTON

    navButtons.forEach(function (button) {

        button.classList.remove("active");

        if (button.dataset.view === page) {

            button.classList.add("active");

        }

    });

}


// ------------------------------------------
// UPDATE PROFILE
// ------------------------------------------

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


// ------------------------------------------
// NAVIGATION BUTTONS
// ------------------------------------------

navButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const page =
                button.dataset.view;

            showPage(page);

        }
    );

});


// ------------------------------------------
// START ON HOME
// ------------------------------------------

showPage("home");

});
