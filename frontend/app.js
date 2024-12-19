const API_BASE_URL = "http://localhost:5000/api";
let token = null;
let userRole = null;

// Fetch Events and Display
async function fetchEvents() {
    const res = await fetch(`${API_BASE_URL}/events`);
    const events = await res.json();

    const eventsContainer = document.getElementById("events-container");
    eventsContainer.innerHTML = "";

    events.forEach(event => {
        eventsContainer.innerHTML += `
            <div class="event-card">
                <img src="${event.image}" alt="${event.name}">
                <h3>${event.name}</h3>
                <p>Date: ${event.date}</p>
                <p class="fee">Fee: Rs. ${event.fee}</p>
            </div>
        `;
    });
}

// Login Function
async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            token = data.token;
            userRole = data.role;

            alert(`Login successful as ${userRole}`);
            fetchEvents();
        } else {
            document.getElementById("login-error").innerText = data.message;
        }
    } catch (error) {
        console.error("Login Error:", error);
    }
}

// Initialize Events on Page Load
document.addEventListener("DOMContentLoaded", fetchEvents);
