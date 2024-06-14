document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const closeModalButtons = document.querySelectorAll('.close');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p>${item.name} - $${item.price.toFixed(2)}</p>
                <button data-index="${index}" class="remove-item">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceElement.textContent = total.toFixed(2);

        
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                removeFromCart(index);
            });
        });
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCart();
        saveCartToStorage();
    }

    function saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
        saveCartToStorage();
    });

    checkoutBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'block';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            checkoutModal.style.display = 'none';
        });
    });

    checkoutForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        alert(`Gracias por tu compra, ${name}! Te enviaremos un email a ${email}.`);
        cart = [];
        updateCart();
        saveCartToStorage();
        checkoutModal.style.display = 'none';
    });

    updateCart();
});
