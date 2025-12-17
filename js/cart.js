import { updateCartCount } from './app.js';

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-container');
    const summary = document.getElementById('cart-summary');
    const totalSpan = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        summary.style.display = 'none';
        return;
    }

    summary.style.display = 'block';

    let total = 0;
    container.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
            <thead>
                <tr style="border-bottom: 2px solid var(--color-secondary);">
                    <th style="text-align: left; padding: 1rem;">Product</th>
                    <th style="padding: 1rem;">Price</th>
                    <th style="padding: 1rem;">Quantity</th>
                    <th style="padding: 1rem;">Subtotal</th>
                    <th style="padding: 1rem;">Action</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;
        return `
                        <tr style="border-bottom: 1px solid #ccc;">
                            <td style="padding: 1rem;">${item.name}</td>
                            <td style="padding: 1rem; text-align: center;">$${item.price.toFixed(2)}</td>
                            <td style="padding: 1rem; text-align: center;">${item.quantity}</td>
                            <td style="padding: 1rem; text-align: center;">$${subtotal.toFixed(2)}</td>
                            <td style="padding: 1rem; text-align: center;">
                                <button class="btn btn-secondary remove-btn" data-index="${index}" style="padding: 5px 10px; font-size: 0.8rem;">Remove</button>
                            </td>
                        </tr>
                    `;
    }).join('')}
            </tbody>
        </table>
    `;

    totalSpan.innerText = total.toFixed(2);

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', removeFromCart);
    });
}

function removeFromCart(e) {
    const index = e.target.dataset.index;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();
    loadCart();
}

document.getElementById('checkout-btn')?.addEventListener('click', () => {
    alert("Checkout functionality would integrate with a payment gateway (e.g., Stripe) here.");
});

document.addEventListener('DOMContentLoaded', loadCart);
