import { auth, db } from './config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Layout Elements
const loginScreen = document.getElementById('admin-login-screen');
const dashboard = document.getElementById('admin-dashboard');

// check Auth
onAuthStateChanged(auth, (user) => {
    if (user) {
        // In a real app we would check for admin claims
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        loadHeroes();
        loadProducts();
    } else {
        loginScreen.style.display = 'block';
        dashboard.style.display = 'none';
    }
});

document.getElementById('logout-btn-admin').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "index.html");
});

// --- HEROES ---

const heroForm = document.getElementById('add-hero-form');
heroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newHero = {
        name: document.getElementById('hero-name').value,
        shortDescription: document.getElementById('hero-short-desc').value,
        description: document.getElementById('hero-desc').value,
        imageUrl: document.getElementById('hero-image').value,
        videoUrl: document.getElementById('hero-video').value
    };

    try {
        await addDoc(collection(db, "heroes"), newHero);
        alert("Hero added!");
        heroForm.reset();
        loadHeroes();
    } catch (e) {
        alert("Error adding hero: " + e.message);
    }
});

async function loadHeroes() {
    const list = document.getElementById('heroes-list');
    list.innerHTML = 'Loading...';

    const querySnapshot = await getDocs(collection(db, "heroes"));
    list.innerHTML = '';

    querySnapshot.forEach((docSnap) => {
        const item = docSnap.data();
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <span>${item.name}</span>
            <button class="btn-delete" data-id="${docSnap.id}">Delete</button>
        `;
        list.appendChild(div);
    });

    // Add listeners
    document.querySelectorAll('#heroes-list .btn-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm('Delete this hero?')) {
                await deleteDoc(doc(db, "heroes", e.target.dataset.id));
                loadHeroes();
            }
        });
    });
}


// --- PRODUCTS ---

const prodForm = document.getElementById('add-product-form');
prodForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newProd = {
        name: document.getElementById('prod-name').value,
        price: parseFloat(document.getElementById('prod-price').value),
        category: document.getElementById('prod-category').value,
        imageUrl: document.getElementById('prod-image').value
    };

    try {
        await addDoc(collection(db, "products"), newProd);
        alert("Product added!");
        prodForm.reset();
        loadProducts();
    } catch (e) {
        alert("Error adding product: " + e.message);
    }
});

async function loadProducts() {
    const list = document.getElementById('products-list');
    list.innerHTML = 'Loading...';

    const querySnapshot = await getDocs(collection(db, "products"));
    list.innerHTML = '';

    querySnapshot.forEach((docSnap) => {
        const item = docSnap.data();
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
            <span>${item.name} ($${item.price})</span>
            <button class="btn-delete" data-id="${docSnap.id}">Delete</button>
        `;
        list.appendChild(div);
    });

    document.querySelectorAll('#products-list .btn-delete').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (confirm('Delete this product?')) {
                await deleteDoc(doc(db, "products", e.target.dataset.id));
                loadProducts();
            }
        });
    });
}
