const answers = document.querySelectorAll('.bottom')
const products = document.querySelector('.product-list')
const search = document.querySelector('.search-input')
const nextBtn = document.querySelector('.next-btn')
const prevBtn = document.querySelector('.prev-btn')
const select = document.querySelector('#category-select')
const sortSelect = document.querySelector('#sort-select')
const loginContainer = document.getElementById('login-container')
const cartButton = document.querySelector('.cart-btn')
let loggedIn = JSON.parse(localStorage.getItem('logged-in'))
const productsPerPage = 9
let currentPage = 1
let filteredProducts = []
let cart = []
function filterProduct() {
    fetch('https://dummyjson.com/products')
    .then((response) => response.json())
    .then((data) => {
        const searchValue = search.value.toLowerCase()
        const selectedCategory = select.value
        const selectedSort = sortSelect.value
        filteredProducts = data.products.filter((product) => {
            const productTitle = product.title.toLowerCase()
            const productBrand = product.brand.toLowerCase()
            const productCategory = product.category.toLowerCase()
            const categoryMatch = selectedCategory === 'all' || productCategory === selectedCategory
            const searchMatch = productTitle.includes(searchValue) || productBrand.includes(searchValue) || productCategory.includes(searchValue)
            return categoryMatch && searchMatch
        })
        if (selectedSort === 'price-low-to-high') {
            filteredProducts.sort((a, b) => a.price - b.price)
        }
        else if (selectedSort === 'price-high-to-low') {
            filteredProducts.sort((a, b) => b.price - a.price)
        }
        else if (selectedSort === 'discount') {
            filteredProducts.sort((a, b) => b.discountPercentage - a.discountPercentage)
        }
        else if (selectedSort === 'available') {
            filteredProducts.sort((a, b) => b.stock - a.stock)
        }
        const startIndex = (currentPage-1)*productsPerPage // 0 // 9 ...
        const endIndex = startIndex+productsPerPage // 9 // 18 ...
        products.innerHTML = ''
        filteredProducts.slice(startIndex, endIndex).forEach(renderProduct)
        if (currentPage === 1) {
            prevBtn.classList.add('invisible')
        }
        else {
            prevBtn.classList.remove('invisible')
        }
        if (filteredProducts.length > endIndex) {
            nextBtn.classList.remove('invisible')
        }
        else {
            nextBtn.classList.add('invisible')
        }
        if (filteredProducts.length === 0){
            products.innerHTML = '<h2>No products found</h2>'
        }
    })
}
function renderProduct(product) {
    const block = document.createElement('div')
    block.classList.add('product')
    block.innerHTML = `
    <div class="product-header">
    <span class="badge">${product.category}</span>
    <h2>${product.title}</h2>
    </div>
    <img class="product-img" src=${product.thumbnail}>`
    const productFooter = document.createElement('div')
    productFooter.classList.add('product-footer')
    productFooter.innerHTML = `
    <div class="product-footer-left">
    <h2>$${product.price} <span class="strikethrough">$${Math.round(product.price/(1-product.discountPercentage*0.01))}</span></h2>
    <h4><span class="badge"><img src="img/star.svg" alt="rating"> ${product.rating}</span>
    <span class="badge">${product.stock} in stock</span></h4>
    </div>`
    const addToCartBtn = document.createElement('button')
    addToCartBtn.classList.add('add-to-cart')
    addToCartBtn.innerHTML = '<img src="img/cart-plus.svg" alt="add to cart">'
    addToCartBtn.addEventListener('click', (event) => {
        if (loggedIn) {
            event.stopPropagation()
            addToCart(product)
            updateCartCount()
        }
        else {
            event.stopPropagation()
            const messageWindow = document.createElement('div')
            messageWindow.classList.add('success-message')
            messageWindow.classList.add('question-message')
            messageWindow.innerHTML = `<p>You need to be logged in to add to the cart. Log in?</p><div class="login-options"><button class="button"><a href="login.html">Yes</a></button><button class="no-btn button">No</button></div>`
            document.body.append(messageWindow)
            document.querySelector('.no-btn').addEventListener('click', ()=>{
                document.body.removeChild(messageWindow)
            })
        }
    })
    productFooter.append(addToCartBtn)
    block.append(productFooter)
    products.append(block)
    block.addEventListener('click', () => {
      viewProductDetails(product)
    })
}
function addToCart(product) {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id)
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity++
    }
    else {
        product.quantity = 1
        cart.push(product)
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCartCount()
    showSuccessMessage(product.title)
}
function updateCartCount() {
    let cartCount = cart.length
    if (!loggedIn){
        cartCount = 0
    }
    cartButton.innerHTML = `
        <img src="img/cart.svg" alt="cart">
        <h2>(${cartCount})</h2>`
}
function showSuccessMessage(productTitle) {
    const messageWindow = document.createElement('div')
    messageWindow.classList.add('success-message')
    messageWindow.textContent = `${productTitle} successfully added to the cart`
    document.body.append(messageWindow)
    setTimeout(() => {
        document.body.removeChild(messageWindow)
    }, 3000) 
}
function viewProductDetails(product) {
    document.body.innerHTML = `
    <div class="small-container container unique-product">
        <button onclick="goBack()"><img src="img/arrow.svg"></button>
        <h1>${product.title}</h1>
        <p>${product.description}</p>
        <div class="slider-container">
            <div class="slider">
            </div>
        </div>
        <div class="divider">
            <div class="main-info">
                <p><b>Category</b>: ${product.category}</p>
                <p><b>Brand</b>: ${product.brand}</p>
                <p><b>Price</b>: $${product.price}</p>
                <p><b>Rating</b>: ${product.rating}</p>
                <p><b>In stock</b>: ${product.stock}</p>
            </div>
            <div class="product-buttons">
                <button class="add-to-cart"><img src="img/cart-plus.svg" alt="add to cart"></button>
                <button class="buy-btn button">Buy</button>
            </div>
        </div>
    </div>`
    document.querySelector('.add-to-cart').addEventListener('click', (event) => {
        if (loggedIn) {
            event.stopPropagation()
            addToCart(product)
           updateCartCount()
        }
        else {
            event.stopPropagation()  
            const messageWindow = document.createElement('div')
            messageWindow.classList.add('success-message')
            messageWindow.classList.add('question-message')
            messageWindow.style.animation = 'none'
            messageWindow.innerHTML = `<p>You need to be logged in to add to the cart. Log in?</p><div class="login-options"><a href="login.html" class="button">Yes</a><button class="no-btn button">No</button></div>`
            document.body.append(messageWindow)
            document.querySelector('.no-btn').addEventListener('click', ()=>{
                document.body.removeChild(messageWindow)
            })
        }
    })
    document.querySelector('.buy-btn').addEventListener('click', () => {
        const successModal = document.createElement('div')
        successModal.classList.add('success-message')
        successModal.innerHTML = `
        <div class="modal-content">
            <p>Successful payment!</p>
        </div>`
        document.body.append(successModal)
        setTimeout(() => {
            document.body.removeChild(successModal)
            localStorage.removeItem('cart')
            window.location.href = 'index.html'
        }, 3000)
    })
    const productGallery = document.querySelector('.slider')
    product.images.forEach((imageUrl, index) => {
        const carouselItem = document.createElement('div')
        carouselItem.classList.add('slide')
        carouselItem.innerHTML = `
        <img class="d-block w-100" src="${imageUrl}" alt="Product Image ${index + 1}">
        `
        productGallery.append(carouselItem)
    })
    $(document).ready(function () {
        $('.slide img').on('load', function () {
        let slideWidth = $('.slide').width()
        let slideCount = $('.slide').length
        console.log(slideWidth, slideCount)
        $('.slider-container').css('width', slideWidth)
        $('.slider').css('width', slideWidth * slideCount)
        function nextSlide() {
            $('.slider').animate({ 'margin-left': -slideWidth }, 2000,
            function () {
                $('.slider').append($('.slide:first'))
                $('.slider').css('margin-left', 0)
            })
        }
        let interval = setInterval(nextSlide, 2000)
        $('.slider-container').hover(function () {
            clearInterval(interval)
          },
          function () {
              interval = setInterval(nextSlide, 2000)
            })
        })
    })
}
function goBack() {
    location.reload()
}
window.addEventListener('load', ()=> {
filterProduct()
if (localStorage.getItem('cart')) {
    cart = JSON.parse(localStorage.getItem('cart'))
}
updateCartCount()
})
loginContainer.addEventListener('mouseover', () => {
    if (loggedIn) {
        greeting.classList.remove('invisible')
        document.getElementById('usernameText').textContent = loggedIn['username']
    }
    else {
        greeting.classList.add('invisible')
    }
})
loginContainer.addEventListener('mouseleave', () => {
    greeting.classList.add('invisible')
})
document.querySelector('.logout-btn').addEventListener('click',()=> {
    localStorage.removeItem('logged-in')
    loggedIn = JSON.parse(localStorage.getItem('logged-in'))
    updateCartCount()
    greeting.classList.add('invisible')
    document.querySelector('.login-icon').src = 'img/user.svg'
})
search.addEventListener('input', () => {
    currentPage = 1
    filterProduct()
})
nextBtn.addEventListener('click', () => {
    currentPage++
    filterProduct()
})
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--
        filterProduct()
    }
})
select.addEventListener('change', () => {
  currentPage = 1
  filterProduct()
})
sortSelect.addEventListener('change', () => {
    currentPage = 1
    filterProduct()
})
document.querySelectorAll('.top').forEach((btn, i) => {
    btn.addEventListener('click', () => {
        const bottom = answers[i]
        const closeBtn = document.querySelectorAll('.close')
        bottom.classList.toggle('visible')
        closeBtn[i].classList.toggle('exe')
        answers.forEach((bottom, j) => {
            if (j !== i) {
                bottom.classList.remove('visible')
                closeBtn[j].classList.remove('exe')
            }
        })
    })
})
if (loggedIn.pfp){
    document.querySelector('.login-icon').src = loggedIn['pfp']
}