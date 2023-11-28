const cartProducts = document.querySelector('.product-list')
const totalNumber = document.getElementById('total-number')
const cartData = JSON.parse(localStorage.getItem('cart')) || []
const cartContainer = document.querySelector('.cart')
const buyBtn = document.querySelector('.buy-btn')
const cartFooter = document.querySelector('.cart-footer')
cartProducts.innerHTML = ''
cartProducts.style.animationName = 'none'
function renderCart() {
    cartProducts.innerHTML = ''
    let totalPrice = 0
    cartData.forEach((product, index) => {
        const cartItem = document.createElement('div')
        cartItem.classList.add('product')
        cartItem.style.transform = 'none'
        cartItem.innerHTML = `
        <div class="product-header">
            <span class="badge">${product.category}</span>
            <h2>${product.title}</h2>
        </div>
        <img class="product-img" src=${product.thumbnail}>
        <div class="product-footer">
            <div class="product-footer-left">
                <h2>$${product.price} <span class="strikethrough">$${Math.round(product.price/(1-product.discountPercentage*0.01))}</span></h2>
                <h4><span class="badge"><img src="img/star.svg"> ${product.rating}</span>
                <span class="badge">${product.stock} in stock</span></h4>
            </div>
            <div class="product-quantity">
                <input class="items-number" type="number" id="quantity" name="quantity" min="1" max="${product.stock}" value="${product.quantity}" data-index="${index}">
                <p>items</p>
            </div>
            <button class="removeFromCart" data-index="${index}"><img src="img/delete.svg" alt="remove from cart"></button>
        </div>`
        totalPrice += product.price * product.quantity
        cartProducts.appendChild(cartItem)
    })
    totalNumber.textContent = totalPrice
    const quantityInputs = document.querySelectorAll('.product-quantity input')
    quantityInputs.forEach((input) => {
        input.addEventListener('change', (event) => {
            const index = event.target.getAttribute('data-index')
            updateCartQuantity(index, event.target.value)
        })
    })
    const removeFromCartButtons = document.querySelectorAll('.removeFromCart')
    removeFromCartButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index')
            deleteFromCart(index)
        })
    })
    totalNumber.textContent = totalPrice
    if (cartProducts.innerHTML === ''){
        cartProducts.innerHTML = `<h2>No items in cart.</h2>`
        totalNumber.textContent = '0'
    }
}
function updateCartQuantity(index, quantity) {
    cartData[index].quantity = parseInt(quantity, 10)
    localStorage.setItem('cart', JSON.stringify(cartData))
    const quantityInputs = document.querySelectorAll('.product-quantity input')
    quantityInputs[index].value = quantity
    renderCart()
}
function deleteFromCart(index) {
    cartData.splice(index, 1)
    localStorage.setItem('cart', JSON.stringify(cartData))
    renderCart()
}
renderCart()
if (cartData.length > 0) {
    cartFooter.classList.remove('invisible')
}
else {
    cartFooter.classList.add('invisible')
}
buyBtn.addEventListener('click', () => {
    const successModal = document.createElement('div')
    successModal.classList.add('success-message')
    successModal.innerHTML = `
    <div class="modal-content">
        <p>Successful payment!</p>
    </div>`
    document.body.appendChild(successModal)
    setTimeout(() => {
        document.body.removeChild(successModal)
        localStorage.removeItem('cart')
        window.location.href = 'index.html'
    }, 3000)
})