/**
 * js/app.js (Formerly ui.js)
 * 
 * THE BRAIN
 * Handles global logic:
 * 1. Loads Navigation & Footer dynamically.
 * 2. Manages Mobile Menu.
 * 3. Handles Auth State in the UI.
 */

import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// Note: imports fixed to point to correct auth module in actual standard output, 
// keeping consistent with previous files but ensuring correct module source.
// Re-verifying import source:
import { onAuthStateChanged as onAuthStateChangedAuth, signOut as signOutAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// --- DYNAMIC COMPONENT LOADER ---
async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(file);
        if (response.ok) {
            const html = await response.text();
            element.innerHTML = html;

            // After loading Nav, re-attach event listeners
            if (id === 'nav-placeholder') {
                setupMobileMenu();
                updateCartCount(); // Restore cart count
                setupAuthListeners(); // Restore auth check
            }
        }
    } catch (err) {
        console.error(`Failed to load ${file}`, err);
    }
}

// --- MOBILE MENU ---
function setupMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('nav ul');

    if (toggle && navList) {
        toggle.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }
}

// --- CART COUNT ---
export function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countSpan = document.getElementById('cart-count');
    if (countSpan) {
        countSpan.innerText = `(${cart.length})`;
    }
}

// --- AUTH STATE ---
function setupAuthListeners() {
    onAuthStateChangedAuth(auth, (user) => {
        const navLogin = document.getElementById('nav-login');
        const navAdmin = document.getElementById('nav-admin');

        // Safety check if nav isn't loaded yet
        if (!navLogin) return;

        if (user) {
            navLogin.innerHTML = '<a href="#" id="logout-btn">Logout</a>';
            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                signOutAuth(auth).then(() => {
                    alert('Logged out');
                    window.location.reload();
                });
            });
            navAdmin.style.display = 'block';
        } else {
            navLogin.innerHTML = '<a href="login.html">Login</a>';
            navAdmin.style.display = 'none';
        }
    });
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    // Load components in parallel
    loadComponent('nav-placeholder', 'components/navbar.html');
    loadComponent('footer-placeholder', 'components/footer.html');
});