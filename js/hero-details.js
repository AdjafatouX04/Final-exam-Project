import { db } from './config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadHeroDetails() {
    const params = new URLSearchParams(window.location.search);
    const heroId = params.get('id');
    const container = document.getElementById('hero-detail-container');

    if (!heroId) {
        container.innerHTML = "<p>Hero not specified.</p>";
        return;
    }

    try {
        let hero = null;

        // Try Firestore first
        try {
            const docRef = doc(db, "heroes", heroId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                hero = docSnap.data();
            }
        } catch (e) {
            console.log("Firestore fetch failed, trying local JSON...");
        }

        // Fallback to JSON if not found in Firestore
        if (!hero) {
            const response = await fetch('data/heroes.json');
            const data = await response.json();
            hero = data.find(h => h.id === heroId);
        }

        if (hero) {
            renderHero(hero, container);
        } else {
            container.innerHTML = "<p>Hero not found.</p>";
        }

    } catch (error) {
        console.error("Error loading details:", error);
        container.innerHTML = "<p>Error loading story.</p>";
    }
}

function renderHero(hero, container) {
    container.innerHTML = `
        <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
            <div style="flex: 1; min-width: 300px;">
                <img src="${hero.imageUrl || 'assets/images/placeholder.jpg'}" alt="${hero.name}" style="width: 100%; border-radius: 8px; box-shadow: var(--shadow-soft);">
            </div>
            <div style="flex: 1; min-width: 300px;">
                <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">${hero.name}</h1>
                <p style="font-size: 1.1rem; margin-bottom: 2rem;">${hero.description}</p>
                
                <div class="video-container" style="margin-top: 2rem;">
                    <h3>Animated Story</h3>
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin-top: 1rem; border-radius: 8px; border: 4px solid var(--color-primary);">
                        <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                                src="${hero.videoUrl}" 
                                frameborder="0" 
                                allowfullscreen>
                        </iframe>
                    </div>
                </div>
                
                <div style="margin-top: 3rem;">
                    <h3>Related Merchandise</h3>
                    <a href="store.html" class="btn btn-primary" style="margin-top: 1rem;">View Store</a>
                </div>
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadHeroDetails);
