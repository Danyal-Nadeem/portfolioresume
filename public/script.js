document.addEventListener("DOMContentLoaded", () => {

    // --------------- NAVBAR ACTIVE LINK ----------------
    const navLinks = document.querySelectorAll(".top-bar nav a");
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            navLinks.forEach(l => l.classList.remove("active"));
            this.classList.add("active");
        });
    });

    // --------------- CONTACT FORM ----------------
    const form = document.getElementById("contactForm");

    // Create a paragraph to show messages dynamically
    let formMessage = document.createElement("p");
    formMessage.id = "formMessage";
    formMessage.style.marginTop = "10px";
    form.appendChild(formMessage);

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const message = form.message.value.trim();

        if (!name || !email || !message) {
            formMessage.style.color = "red";
            formMessage.textContent = "❌ Please fill in all fields.";
            return;
        }

        formMessage.style.color = "blue";
        formMessage.textContent = "⏳ Sending message...";

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await response.json();

            if (data.success) {
                formMessage.style.color = "green";
                formMessage.textContent = "✅ Message sent successfully!";
                form.reset();

                setTimeout(() => { formMessage.textContent = ""; }, 5000);
            } else {
                formMessage.style.color = "red";
                formMessage.textContent = "❌ Error: " + (data.error || "Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            formMessage.style.color = "red";
            formMessage.textContent = "❌ Unable to send message. Try again later.";
        }
    });
});
