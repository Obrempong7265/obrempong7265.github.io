// ==========================================
// VIDEO CITY - PI LOGIN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const loginBtn =
    document.getElementById("loginBtn");

const piUser =
    document.getElementById("piUser");

const profileUsername =
    document.getElementById("profileUsername");

const profileStatus =
    document.getElementById("profileStatus");


// ==========================================
// CHECK LOGIN BUTTON
// ==========================================

if (!loginBtn) {

    console.error(
        "Video City: Login button not found."
    );

    return;
}


// ==========================================
// CHECK PI SDK
// ==========================================

if (typeof Pi === "undefined") {

    console.error(
        "Video City: Pi SDK was not found."
    );

    return;
}


// ==========================================
// UPDATE PROFILE
// ==========================================

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


// ==========================================
// PI LOGIN
// ==========================================

loginBtn.addEventListener(
    "click",
    async function () {

        loginBtn.disabled = true;

        loginBtn.textContent =
            "Connecting...";


        try {

            const scopes = [
    "username",
    "payments"
];


            function onIncompletePaymentFound(
                payment
            ) {

                console.log(
                    "Incomplete payment found:",
                    payment
                );

            }


            const auth =
                await Pi.authenticate(
                    scopes,
                    onIncompletePaymentFound
                );
            // ==========================================
// SAVE PI ACCESS TOKEN
// ==========================================

if (auth.accessToken) {

    sessionStorage.setItem(
        "videoCityPiAccessToken",
        auth.accessToken
    );

}
            


            console.log(
                "Pi authentication successful:",
                auth
            );


            if (
                !auth ||
                !auth.user ||
                !auth.user.username
            ) {

                throw new Error(
                    "Pi authentication returned no username."
                );

            }


            const username =
                auth.user.username;


            // ==================================
            // SAVE PI USER INFORMATION
            // ==================================

            sessionStorage.setItem(
                "videoCityUsername",
                username
            );


            if (auth.user.uid) {

                sessionStorage.setItem(
                    "videoCityPiUID",
                    auth.user.uid
                );

            }


            // ==================================
            // UPDATE HEADER
            // ==================================

            if (piUser) {

                piUser.textContent =
                    "@" + username;

            }


            // ==================================
            // UPDATE PROFILE
            // ==================================

            updateProfile(
                username
            );


            // ==================================
            // UPDATE LOGIN BUTTON
            // ==================================

            loginBtn.textContent =
                "Connected ✓";

            loginBtn.disabled =
                false;
            // await loadCreatorSubscriptionStatus();
            loginBtn.style.background =
                "#22c55e";
setTimeout(
    function () {
        markActiveSubscriptionCard();
    },
    1000
);
            

            console.log(
                "Video City: Pi Username:",
                username
            );


            console.log(
                "Video City: Pi UID:",
                auth.user.uid || "Not provided"
            );


        } catch (error) {

            console.error(
                "Video City: Pi Login Error:",
                error
            );


            loginBtn.disabled =
                false;

            loginBtn.textContent =
                "Login with Pi";


            if (profileStatus) {

                profileStatus.textContent =
                    "Not connected";

            }


            alert(
                "Pi Login could not be completed.\n\n" +
                "Please make sure Video City is open " +
                "inside Pi Browser and try again."
            );

        }

    }
);


// ==========================================
// RESTORE PREVIOUS LOGIN
// ==========================================

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


    loginBtn.disabled =
        false;


    loginBtn.style.background =
        "#22c55e";
    
setTimeout(
    function () {

        markActiveSubscriptionCard();

    },
    1000
);


}


console.log(
    "Video City: Login module ready."
);

});
