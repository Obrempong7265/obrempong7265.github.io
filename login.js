// ==========================================
// VIDEO CITY - PI LOGIN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const loginBtn =
    document.getElementById("loginBtn");

const piUser =
    document.getElementById("piUser");


if (!loginBtn || !piUser) {

    console.error(
        "Video City login elements were not found."
    );

    return;
}


if (typeof Pi === "undefined") {

    console.error(
        "Pi SDK was not found."
    );

    return;
}


// ------------------------------------------
// PI LOGIN
// ------------------------------------------

loginBtn.addEventListener(
    "click",
    async function () {

        loginBtn.disabled = true;

        loginBtn.textContent =
            "Connecting...";


        try {

            const scopes = [
                "username"
            ];


            function onIncompletePaymentFound(payment) {

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
                    "Pi authentication succeeded, but no username was returned."
                );

            }


            const username =
                auth.user.username;


            // Display username in header

            piUser.textContent =
                "@" + username;


            // Update login button

            loginBtn.textContent =
                "Connected ✓";

            loginBtn.style.background =
                "#22c55e";


            // Save username for this session

            sessionStorage.setItem(
                "videoCityUsername",
                username
            );


            console.log(
                "Pi Username:",
                username
            );


            // Tell the rest of Video City
            // that login was successful

            window.dispatchEvent(
                new Event("videoCityLogin")
            );


        } catch (error) {

            console.error(
                "Pi Login Error:",
                error
            );


            loginBtn.disabled = false;

            loginBtn.textContent =
                "Login with Pi";


            let message =
                "Unknown Pi authentication error.";


            if (error && error.message) {
                message = error.message;
            }


            alert(
                "PI LOGIN ERROR:\n\n" +
                message
            );

        }

    }
);


// ------------------------------------------
// RESTORE LOGIN
// ------------------------------------------

const savedUsername =
    sessionStorage.getItem(
        "videoCityUsername"
    );


if (savedUsername) {

    piUser.textContent =
        "@" + savedUsername;


    loginBtn.textContent =
        "Connected ✓";


    loginBtn.style.background =
        "#22c55e";

}

});
