
document.addEventListener("DOMContentLoaded", () => {
    const subscribeBtn = document.getElementById("newsletter-btn");
    const emailInput = document.getElementById("emailSub");
    subscribeBtn.addEventListener("click", async () => {
        const email = emailInput.value.trim();
        if (!email) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!emailInput.checkValidity()) {
            emailInput.reportValidity();
            return;
        }
        subscribeBtn.disabled = true;
        subscribeBtn.textContent = "Subscribing...";
        const fetchNews = await fetch("http://localhost:3002/newsletter");
        const news = await fetchNews.json();
    
        const newsId = news.length > 0 
        ? Math.max(...news.map(r => parseInt(r.id) || 0)) + 1 
        : 1;
        try {
            const response = await fetch("http://localhost:3002/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: String(newsId),
                    email: email, 
                    subscribedAt: new Date().toISOString()
                    }),
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Subscription failed");
            }

            alert("Thanks for subscribing to our newsletter!");
            emailInput.value = "";
        } catch (error) {
            alert(`${error.message}`);
        } finally {
            subscribeBtn.disabled = false;
            subscribeBtn.textContent = "Subscribe";
        }
    });
});
