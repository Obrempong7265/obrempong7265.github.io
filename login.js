// ==========================================
// VIDEO CITY - PI LOGIN
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const loginBtn = document.getElementById("loginBtn");
    const piUser = document.getElementById("piUser");

    if (!loginBtn || !piUser) {
        console.error("Video City login elements were not found.");
        return;
    }

    if (typeof Pi === "undefined") {
        console.error("Pi SDK was not found.");
        alert("Pi SDK was not found.");
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

            console.log("Pi authentication successful:", auth);

            const username = auth.user.username;

            piUser.textContent = "@" + username;

            loginBtn.textContent = "Connected ✓";

            loginBtn.style.background = "#22c55e";

            sessionStorage.setItem(
                "videoCityUsername",
                username
            );

        } catch (error) {

            console.error("Pi Login Error:", error);

            loginBtn.disabled = false;
            loginBtn.textContent = "Login with Pi";

            let message = "Unknown Pi authentication error.";

            if (error) {
                if (error.message) {
                    message = error.message;
                } else if (typeof error === "string") {
                    message = error;
                } else {
                    try {
                        message = JSON.stringify(error);
                    } catch (e) {
                        message = String(error);
                    }
                }
            }

            alert("PI LOGIN ERROR:\n\n" + message);
        }
    });


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
