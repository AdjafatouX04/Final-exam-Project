/**
 * HERITAGE & HEROES STORE LOGIC
 * Phases 2, 3, & 4
 */

// --- PHASE 2: INVENTORY DATA ---
const PRODUCTS = [
    // Sundiata Keita (Value: Resilience)
    { id: 101, hero: 'Sundiata Keita', type: 'T-Shirt', value: 'Resilience', priceUSD: 25, priceFCFA: 15000, img: 'shirt' },
    { id: 102, hero: 'Sundiata Keita', type: 'Poster', value: 'Resilience', priceUSD: 15, priceFCFA: 9000, img: 'poster' },

    // Mansa Musa (Value: Wealth & Wisdom)
    { id: 201, hero: 'Mansa Musa', type: 'Hoodie', value: 'Prosperity', priceUSD: 45, priceFCFA: 27000, img: 'hoodie' },
    { id: 202, hero: 'Mansa Musa', type: 'Tote Bag', value: 'Wisdom', priceUSD: 20, priceFCFA: 12000, img: 'bag' },

    // Shaka Zulu (Value: Strategy)
    { id: 301, hero: 'Shaka Zulu', type: 'T-Shirt', value: 'Strategy', priceUSD: 25, priceFCFA: 15000, img: 'shirt' },

    // Queen Amina (Value: Leadership)
    { id: 401, hero: 'Queen Amina', type: 'T-Shirt', value: 'Leadership', priceUSD: 25, priceFCFA: 15000, img: 'shirt' },

    // Yaa Asantewaa (Value: Courage)
    { id: 501, hero: 'Yaa Asantewaa', type: 'T-Shirt', value: 'Courage', priceUSD: 25, priceFCFA: 15000, img: 'shirt' },

    // Thomas Sankara (Value: Integrity)
    { id: 601, hero: 'Thomas Sankara', type: 'Cap', value: 'Integrity', priceUSD: 20, priceFCFA: 12000, img: 'cap' },
    { id: 602, hero: 'Thomas Sankara', type: 'Poster', value: 'Revolution', priceUSD: 15, priceFCFA: 9000, img: 'poster' },

    // Nelson Mandela (Value: Peace)
    { id: 701, hero: 'Nelson Mandela', type: 'T-Shirt', value: 'Peace', priceUSD: 25, priceFCFA: 15000, img: 'shirt' },

    // Haile Selassie (Value: Sovereignty)
    { id: 801, hero: 'Haile Selassie', type: 'Hoodie', value: 'Sovereignty', priceUSD: 45, priceFCFA: 27000, img: 'hoodie' },

    // Samory Touré (Value: Resistance)
    { id: 901, hero: 'Samory Touré', type: 'Bottle', value: 'Resistance', priceUSD: 18, priceFCFA: 10800, img: 'bottle' },

    // Others
    { id: 1001, hero: 'Toussaint Louverture', type: 'Poster', value: 'Freedom', priceUSD: 15, priceFCFA: 9000, img: 'poster' },
    { id: 1101, hero: 'Lat Dior', type: 'T-Shirt', value: 'Honor', priceUSD: 25, priceFCFA: 15000, img: 'shirt' },
    { id: 1201, hero: 'Cheikh Ahmadou Bamba', type: 'Book', value: 'Faith', priceUSD: 20, priceFCFA: 12000, img: 'book' },
    { id: 1301, hero: 'Aline Sitoe Diatta', type: 'Tote Bag', value: 'Dignity', priceUSD: 20, priceFCFA: 12000, img: 'bag' }
];

// --- APP STATE ---
let state = {
    currency: 'USD', // or 'FCFA'
    filterHero: 'All',
    filterType: 'All',
    cart: JSON.parse(localStorage.getItem('heritage_cart')) || []
};

// --- DOM ELEMENTS ---
const grid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const currencyBtn = document.getElementById('currency-btn');

// --- INITIALIZATION ---
function init() {
    renderProducts();
    updateCartUI();
    setupFilters();
}

// --- RENDER LOGIC ---
function renderProducts() {
    grid.innerHTML = '';

    const filtered = PRODUCTS.filter(p => {
        const heroMatch = state.filterHero === 'All' || p.hero === state.filterHero;
        const typeMatch = state.filterType === 'All' || p.type === state.filterType;
        return heroMatch && typeMatch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No artifacts found matching these criteria.</p>';
        return;
    }

    filtered.forEach(p => {
        const price = state.currency === 'USD' ? `$${p.priceUSD}` : `${p.priceFCFA.toLocaleString()} FCFA`;
        const card = document.createElement('article');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="images/product-${p.id}.jpg" 
                     class="card-img" 
                     alt="${p.hero} ${p.type}"
                     onerror="this.src='https://placehold.co/300x300/3E2723/FFF8E1?text=${p.type}'">
            </div>
            <div class="card-body">
                <div class="hero-value">${p.value}</div>
                <h3 style="font-size: 1rem; font-weight: bold; margin: 0;">${p.hero}</h3>
                <p style="color: #666; font-size: 0.9rem;">${p.type}</p>
                <div class="price">${price}</div>
                <button onclick="addToCart(${p.id})" class="btn-add">ADD TO CART</button>
                <a href="index.html" class="learn-link">Who is ${p.hero}?</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- CART LOGIC ---
function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    state.cart.push(product);
    localStorage.setItem('heritage_cart', JSON.stringify(state.cart));
    updateCartUI();

    // Feedback
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "ADDED!";
    btn.style.background = "#FFD700";
    btn.style.color = "#3E2723";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
        btn.style.color = "";
    }, 1000);
}

function updateCartUI() {
    cartCount.innerText = state.cart.length;
}

// --- FILTERS ---
function setupFilters() {
    // Populate Hero List (Unique)
    const heroes = [...new Set(PRODUCTS.map(p => p.hero))];
    const heroList = document.getElementById('hero-filters');

    heroes.forEach(h => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.innerText = h;
        btn.onclick = () => {
            // Remove active class from all
            document.querySelectorAll('#hero-filters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.filterHero = h;
            renderProducts();
        };
        heroList.appendChild(btn);
    });
}

function filterByType(type) {
    state.filterType = type;
    document.querySelectorAll('#type-filters .filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderProducts();
}

// --- CURRENCY TOGGLE ---
currencyBtn.addEventListener('click', () => {
    state.currency = state.currency === 'USD' ? 'FCFA' : 'USD';
    currencyBtn.innerText = `Currency: ${state.currency}`;
    renderProducts();
});

// Run
document.addEventListener('DOMContentLoaded', init);

// Expose functions globally for HTML onclicks
window.addToCart = addToCart;
window.filterByType = filterByType;
