const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const apiRequest = () => fetch(api).then((response) => response.json());
const cartItems = '.cart__items';
const apiItemId = 'https://api.mercadolibre.com/items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

// Requisito 6
const clearCart = () => {
  const clearBtn = document.querySelector('.empty-cart');
  const priceTotal = document.querySelector('.total-price');
  const cartProducts = document.querySelector(cartItems);
  clearBtn.addEventListener('click', () => {
    cartProducts.innerHTML = '';
    priceTotal.innerHTML = 0;
    localStorage.clear();
  });
};

// Requisito 5
const sumPrice = async () => {
  try {
    await apiRequest();
    let total = 0;
    const cartProducts = document.querySelectorAll('.cart__item');
    cartProducts.forEach((product) => {
      total += parseFloat(product.innerText.split('$')[1]);
    });
    const priceTotal = document.querySelector('.total-price');
    priceTotal.innerText = total;
  } catch (error) {
    console.log(error);
  }
};

// Requisito 4
const saveCartProducts = () => {
  const ol = document.querySelector(cartItems).innerHTML;
  localStorage.setItem('cartProducts', ol);
};

// Requisito 3
async function cartItemClickListener(event) {
  event.target.remove();
  saveCartProducts();
  sumPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2
const addToCart = () => {
  const cartItem = document.querySelector(cartItems);
  const addToCartBtn = document.querySelectorAll('.item__add');
  addToCartBtn.forEach((item) => {
    item.addEventListener('click', () => {
      const itemId = item.parentNode.firstChild.innerText;
      fetch(`${apiItemId}/${itemId}`)
      .then((response) => response.json())
      .then((product) => {
        const productInfo = { sku: product.id, name: product.title, salePrice: product.price };
        const productToCart = createCartItemElement(productInfo);
        cartItem.appendChild(productToCart);
        saveCartProducts();
        sumPrice();
      });
    });
  });
};

// Requisito 1
const listItens = async () => {
  try {
    await apiRequest().then((item) => {
      const loading = document.querySelector('.loading');
      const items = document.querySelector('.items');
      items.removeChild(loading);
    const productContainer = document.querySelector('.items');
    item.results.map((product) => {
      const productDetails = { sku: product.id, name: product.title, image: product.thumbnail };
      const productElement = createProductItemElement(productDetails);
      return productContainer.appendChild(productElement);    
  });
  }).then(() => addToCart());
} catch (err) {
  console.log('Erro na requisição');
  }
};

window.onload = function onload() {
  if (localStorage.cartProducts) {
    const itemCart = document.querySelector(cartItems);
    const loadItems = localStorage.getItem('cartProducts');
    itemCart.innerHTML = loadItems;
    const cartProducts = document.querySelectorAll(cartItems);
    cartProducts.forEach((element) => {
      element.addEventListener('click', cartItemClickListener);
    });
    sumPrice();
  }
  listItens();
  clearCart();
};