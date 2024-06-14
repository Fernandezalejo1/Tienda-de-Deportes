document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeModalButtons = document.querySelectorAll('.close');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const cartCountElement = document.getElementById('cart-count');
    const clearCartBtn = document.getElementById('clear-cart-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function fetchProducts() {
        fetch('products.json')
            .then(response => response.json())
            .then(products => displayProducts(products))
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    function displayProducts(products) {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button data-id="${product.id}">Agregar al Carrito</button>
            `;
            productsContainer.appendChild(productCard);
        });

        
        const addToCartButtons = document.querySelectorAll('.product-card button');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                addToCart(parseInt(id));
            });
        });
    }

    function addToCart(id) {
        fetch('products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === id);
                cart.push(product);
                updateCart();
                saveCartToStorage();
            })
            .catch(error => console.error('Error al agregar al carrito:', error));
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <p>${item.name} - $${item.price.toFixed(2)}</p>
                <button class="remove-item" data-index="${index}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalPriceElement.textContent = total.toFixed(2);
        cartCountElement.textContent = cart.length;

        
        const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                removeFromCart(parseInt(index));
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

    cartBtn.addEventListener('click', () => {
        cartModal.style.display = 'block';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            cartModal.style.display = 'none';
            checkoutModal.style.display = 'none';
        });
    });

    checkoutBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'block';
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

    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
        saveCartToStorage();
    });

    fetchProducts();
    updateCart();
});
