import { db } from './config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function fetchHeroes() {
    const container = document.getElementById('heroes-container');
    try {
        const querySnapshot = await getDocs(collection(db, "heroes"));

        // If Firestore is empty, we might want to fall back to local JSON for the demo
        if (querySnapshot.empty) {
            // Attempt to load from local JSON
            try {
                const response = await fetch('data/heroes.json');
                const data = await response.json();
                renderHeroes(data, container);
                return;
            } catch (err) {
                console.log("Local data not found either.");
            }
        }

        const heroes = [];
        querySnapshot.forEach((doc) => {
            heroes.push({ id: doc.id, ...doc.data() });
        });

        renderHeroes(heroes, container);

    } catch (error) {
        console.error("Error fetching heroes:", error);
        container.innerHTML = "<p>Error loading heroes. Please try again later.</p>";
    }
}

function renderHeroes(heroes, container) {
    if (heroes.length === 0) {
        container.innerHTML = "<p>No heroes found.</p>";
        return;
    }

    container.innerHTML = heroes.map(hero => `
        <div class="card">
            <img src="${hero.imageUrl || 'assets/images/placeholder.jpg'}" alt="${hero.name}">
            <div class="card-content">
                <h3>${hero.name}</h3>
                <p>${hero.shortDescription}</p>
                <br>
                <a href="hero-details.html?id=${hero.id}" class="btn btn-secondary">Read Story</a>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', fetchHeroes);
