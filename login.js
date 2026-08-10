// ==========================================
// VIDEO CITY - PI LOGIN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const loginBtn = document.getElementById("loginBtn");
const piUser = document.getElementById("piUser");

if (!loginBtn || !piUser) {
    console.error("Login elements not found.");
    return;
}

if (typeof Pi === "undefined") {
    console.error("Pi SDK was not found.");
    return;
}

loginBtn.addEventListener("click", async function () {

    loginBtn.disabled = true;
    loginBtn.textContent = "Connecting...";

    try {

        const scopes = ["username"];

        function onIncompletePaymentFound(payment) {
            console.log("Incomplete payment found:", payment);
        }

        const auth = await Pi.authenticate(
            scopes,
            onIncompletePaymentFound
        );

        console.log("FULL PI AUTH RESPONSE:", auth);

        // Get the authenticated Pi user
        const user = auth.user;

        if (!user) {
            throw new Error(
                "Pi authentication succeeded, but no user information was returned."
            );
        }

        console.log("PI USER:", user);

        // Get username safely
        const username = user.username;

        if (!username) {
            throw new Error(
                "Pi authentication succeeded, but Pi did not return a username."
            );
        }

        // Display username
        piUser.textContent = "@" + username;

        // Update button
        loginBtn.textContent = "Connected ✓";
        loginBtn.style.background = "#22c55e";

        // Save username temporarily
        sessionStorage.setItem(
            "videoCityUsername",
            username
        );

        console.log(
            "Video City Pi username:",
            username
        );

    } catch (error) {

        console.error("PI LOGIN ERROR:", error);

        loginBtn.disabled = false;
        loginBtn.textContent = "Login with Pi";

        let message = "Unknown Pi authentication error.";

        if (error && error.message) {
            message = error.message;
        }

        alert("PI LOGIN ERROR:\n\n" + message);
    }
});


// Restore username after page refresh
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
