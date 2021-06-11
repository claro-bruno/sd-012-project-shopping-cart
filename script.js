const cartClass = '.cart__items';

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function saveCart() {
  const cartHTML = document.querySelector(cartClass).innerHTML;
  localStorage.setItem('trybe-cart', cartHTML);
}

function cartItemClickListener(event) {
  const cart = document.querySelector(cartClass);
  cart.removeChild(event.target);
  saveCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  saveCart();
  return li;
}

function fetchCart(id) {
  const list = document.querySelector(cartClass);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((item) => {
      const product = { 
        sku: item.id, 
        name: item.title, 
        salePrice: item.price, 
      };
      list.appendChild(createCartItemElement(product));
    });
}

function addToCartListener() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      fetchCart(event.target.parentNode.firstElementChild.innerText);
    }
  });
}

function apiFetch() { 
  const list = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((json) => json.results.forEach((item) => {
      list.appendChild(createProductItemElement(item));
    }));
    addToCartListener();
}

function loadCart() {
  const saved = localStorage.getItem('cart');
  if (saved) {
    const cart = document.querySelector(cartClass);
    cart.innerHTML = saved;
    Array.from(cart.children).forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
}

window.onload = function onload() {
  apiFetch();
  loadCart();
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    const cart = document.querySelector(cartClass);
    while (cart.firstChild) {
      cart.removeChild(cart.lastChild);
    }
  });
};
