// ==========================================
// VIDEO CITY - PI LOGIN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const loginBtn = document.getElementById("loginBtn");
const piUser = document.getElementById("piUser");

const profileUsername =
    document.getElementById("profileUsername");

const profileStatus =
    document.getElementById("profileStatus");


// Check Pi SDK

if (typeof Pi === "undefined") {

    console.error("Pi SDK was not found.");

    return;
}


// ------------------------------------------
// UPDATE PROFILE
// ------------------------------------------

function updateProfile(username) {

    if (profileUsername) {

        profileUsername.textContent =
            "@" + username;

    }

    if (profileStatus) {

        profileStatus.textContent =
            "Connected ✓";

    }

}


// ------------------------------------------
// PI LOGIN
// ------------------------------------------

loginBtn.addEventListener("click", async function () {

    loginBtn.disabled = true;

    loginBtn.textContent =
        "Connecting...";


    try {

        const scopes = ["username"];


        function onIncompletePaymentFound(payment) {

            console.log(
                "Incomplete payment found:",
                payment
            );

        }


        const auth = await Pi.authenticate(
            scopes,
            onIncompletePaymentFound
        );


        console.log(
            "Pi authentication successful:",
            auth
        );


        const username =
            auth.user.username;


        // Header username

        if (piUser) {

            piUser.textContent =
                "@" + username;

        }


        // Profile username

        updateProfile(username);


        // Login button

        loginBtn.textContent =
            "Connected ✓";


        loginBtn.style.background =
            "#22c55e";


        console.log(
            "Pi Username:",
            username
        );


        // Save username

        sessionStorage.setItem(
            "videoCityUsername",
            username
        );


    } catch (error) {

        console.error(
            "Pi Login Error:",
            error
        );


        loginBtn.disabled = false;

        loginBtn.textContent =
            "Login with Pi";


        if (profileStatus) {

            profileStatus.textContent =
                "Not connected";

        }


        alert(
            "Pi Login could not be completed. " +
            "Please open Video City inside Pi Browser " +
            "and try again."
        );

    }

});


// ------------------------------------------
// RESTORE LOGIN
// ------------------------------------------

const savedUsername =
    sessionStorage.getItem(
        "videoCityUsername"
    );


if (savedUsername) {

    if (piUser) {

        piUser.textContent =
            "@" + savedUsername;

    }


    updateProfile(
        savedUsername
    );


    loginBtn.textContent =
        "Connected ✓";


    loginBtn.style.background =
        "#22c55e";

}

});
