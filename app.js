// ==========================================
// VIDEO CITY - PI LOGIN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const loginBtn = document.getElementById("loginBtn");
    const piUser = document.getElementById("piUser");

    // Check that Pi SDK is available
    if (typeof Pi === "undefined") {
        console.error("Pi SDK was not found.");
        return;
    }

    // ------------------------------------------
    // PI LOGIN
    // ------------------------------------------

    loginBtn.addEventListener("click", async function () {

        loginBtn.disabled = true;
        loginBtn.textContent = "Connecting...";

        try {

            // We only request the information Video City needs
            const scopes = ["username"];

            // Handle incomplete payments later
            function onIncompletePaymentFound(payment) {
                console.log("Incomplete payment found:", payment);

                // Payment handling will be added
                // when we build the backend.
            }

            const auth = await Pi.authenticate(
                scopes,
                onIncompletePaymentFound
            );

            console.log("Pi authentication successful:", auth);

            // Get username
            const username = auth.user.username;

            // Display Pi username
            piUser.textContent = "@" + username;

            // Change login button
            loginBtn.textContent = "Connected ✓";

            loginBtn.style.background = "#22c55e";

            console.log("Pi Username:", username);

            // Save only for temporary display
            sessionStorage.setItem(
                "videoCityUsername",
                username
            );

        } catch (error) {

            console.error("Pi Login Error:", error);

            loginBtn.disabled = false;
            loginBtn.textContent = "Login with Pi";

            alert(
                "Pi Login could not be completed. " +
                "Please open Video City inside Pi Browser and try again."
            );
        }

    });


    // ------------------------------------------
    // RESTORE USERNAME ON PAGE REFRESH
    // ------------------------------------------

    const savedUsername =
        sessionStorage.getItem("videoCityUsername");

    if (savedUsername) {

        piUser.textContent =
            "@" + savedUsername;

        loginBtn.textContent =
            "Connected ✓";

        loginBtn.style.background =
            "#22c55e";
    }

});
